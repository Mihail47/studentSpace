import React from 'react';
import styled from 'styled-components';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.0);
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;

  &:hover, &:focus {
    background: rgba(0,0,0,0.04);
    box-shadow: 0 4px 24px rgba(0,0,0,0.16);
    outline: none;
    transform: scale(1.07);
  }

  @media (max-width: 900px) {
    width: 52px;
    height: 52px;
    bottom: 18px;
    right: 18px;
  }
  @media (max-width: 600px) {
    width: 44px;
    height: 44px;
    bottom: 10px;
    right: 10px;
  }
`;

const PlusIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before, &::after {
    content: '';
    position: absolute;
    background: #111;
    border-radius: 4px;
  }
  &::before {
    width: 32px;
    height: 8px;
  }
  &::after {
    width: 8px;
    height: 32px;
  }
  position: relative;

  @media (max-width: 900px) {
    width: 28px;
    height: 28px;
    &::before {
      width: 20px;
      height: 6px;
    }
    &::after {
      width: 6px;
      height: 20px;
    }
  }
  @media (max-width: 600px) {
    width: 20px;
    height: 20px;
    &::before {
      width: 14px;
      height: 4px;
    }
    &::after {
      width: 4px;
      height: 14px;
    }
  }
`;

const FloatingAddNewsButton = ({ onClick }) => (
  <FloatingButton onClick={onClick} aria-label="Add News">
    <PlusIcon />
  </FloatingButton>
);

export default FloatingAddNewsButton; 