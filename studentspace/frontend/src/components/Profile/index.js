import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaEdit, FaMedal, FaAward, FaTrophy, 
  FaPen, FaStar, FaBookmark, FaCrown, FaRegCommentDots, 
  FaLightbulb, FaGraduationCap, FaHeart, FaClock, FaUsers, 
  FaRegLightbulb, FaKey, FaCamera
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { AVAILABLE_BADGES } from '../../constants/badges';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  ProfileContainer,
  ProfileContent,
  ProfileField,
  ProfileInput,
  SaveButton,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  BackButton,
  ProfileSidebar,
  ProfileHeader,
  Avatar,
  UserInfo,
  Username,
  ReputationLevel,
  ReputationTooltip,
  EditButton,
  BadgesContainer,
  BadgeGroup,
  BadgeGroupTitle,
  BadgeGrid,
  BadgeItem,
  BadgeName,
  BadgeTooltip,
  ProfileMain,
  StatsContainer,
  StatBox,
  StatNumber,
  StatLabel,
  TabContainer,
  TabList,
  Tab,
  TabContent,
  PostList,
  PostItem,
  PostTitle,
  PostMeta,
  AnswerList,
  AnswerItem,
  AnswerContent,
  AnswerMeta,
  VoteCount
} from './ProfileElements';

const BADGE_ICONS = {
  // Post badges
  'Beginner Poster': FaPen,
  'Active Poster': FaBookmark,
  'Prolific Author': FaCrown,

  // Answer badges
  'Helper': FaRegCommentDots,
  'Problem Solver': FaLightbulb,
  'Expert': FaGraduationCap,

  // Vote badges
  'Rising Star': FaStar,
  'Popular Contributor': FaHeart,
  'Community Leader': FaTrophy,

  // Special badges
  'Quick Thinker': FaClock,
  'Discussion Starter': FaUsers,
  'First Steps': FaRegLightbulb
};

const getBadgeIcon = (type) => {
  switch (type) {
    case 'gold':
      return <FaTrophy color="#FFD700" />;
    case 'silver':
      return <FaMedal color="#C0C0C0" />;
    case 'bronze':
      return <FaAward color="#CD7F32" />;
    default:
      return null;
  }
};

const getNextLevelThreshold = (reputation) => {
  if (reputation < 100) return { next: 100, current: 0 };
  if (reputation < 250) return { next: 250, current: 100 };
  if (reputation < 500) return { next: 500, current: 250 };
  if (reputation < 1000) return { next: 1000, current: 500 };
  if (reputation < 2000) return { next: 2000, current: 1000 };
  if (reputation < 5000) return { next: 5000, current: 2000 };
  if (reputation < 10000) return { next: 10000, current: 5000 };
  return { next: null, current: 10000 };
};

