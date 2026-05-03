const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadProfile.single('profilePicture'), updateProfile);

module.exports = router;
