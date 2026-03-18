const Order = require("../models/Order");

/* View all orders (admin) */
const adminGetAllOrders = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin only",
      });
    }

    const orders = await Order.find({ isDeleted: false })
      .populate("userId", "fullName email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* view list orders(admin + customer) */
const getOrderList = async (req, res) => {
  try {
    const filter = { isDeleted: false };
    if (!req.user?.isAdmin) {
      filter.userId = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* view order detail (admin + customer)*/
const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "fullName email phone")
      .populate("items.productId");

    if (!order || order.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !req.user?.isAdmin &&
      order.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Update status (admin) */
const adminUpdateOrderStatus = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin only",
      });
    }

    const { status } = req.body;
    const allowedStatus = ["pending", "in_progress", "done", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["done", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot update completed order",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminGetAllOrders,
  getOrderList,
  getOrderDetail,
  adminUpdateOrderStatus,
};