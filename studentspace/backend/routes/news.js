const express = require('express');
const router = express.Router();
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const {
  getAllNews,
  getNewsById,
  createNews,
  deleteNews,
  restoreNews
} = require('../controllers/newsController');

router.get('/', optionalAuth, getAllNews);
router.get('/:id', optionalAuth, getNewsById);
router.post('/', protect, admin, createNews);
router.delete('/:id', protect, admin, deleteNews);
router.post('/:id/restore', protect, admin, restoreNews);

module.exports = router; 