const getReputationProgress = (reputation) => {
  const nextThreshold = getNextLevelThreshold(reputation);
  if (!nextThreshold) return 100;

  const prevThreshold = 
    nextThreshold === 100 ? 0 :
    nextThreshold === 250 ? 100 :
    nextThreshold === 500 ? 250 :
    nextThreshold === 1000 ? 500 : 0;

  return ((reputation - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
};

const getReputationStars = (reputation) => {
  const totalStars = 5;
  let filledStars;
  
  const points = typeof reputation === 'object' ? reputation.points : reputation;
  
  if (points >= 1000) filledStars = 5;
  else if (points >= 500) filledStars = 4;
  else if (points >= 250) filledStars = 3;
  else if (points >= 100) filledStars = 2;
  else filledStars = 1;

  return Array(totalStars).fill(null).map((_, index) => (
    <FaStar 
      key={index}
      color={index < filledStars ? "#FFD700" : "#e4e5e9"}
      size={20}
    />
  ));
};

const getReputationLevel = (reputation) => {
  if (reputation >= 1000) return 'Expert';
  if (reputation >= 500) return 'Advanced';
  if (reputation >= 250) return 'Intermediate';
  if (reputation >= 100) return 'Rising Star';
  return 'Beginner';
};

const renderBadges = (badges, availableBadges) => {
  const categories = {
    post: { title: 'Posting Achievements', badges: [] },
    answer: { title: 'Answer Achievements', badges: [] },
    vote: { title: 'Voting Achievements', badges: [] },
    special: { title: 'Special Achievements', badges: [] }
  };

  const earnedBadges = new Set(badges.map(badge => badge.name));
  Object.entries(availableBadges).forEach(([key, badge]) => {
    const isEarned = earnedBadges.has(badge.name);
    const BadgeIcon = BADGE_ICONS[badge.name];

    categories[badge.category].badges.push({
      ...badge,
      earned: isEarned,
      icon: BadgeIcon
    });
  });

  return (
    <BadgesContainer>
      {Object.entries(categories).map(([category, { title, badges }]) => (
        <BadgeGroup key={category}>
          <BadgeGroupTitle>{title}</BadgeGroupTitle>
          <BadgeGrid>
            {badges.map(badge => (
              <BadgeItem
                key={badge.name}
                earned={badge.earned}
                type={badge.type}
              >
                {badge.icon && <badge.icon />}
                <BadgeName earned={badge.earned}>
                  {badge.name}
                </BadgeName>
                <BadgeTooltip>
                  <strong>{badge.earned ? 'Achievement Unlocked!' : 'Locked Achievement'}</strong>
                  {badge.description}
                  {!badge.earned && (
                    <>
                      <br />
                      <br />
                      <em>Keep contributing to unlock this badge!</em>
                    </>
                  )}
                </BadgeTooltip>
              </BadgeItem>
            ))}
          </BadgeGrid>
        </BadgeGroup>
      ))}
    </BadgesContainer>
  );
};

const ToggleSwitch = ({ checked, onChange, label, colorOn, colorOff, disabled }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ minWidth: 70, fontWeight: 600, color: checked ? colorOn : colorOff }}>
      {label}
    </span>
    <label style={{
      display: 'inline-block',
      position: 'relative',
      width: 50,
      height: 28,
      margin: 0,
      verticalAlign: 'middle',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
        style={{ display: 'none' }}
      />
      <span style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: checked ? colorOn : colorOff,
        borderRadius: 28,
        transition: 'background 0.2s',
        boxShadow: '0 2px 8px #eee',
      }} />
      <span style={{
        position: 'absolute',
        left: checked ? 24 : 3,
        top: 3,
        width: 22,
        height: 22,
        background: '#fff',
        borderRadius: '50%',
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px #bbb',
      }} />
    </label>
  </div>
);

