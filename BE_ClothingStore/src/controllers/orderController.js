const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const resolveItemInput = (item) => {
  if (!item) return null;

  if (Array.isArray(item.variant) && item.variant.length > 0) {
    return {
      productId: item.productId,
      variantId: item.variant[0].variantId,
      size: item.variant[0].size,
      color: item.variant[0].color,
      quantity: item.variant[0].quantity,
    };
  }

  if (item.variant && typeof item.variant === "object") {
    return {
      productId: item.productId,
      variantId: item.variant.variantId,
      size: item.variant.size,
      color: item.variant.color,
      quantity: item.variant.quantity,
    };
  }

  if (item.variants && typeof item.variants === "object") {
    return {
      productId: item.productId,
      variantId: item.variants.variantId,
      size: item.variants.size,
      color: item.variants.color,
      quantity: item.variants.quantity,
    };
  }

  return {
    productId: item.productId,
    variantId: item.variantId,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  };
};

const findVariantFromProduct = (product, { variantId, size, color }) => {
  if (!product?.variants?.length) return null;

  if (variantId) {
    return product.variants.find((v) => v._id.toString() === String(variantId));
  }

  if (!size || !color) return null;

  return product.variants.find(
    (v) =>
      v.size.toLowerCase() === String(size).toLowerCase() &&
      v.color.toLowerCase() === String(color).toLowerCase(),
  );
};

const normalizeAndValidateItems = async (rawItems) => {
  const orderItems = [];
  const stockUpdates = [];
  let subTotal = 0;

  for (const item of rawItems) {
    const normalized = resolveItemInput(item);

    if (!normalized?.productId) {
      throw new Error("Each order item must include productId");
    }

    const quantity = Number(normalized.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(
        "Quantity of each item must be an integer greater than 0",
      );
    }

    const product = await Product.findById(normalized.productId);
    if (!product || product.status !== "active") {
      throw new Error(
        `Product ${normalized.productId} not found or unavailable`,
      );
    }

    const variant = findVariantFromProduct(product, normalized);
    if (!variant) {
      throw new Error(`Variant not found for product ${product._id}`);
    }

    if (variant.stock < quantity) {
      throw new Error(
        `Insufficient stock for ${product.name} (${variant.size}/${variant.color}). Available stock: ${variant.stock}`,
      );
    }

    const unitPrice =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    subTotal += unitPrice * quantity;

    orderItems.push({
      productId: product._id,
      variant: [
        {
          size: variant.size,
          color: variant.color,
          quantity,
          price: unitPrice,
        },
      ],
    });

    stockUpdates.push({
      product,
      variantId: variant._id,
      quantity,
    });
  }

  return { orderItems, stockUpdates, subTotal };
};

const applyStockUpdates = async (stockUpdates) => {
  for (const stockUpdate of stockUpdates) {
    const { product, variantId, quantity } = stockUpdate;

    const variant = product.variants.find(
      (item) => item._id.toString() === String(variantId),
    );

    if (!variant || variant.stock < quantity) {
      throw new Error("Unable to update stock because inventory changed");
    }

    variant.stock -= quantity;
    await product.save();
  }
};

const removePurchasedItemsFromCart = async (userId, orderItems) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || !cart.items.length) {
    return;
  }

  for (const orderItem of orderItems) {
    const productId = orderItem.productId.toString();
    const orderVariant = orderItem.variant[0];

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!cartItem) continue;

    cartItem.variants = cartItem.variants.filter(
      (variant) =>
        !(
          variant.size.toLowerCase() === orderVariant.size.toLowerCase() &&
          variant.color.toLowerCase() === orderVariant.color.toLowerCase()
        ),
    );
  }

  cart.items = cart.items.filter((item) => item.variants.length > 0);
  await cart.save();
};

const createOrder = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const inputUserId = req.body.userId
      ? String(req.body.userId)
      : currentUserId;

    if (inputUserId !== currentUserId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only create order for your own account",
      });
    }

    const {
      items = [],
      shippingAddress,
      note = "",
      shippingCost = 0,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!shippingAddress || String(shippingAddress).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const parsedShippingCost = Number(shippingCost || 0);
    if (Number.isNaN(parsedShippingCost) || parsedShippingCost < 0) {
      return res.status(400).json({
        success: false,
        message: "Shipping cost must be a non-negative number",
      });
    }

    const { orderItems, stockUpdates, subTotal } =
      await normalizeAndValidateItems(items);

    await applyStockUpdates(stockUpdates);

    const order = await Order.create({
      userId: inputUserId,
      items: orderItems,
      totalAmount: subTotal + parsedShippingCost,
      shippingAddress: String(shippingAddress).trim(),
      note: String(note || "").trim(),
      shippingCost: parsedShippingCost,
      status: "pending",
    });

    await removePurchasedItemsFromCart(inputUserId, orderItems);

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "fullName email phone")
      .populate("items.productId");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

const checkout = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const {
      shippingAddress,
      note = "",
      shippingCost = 0,
      selectedItems = [],
    } = req.body;

    if (!shippingAddress || String(shippingAddress).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const parsedShippingCost = Number(shippingCost || 0);
    if (Number.isNaN(parsedShippingCost) || parsedShippingCost < 0) {
      return res.status(400).json({
        success: false,
        message: "Shipping cost must be a non-negative number",
      });
    }

    const selectedSet = new Set(
      (Array.isArray(selectedItems) ? selectedItems : []).map(
        (item) => `${String(item.productId)}-${String(item.variantId)}`,
      ),
    );

    const rawItems = [];

    for (const cartItem of cart.items) {
      for (const cartVariant of cartItem.variants) {
        const itemKey = `${cartItem.productId.toString()}-${cartVariant._id.toString()}`;

        if (selectedSet.size > 0 && !selectedSet.has(itemKey)) {
          continue;
        }

        rawItems.push({
          productId: cartItem.productId,
          variantId: cartVariant.variantId,
          size: cartVariant.size,
          color: cartVariant.color,
          quantity: cartVariant.quantity,
        });
      }
    }

    if (!rawItems.length) {
      return res.status(400).json({
        success: false,
        message: "No selected items found for checkout",
      });
    }

    const { orderItems, stockUpdates, subTotal } =
      await normalizeAndValidateItems(rawItems);

    await applyStockUpdates(stockUpdates);

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount: subTotal + parsedShippingCost,
      shippingAddress: String(shippingAddress).trim(),
      note: String(note || "").trim(),
      shippingCost: parsedShippingCost,
      status: "pending",
    });

    await removePurchasedItemsFromCart(userId, orderItems);

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "fullName email phone")
      .populate("items.productId");

    return res.status(201).json({
      success: true,
      message: "Checkout successful",
      order: populatedOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Checkout failed",
    });
  }
};

module.exports = {
  createOrder,
  checkout,
};
