const mongoose = require("mongoose");
const Order = require("../models/Order");

/**
 * GET /api/orders/admin
 * Admin: lấy toàn bộ đơn (chưa xóa mềm), sort theo thời gian tạo mới nhất.
 */
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

/**
 * GET /api/orders
 * Admin: lấy tất cả đơn
 * User(Customer): chỉ lấy đơn của chính user đó.
 */
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

/**
 * GET /api/orders/:id
 * Admin + owner của order đều xem được.
 */
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

/**
 * PATCH /api/orders/:id/status (Admin)
 * Admin cập nhật trạng thái đơn theo enum cho phép.
 */
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

/**
 * GET /api/orders/admin/search (Admin)
 * Admin tìm đơn theo: orderId, status, userId, from/to, keyword + phân trang.
 */
const adminSearchOrders = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    const { orderId, status, userId, from, to, keyword } = req.query;

    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      filter._id = orderId;
    }
    if (status) {
      const allowed = ["pending", "in_progress", "done", "cancelled"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "status không hợp lệ",
        });
      }
      filter.status = status;
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.userId = userId;
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (keyword && String(keyword).trim()) {
      const q = String(keyword).trim();
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ shippingAddress: rx }, { note: rx }];
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "fullName email")
        .populate("items.productId", "name price images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "OK",
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
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
  adminSearchOrders,
  getOrderList,
  getOrderDetail,
  adminUpdateOrderStatus,
};