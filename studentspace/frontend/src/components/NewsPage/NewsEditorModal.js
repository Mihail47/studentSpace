import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.32);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 28px 24px 28px;
  min-width: 340px;
  max-width: 95vw;
  width: 400px;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #888;
  cursor: pointer;
  &:hover { color: #111; }
`;

const Title = styled.h2`
  margin: 0 0 18px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #222;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #444;
  margin-bottom: 4px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 8px 10px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px 0;
  background: #ff8c00;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
  &:hover:enabled { background: #e67e22; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const ErrorMsg = styled.div`
  color: #b30000;
  margin-bottom: 10px;
  font-size: 0.98rem;
`;

const NewsEditorModal = ({ open, onClose, onNewsPosted }) => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to post news');
      }
      setForm({ title: '', content: '' });
      onNewsPosted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose} aria-label="Close">×</CloseBtn>
        <Title>Post News</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <Label htmlFor="news-title">Title</Label>
          <Input id="news-title" name="title" value={form.title} onChange={handleChange} maxLength={100} required disabled={loading} />
          <Label htmlFor="news-content">Content</Label>
          <Textarea id="news-content" name="content" value={form.content} onChange={handleChange} maxLength={2000} required disabled={loading} />
          <SubmitBtn type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post News'}</SubmitBtn>
        </form>
      </Modal>
    </Overlay>
  );
};

export default NewsEditorModal; 