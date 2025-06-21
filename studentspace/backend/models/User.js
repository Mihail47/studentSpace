const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['bronze', 'silver', 'gold'], required: true },
  earnedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  bio: {
    type: String,
    default: ''
  },
  reputation: {
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ['Beginner', 'Learner', 'Intermediate', 'Advanced', 'Expert', 'Master'],
      default: 'Beginner'
    },
    nextLevel: {
      type: Number,
      default: 251
    }
  },
  statistics: {
    totalPosts: { type: Number, default: 0 },
    totalAnswers: { type: Number, default: 0 },
    acceptedAnswers: { type: Number, default: 0 },
    totalVotesReceived: { type: Number, default: 0 },
    totalVotesGiven: { type: Number, default: 0 }
  },
  memberSince: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  avatarUrl: { type: String, default: '' },
  banned: { type: Boolean, default: false },
  silencedUntil: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre('save', function(next) {
  this.lastSeen = new Date();
  next();
});

UserSchema.methods.awardBadge = async function(badgeData) {
  if (!this.badges.some(badge => badge.name === badgeData.name)) {
    this.badges.push(badgeData);
    await this.save();
  }
};

UserSchema.methods.updateReputationLevel = function() {
  const points = this.reputation.points;
  
  if (points >= 3501) {
    this.reputation.level = 'Master';
    this.reputation.nextLevel = null;
  } else if (points >= 2001) {
    this.reputation.level = 'Expert';
    this.reputation.nextLevel = 3501;
  } else if (points >= 1001) {
    this.reputation.level = 'Advanced';
    this.reputation.nextLevel = 2001;
  } else if (points >= 501) {
    this.reputation.level = 'Intermediate';
    this.reputation.nextLevel = 1001;
  } else if (points >= 251) {
    this.reputation.level = 'Learner';
    this.reputation.nextLevel = 501;
  } else {
    this.reputation.level = 'Beginner';
    this.reputation.nextLevel = 251;
  }
};

UserSchema.methods.addReputationPoints = async function(points) {
  const newPoints = Math.max(0, this.reputation.points + points);
  
  if (newPoints !== this.reputation.points) {
    this.reputation.points = newPoints;
    if (points > 0) {
      this.statistics.totalVotesReceived = (this.statistics.totalVotesReceived || 0) + 1;
    } else if (points < 0) {
      this.statistics.totalVotesReceived = Math.max(0, (this.statistics.totalVotesReceived || 0) - 1);
    }
    
    this.updateReputationLevel();
    await this.save();
  }
};

UserSchema.virtual('isSilenced').get(function() {
  return this.silencedUntil && new Date(this.silencedUntil) > new Date();
});

module.exports = mongoose.model('User', UserSchema);
