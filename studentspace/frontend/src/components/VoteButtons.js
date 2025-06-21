import React from 'react';
import { VoteContainer, VoteButton, VoteCount } from './VoteButtonsElements';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const VoteButtons = ({ votes = 0, onVote, userVote, isLoggedIn = false }) => {
  const handleVote = (newVoteType) => {
    if (!isLoggedIn) {
      return; 
    }
    
    if (userVote === newVoteType) {
      onVote(null);
    } 
    else {
      onVote(newVoteType);
    }
  };

  return (
    <VoteContainer>
      <VoteButton 
        onClick={() => handleVote('up')}
        active={userVote === 'up'}
        disabled={!isLoggedIn}
        title={!isLoggedIn ? "Please log in to vote" : userVote === 'up' ? "Remove upvote" : "Upvote"}
      >
        <FaCaretUp />
      </VoteButton>
      <VoteCount>{votes}</VoteCount>
      <VoteButton 
        onClick={() => handleVote('down')}
        active={userVote === 'down'}
        disabled={!isLoggedIn}
        title={!isLoggedIn ? "Please log in to vote" : userVote === 'down' ? "Remove downvote" : "Downvote"}
      >
        <FaCaretDown />
      </VoteButton>
    </VoteContainer>
  );
};

export default VoteButtons;
