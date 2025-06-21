import styled from 'styled-components';

export const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
`;

export const NewsWrapper = styled.div`
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

export const NewsContent = styled.main`
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

export const NewsTitle = styled.h1`
  font-size: 30px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 14px;
  }
  @media (max-width: 480px) {
    font-size: 17px;
    margin-bottom: 10px;
  }
`;

export const NewsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  @media (max-width: 600px) {
    gap: 16px;
  }
`;

export const NewsCardWrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 32px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  width: 100%;
  min-height: 180px;
  max-width: 100%;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: flex-start;
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  @media (max-width: 900px) {
    padding: 20px 10px;
    min-height: 140px;
  }
  @media (max-width: 600px) {
    padding: 10px 2px;
    min-height: 100px;
    border-radius: 0;
  }
  @media (max-width: 400px) {
    padding: 6px 0;
  }
`; 