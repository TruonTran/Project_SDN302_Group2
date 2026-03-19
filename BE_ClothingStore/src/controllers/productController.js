const mongoose = require("mongoose");
const Product = require("../models/Product");

const ok = (res, data, message = "OK", code = 200) =>
  res.status(code).json({ success: true, message, data });
const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

/**
 * Tạo filter để lấy danh sách sản phẩm.
 * - Admin: cho phép lọc `status` và `category` (nếu có query)
 * - Guest/Customer: mặc định chỉ lấy `status = active`
 */
function buildListFilter(query, isAdmin) {
  const filter = {};
  if (isAdmin) {
    if (query.status) filter.status = query.status;
    if (query.category && mongoose.Types.ObjectId.isValid(query.category)) {
      filter.category = query.category;
    }
  } else {
    filter.status = "active";
    if (query.category && mongoose.Types.ObjectId.isValid(query.category)) {
      filter.category = query.category;
    }
  }
  return filter;
}

/**
 * Validate body tạo sản phẩm (Admin).
 * Trả về string mô tả lỗi nếu sai; ngược lại trả về `null`.
 */
function validateCreateBody(body) {
  const { name, description, price, category, variants } = body;
  if (!name || String(name).trim() === "")
    return "Tên sản phẩm là bắt buộc";
  if (!description || String(description).trim() === "")
    return "Mô tả là bắt buộc";
  if (price == null || Number(price) < 0) return "Giá không hợp lệ";
  if (!category || !mongoose.Types.ObjectId.isValid(category))
    return "category (ObjectId) là bắt buộc";
  if (!Array.isArray(variants) || variants.length === 0)
    return "Cần ít nhất một biến thể (size, color, stock)";
  for (const v of variants) {
    if (!v.size || !v.color || v.stock == null || Number(v.stock) < 0)
      return "Mỗi biến thể cần size, color và stock >= 0";
  }
  return null;
}

/**
 * GET /api/products
 * - Guest/Customer: trả danh sách sản phẩm đang `active`
 * - Admin (nếu có token): có thể lọc thêm theo `status`, `category`
 */
exports.getAllProducts = async (req, res) => {
  try {
    const isAdmin = req.user?.isAdmin === true;
    const filter = buildListFilter(req.query, isAdmin);

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return ok(res, {
      products: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return fail(res, 500, error.message);
  }
};

/**
 * GET /api/products/:id
 * - Guest/Customer: chỉ xem được sản phẩm `active`
 * - Admin: xem được cả `inactive`/`draft`
 */
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return fail(res, 400, "ID không hợp lệ");
    }
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) return fail(res, 404, "Không tìm thấy sản phẩm");

    const isAdmin = req.user?.isAdmin === true;
    if (!isAdmin && product.status !== "active") {
      return fail(res, 404, "Không tìm thấy sản phẩm");
    }

    return ok(res, { product });
  } catch (error) {
    return fail(res, 500, error.message);
  }
};

/**
 * POST /api/products (Admin)
 * Tạo sản phẩm mới, lưu category + variants.
 */
exports.createProduct = async (req, res) => {
  try {
    const err = validateCreateBody(req.body);
    if (err) return fail(res, 400, err);

    const product = new Product(req.body);
    await product.save();
    const populated = await Product.findById(product._id).populate(
      "category",
      "name"
    );
    return ok(res, { product: populated }, "Tạo sản phẩm thành công", 201);
  } catch (error) {
    return fail(res, 400, error.message);
  }
};

/**
 * PUT /api/products/:id (Admin)
 * Cập nhật sản phẩm (gồm nhiều trường), dùng `runValidators: true`.
 */
exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return fail(res, 400, "ID không hợp lệ");
    }
    const body = { ...req.body };
    delete body._id;
    if (body.variants && (!Array.isArray(body.variants) || body.variants.length === 0)) {
      return fail(res, 400, "variants phải là mảng có ít nhất 1 phần tử");
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate("category", "name");

    if (!updated) return fail(res, 404, "Không tìm thấy sản phẩm");
    return ok(res, { product: updated }, "Cập nhật thành công");
  } catch (error) {
    return fail(res, 400, error.message);
  }
};

/**
 * PATCH /api/products/:id/status (Admin)
 * Cập nhật riêng `status` của sản phẩm.
 */
exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["active", "inactive", "draft"];
    if (!allowed.includes(status)) {
      return fail(res, 400, "status phải là: active | inactive | draft");
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return fail(res, 400, "ID không hợp lệ");
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("category", "name");

    if (!product) return fail(res, 404, "Không tìm thấy sản phẩm");
    return ok(res, { product }, "Cập nhật trạng thái thành công");
  } catch (error) {
    return fail(res, 400, error.message);
  }
};

/**
 * DELETE /api/products/:id (Admin)
 * Xóa sản phẩm (xóa cứng).
 */
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return fail(res, 400, "ID không hợp lệ");
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return fail(res, 404, "Không tìm thấy sản phẩm");
    return ok(res, null, "Đã xóa sản phẩm");
  } catch (error) {
    return fail(res, 500, error.message);
  }
};
