import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VoteButtons from '../VoteButtons';
import { Toaster } from 'react-hot-toast';
import {
  PostDetailContainer,
  PostTitle,
  PostContent,
  BackButton,
  VoteContainer,
  PostBody,
  PostMeta,
  TagContainer,
  Tag,
  AnswerSection,
  AnswerList,
  AnswerItem,
  AnswerForm,
  AnswerInput,
  AnswerButton,
  AcceptButton,
  DeleteButton,
} from './PostDetailElements';
import { FaArrowLeft, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const getUserData = () => {
  const token = localStorage.getItem('token');
  const userObj = localStorage.getItem('user');
  let user = null;
  try {
    user = userObj ? JSON.parse(userObj) : null;
    if (user) {
      return { token, user, isLoggedIn: true };
    } else {
      return { token: null, user: null, isLoggedIn: false };
    }
  } catch (e) {
    console.error('Error processing user data:', e);
    return { token: null, user: null, isLoggedIn: false };
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState(() => getUserData());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(getUserData());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setAuthState(getUserData());
    };

    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleVotePost = async (voteType) => {
    const { token, user, isLoggedIn } = authState;
    
    if (!isLoggedIn) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to vote');
      }

      const { post: updatedPost } = responseData;
      setPost(updatedPost);
      
      if (voteType === null) {
        toast.success('Vote removed');
      } else {
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Error voting on post');
    }
  };

  const handleVoteAnswer = async (answerId, voteType) => {
    const { token, isLoggedIn } = authState;
    
    if (!isLoggedIn) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/answers/${id}/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to vote');
        } else {
          throw new Error('Failed to vote');
        }
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      
      if (voteType === null) {
        toast.success('Vote removed');
      } else {
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Error voting on answer');
    }
  };

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    const { token, isLoggedIn } = authState;
    
    if (!isLoggedIn) {
      toast.error('Please log in to answer');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/answers/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: answerContent }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add answer');
      }
      setAnswerContent('');
      const data = await response.json();
      setPost(data);
      toast.success('Answer posted successfully!');
    } catch (error) {
      console.error('Error adding answer:', error);
      toast.error(error.message || 'Error posting answer');
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    const { token, isLoggedIn } = authState;
    
    if (!isLoggedIn) {
      toast.error('Please log in to accept an answer');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/answers/${id}/${answerId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to accept answer');
        } else {
          throw new Error('Failed to accept answer');
        }
      }

      const data = await response.json();
      setPost(data);
      toast.success('Answer accepted!');
    } catch (error) {
      console.error('Error accepting answer:', error);
      toast.error(error.message || 'Error accepting answer');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const { token, isLoggedIn } = authState;
    
    if (!isLoggedIn) {
      toast.error('Please log in to delete your answer');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/answers/${id}/${answerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete answer');
        } else {
          throw new Error('Failed to delete answer');
        }
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      toast.success('Answer deleted successfully');
    } catch (error) {
      console.error('Error deleting answer:', error);
      toast.error(error.message || 'Error deleting answer');
    }
  };

  if (loading) return <LoadingView navigate={navigate} />;
  if (error) return <ErrorView error={error} navigate={navigate} />;
  if (!post) return <NotFoundView navigate={navigate} />;

  const { user, isLoggedIn } = authState;

  return (
    <PostDetailContainer>
      <Toaster position="top-right" />
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </BackButton>
      <PostContent>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <VoteContainer>
            <VoteButtons 
              votes={post.votes} 
              onVote={handleVotePost}
              userVote={user && post.votedBy ? post.votedBy.find(vote => vote.userId === user._id)?.voteType : null}
              isLoggedIn={isLoggedIn}
            />
          </VoteContainer>
          <div style={{ flex: 1 }}>
            <PostTitle>{post.title}</PostTitle>
            <PostBody>{post.content}</PostBody>
            <PostMeta>
              Posted by {post.userId?._id === user?._id ? (
                <Link to="/profile">{post.userId?.username || 'Anonymous'}</Link>
              ) : (
                <Link to={`/profile/user/${post.userId?._id}`}>{post.userId?.username || 'Anonymous'}</Link>
              )} on {new Date(post.createdAt).toLocaleDateString()}
            </PostMeta>
            {post.tags?.length > 0 && (
              <TagContainer>
                {post.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagContainer>
            )}
          </div>
        </div>

        <AnswerSection>
          <h3>{post.answers?.length || 0} Answer{post.answers?.length !== 1 ? 's' : ''}</h3>
          <AnswerList>
            {post.answers
              ?.sort((a, b) => {
                if (a.isAccepted && !b.isAccepted) return -1;
                if (!a.isAccepted && b.isAccepted) return 1;
                if (a.votes !== b.votes) return b.votes - a.votes;
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((answer) => (
                <AnswerItem key={answer._id} isAccepted={answer.isAccepted}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <VoteContainer>
                      <VoteButtons 
                        votes={answer.votes} 
                        onVote={(voteType) => handleVoteAnswer(answer._id, voteType)}
                        userVote={user && answer.votedBy ? answer.votedBy.find(vote => vote.userId === user._id)?.voteType : null}
                        isLoggedIn={isLoggedIn}
                      />
                    </VoteContainer>
                    <div style={{ flex: 1 }}>
                      <div>{answer.content}</div>
                      <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                        Answered by {answer.userId?._id === user?._id ? (
                          <Link to="/profile">{answer.userId?.username || 'Anonymous'}</Link>
                        ) : (
                          <Link to={`/profile/user/${answer.userId?._id}`}>{answer.userId?.username || 'Anonymous'}</Link>
                        )} on{' '}
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                      {user && post.userId?._id === user._id && (
                        <AcceptButton
                          isAccepted={answer.isAccepted}
                          onClick={() => handleAcceptAnswer(answer._id)}
                          type="button"
                          title={answer.isAccepted ? "Accepted Answer" : "Accept this answer"}
                        >
                          <FaCheck />
                        </AcceptButton>
                      )}
                      {user && answer.userId?._id === user._id && (
                        <DeleteButton
                          onClick={() => handleDeleteAnswer(answer._id)}
                          type="button"
                          title="Delete answer"
                        >
                          <FaTrash />
                        </DeleteButton>
                      )}
                    </div>
                  </div>
                </AnswerItem>
              ))}
          </AnswerList>

          {isLoggedIn ? (
            <AnswerForm onSubmit={handleAddAnswer}>
              <AnswerInput
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer..."
                required
              />
              <AnswerButton type="submit">Post Answer</AnswerButton>
            </AnswerForm>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
              Please log in to post an answer.
            </div>
          )}
        </AnswerSection>
      </PostContent>
    </PostDetailContainer>
  );
};

const LoadingView = ({ navigate }) => (
  <PostDetailContainer>
    <BackButton onClick={() => navigate(-1)}>
      <FaArrowLeft /> Back
    </BackButton>
    <div>Loading...</div>
  </PostDetailContainer>
);

const ErrorView = ({ error, navigate }) => (
  <PostDetailContainer>
    <BackButton onClick={() => navigate(-1)}>
      <FaArrowLeft /> Back
    </BackButton>
    <div style={{ color: 'red' }}>Error: {error}</div>
  </PostDetailContainer>
);

const NotFoundView = ({ navigate }) => (
  <PostDetailContainer>
    <BackButton onClick={() => navigate(-1)}>
      <FaArrowLeft /> Back
    </BackButton>
    <div>Post not found</div>
  </PostDetailContainer>
);

export default PostDetail;
