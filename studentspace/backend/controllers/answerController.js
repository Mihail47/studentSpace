const Post = require('../models/Post');
const { updateReputationPoints, REPUTATION_POINTS } = require('../services/reputationService');
const User = require('../models/User');

const addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Answer content is required." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (req.user.silencedUntil && new Date(req.user.silencedUntil) > new Date()) {
      return res.status(403).json({ message: "You are silenced and cannot answer until " + new Date(req.user.silencedUntil).toLocaleString() });
    }

    const answer = {
      content,
      userId: req.user._id,
      votes: 0,
      isAccepted: false,
    };

    post.answers.push(answer);
    await post.save();

    const populatedPost = await Post.findById(req.params.id)
      .populate("userId", "username")
      .populate("answers.userId", "username")
      .lean();

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: "Error adding answer.", error: error.message });
  }
};

const voteAnswer = async (req, res) => {
  try {
    const { voteType } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const answer = post.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    const existingVoteIndex = answer.votedBy.findIndex(
      vote => vote.userId.toString() === req.user._id.toString()
    );

    const answerAuthor = await User.findById(answer.userId);
    if (!answerAuthor) {
      return res.status(404).json({ message: "Answer author not found." });
    }

    if (voteType === null) {
      if (existingVoteIndex !== -1) {
        const oldVoteType = answer.votedBy[existingVoteIndex].voteType;
        answer.votes += oldVoteType === "up" ? -1 : 1;
        answer.votedBy.splice(existingVoteIndex, 1);
        
        if (oldVoteType === "up") {
          if (answerAuthor.reputation.points >= 5) {
            await updateReputationPoints(answer.userId, "ANSWER_DOWNVOTED");
          }
        }
      }
    } else {
      if (existingVoteIndex !== -1) {
        const existingVote = answer.votedBy[existingVoteIndex];
        if (existingVote.voteType !== voteType) {
          answer.votes += voteType === "up" ? 2 : -2;
          existingVote.voteType = voteType;
          
          if (voteType === "up") {
            await updateReputationPoints(answer.userId, "ANSWER_UPVOTED");
          } else {
            if (answerAuthor.reputation.points >= 5) {
              await updateReputationPoints(answer.userId, "ANSWER_DOWNVOTED");
            }
          }
        }
      } else {
        answer.votes += voteType === "up" ? 1 : -1;
        answer.votedBy.push({ userId: req.user._id, voteType });
        
        if (voteType === "up") {
          await updateReputationPoints(answer.userId, "ANSWER_UPVOTED");
        } else {
          if (answerAuthor.reputation.points >= 5) {
            await updateReputationPoints(answer.userId, "ANSWER_DOWNVOTED");
          }
        }
        
        if (voteType === "down") {
          const voter = await User.findById(req.user._id);
          if (voter && voter.reputation.points >= 1) {
            await updateReputationPoints(req.user._id, "DOWNVOTING");
          }
        }
      }
    }

    await post.save();

    const updatedPost = await Post.findById(req.params.postId)
      .populate("userId", "username")
      .populate("answers.userId", "username")
      .lean();

    res.json(updatedPost);
  } catch (error) {
    console.error("Error voting on answer:", error);
    res.status(500).json({ message: "Error voting on answer.", error: error.message });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const answer = post.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    if (answer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this answer." });
    }

    let pointsToRemove = 0;
    const upvotes = answer.votedBy.filter(vote => vote.voteType === 'up').length;
    pointsToRemove += upvotes * REPUTATION_POINTS.ANSWER_UPVOTED;
    
    if (answer.isAccepted) {
      pointsToRemove += REPUTATION_POINTS.ANSWER_ACCEPTED;
    }

    const user = await User.findById(answer.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { answers: { _id: req.params.answerId } }
      },
      { new: true }
    ).populate("userId", "username")
     .populate("answers.userId", "username")
     .lean();

    if (!updatedPost) {
      return res.status(404).json({ message: "Error updating post." });
    }

    if (pointsToRemove > 0) {
      const newPoints = Math.max(0, user.reputation.points - pointsToRemove);
      user.reputation.points = newPoints;
      user.updateReputationLevel();
      await user.save();
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ message: "Error deleting answer.", error: error.message });
  }
};

const acceptAnswer = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the post author can accept answers." });
    }

    const answer = post.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    post.answers.forEach(a => {
      if (a.isAccepted) {
        a.isAccepted = false;
      }
    });

    answer.isAccepted = true;
    await updateReputationPoints(answer.userId, "ANSWER_ACCEPTED");

    await post.save();

    const updatedPost = await Post.findById(req.params.postId)
      .populate("userId", "username")
      .populate("answers.userId", "username")
      .lean();

    res.json(updatedPost);
  } catch (error) {
    console.error("Error accepting answer:", error);
    res.status(500).json({ message: "Error accepting answer.", error: error.message });
  }
};

module.exports = {
  addAnswer,
  voteAnswer,
  deleteAnswer,
  acceptAnswer
}; 