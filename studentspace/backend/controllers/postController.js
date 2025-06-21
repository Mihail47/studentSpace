const Post = require('../models/Post');
const { updateReputationPoints } = require('../services/reputationService');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const includeDeleted = req.query.includeDeleted === 'true' && req.user && req.user.role === 'admin';
    let filter = includeDeleted ? {} : { deleted: false };

    if (search) {
      const orFilter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ]
      };
      if (Object.keys(filter).length > 0) {
        filter = { $and: [filter, orFilter] };
      } else {
        filter = orFilter;
      }
    }

    const total = await Post.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const posts = await Post.find(filter)
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const postsWithAnswerCount = posts.map(post => ({
      ...post,
      answerCount: post.answers ? post.answers.length : 0
    }));

    res.json({
      posts: postsWithAnswerCount,
      pagination: {
        total,
        page: parseInt(page),
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts.", error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found." });
    }

    if (req.user.silencedUntil && new Date(req.user.silencedUntil) > new Date()) {
      return res.status(403).json({ message: "You are silenced and cannot post until " + new Date(req.user.silencedUntil).toLocaleString() });
    }

    const newPost = new Post({
      title,
      content,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((tag) => tag.trim()) : []),
      createdBy: req.user.username,
      userId: req.user._id,
      votes: 0,
      answers: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post.", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      deleted: false
    })
      .populate("userId", "username")
      .populate("answers.userId", "username")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post.", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post." });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.tags = req.body.tags ? req.body.tags.split(",").map((tag) => tag.trim()) : post.tags;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post.", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    post.deleted = true;
    await post.save();
    
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post.", error: error.message });
  }
};

const restorePost = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can restore posts." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.deleted = false;
    await post.save();
    
    res.json({ message: "Post restored successfully." });
  } catch (error) {
    console.error("Error restoring post:", error);
    res.status(500).json({ message: "Error restoring post.", error: error.message });
  }
};

const votePost = async (req, res) => {
  try {
    const { voteType } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const existingVoteIndex = post.votedBy.findIndex(
      vote => vote.userId.toString() === req.user._id.toString()
    );

    const postAuthor = await User.findById(post.userId);
    if (!postAuthor) {
      return res.status(404).json({ message: "Post author not found." });
    }

    if (voteType === null) {
      if (existingVoteIndex !== -1) {
        const oldVoteType = post.votedBy[existingVoteIndex].voteType;
        post.votes += oldVoteType === "up" ? -1 : 1;
        post.votedBy.splice(existingVoteIndex, 1);
        
        if (oldVoteType === "up") {
          if (postAuthor.reputation.points >= 5) {
            await updateReputationPoints(post.userId, "POST_DOWNVOTED");
            await User.findByIdAndUpdate(post.userId, {
              $inc: { 'statistics.totalVotesReceived': -1 }
            });
          }
        }
      }
    } else {
      if (existingVoteIndex !== -1) {
        const existingVote = post.votedBy[existingVoteIndex];
        if (existingVote.voteType !== voteType) {
          post.votes += voteType === "up" ? 2 : -2;
          existingVote.voteType = voteType;
          
          if (voteType === "up") {
            await updateReputationPoints(post.userId, "QUESTION_UPVOTED");
            await User.findByIdAndUpdate(post.userId, {
              $inc: { 'statistics.totalVotesReceived': 1 }
            });
          } else {
            if (postAuthor.reputation.points >= 5) {
              await updateReputationPoints(post.userId, "POST_DOWNVOTED");
              await User.findByIdAndUpdate(post.userId, {
                $inc: { 'statistics.totalVotesReceived': -1 }
              });
            }
          }
        }
      } else {
        post.votes += voteType === "up" ? 1 : -1;
        post.votedBy.push({ userId: req.user._id, voteType });
        
        if (voteType === "up") {
          await updateReputationPoints(post.userId, "QUESTION_UPVOTED");
          await User.findByIdAndUpdate(post.userId, {
            $inc: { 'statistics.totalVotesReceived': 1 }
          });
        } else {
          if (postAuthor.reputation.points >= 5) {
            await updateReputationPoints(post.userId, "POST_DOWNVOTED");
            await User.findByIdAndUpdate(post.userId, {
              $inc: { 'statistics.totalVotesReceived': -1 }
            });
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

    const updatedPost = await Post.findById(req.params.id)
      .populate("userId", "username")
      .populate("answers.userId", "username")
      .lean();

    res.json({ message: "Vote registered.", post: updatedPost });
  } catch (error) {
    console.error("Error voting on post:", error);
    res.status(500).json({ message: "Error voting on post.", error: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  restorePost,
  votePost
}; 