import styled from 'styled-components';

export const PostDetailContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

export const PostContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const PostTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
`;

export const PostBody = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 20px;
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
`;

export const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  background-color: #e1ecf4;
  color: #39739d;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

export const AnswerSection = styled.div`
  margin-top: 30px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

export const AnswerForm = styled.form`
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

export const AnswerInput = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 15px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0077cc;
    box-shadow: 0 0 0 4px rgba(0, 119, 204, 0.1);
  }
`;

export const AnswerButton = styled.button`
  background-color: #f97316;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-start;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ea580c;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

export const AnswerList = styled.div`
  margin-top: 20px;
`;

export const AnswerItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${props => props.isAccepted ? '#f0fdf4' : 'transparent'};

  &:last-child {
    border-bottom: none;
  }
`;

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
`;

export const AcceptButton = styled.button`
  background-color: ${props => props.isAccepted ? '#22c55e' : 'transparent'};
  color: ${props => props.isAccepted ? 'white' : '#666'};
  border: 1px solid ${props => props.isAccepted ? '#22c55e' : '#ddd'};
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: ${props => props.isAccepted ? '#16a34a' : '#f5f5f5'};
    border-color: ${props => props.isAccepted ? '#16a34a' : '#666'};
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 20px;
  font-size: 16px;

  &:hover {
    color: #0077cc;
  }
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: #fee2e2;
    border-color: #dc2626;
    color: #dc2626;
  }
`;
