import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  min-height: 692px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
  overflow: hidden;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FormWrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const Icon = styled(Link)`
  position: absolute;
  top: 32px;
  left: 32px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 32px;

  @media screen and (max-width: 480px) {
    top: 16px;
    left: 16px;
  }
`;

export const FormContent = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 480px) {
    padding: 10px;
  }
`;

export const Form = styled.form`
  background: rgba(0,0,0,0.1);
  width: 100%;
  z-index: 1;
  display: grid;
  padding: 80px 32px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.9);

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;

export const FormH1 = styled.h1`
  margin-bottom: 40px;
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
`;

export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #fff;
`;

export const FormInput = styled.input`
  padding: 16px 16px;
  margin-bottom: 32px;
  border: none;
  border-radius: 14px;
  
`;

export const FormButton = styled.button`
  background: #ffA500;
  padding: 16px 0;
  border: none;
  border-radius: 20px;
  color: #010106;
  font-size: 20px;
  cursor: pointer;

    &:hover {
    background: #fff;
`;

export const Text = styled.span`
  text-align: center;
  margin-top: 24px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #ffA500;
    cursor: pointer;
  }
`;

const moveShapes = keyframes`
  0% { transform: translateY(0px) translateX(0px) scale(1); }
  25% { transform: translateY(-20px) translateX(20px) scale(1.1); }
  50% { transform: translateY(20px) translateX(-20px) scale(0.9); }
  75% { transform: translateY(-20px) translateX(-20px) scale(1.05); }
  100% { transform: translateY(0px) translateX(0px) scale(1); }
`;

export const Shapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  div {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 165, 0, 0.6);
    animation: ${moveShapes} 10s infinite ease-in-out;

    &:nth-child(1) {
      width: 60px;
      height: 60px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      width: 80px;
      height: 80px;
      top: 50%;
      left: 25%;
      animation-delay: 1s;
    }

    &:nth-child(3) {
      width: 100px;
      height: 100px;
      top: 70%;
      left: 70%;
      animation-delay: 2s;
    }

    &:nth-child(4) {
      width: 50px;
      height: 50px;
      top: 40%;
      left: 80%;
      animation-delay: 3s;
    }

    &:nth-child(5) {
      width: 120px;
      height: 120px;
      top: 10%;
      left: 50%;
      animation-delay: 4s;
    }

    &:nth-child(6) {
      width: 90px;
      height: 90px;
      top: 60%;
      left: 20%;
      animation-delay: 5s;
    }

    &:nth-child(7) {
      width: 70px;
      height: 70px;
      top: 80%;
      left: 30%;
      animation-delay: 6s;
    }

    &:nth-child(8) {
      width: 100px;
      height: 100px;
      top: 30%;
      left: 90%;
      animation-delay: 7s;
    }

    &:nth-child(9) {
      width: 110px;
      height: 110px;
      top: 20%;
      left: 70%;
      animation-delay: 8s;
    }

    &:nth-child(10) {
      width: 80px;
      height: 80px;
      top: 60%;
      left: 50%;
      animation-delay: 9s;
    }
  }
`;

export const SwitchText = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #ffA500;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;