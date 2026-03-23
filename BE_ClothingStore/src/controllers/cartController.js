const Cart = require("../models/Cart");
const Product = require("../models/Product");

const buildEmptyCartResponse = (userId) => ({
  userId,
  items: [],
});

const getPopulatedCart = async (userId) => {
  return Cart.findOne({ userId }).populate("items.productId");
};

const findProductVariant = (product, variantId, size, color) => {
  if (!product?.variants?.length) {
    return null;
  }

  if (variantId) {
    return product.variants.find(
      (v) => v._id.toString() === variantId.toString(),
    );
  }

  if (!size || !color) {
    return null;
  }

  return product.variants.find(
    (v) =>
      v.size.toLowerCase() === String(size).toLowerCase() &&
      v.color.toLowerCase() === String(color).toLowerCase(),
  );
};

const getCartByUserId = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const cart = await getPopulatedCart(userId);
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: buildEmptyCartResponse(userId),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const payloadItem = Array.isArray(req.body.items)
      ? req.body.items[0]
      : req.body.items;

    if (!payloadItem?.productId || !payloadItem?.variants) {
      return res.status(400).json({
        success: false,
        message: "productId and variants are required",
      });
    }

    const quantity = Number(payloadItem.variants.quantity || 1);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be an integer greater than 0",
      });
    }

    const product = await Product.findById(payloadItem.productId);
    if (!product || product.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Product not found or unavailable",
      });
    }

    const selectedVariant = findProductVariant(
      product,
      payloadItem.variants.variantId,
      payloadItem.variants.size,
      payloadItem.variants.color,
    );

    if (!selectedVariant) {
      return res.status(400).json({
        success: false,
        message: "Selected product variant not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    let cartItem = cart.items.find(
      (item) => item.productId.toString() === product._id.toString(),
    );

    if (!cartItem) {
      cart.items.push({
        productId: product._id,
        variants: [
          {
            variantId: selectedVariant._id,
            size: selectedVariant.size,
            color: selectedVariant.color,
            quantity,
          },
        ],
      });
    } else {
      const existedVariant = cartItem.variants.find(
        (v) => v.variantId.toString() === selectedVariant._id.toString(),
      );

      if (existedVariant) {
        const nextQuantity = existedVariant.quantity + quantity;
        if (nextQuantity > selectedVariant.stock) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock. Available stock: ${selectedVariant.stock}`,
          });
        }
        existedVariant.quantity = nextQuantity;
      } else {
        cartItem.variants.push({
          variantId: selectedVariant._id,
          size: selectedVariant.size,
          color: selectedVariant.color,
          quantity,
        });
      }
    }

    const currentVariantQty = cart.items
      .flatMap((item) => item.variants)
      .filter((v) => v.variantId.toString() === selectedVariant._id.toString())
      .reduce((sum, v) => sum + v.quantity, 0);

    if (currentVariantQty > selectedVariant.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${selectedVariant.stock}`,
      });
    }

    await cart.save();

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: "Added to cart successfully",
      data: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId, variantId, quantity } = req.body;

    if (!productId || !variantId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId, variantId and quantity are required",
      });
    }

    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be an integer greater than 0",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === String(productId),
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const targetVariant = cartItem.variants.find(
      (v) => v._id.toString() === String(variantId),
    );

    if (!targetVariant) {
      return res.status(404).json({
        success: false,
        message: "Cart variant not found",
      });
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Product not available",
      });
    }

    const productVariant = product.variants.find(
      (v) => v._id.toString() === targetVariant.variantId.toString(),
    );

    if (!productVariant) {
      return res.status(400).json({
        success: false,
        message: "Product variant no longer exists",
      });
    }

    if (nextQuantity > productVariant.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${productVariant.stock}`,
      });
    }

    targetVariant.quantity = nextQuantity;

    await cart.save();

    const populatedCart = await getPopulatedCart(userId);
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId, variantId } = req.body;

    if (!productId || !variantId) {
      return res.status(400).json({
        success: false,
        message: "productId and variantId are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === String(productId),
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cartItem.variants = cartItem.variants.filter(
      (variant) => variant._id.toString() !== String(variantId),
    );

    cart.items = cart.items.filter((item) => item.variants.length > 0);

    await cart.save();

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: populatedCart || buildEmptyCartResponse(userId),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        data: buildEmptyCartResponse(userId),
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
};
