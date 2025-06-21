const express = require("express");
const router = express.Router();
const { protect, admin, optionalAuth } = require("../middleware/authMiddleware");
const {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  restorePost,
  votePost
} = require("../controllers/postController");

router.get("/", optionalAuth, getPosts);
router.get("/:id", optionalAuth, getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/vote", protect, votePost);
router.post("/:id/restore", protect, admin, restorePost);

module.exports = router;
