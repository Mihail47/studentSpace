const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addAnswer,
  voteAnswer,
  deleteAnswer,
  acceptAnswer
} = require("../controllers/answerController");


router.post("/:id", protect, addAnswer);
router.post("/:postId/:answerId/vote", protect, voteAnswer);
router.delete("/:postId/:answerId", protect, deleteAnswer);
router.post("/:postId/:answerId/accept", protect, acceptAnswer);

module.exports = router;
