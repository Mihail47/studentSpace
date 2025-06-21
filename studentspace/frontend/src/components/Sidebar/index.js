import React, { useState, useEffect } from 'react';
import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SidebarWrapper,
  SidebarMenu,
  SidebarLink,
  SideBtnWrap,
  SidebarRoute,
  DropdownContainer,
  DropdownItem,
} from './SidebarElements';
import { FaUserCircle } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const userObj = localStorage.getItem('user');
    const user = userObj ? JSON.parse(userObj) : null;
    setIsAdmin(user?.role === 'admin');

    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowDropdown(false);
    window.location.reload();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <SidebarWrapper>
        <SidebarMenu>
          <li style={{listStyle: 'none', margin: '32px 0', textAlign: 'center'}}>
            <SidebarLink to="about" onClick={toggle} style={{
              fontSize: '1.5rem',
              color: '#fff',
              background: 'none',
              padding: 0,
              margin: 0,
              display: 'inline',
              textAlign: 'center',
              boxShadow: 'none',
            }}>
              About
            </SidebarLink>
          </li>
          <li style={{listStyle: 'none', margin: '32px 0', textAlign: 'center'}}>
            <SidebarRoute to="/news" onClick={toggle} style={{
              background: 'none',
              color: '#fff',
              borderRadius: 0,
              padding: 0,
              fontSize: '1.5rem',
              width: 'auto',
              margin: 0,
              display: 'inline',
              textAlign: 'center',
              boxShadow: 'none',
            }}>
              News
            </SidebarRoute>
          </li>
          <li style={{listStyle: 'none', margin: '32px 0', textAlign: 'center'}}>
            <SidebarRoute to="/forum" onClick={toggle} style={{
              background: 'none',
              color: '#fff',
              borderRadius: 0,
              padding: 0,
              fontSize: '1.5rem',
              width: 'auto',
              margin: 0,
              display: 'inline',
              textAlign: 'center',
              boxShadow: 'none',
            }}>
              Forum
            </SidebarRoute>
          </li>
          {isAdmin && (
            <SidebarLink as={SidebarRoute} to="/admin" onClick={toggle} style={{fontSize: '1.5rem', background: 'none', color: '#fff', borderRadius: 0, padding: 0}}>
              Admin Dashboard
            </SidebarLink>
          )}
        </SidebarMenu>
        {isLoggedIn ? (
          <SideBtnWrap>
            <DropdownContainer className="dropdown-container">
              <FaUserCircle
                size={28}
                onClick={toggleDropdown}
                style={{ cursor: 'pointer', color: '#ffA500' }}
              />
              {showDropdown && (
                <div>
                  <DropdownItem to="/profile" onClick={toggle}>
                    Profile
                  </DropdownItem>
                  <DropdownItem as="button" onClick={handleLogout}>
                    Logout
                  </DropdownItem>
                </div>
              )}
            </DropdownContainer>
          </SideBtnWrap>
        ) : (
          <SideBtnWrap>
            <SidebarRoute to="/signin">Sign In</SidebarRoute>
          </SideBtnWrap>
        )}
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
