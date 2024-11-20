import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: ${props => props.active ? '#3498db' : '#2c3e50'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #3498db;
  }
`;

const DevToolsLink = styled(Link)<{ active?: boolean }>`
  color: ${props => props.active ? '#3498db' : '#2c3e50'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2c3e50;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLink = styled(NavLink)`
  display: block;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'bitcoin', 'about', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
        window.history.replaceState(null, '', `/#${current}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Nav>
        <Logo to="/">Lance Wu</Logo>
        <NavLinks>
          <NavLink 
            onClick={() => handleNavClick('home')}
            active={activeSection === 'home'}
          >
            Home
          </NavLink>
          <NavLink 
            onClick={() => handleNavClick('bitcoin')}
            active={activeSection === 'bitcoin'}
          >
            Bitcoin
          </NavLink>
          <NavLink 
            onClick={() => handleNavClick('about')}
            active={activeSection === 'about'}
          >
            About
          </NavLink>
          <NavLink 
            onClick={() => handleNavClick('projects')}
            active={activeSection === 'projects'}
          >
            Projects
          </NavLink>
          <NavLink 
            onClick={() => handleNavClick('contact')}
            active={activeSection === 'contact'}
          >
            Contact
          </NavLink>
          <DevToolsLink 
            to="/devtools"
            active={location.pathname === '/devtools'}
          >
            DevTools
          </DevToolsLink>
        </NavLinks>
        <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </Nav>
      <MobileMenu isOpen={isOpen}>
        <MobileNavLink onClick={() => handleNavClick('home')}>Home</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('bitcoin')}>Bitcoin</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('about')}>About</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('projects')}>Projects</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('contact')}>Contact</MobileNavLink>
        <MobileNavLink as={Link} to="/devtools">DevTools</MobileNavLink>
      </MobileMenu>
    </>
  );
};

export default Navbar;
