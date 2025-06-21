import styled from 'styled-components';

export const ProfileContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

export const ProfileContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 18px;
  }
`;

export const ProfileSidebar = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  @media (max-width: 900px) {
    padding: 12px 6px;
    border-radius: 6px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

export const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 3px solid #f48024;
  object-fit: cover;
  background-color: #e0e0e0;
  @media (max-width: 900px) {
    width: 100px;
    height: 100px;
  }
`;

export const UserInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
`;

export const Username = styled.h2`
  font-size: 24px;
  margin: 0;
  color: #333;
  @media (max-width: 900px) {
    font-size: 18px;
  }
`;

export const ReputationLevel = styled.div`
  font-size: 15px;
  color: #4FD1C5;
  margin-top: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(79, 209, 197, 0.1);
  border: 1px solid rgba(79, 209, 197, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: help;
  position: relative;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(79, 209, 197, 0.1);
  transition: all 0.2s ease;

  &:before {
    content: '⬥';
    color: #4FD1C5;
    margin-right: 4px;
  }

  &:after {
    content: '⬥';
    color: #4FD1C5;
    margin-left: 4px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(79, 209, 197, 0.2);
    background: rgba(79, 209, 197, 0.15);
  }

  &:hover .reputation-tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

export const EditButton = styled.button`
  position: absolute;
  top: -35px;
  right: 2;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  
  &:hover {
    color: #f48024;
  }

  svg {
    font-size: 1.1rem;
  }
`;

export const BadgesContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const BadgeGroup = styled.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const BadgeGroupTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eee;
`;

export const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const BadgeTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  min-width: 200px;
  max-width: 300px;
  padding: 12px;
  background: #1e2634;
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 12px;

  strong {
    display: block;
    margin-bottom: 8px;
    color: #4FD1C5;
  }

  em {
    display: block;
    margin-top: 8px;
    color: #718096;
    font-style: italic;
    font-size: 0.85rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #1e2634;
    border-bottom: none;
  }
`;

export const BadgeItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.earned ? 'white' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 8px;
  border: 1px solid ${props => props.earned ? '#e2e8f0' : 'transparent'};
  color: ${props => props.earned ? '#2d3748' : '#718096'};
  cursor: help;
  transition: all 0.2s ease;

  svg {
    font-size: 1.2rem;
    color: ${props => {
      if (!props.earned) return '#4A5568';
      switch (props.type) {
        case 'gold':
          return '#FFD700';
        case 'silver':
          return '#C0C0C0';
        case 'bronze':
          return '#CD7F32';
        default:
          return '#4A5568';
      }
    }};
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    ${BadgeTooltip} {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

export const BadgeName = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.earned ? '#2d3748' : '#a0aec0'};
`;

export const CategoryIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 14px;
  color: ${props => props.earned ? '#6a737d' : '#959da5'};
`;

export const ProfileMain = styled.div`
  padding: 20px;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatBox = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #f48024;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

export const TabContainer = styled.div`
  margin-top: 20px;
`;

export const TabList = styled.div`
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
`;

export const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.$active ? '#f48024' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4A5568'};
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#f48024' : 'rgba(244, 128, 36, 0.1)'};
    color: ${props => props.$active ? 'white' : '#f48024'};
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    color: #f48024;
  }
`;

export const ProfileDetails = styled.div`
  padding: 20px;
`;

export const ProfileField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #4a5568;
    font-size: 0.9rem;
  }
`;

export const ProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

export const SaveButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &.primary {
    background-color: #f48024;
    color: white;
    &:hover {
      background-color: #da6709;
    }
  }

  &.secondary {
    background-color: #e2e8f0;
    color: #4a5568;
    &:hover {
      background-color: #cbd5e0;
    }
  }

  &.dark {
    background-color: #4a5568;
    color: white;
    &:hover {
      background-color: #2d3748;
    }
  }
`;

export const ChangePasswordButton = styled(SaveButton)`
  background-color: #666;
  margin-right: 10px;

  &:hover {
    background-color: #444;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 20px;
    color: #2d3748;
    font-size: 1.5rem;
    text-align: center;
  }
`;

export const ModalCloseButton = styled.button`
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background-color: #cbd5e0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(203, 213, 224, 0.3);
  }
`;

export const BackToHomeArrow = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: #666;

  &:hover {
    color: #f48024;
  }
`;

export const TabContent = styled.div`
  padding: 20px;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PostItem = styled.div`
  padding: 16px;
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const PostTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #24292e;
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #586069;
`;

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AnswerItem = styled.div`
  position: relative;
  padding: 16px;
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;

  /* Accepted answer corner ribbon */
  ${props => props.$accepted && `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 38px solid #2ea44f; /* size & color of ribbon */
      border-left: 38px solid transparent;
      border-top-right-radius: 8px;
      pointer-events: none;
    }

    &:before {
      content: '\u2605'; /* Unicode star */
      position: absolute;
      top: 6px;
      right: 8px;
      font-size: 14px;
      color: #ffffff;
      z-index: 1;
      pointer-events: none;
    }
  `}
`;

export const AnswerContent = styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  color: #24292e;
  line-height: 1.5;
  position: relative;
`;

export const AnswerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #586069;
  flex-wrap: wrap;
`;

export const VoteCount = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f48024;
  font-weight: 600;

  svg {
    font-size: 16px;
  }
`;

export const ReputationTooltip = styled.div.attrs({
  className: 'reputation-tooltip'
})`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  padding: 24px;
  background: #1e2634;
  color: white;
  border-radius: 12px;
  font-size: 0.9rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-top: 12px;

  .reputation-header {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .points-display {
    font-size: 1.5rem;
    font-weight: 500;
    color: #4FD1C5;
  }

  .section-title {
    color: white;
    font-size: 0.95rem;
    margin-bottom: 12px;
    opacity: 0.9;
  }

  .level-thresholds {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #a0aec0;
        margin-bottom: 8px;
        font-size: 0.9rem;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s ease;

        &.current {
          background: rgba(79, 209, 197, 0.1);
          color: #4FD1C5;

          .threshold {
            color: #4FD1C5;
          }
        }

        .threshold {
          color: #718096;
          font-size: 0.85rem;
        }
      }
    }
  }

  .ways-to-earn {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #a0aec0;
        margin-bottom: 8px;
        font-size: 0.9rem;

        .points {
          color: #4FD1C5;
          font-weight: 500;
        }
      }
    }
  }

  em {
    display: block;
    color: #718096;
    font-style: italic;
    font-size: 0.85rem;
    margin-top: 20px;
    text-align: center;
  }

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #1e2634;
  }
`;
