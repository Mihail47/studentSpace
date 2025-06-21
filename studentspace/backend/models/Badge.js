const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    required: true
  },
  category: {
    type: String,
    enum: ['post', 'answer', 'vote', 'special'],
    required: true
  },
  awardedAt: {
    type: Date,
    default: Date.now
  }
});

badgeSchema.index({ userId: 1, name: 1 }, { unique: true });

const Badge = mongoose.model('Badge', badgeSchema);

const AVAILABLE_BADGES = {
  BEGINNER_POSTER: {
    name: 'Beginner Poster',
    description: 'Created 3 posts',
    type: 'bronze',
    category: 'post',
    condition: (stats) => stats.totalPosts >= 3
  },
  ACTIVE_POSTER: {
    name: 'Active Poster',
    description: 'Created 10 posts',
    type: 'silver',
    category: 'post',
    condition: (stats) => stats.totalPosts >= 10
  },
  PROLIFIC_AUTHOR: {
    name: 'Prolific Author',
    description: 'Created 25 posts with at least 5 upvotes each',
    type: 'gold',
    category: 'post',
    condition: (stats) => stats.postsWithHighVotes >= 25
  },

  HELPER: {
    name: 'Helper',
    description: 'Got 1 answer accepted',
    type: 'bronze',
    category: 'answer',
    condition: (stats) => stats.acceptedAnswers >= 1
  },
  PROBLEM_SOLVER: {
    name: 'Problem Solver',
    description: 'Got 5 answers accepted',
    type: 'silver',
    category: 'answer',
    condition: (stats) => stats.acceptedAnswers >= 5
  },
  EXPERT: {
    name: 'Expert',
    description: 'Got 15 answers accepted',
    type: 'gold',
    category: 'answer',
    condition: (stats) => stats.acceptedAnswers >= 15
  },

  RISING_STAR: {
    name: 'Rising Star',
    description: 'Received 10 total upvotes',
    type: 'bronze',
    category: 'vote',
    condition: (stats) => stats.totalVotesReceived >= 10
  },
  POPULAR_CONTRIBUTOR: {
    name: 'Popular Contributor',
    description: 'Received 50 total upvotes',
    type: 'silver',
    category: 'vote',
    condition: (stats) => stats.totalVotesReceived >= 50
  },
  COMMUNITY_LEADER: {
    name: 'Community Leader',
    description: 'Received 200 total upvotes',
    type: 'gold',
    category: 'vote',
    condition: (stats) => stats.totalVotesReceived >= 200
  },

  QUICK_THINKER: {
    name: 'Quick Thinker',
    description: 'Got an answer accepted within 1 hour of the question being posted',
    type: 'gold',
    category: 'special',
    condition: (stats) => stats.quickAcceptedAnswers >= 1
  },
  DISCUSSION_STARTER: {
    name: 'Discussion Starter',
    description: 'Created a post that received 5+ answers',
    type: 'silver',
    category: 'special',
    condition: (stats) => stats.postsWithManyAnswers >= 1
  },
  FIRST_STEPS: {
    name: 'First Steps',
    description: 'Made your first contribution to the community',
    type: 'bronze',
    category: 'special',
    condition: (stats) => stats.totalPosts + stats.totalAnswers >= 1
  }
};

module.exports = { Badge, AVAILABLE_BADGES }; 