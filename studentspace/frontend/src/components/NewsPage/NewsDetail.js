import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const DetailContainer = styled.div`
  width: 100%;
  max-width: 900px;
  height: 500px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 32px 32px 32px 32px;
  margin-top: 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  word-break: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  @media (max-width: 900px) {
    max-width: 100%;
    padding: 20px 10px;
    height: 400px;
  }
  @media (max-width: 600px) {
    padding: 10px 2px;
    height: 320px;
  }
`;
const NewsTitle = styled.h1`
  font-size: 2rem;
  color: #222;
  margin-bottom: 12px;
`;
const NewsDate = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 18px;
`;
const NewsContent = styled.div`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 24px;
  white-space: pre-line;
`;
const Author = styled.div`
  font-size: 1rem;
  color: #666;
  margin-bottom: 8px;
`;
const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 18px;
  color: #ff8c00;
  text-decoration: none;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error('Failed to fetch news article');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <DetailContainer>Loading...</DetailContainer>;
  if (error) return <DetailContainer style={{ color: 'red' }}>{error}</DetailContainer>;
  if (!news) return <DetailContainer>News article not found.</DetailContainer>;

  return (
    <DetailContainer>
      <BackLink to="/news">← Back to News</BackLink>
      <NewsTitle>{news.title}</NewsTitle>
      <NewsDate>{news.createdAt ? new Date(news.createdAt).toLocaleDateString() : ''}</NewsDate>
      <Author>
        {news.author && news.author._id ? (
          <Link to={`/profile/user/${news.author._id}`}>{news.author.username}</Link>
        ) : (
          'Unknown'
        )}
      </Author>
      <NewsContent>{news.content}</NewsContent>
    </DetailContainer>
  );
};

export default NewsDetail; 