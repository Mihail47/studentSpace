import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Profile from '../components/Profile';
import axios from 'axios';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #4A5568;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #E53E3E;
  gap: 1rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4299E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3182CE;
  }
`;

const ProfileUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/profiles/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (response.data) {
          setUserProfile(response.data);
        } else {
          throw new Error('No profile data received');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <LoadingContainer>
        Loading profile...
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>{error}</div>
        <BackButton onClick={() => navigate(-1)}>
          Go Back
        </BackButton>
      </ErrorContainer>
    );
  }

  if (!userProfile) {
    return (
      <ErrorContainer>
        <div>User not found</div>
        <BackButton onClick={() => navigate(-1)}>
          Go Back
        </BackButton>
      </ErrorContainer>
    );
  }

  return <Profile userProfile={userProfile} />;
};

export default ProfileUserPage; 