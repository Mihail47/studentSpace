import React from 'react';
import { NewsCardWrapper } from './NewsPageElements';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NewsTitle = styled.h2`
  font-size: 20px;
  color: #222;
  margin-bottom: 8px;
`;

const NewsDate = styled.p`
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
`;

const NewsSummary = styled.p`
  font-size: 15px;
  color: #444;
  margin-bottom: 12px;
`;

const ReadMore = styled(Link)`
  color: #ff8c00;
  font-weight: 600;
  text-decoration: none;
  margin-top: auto;
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.85);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b30000;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: #ffeaea;
    color: #ff2222;
  }
`;

const CardContainer = styled.div`
  position: relative;
`;

const NewsAuthor = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  a {
    color: #ff8c00;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

const NewsCard = ({ _id, title, content, createdAt, author, onDelete, isAdmin }) => (
  <CardContainer>
    {isAdmin && (
      <DeleteBtn onClick={() => {
        if (window.confirm('Delete this news post?')) onDelete(_id);
      }} title="Delete news post" aria-label="Delete news post">
        <FaTrash />
      </DeleteBtn>
    )}
    <NewsCardWrapper>
      <NewsTitle>{title}</NewsTitle>
      <NewsDate>{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</NewsDate>
      <NewsAuthor>
        {author && author._id ? (
          <a href={`/profile/user/${author._id}`}>{author.username}</a>
        ) : (
          'Unknown'
        )}
      </NewsAuthor>
      <NewsSummary>{content.length > 120 ? content.slice(0, 120) + '...' : content}</NewsSummary>
      <ReadMore to={`/news/${_id}`}>Read more</ReadMore>
    </NewsCardWrapper>
  </CardContainer>
);

export default NewsCard; 