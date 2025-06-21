const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');
const { Badge } = require('../models/Badge');
const Notification = require('../models/Notification');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password, name, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.name = name || user.name;
    user.bio = bio || user.bio;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ 
      message: 'Profile updated successfully', 
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        reputation: user.reputation
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const posts = await Post.find({ userId: req.params.id, deleted: false })
      .sort({ createdAt: -1 })
      .populate('userId', 'username')
      .lean();

    const allPosts = await Post.find({ deleted: false, 'answers.userId': req.params.id }).populate('userId', 'username').lean();
    const answers = allPosts.reduce((acc, post) => {
      const userAnswers = post.answers
        .filter(answer => answer.userId.toString() === req.params.id)
        .map(answer => ({
          ...answer,
          postId: post._id,
          postTitle: post.title,
          postAuthor: post.userId.username
        }));
      return [...acc, ...userAnswers];
    }, []);
    answers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const statistics = {
      totalPosts: posts.length,
      totalAnswers: answers.length,
      acceptedAnswers: answers.filter(a => a.isAccepted).length,
      totalVotesReceived: [
        ...posts.map(p => p.votedBy ? p.votedBy.filter(vote => vote.voteType === 'up').length : 0),
        ...answers.map(a => a.votedBy ? a.votedBy.filter(vote => vote.voteType === 'up').length : 0)
      ].reduce((a, b) => a + b, 0)
    };

    const badges = await Badge.find({ userId: req.params.id }).lean();

    res.json({
      ...user.toObject(),
      posts,
      answers,
      statistics,
      badges
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.banned = !user.banned;
    await user.save();
    await Notification.create({
      userId: user._id,
      type: 'ban',
      state: user.banned,
      message: user.banned ? 'You have been banned by an admin.' : 'You have been unbanned by an admin.'
    });
    res.json({ message: user.banned ? 'User banned.' : 'User unbanned.' });
  } catch (error) {
    console.error('Toggle ban error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const silenceUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.unsilence) {
      user.silencedUntil = null;
      await user.save();
      await Notification.create({
        userId: user._id,
        type: 'silence',
        state: false,
        message: 'You have been unsilenced by an admin.'
      });
      return res.json({ message: 'User unsilenced.' });
    }
    const now = new Date();
    user.silencedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now
    await user.save();
    await Notification.create({
      userId: user._id,
      type: 'silence',
      state: true,
      message: 'You have been silenced by an admin for 1 day.'
    });
    res.json({ message: 'User silenced for 1 day.' });
  } catch (error) {
    console.error('Silence user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getModerationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('banned silencedUntil');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ banned: user.banned, silencedUntil: user.silencedUntil });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserModerationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('banned silencedUntil');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ banned: user.banned, silencedUntil: user.silencedUntil });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  toggleBanUser,
  silenceUser,
  getModerationStatus,
  getUserModerationStatus
}; 