const ProfilePage = ({ userProfile }) => {
  const { id } = useParams();
  const [user, setUser] = useState(userProfile || null);
  const [isLoading, setIsLoading] = useState(!userProfile);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState(userProfile ? userProfile.posts || [] : []);
  const [answers, setAnswers] = useState(userProfile ? userProfile.answers || [] : []);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [moderationStatus, setModerationStatus] = useState({ banned: false, silencedUntil: null });
  const [adminModerationStatus, setAdminModerationStatus] = useState({ banned: false, silencedUntil: null });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const isOwnProfile = loggedInUserId && (id === undefined || id === loggedInUserId);

  useEffect(() => {
    const userObj = localStorage.getItem('user');
    const user = userObj ? JSON.parse(userObj) : null;
    setIsAdmin(user?.role === 'admin');
    setLoggedInUserId(user?._id || user?.userId);
  }, []);

  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile();
    } else {
      setUser(userProfile);
      setPosts(userProfile.posts || []);
      setAnswers(userProfile.answers || []);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchModerationStatus = async () => {
      const token = localStorage.getItem('token');
      if (isOwnProfile && token) {
        try {
          const res = await axios.get('/api/users/moderation/status', { headers: { Authorization: `Bearer ${token}` } });
          setModerationStatus(res.data);
        } catch (err) {
          console.error('Error fetching moderation status:', err);
        }
      } else if (id && isAdmin && token) {
        try {
          const res = await axios.get(`/api/users/${id}/moderation/status`, { headers: { Authorization: `Bearer ${token}` } });
          setAdminModerationStatus(res.data);
        } catch (err) {
          console.error('Error fetching admin moderation status:', err);
        }
      }
    };
    fetchModerationStatus();
  }, [id, isOwnProfile, isAdmin]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/profile`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data) {
        setUser(response.data);
        setPosts(response.data.posts || []);
        setAnswers(response.data.answers || []);
        
        setEditForm({
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio || ''
        });
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username,
      email: user.email,
      bio: user.bio || ''
    });
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await axios.put('/api/profile/avatar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      const response = await axios.put('/api/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchUserProfile();
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview('');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile: ' + error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Error updating password: ' + error.message);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <PostList>
            {posts && posts.length > 0 ? (
              posts.map(post => (
                <PostItem key={post._id} onClick={() => navigate(`/forum/${post._id}`)}>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    <VoteCount>
                      <FaStar /> {post.votes || 0} votes
                    </VoteCount>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </PostMeta>
                </PostItem>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No posts yet
              </div>
            )}
          </PostList>
        );

      case 'answers':
        return (
          <AnswerList>
            {answers && answers.length > 0 ? (
              answers.map(answer => (
                <AnswerItem key={answer._id} $accepted={answer.isAccepted}>
                  <AnswerContent>
                    {answer.content}
                  </AnswerContent>
                  <AnswerMeta>
                    <VoteCount>
                      <FaStar /> {answer.votes || 0} votes
                    </VoteCount>
                    <span>on: {answer.postTitle}</span>
                    <span>by: {answer.postAuthor}</span>
                    <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                  </AnswerMeta>
                </AnswerItem>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No answers yet
              </div>
            )}
          </AnswerList>
        );

      case 'badges':
        return renderBadges(user?.badges || [], AVAILABLE_BADGES);

      default:
        return null;
    }
  };

  const handleToggleBan = async (checked) => {
    const token = localStorage.getItem('token');
    try {
      if (checked !== adminModerationStatus.banned) {
        await axios.post(`/api/users/${id}/ban`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      const res = await axios.get(`/api/users/${id}/moderation/status`, { headers: { Authorization: `Bearer ${token}` } });
      setAdminModerationStatus(res.data);
      toast.success(res.data.banned ? 'User banned.' : 'User unbanned.');
    } catch (err) {
      toast.error('Failed to update ban status.');
    }
  };

  const handleToggleSilence = async (checked) => {
    const token = localStorage.getItem('token');
    try {
      const isCurrentlySilenced = adminModerationStatus.silencedUntil && new Date(adminModerationStatus.silencedUntil) > new Date();
      if (checked && !isCurrentlySilenced) {
        await axios.post(`/api/users/${id}/silence`, {}, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('User silenced for 1 day.');
      } else if (!checked && isCurrentlySilenced) {
        await axios.post(`/api/users/${id}/silence`, { unsilence: true }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('User unsilenced.');
      }
      const res = await axios.get(`/api/users/${id}/moderation/status`, { headers: { Authorization: `Bearer ${token}` } });
      setAdminModerationStatus(res.data);
    } catch (err) {
      toast.error('Failed to update silence status.');
    }
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#4A5568'
        }}>
          Loading profile...
        </div>
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#4A5568'
        }}>
          Profile not found. Please try again later.
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </BackButton>
      
      {isOwnProfile && (moderationStatus.banned || (moderationStatus.silencedUntil && new Date(moderationStatus.silencedUntil) > new Date())) && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#FEE2E2', 
          borderRadius: '4px',
          color: '#991B1B'
        }}>
          {moderationStatus.banned && <div>Your account is <b>banned</b>. You cannot access most features.</div>}
          {moderationStatus.silencedUntil && new Date(moderationStatus.silencedUntil) > new Date() && (
            <div>You are <b>silenced</b> until {new Date(moderationStatus.silencedUntil).toLocaleString()}. You cannot post or answer.</div>
          )}
        </div>
      )}
      <ProfileContent>
        <ProfileSidebar>
          <ProfileHeader>
            <Avatar src={avatarPreview || user?.avatarUrl || 'https://via.placeholder.com/150'} />
            {isEditing && isOwnProfile && (
              <div style={{
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <FaCamera /> Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            )}
            <UserInfo>
              {isEditing && isOwnProfile ? (
                <div>
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditFormChange}
                    style={{
                      fontSize: '20px',
                      padding: '5px',
                      marginBottom: '5px',
                      width: '100%'
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    style={{
                      fontSize: '16px',
                      padding: '5px',
                      marginBottom: '5px',
                      width: '100%'
                    }}
                  />
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditFormChange}
                    placeholder="Write something about yourself..."
                    style={{
                      width: '100%',
                      padding: '5px',
                      marginBottom: '10px',
                      minHeight: '100px'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <SaveButton 
                        onClick={handleSaveProfile}
                        className="primary"
                      >
                        Save Changes
                      </SaveButton>
                      <SaveButton 
                        onClick={handleCancelEdit}
                        className="secondary"
                      >
                        Cancel
                      </SaveButton>
                    </div>
                    <SaveButton 
                      onClick={togglePasswordModal}
                      className="dark"
                    >
                      <FaKey style={{ marginRight: '8px' }} /> Change Password
                    </SaveButton>
                  </div>
                </div>
              ) : (
                <>
                  <Username>{user?.username}</Username>
                  <ReputationLevel>
                    {user?.reputation?.level}
                    <ReputationTooltip>
                      <div className="reputation-header">
                        <div className="points-display">
                          {user?.reputation?.points} points
                        </div>
                      </div>

                      <div className="level-thresholds">
                        <div className="section-title">Reputation Levels:</div>
                        <ul>
                          <li className={user?.reputation?.points < 251 ? 'current' : ''}>
                            Beginner <span className="threshold">0 - 250</span>
                          </li>
                          <li className={user?.reputation?.points >= 251 && user?.reputation?.points < 501 ? 'current' : ''}>
                            Learner <span className="threshold">251 - 500</span>
                          </li>
                          <li className={user?.reputation?.points >= 501 && user?.reputation?.points < 1001 ? 'current' : ''}>
                            Intermediate <span className="threshold">501 - 1,000</span>
                          </li>
                          <li className={user?.reputation?.points >= 1001 && user?.reputation?.points < 2001 ? 'current' : ''}>
                            Advanced <span className="threshold">1,001 - 2,000</span>
                          </li>
                          <li className={user?.reputation?.points >= 2001 && user?.reputation?.points < 3501 ? 'current' : ''}>
                            Expert <span className="threshold">2,001 - 3,500</span>
                          </li>
                          <li className={user?.reputation?.points >= 3501 ? 'current' : ''}>
                            Master <span className="threshold">3,501+</span>
                          </li>
                        </ul>
                      </div>

                      <div className="ways-to-earn">
                        <div className="section-title">Ways to Earn Reputation:</div>
                        <ul>
                          <li>
                            Answer is accepted
                            <span className="points">+10</span>
                          </li>
                          <li>
                            Answer is upvoted
                            <span className="points">+10</span>
                          </li>
                          <li>
                            Question is upvoted
                            <span className="points">+5</span>
                          </li>
                        </ul>
                      </div>

                      <em>
                        Keep contributing to unlock more privileges!
                      </em>
                    </ReputationTooltip>
                  </ReputationLevel>
                  <p style={{ marginTop: '10px', color: '#666' }}>{user?.bio || 'No bio yet'}</p>
                  {isOwnProfile && (
                    <EditButton onClick={handleEditProfile}>
                      <FaEdit /> Edit Profile
                    </EditButton>
                  )}
                </>
              )}
            </UserInfo>
          </ProfileHeader>

          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              color: '#2d3748',
              marginBottom: '12px'
            }}>Recent Achievements</h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {(user?.badges || []).slice(-3).map((badge, index) => {
                const BadgeIcon = BADGE_ICONS[badge.name];
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #eee',
                      fontSize: '0.9rem',
                      color: '#4a5568'
                    }}
                  >
                    {BadgeIcon && <BadgeIcon style={{
                      marginRight: '6px',
                      color: badge.type === 'gold' ? '#FFD700' :
                             badge.type === 'silver' ? '#C0C0C0' :
                             '#CD7F32'
                    }} />}
                    {badge.name}
                  </div>
                );
              })}
              {(user?.badges || []).length === 0 && (
                <div style={{ 
                  textAlign: 'center',
                  width: '100%',
                  color: '#718096',
                  fontSize: '0.9rem'
                }}>
                  No badges earned yet. Keep contributing!
                </div>
              )}
            </div>
          </div>
          {isAdmin && !isOwnProfile && (
            <div style={{
              marginTop: '24px',
              display: 'flex',
              gap: '32px',
              justifyContent: 'center',
              alignItems: 'center',

            }}>
              <ToggleSwitch
                checked={adminModerationStatus.banned}
                onChange={e => handleToggleBan(e.target.checked)}
                label={adminModerationStatus.banned ? 'Banned' : 'Active'}
                colorOn="#e53935"
                colorOff="#388e3c"
                disabled={false}
              />
              <ToggleSwitch
                checked={adminModerationStatus.silencedUntil && new Date(adminModerationStatus.silencedUntil) > new Date()}
                onChange={e => handleToggleSilence(e.target.checked)}
                label={adminModerationStatus.silencedUntil && new Date(adminModerationStatus.silencedUntil) > new Date() ? 'Silenced' : 'Can Post'}
                colorOn="#ff9800"
                colorOff="#1976d2"
                disabled={false}
              />
            </div>
          )}
        </ProfileSidebar>

        <ProfileMain>
          <StatsContainer>
            <StatBox>
              <StatNumber>{user?.statistics?.totalPosts || 0}</StatNumber>
              <StatLabel>Posts</StatLabel>
            </StatBox>
            <StatBox>
              <StatNumber>{user?.statistics?.totalAnswers || 0}</StatNumber>
              <StatLabel>Answers</StatLabel>
            </StatBox>
            <StatBox>
              <StatNumber>{user?.statistics?.acceptedAnswers || 0}</StatNumber>
              <StatLabel>Accepted</StatLabel>
            </StatBox>
            <StatBox>
              <StatNumber>{user?.statistics?.totalVotesReceived || 0}</StatNumber>
              <StatLabel>Upvotes</StatLabel>
            </StatBox>
          </StatsContainer>

          <TabContainer>
            <TabList>
              <Tab
                $active={activeTab === 'posts'}
                onClick={() => setActiveTab('posts')}
              >
                Posts ({user?.statistics?.totalPosts || 0})
              </Tab>
              <Tab
                $active={activeTab === 'answers'}
                onClick={() => setActiveTab('answers')}
              >
                Answers ({user?.statistics?.totalAnswers || 0})
              </Tab>
              {isOwnProfile && (
                <Tab
                  $active={activeTab === 'badges'}
                  onClick={() => setActiveTab('badges')}
                >
                  Badges ({(user?.badges || []).length})
                </Tab>
              )}
            </TabList>

            <TabContent>
              {renderTabContent()}
            </TabContent>
          </TabContainer>
        </ProfileMain>
      </ProfileContent>

      {showPasswordModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Change Password</h2>
            <ProfileField>
              <label>Current Password:</label>
              <ProfileInput
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </ProfileField>
            <ProfileField>
              <label>New Password:</label>
              <ProfileInput
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </ProfileField>
            <ProfileField>
              <label>Confirm New Password:</label>
              <ProfileInput
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </ProfileField>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SaveButton 
                onClick={handlePasswordSubmit}
                className="primary"
              >
                Update Password
              </SaveButton>
              <SaveButton 
                onClick={togglePasswordModal}
                className="secondary"
              >
                Cancel
              </SaveButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;

