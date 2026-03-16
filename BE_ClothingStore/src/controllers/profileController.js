const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

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
        const { fullName, phone, address, gender } = req.body;

        if (fullName !== undefined && fullName.trim() === "")
            return res.status(400).json({ success: false, message: "Full name cannot be empty" });

        if (gender !== undefined && !["male", "female"].includes(gender))
            return res.status(400).json({ success: false, message: "Gender must be 'male' or 'female'" });

        if (phone !== undefined && phone !== "" && phone !== null && !/^[0-9]{10,11}$/.test(phone))
            return res.status(400).json({ success: false, message: "Phone number must be 10-11 digits" });

        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName.trim();
        if (phone !== undefined) updateData.phone = phone || null;
        if (address !== undefined) updateData.address = address || null;
        if (gender !== undefined) updateData.gender = gender || null;

        if (req.file) {
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
            updateData.avatar = `avatars/${req.file.filename}`;
        }

        if (Object.keys(updateData).length === 0)
            return res.status(400).json({ success: false, message: "No valid fields provided to update" });

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -resetPasswordToken -resetPasswordExpires");

        if (!updated) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to update profile", error: error.message });
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

        if (!oldPassword || !newPassword)
            return res.status(400).json({ success: false, message: "Old password and new password are required" });

        if (newPassword.length < 6)
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

        if (confirmPassword !== undefined && newPassword !== confirmPassword)
            return res.status(400).json({ success: false, message: "New password and confirm password do not match" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect old password" });

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ success: false, message: "New password must be different from the old password" });

        user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = { getProfile, updateProfile, updateAvatar, deleteAvatar, changePassword };