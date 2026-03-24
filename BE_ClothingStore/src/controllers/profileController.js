const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { validatePassword } = require("../utils/validation");

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "Profile retrieved successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { fullName, phone, address, gender } = req.body;
    const updateData = {};

    if (fullName !== undefined) {
      if (typeof fullName !== "string") {
        return res.status(400).json({
          success: false,
          message: "Full name must be a string",
        });
      }

      const trimmedName = fullName.trim();

      if (trimmedName.length < 2 || trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Full name must be between 2 and 100 characters",
        });
      }

      updateData.fullName = trimmedName;
    }

    if (phone !== undefined) {
      if (phone === "" || phone === null) {
        updateData.phone = null;
      } else {
        if (typeof phone !== "string") {
          return res.status(400).json({
            success: false,
            message: "Phone must be a string",
          });
        }

        const trimmedPhone = phone.trim();

        if (!/^[0-9]{10,11}$/.test(trimmedPhone)) {
          return res.status(400).json({
            success: false,
            message: "Phone number must be 10-11 digits",
          });
        }

        const existing = await User.findOne({
          phone: trimmedPhone,
          _id: { $ne: req.user._id },
        });

        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Phone number already in use",
          });
        }

        updateData.phone = trimmedPhone;
      }
    }

    if (address !== undefined) {
      if (address === "" || address === null) {
        updateData.address = null;
      } else {
        if (typeof address !== "string") {
          return res.status(400).json({
            success: false,
            message: "Address must be a string",
          });
        }

        const trimmedAddress = address.trim();

        if (trimmedAddress.length > 255) {
          return res.status(400).json({
            success: false,
            message: "Address must not exceed 255 characters",
          });
        }

        updateData.address = trimmedAddress;
      }
    }

    if (gender !== undefined) {
      if (!["male", "female"].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Gender must be 'male' or 'female'",
        });
      }

      updateData.gender = gender;
    }

    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(req.file.mimetype)) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: "Only .jpeg, .jpg, .png files are allowed",
        });
      }

      if (req.file.size > MAX_FILE_SIZE) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: "Avatar must not exceed 2MB",
        });
      }

      const currentUser = await User.findById(req.user._id);

      if (currentUser?.avatar) {
        const oldPath = path.join(
          __dirname,
          "..",
          "uploads",
          "avatars",
          currentUser.avatar.replace("avatars/", "")
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.avatar = `avatars/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// PUT /api/profile/avatar
const updateAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No avatar file uploaded" });

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Only .jpeg, .jpg, .png files are allowed" });
    }

    const currentUser = await User.findById(req.user._id);
    if (currentUser?.avatar) {
      const oldPath = path.join(__dirname, "..", "uploads", "avatars", currentUser.avatar.replace("avatars/", ""));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: `avatars/${req.file.filename}` } },
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json({ success: true, message: "Avatar updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update avatar", error: error.message });
  }
};

// DELETE /api/profile/avatar
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.avatar) return res.status(400).json({ success: false, message: "No avatar to delete" });

    const oldPath = path.join(__dirname, "..", "uploads", "avatars", user.avatar.replace("avatars/", ""));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { avatar: "" } },
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json({ success: true, message: "Avatar deleted successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete avatar", error: error.message });
  }
};

// PUT /api/profile/change-password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check required fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password, new password and confirm password are required",
      });
    }

    // Validate password strength
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include uppercase, lowercase and number",
      });
    }

    // Check confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    // Check new password different from old
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the old password",
      });
    }

    // Hash & save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getProfile, updateProfile, updateAvatar, deleteAvatar, changePassword };