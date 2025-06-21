import React from 'react';
import ForumPage from '../components/ForumPage';

const Forum = ({ isOpen, toggle }) => {
  return <ForumPage isOpen={isOpen} toggle={toggle} />;
};

export default Forum;
