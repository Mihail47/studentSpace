import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsList from '../components/NewsPage/NewsList';
import { NewsContainer, NewsWrapper, NewsContent, NewsTitle } from '../components/NewsPage/NewsPageElements';
import FloatingAddNewsButton from '../components/NewsPage/FloatingAddNewsButton';
import NewsEditorModal from '../components/NewsPage/NewsEditorModal';
import { Routes, Route } from 'react-router-dom';
import NewsDetail from '../components/NewsPage/NewsDetail';
import Sidebar from '../components/Sidebar';

const NewsPage = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const userObj = localStorage.getItem('user');
    const user = userObj ? JSON.parse(userObj) : null;
    setIsAdmin(user?.role === 'admin');
  }, []);

  const handleNewsPosted = () => {
    setShowEditor(false);
    setRefreshFlag(f => f + 1);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <NewsContainer>
        <NewsWrapper>
          <NewsContent>
            <NewsTitle>Latest News</NewsTitle>
            <Routes>
              <Route index element={<NewsList refreshFlag={refreshFlag} />} />
              <Route path=":id" element={<NewsDetail />} />
            </Routes>
            {isAdmin && (
              <>
                <FloatingAddNewsButton onClick={() => setShowEditor(true)} />
                <NewsEditorModal open={showEditor} onClose={() => setShowEditor(false)} onNewsPosted={handleNewsPosted} />
              </>
            )}
          </NewsContent>
        </NewsWrapper>
      </NewsContainer>
      <Footer />
    </>
  );
};

export default NewsPage;