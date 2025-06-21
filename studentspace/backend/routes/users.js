const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  toggleBanUser,
  silenceUser,
  getModerationStatus,
  getUserModerationStatus
} = require('../controllers/userController');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/:id/ban', protect, admin, toggleBanUser);
router.post('/:id/silence', protect, admin, silenceUser);
router.get('/moderation/status', protect, getModerationStatus);
router.get('/:id/moderation/status', protect, admin, getUserModerationStatus);

module.exports = router;
