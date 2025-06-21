import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import SignInPage from './pages/signin';
import NewsPage from './pages/news';
import ForumPage from './pages/forum';
import ProfilePage from './components/Profile';
import PostDetail from './components/PostDetail';
import ScrollToTop from './components/ScrollToTop';
import ProfileUserPage from './pages/profileUser';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home isOpen={isOpen} toggle={toggle} />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/news/*" element={<NewsPage />} />
        <Route path="/forum" element={<ForumPage isOpen={isOpen} toggle={toggle} />} />
        <Route path="/forum/:id" element={<PostDetail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/user/:id" element={<ProfileUserPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
