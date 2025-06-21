import styled from 'styled-components';
import { Link as LinkScroll } from 'react-scroll';
import { Link as LinkRouter } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

export const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #0d0d0d;
  display: grid;
  align-items: center;
  top: 0;
  left: 0;
  transition: 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
  top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
`;

export const CloseIcon = styled(FaTimes)`
  color: #fff;
`;

export const Icon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
  z-index: 1001;
`;

export const SidebarWrapper = styled.div`
  color: #fff;
`;

export const SidebarMenu = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 60px);
  text-align: center;

  @media screen and (max-width: 480px) {
    grid-template-rows: repeat(4, 50px);
  }
`;

export const SidebarLink = styled(LinkScroll)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #ffA500;
    transition: 0.2s ease-in-out;
  }
`;

export const SideBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const SidebarRoute = styled(LinkRouter)`
  border-radius: 50px;
  background: #ffA500;
  white-space: nowrap;
  padding: 16px 64px;
  color: #010606;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;

  div {
    position: absolute;
    top: 40px;
    right: 0;
    background: #0d0d0d;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    z-index: 1000;
  }
`;

export const DropdownItem = styled(LinkRouter)`
  padding: 12px 20px;
  color: #fff;
  background: #0d0d0d;
  text-decoration: none;
  font-size: 16px;
  display: block;
  cursor: pointer;
  border: none; 
  box-sizing: border-box; 

  &:hover {
    background: #ffA500;
    color: #010606;
  }

  &[as='button'] {
    padding: 12px 20px; 
    color: #fff;
    background: #0d0d0d; 
    border: none; 
    text-align: left;
    width: 100%; 
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
      background: #ffA500;
      color: #010606;
    }
  }
`;