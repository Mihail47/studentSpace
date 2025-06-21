import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import { NewsListWrapper } from './NewsPageElements';

const NewsList = ({ refreshFlag }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userObj = localStorage.getItem('user');
    const user = userObj ? JSON.parse(userObj) : null;
    setIsAdmin(user?.role === 'admin');
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [refreshFlag]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete news');
      }
      setNews(news => news.filter(n => n._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Loading news...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!news.length) return <div>No news yet.</div>;

  return (
    <NewsListWrapper>
      {news.map((item) => (
        <NewsCard
          key={item._id}
          {...item}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          deleting={deletingId === item._id}
        />
      ))}
    </NewsListWrapper>
  );
};

export default NewsList; 