const User = require('../models/User');
const Post = require('../models/Post');

const REPUTATION_POINTS = {
  ANSWER_ACCEPTED: 10,
  ANSWER_UPVOTED: 10,
  QUESTION_UPVOTED: 5,
  POST_DOWNVOTED: -5,
  ANSWER_DOWNVOTED: -5,
  DOWNVOTING: -1
};

async function updateReputationPoints(userId, action) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for reputation update:', userId);
      return false;
    }

    let points = 0;
    switch (action) {
      case 'ANSWER_ACCEPTED':
        points = REPUTATION_POINTS.ANSWER_ACCEPTED;
        break;
      case 'ANSWER_UPVOTED':
        points = REPUTATION_POINTS.ANSWER_UPVOTED;
        break;
      case 'QUESTION_UPVOTED':
        points = REPUTATION_POINTS.QUESTION_UPVOTED;
        break;
      case 'POST_DOWNVOTED':
        if (user.reputation.points < Math.abs(REPUTATION_POINTS.POST_DOWNVOTED)) {
          console.log('User does not have enough points for downvote penalty');
          return false;
        }
        points = REPUTATION_POINTS.POST_DOWNVOTED;
        break;
      case 'ANSWER_DOWNVOTED':
        if (user.reputation.points < Math.abs(REPUTATION_POINTS.ANSWER_DOWNVOTED)) {
          console.log('User does not have enough points for answer downvote penalty');
          return false;
        }
        points = REPUTATION_POINTS.ANSWER_DOWNVOTED;
        break;
      case 'DOWNVOTING':
        if (user.reputation.points < Math.abs(REPUTATION_POINTS.DOWNVOTING)) {
          console.log('User does not have enough points for downvoting penalty');
          return false;
        }
        points = REPUTATION_POINTS.DOWNVOTING;
        break;
      default:
        console.error('Invalid reputation action:', action);
        return false;
    }

    if (points < 0 && Math.abs(points) > user.reputation.points) {
      console.log('Operation would result in negative points, skipping');
      return false;
    }

    await user.addReputationPoints(points);
    return true;
  } catch (error) {
    console.error('Error updating reputation points:', error);
    throw error;
  }
}

async function recalculateUserReputation(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for reputation recalculation:', userId);
      return null;
    }

    const posts = await Post.find({ userId: userId });
    const postsWithAnswers = await Post.find({ 'answers.userId': userId });
    const acceptedAnswers = postsWithAnswers.reduce((count, post) => {
      const userAcceptedAnswers = post.answers.filter(answer => 
        answer.userId.toString() === userId.toString() && 
        answer.isAccepted
      );
      return count + userAcceptedAnswers.length;
    }, 0);
    
    const acceptedAnswersPoints = acceptedAnswers * REPUTATION_POINTS.ANSWER_ACCEPTED;
    const answerUpvotes = postsWithAnswers.reduce((count, post) => {
      const userAnswers = post.answers.filter(answer => 
        answer.userId.toString() === userId.toString()
      );
      return count + userAnswers.reduce((answerCount, answer) => {
        const upvotes = answer.votedBy.filter(vote => vote.voteType === 'up').length;
        return answerCount + (upvotes * REPUTATION_POINTS.ANSWER_UPVOTED);
      }, 0);
    }, 0);

    const postUpvotes = posts.reduce((count, post) => {
      const upvotes = post.votedBy.filter(vote => vote.voteType === 'up').length;
      return count + (upvotes * REPUTATION_POINTS.QUESTION_UPVOTED);
    }, 0);
    
    const totalPoints = acceptedAnswersPoints + answerUpvotes + postUpvotes;
    user.reputation.points = totalPoints;
    user.updateReputationLevel();
    await user.save();

    return user.reputation;
  } catch (error) {
    console.error('Error recalculating reputation:', error);
    return null;
  }
}

module.exports = {
  updateReputationPoints,
  recalculateUserReputation,
  REPUTATION_POINTS
}; 