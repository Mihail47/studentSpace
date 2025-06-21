const { Badge, AVAILABLE_BADGES } = require('../models/Badge');
const Post = require('../models/Post');

async function calculateUserStats(userId) {
  const posts = await Post.find({ userId });
  const postsWithHighVotes = posts.filter(post => post.votes >= 5).length;
  const postsWithManyAnswers = posts.filter(post => post.answers.length >= 5).length;
  const postsWithUserAnswers = await Post.find({ 'answers.userId': userId });
  const quickAcceptedAnswers = postsWithUserAnswers.reduce((count, post) => {
    const userAnswers = post.answers.filter(answer => 
      answer.userId.toString() === userId.toString() &&
      answer.isAccepted &&
      (new Date(answer.createdAt) - new Date(post.createdAt)) <= 3600000 // 1 hour in milliseconds
    );
    return count + userAnswers.length;
  }, 0);

  const postVotes = posts.reduce((sum, post) => sum + (post.votes || 0), 0);
  const answerVotes = postsWithUserAnswers.reduce((sum, post) => {
    const userAnswers = post.answers.filter(answer => 
      answer.userId.toString() === userId.toString()
    );
    return sum + userAnswers.reduce((answerSum, answer) => 
      answerSum + (answer.votes || 0), 0
    );
  }, 0);

  const acceptedAnswers = postsWithUserAnswers.reduce((count, post) => {
    const userAcceptedAnswers = post.answers.filter(answer => 
      answer.userId.toString() === userId.toString() && 
      answer.isAccepted
    );
    return count + userAcceptedAnswers.length;
  }, 0);

  return {
    totalPosts: posts.length,
    postsWithHighVotes,
    postsWithManyAnswers,
    quickAcceptedAnswers,
    totalVotesReceived: postVotes + answerVotes,
    acceptedAnswers,
    totalAnswers: postsWithUserAnswers.reduce((count, post) => 
      count + post.answers.filter(answer => 
        answer.userId.toString() === userId.toString()
      ).length, 0
    )
  };
}

async function checkAndAwardBadges(userId) {
  try {
    const stats = await calculateUserStats(userId);
    const userBadges = await Badge.find({ userId });
    const userBadgeNames = new Set(userBadges.map(badge => badge.name));
    const newBadges = [];

    for (const badgeKey in AVAILABLE_BADGES) {
      const badge = AVAILABLE_BADGES[badgeKey];
      
      if (userBadgeNames.has(badge.name)) continue;
      if (badge.condition(stats)) {
        const newBadge = new Badge({
          userId,
          name: badge.name,
          description: badge.description,
          type: badge.type,
          category: badge.category
        });

        await newBadge.save();
        newBadges.push(newBadge);
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
}

module.exports = {
  checkAndAwardBadges,
  calculateUserStats
}; 