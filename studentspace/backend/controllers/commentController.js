const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      message: 'Error fetching comments', 
      error: error.message 
    });
  }
};

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!req.body.content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (req.user.silencedUntil && new Date(req.user.silencedUntil) > new Date()) {
      return res.status(403).json({ message: "You are silenced and cannot comment until " + new Date(req.user.silencedUntil).toLocaleString() });
    }

    const comment = new Comment({
      content: req.body.content,
      userId: req.user._id,
      postId: req.params.postId,
    });

    await comment.save();
    
    await comment.populate('userId', 'username');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      message: 'Error creating comment', 
      error: error.message 
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      message: 'Error deleting comment', 
      error: error.message 
    });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment
}; 