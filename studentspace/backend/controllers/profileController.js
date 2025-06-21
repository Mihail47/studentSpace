const User = require("../models/User");
const Post = require("../models/Post");
const { Badge } = require("../models/Badge");
const { checkAndAwardBadges } = require("../services/badgeService");
const { recalculateUserReputation } = require("../services/reputationService");
const bcrypt = require("bcrypt");

const calculateProgress = (points) => {
  if (points >= 3501) return 100;
  
  const thresholds = {
    0: { min: 0, max: 251 },
    251: { min: 251, max: 501 },
    501: { min: 501, max: 1001 },
    1001: { min: 1001, max: 2001 },
    2001: { min: 2001, max: 3501 }
  };

  let currentThreshold;
  for (const [key, range] of Object.entries(thresholds)) {
    if (points >= range.min && points < range.max) {
      currentThreshold = range;
      break;
    }
  }

  if (!currentThreshold) return 100;

  const progress = ((points - currentThreshold.min) / 
    (currentThreshold.max - currentThreshold.min)) * 100;
  return Math.round(progress);
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posts (exclude soft-deleted ones)
    const posts = await Post.find({ userId: userId, deleted: false })
      .sort({ createdAt: -1 })
      .populate('userId', 'username')
      .lean();

    const allPosts = await Post.find({
      deleted: false,
      'answers.userId': userId
    }).populate('userId', 'username').lean();

    const answers = allPosts.reduce((acc, post) => {
      const userAnswers = post.answers
        .filter(answer => answer.userId.toString() === userId)
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
    const badges = await Badge.find({ userId: userId }).lean();


    let newBadges = [];
    let updatedReputation = null;
    
    if (req.user && req.user.id === userId) {
      newBadges = await checkAndAwardBadges(userId);
      updatedReputation = await recalculateUserReputation(userId);
    }

    // Prepare response
    const response = {
      ...user,
      posts,
      answers,
      statistics,
      badges: [...badges, ...newBadges],
      reputation: updatedReputation || user.reputation || {
        points: 0,
        level: 'Beginner',
        nextLevel: 251,
        progress: calculateProgress(0)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const userId = req.user.id;

    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const newBadges = await checkAndAwardBadges(userId);
    const badges = await Badge.find({ userId }).lean();

    res.json({
      ...updatedUser.toObject(),
      badges,
      newBadges
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error while uploading avatar', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar
}; 