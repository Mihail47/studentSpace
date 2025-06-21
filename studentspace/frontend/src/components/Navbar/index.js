import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { animateScroll as scroll } from 'react-scroll';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
  NavLinksRouter,
  NavBtn,
  NavBtnLink,
  ProfileIconWrapper,
  DropdownMenu,
  DropdownItem,
} from './NavbarElements';

const Navbar = ({ toggle }) => {
  const [scrollNav, setScrollNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/') {
      window.addEventListener('scroll', changeNav);
      return () => window.removeEventListener('scroll', changeNav);
    } else {
      setScrollNav(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const userObj = localStorage.getItem('user');
    setUser(userObj ? JSON.parse(userObj) : null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleHome = () => {
    scroll.scrollToTop();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isHomePage = location.pathname === '/';

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <Nav scrollNav={scrollNav} position={isHomePage ? 'overlay' : 'sticky'}>
        <NavbarContainer>
          <NavLogo to="/" onClick={toggleHome}>
            StudentSpace
          </NavLogo>
          <MobileIcon onClick={toggle}>
            <FaBars />
          </MobileIcon>
          <NavMenu>
            <NavItem>
              {isHomePage ? (
                <NavLinks
                  to="about"
                  smooth={true}
                  duration={500}
                  spy={true}
                  exact="true"
                  offset={-80}
                >
                  About
                </NavLinks>
              ) : (
                <NavLinksRouter to="/">About</NavLinksRouter>
              )}
            </NavItem>
            <NavItem>
              {isHomePage ? (
                <NavLinks
                  to="news"
                  smooth={true}
                  duration={500}
                  spy={true}
                  exact="true"
                  offset={-80}
                >
                  News
                </NavLinks>
              ) : (
                <NavLinksRouter to="/news">News</NavLinksRouter>
              )}
            </NavItem>
            <NavItem>
              {isHomePage ? (
                <NavLinks
                  to="forum"
                  smooth={true}
                  duration={500}
                  spy={true}
                  exact="true"
                  offset={-80}
                >
                  Forum
                </NavLinks>
              ) : (
                <NavLinksRouter to="/forum">Forum</NavLinksRouter>
              )}
            </NavItem>
            {user?.role === 'admin' && (
              <NavItem>
                <NavLinksRouter to="/admin">Admin Dashboard</NavLinksRouter>
              </NavItem>
            )}
          </NavMenu>
          {isLoggedIn ? (
            <ProfileIconWrapper ref={dropdownRef}>
              <FaUserCircle size={24} onClick={toggleDropdown} />
              {dropdownVisible && (
                <DropdownMenu>
                  <DropdownItem onClick={handleProfileClick}>Profile</DropdownItem>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              )}
            </ProfileIconWrapper>
          ) : (
            <NavBtn>
              <NavBtnLink to="/signin">Sign In</NavBtnLink>
            </NavBtn>
          )}
        </NavbarContainer>
      </Nav>
    </IconContext.Provider>
  );
};

export default Navbar;
