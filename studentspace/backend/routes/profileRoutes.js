const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  updatePassword
} = require("../controllers/profileController");


router.get("/:id", getProfile);
router.put("/", protect, updateProfile);
router.put("/password", protect, updatePassword);

module.exports = router; 