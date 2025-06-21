import styled from 'styled-components';

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const VoteButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${props => props.active ? '#f97316' : '#666'};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.active ? '#ea580c' : '#f97316'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const VoteCount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 20px;
  text-align: center;
`;
