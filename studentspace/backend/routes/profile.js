const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, updatePassword, uploadAvatar } = require("../controllers/profileController");
const uploadAvatarMiddleware = require('../middleware/upload');
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.put("/password", protect, updatePassword);

router.put(
  "/avatar",
  protect,
  uploadAvatarMiddleware.single('avatar'),
  uploadAvatar
);

module.exports = router;
