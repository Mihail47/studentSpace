import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Tabs, Tab, Table, Th, Td, Status, ActionBtn } from './adminDashElements';
import { FaArrowLeft } from 'react-icons/fa';
import { BackButton } from '../PostDetail/PostDetailElements';

const AdminDashboard = () => {
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const [newsRes, postsRes] = await Promise.all([
          fetch('/api/news?includeDeleted=true', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/posts?includeDeleted=true', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        if (!newsRes.ok || !postsRes.ok) throw new Error('Failed to fetch data');
        const newsData = await newsRes.json();
        const postsData = await postsRes.json();
        setNews(Array.isArray(newsData) ? newsData : newsData.posts || []);
        setPosts(Array.isArray(postsData) ? postsData : postsData.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      setRefresh(r => !r);
    } catch (err) {
      alert(err.message);
    }
  };
  const handleRestore = async (type, id) => {
    try {
      const res = await fetch(`/api/${type}/${id}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Restore failed');
      setRefresh(r => !r);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}> <FaArrowLeft /> Back to Home </BackButton>
      <h1>Admin Dashboard</h1>
      <Tabs>
        <Tab $active={tab === 'news'} onClick={() => setTab('news')}>News</Tab>
        <Tab $active={tab === 'posts'} onClick={() => setTab('posts')}>Posts</Tab>
      </Tabs>
      {loading ? <p>Loading...</p> : error ? <p style={{color:'red'}}>{error}</p> : (
        tab === 'news' ? (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n._id}>
                  <Td>{n.title}</Td>
                  <Td>{n.author?.username || 'Unknown'}</Td>
                  <Td><Status deleted={n.deleted}>{n.deleted ? 'Deleted' : 'Active'}</Status></Td>
                  <Td>
                    {!n.deleted ? (
                      <ActionBtn onClick={() => handleDelete('news', n._id)}>Delete</ActionBtn>
                    ) : (
                      <ActionBtn restore onClick={() => handleRestore('news', n._id)}>Restore</ActionBtn>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <Td>{p.title}</Td>
                  <Td>{p.userId?.username || 'Unknown'}</Td>
                  <Td><Status deleted={p.deleted}>{p.deleted ? 'Deleted' : 'Active'}</Status></Td>
                  <Td>
                    {!p.deleted ? (
                      <ActionBtn onClick={() => handleDelete('posts', p._id)}>Delete</ActionBtn>
                    ) : (
                      <ActionBtn restore onClick={() => handleRestore('posts', p._id)}>Restore</ActionBtn>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      )}
    </Container>
  );
};

export default AdminDashboard; 