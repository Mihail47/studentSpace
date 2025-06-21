import styled from 'styled-components';

export const ForumContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
`;

export const ForumWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  margin-top: 64px;

  @media (max-width: 768px) {
    margin-top: 56px;
    padding: 10px 0;
  }
`;

export const ForumContent = styled.main`
  width: 80%;
  max-width: 900px;
  /* min-width: 700px; */
  min-height: 80vh;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    width: 95%;
    padding: 12px;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 6px;
    border-radius: 0;
  }
`;

export const ForumTitle = styled.h1`
  font-size: 30px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 14px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 70%;
  max-width: 500px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: 0.3s;

  &:focus {
    outline: none;
    border-color: #ff8c00;
    box-shadow: 0 0 6px rgba(255, 140, 0, 0.5);
  }
`;

export const SearchButton = styled.button`
  margin-left: 10px;
  padding: 12px 20px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #e67e22;
  }
`;

export const PostForm = styled.form`
  margin: 20px 0;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:focus-within {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: #e2e8f0;
  }

  h2 {
    margin-bottom: 15px;
    color: #333;
    font-size: 24px;
  }
`;

export const PostInput = styled.input`
  width: 100%;
  height: 50px;
  margin-bottom: 15px;
  padding: 12px 15px;
  border: 2px solid ${({ className }) => (className === "error" ? "#ff4d4f" : "#e2e8f0")};
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    border-color: #ff8c00;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
  }

  &.error {
    background-color: #fff2f0;
    
    &:focus {
      border-color: #ff4d4f;
      box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
    }
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const PostTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  margin-bottom: 15px;
  padding: 12px 15px;
  border: 2px solid ${({ className }) => (className === "error" ? "#ff4d4f" : "#e2e8f0")};
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    border-color: #ff8c00;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
  }

  &.error {
    background-color: #fff2f0;
    
    &:focus {
      border-color: #ff4d4f;
      box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
    }
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;

  &:hover {
    background-color: #f17c00;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.3);
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
`;

export const PostList = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const PostItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  margin-bottom: 12px;
  transition: 0.3s;
  cursor: default;
  width: 100%;

  &:hover {
    background: #f8f8f8;
  }
`;

export const QuestionStats = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 80px;
  margin-right: 16px;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
`;

export const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  min-width: 70px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &.votes {
    color: #666;
  }

  &.answers {
    color: #4a5568;
    border-radius: 6px;
    padding: 6px 12px;
    
    // Default state
    background-color: #f7fafc;
    border: 1px solid #e2e8f0;
    
    // Highlight if there are answers
    ${props => props.hasAnswers && `
      background-color: #ebf8ff;
      border: 1px solid #bee3f8;
      
      .count {
        color: #2b6cb0;
      }
      
      .label {
        color: #4299e1;
      }
      
      &:hover {
        background-color: #e6fffa;
        border-color: #81e6d9;
        transform: translateY(-1px);
      }
    `}

    .count {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 2px;
      line-height: 1.2;
    }

    .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
  }
`;

export const QuestionSummary = styled.div`
  flex: 1;
  cursor: pointer;

  h2 {
    font-size: 18px;
    margin: 0 0 6px;
    color: #0077cc;
    &:hover {
      color: #005999;
      text-decoration: underline;
    }
  }

  .excerpt {
    margin: 0 0 8px;
    font-size: 14px;
    color: #555;
    line-height: 1.4;

    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 2.8em; 
  }
`;

export const TagContainer = styled.div`
  margin-bottom: 8px;
`;

export const Tag = styled.span`
  display: inline-block;
  background: #e1ecf4;
  color: #39739d;
  font-size: 12px;
  padding: 5px 8px;
  border-radius: 4px;
  margin-right: 5px;
  margin-bottom: 5px;
`;

export const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #777;
  margin-top: 10px;

  .time {
    font-style: italic;
  }
  .user {
    font-weight: bold;
  }
`;

export const DeleteButton = styled.button`
  position: relative;
  top: 10px;
  right: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: gray;
  transition: 0.2s;
  z-index: 10;

  &:hover {
    color: darkred;
  }
`;

export const LoadMoreButton = styled.button`
  margin: 20px auto;
  padding: 10px 20px;
  background: #f50057;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #c51162;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
