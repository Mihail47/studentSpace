import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import Footer from '../Footer';
import VoteButtons from '../VoteButtons';
import { FaTrash } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';
import {
  ForumContainer,
  ForumWrapper,
  ForumContent,
  ForumTitle,
  SearchContainer,
  SearchInput,
  SearchButton,
  PostForm,
  PostInput,
  PostTextarea,
  SubmitButton,
  PostList,
  PostItem,
  QuestionStats,
  StatBox,
  QuestionSummary,
  TagContainer,
  Tag,
  PostMeta,
  DeleteButton,
} from './ForumPageElements';
import { useNavigate } from 'react-router-dom';

const ForumPage = ({ isOpen, toggle }) => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [formErrors, setFormErrors] = useState({ title: false, content: false });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0, hasMore: true });

  const navigate = useNavigate();
  const userObj = localStorage.getItem('user');
  const user = userObj ? JSON.parse(userObj) : null;
  const userId = user?._id || user?.userId;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (searchTerm = '', page = 1) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      let url = `${apiUrl}/api/posts`;

      const params = new URLSearchParams();
      if (searchTerm.trim() !== '') {
        params.append('search', searchTerm);
      }
      params.append('page', page);
      params.append('limit', 10);
      
      url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        console.error("Fetch error:", response.statusText);
        return;
      }

      const data = await response.json();
      
      if (page === 1) {
        setPosts(data.posts || []);
      } else {
        setPosts(prevPosts => [...prevPosts, ...(data.posts || [])]);
      }
      
      setPagination(prev => ({
        ...prev,
        ...data.pagination
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPosts(query.toLowerCase().trim(), 1);
  };

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
    
    if (hasAttemptedSubmit) {
      setFormErrors(prev => ({
        ...prev,
        [name]: value.trim() === ''
      }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (hasAttemptedSubmit && value.trim() === '') {
      setFormErrors(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const titleEmpty = !newPost.title.trim();
    const contentEmpty = !newPost.content.trim();

    setFormErrors({
      title: titleEmpty,
      content: contentEmpty
    });

    if (titleEmpty) {
      toast.error('Please enter a title for your post');
      return;
    }

    if (contentEmpty) {
      toast.error('Please describe your post in detail');
      return;
    }

    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Creating your post...');

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Post created successfully!', {
          id: loadingToast,
        });
        setNewPost({ title: '', content: '', tags: '' });
        setFormErrors({ title: false, content: false });
        setHasAttemptedSubmit(false);
        fetchPosts();
      } else {
        toast.error(data.message || 'Error creating post', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error('Network error. Please try again later.', {
        id: loadingToast,
      });
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        fetchPosts();
      } else {
        console.error("Error voting on post:", await response.text());
      }
    } catch (error) {
      console.error("Error voting on post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    toast((t) => (
      <div style={{ 
        padding: '8px 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          Are you sure you want to delete this post?
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleConfirmDelete(postId);
            }}
            style={{
              padding: '6px 12px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '6px 12px',
              background: '#e2e8f0',
              color: '#4a5568',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        background: 'white',
        color: 'black',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '300px'
      },
    });
  };

  const handleConfirmDelete = async (postId) => {
    const loadingToast = toast.loading('Deleting post...');

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        toast.success('Post deleted successfully', {
          id: loadingToast,
        });
      } else {
        const data = await response.json();
        toast.error(data.message || 'You can only delete your own posts', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error('Network error. Please try again later.', {
        id: loadingToast,
      });
    }
  };

  return (
    <ForumContainer>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#4caf50',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#f44336',
              color: 'white',
            },
          },
          loading: {
            style: {
              background: '#2196f3',
              color: 'white',
            },
          },
        }}
      />
      <Navbar toggle={toggle} />
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <ForumWrapper>
        <ForumContent>
          <ForumTitle>Forum</ForumTitle>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <SearchButton onClick={handleSearch}>Search</SearchButton>
          </SearchContainer>
          
          {user && (
            <PostForm onSubmit={handleNewPostSubmit}>
              <PostInput
                type="text"
                name="title"
                placeholder="Post title"
                value={newPost.title}
                onChange={handleNewPostChange}
                onBlur={handleInputBlur}
                className={formErrors.title && hasAttemptedSubmit ? 'error' : ''}
              />
              <PostTextarea
                name="content"
                placeholder="Describe your post in detail..."
                value={newPost.content}
                onChange={handleNewPostChange}
                onBlur={handleInputBlur}
                className={formErrors.content && hasAttemptedSubmit ? 'error' : ''}
              />
              <PostInput
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={handleNewPostChange}
              />
              <SubmitButton type="submit">Post</SubmitButton>
            </PostForm>
          )}
          <PostList>
            {posts.map((post) => {
              console.log(
                "Comparing post.userId._id:",
                String(post.userId?._id),
                "with localStorage userId:",
                String(userId)
              );
              
              return (
                <PostItem key={post._id}>
                  <QuestionStats>
                    <StatBox className="votes">
                      <VoteButtons
                        votes={post.votes}
                        onVote={(voteType) => handleVote(post._id, voteType)}
                        isLoggedIn={Boolean(localStorage.getItem('token'))}
                        userVote={userId && post.votedBy ? post.votedBy.find(vote => vote.userId === userId)?.voteType : null}
                      />
                    </StatBox>
                    <StatBox className="answers" hasAnswers={post.answerCount > 0}>
                      <span className="count">{post.answerCount || 0}</span>
                      <span className="label">{post.answerCount === 1 ? 'answer' : 'answers'}</span>
                    </StatBox>
                  </QuestionStats>
                  <QuestionSummary onClick={() => navigate(`/forum/${post._id}`)}>
                    <h2>{post.title}</h2>
                    <p className="excerpt">{post.content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <TagContainer>
                        {post.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </TagContainer>
                    )}
                    <PostMeta>
                      <div className="time">
                        {post.createdAt
                          ? `asked ${new Date(post.createdAt).toLocaleDateString()}`
                          : 'asked just now'}
                      </div>
                      <div className="user">
                        by {post.userId?.username || 'Anonymous'}
                      </div>
                    </PostMeta>
                  </QuestionSummary>
                  {user && userId && post.userId && String(post.userId._id) === String(userId) && (
                    <DeleteButton onClick={() => handleDeletePost(post._id)}>
                      <FaTrash />
                    </DeleteButton>
                  )}
                </PostItem>
              );
            })}
          </PostList>
        </ForumContent>
      </ForumWrapper>

      <Footer />
    </ForumContainer>
  );
};

export default ForumPage;
