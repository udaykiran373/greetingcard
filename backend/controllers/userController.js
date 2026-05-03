const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    if (req.file) {
      // Delete old profile picture if exists
      const user = await User.findById(req.user._id);
      if (user.profilePicture && user.profilePicture.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        isPremium: updatedUser.isPremium,
        isGuest: updatedUser.isGuest
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isPremium: user.hasPremium(),
        isGuest: user.isGuest,
        subscription: user.subscription,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProfile, getProfile };
