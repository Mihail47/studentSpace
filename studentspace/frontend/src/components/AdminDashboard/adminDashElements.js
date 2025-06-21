import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 32px;
`;
export const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 24px;
`;
export const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => (props.$active ? '#ff8c00' : '#333')};
  border-bottom: 3px solid ${props => (props.$active ? '#ff8c00' : 'transparent')};
  margin-right: 32px;
  padding: 8px 0;
  cursor: pointer;
  outline: none;
`;
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
`;
export const Th = styled.th`
  text-align: left;
  padding: 10px 8px;
  background: #f7f7f7;
  border-bottom: 1px solid #eee;
`;
export const Td = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid #f0f0f0;
`;
export const Status = styled.span`
  color: ${props => (props.deleted ? '#c00' : '#0a0')};
  font-weight: 600;
`;
export const ActionBtn = styled.button`
  background: ${props => (props.restore ? '#0a0' : '#c00')};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  margin-right: 8px;
  cursor: pointer;
  font-weight: 500;
  &:hover { opacity: 0.85; }
`; 