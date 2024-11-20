import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Logo = styled(RouterLink)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

interface NavLinkProps {
  isActive?: boolean;
}

const NavLink = styled.a<NavLinkProps>`
  cursor: pointer;
  color: ${props => props.isActive ? '#3498db' : '#333'};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [activeSection, setActiveSection] = useState('home');

  // Handle initial scroll to anchor on page load
  useEffect(() => {
    if (isHome && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    }
  }, [location.hash, isHome]);

  // Monitor scroll position to update active section
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            window.history.replaceState({}, '', section === 'home' ? '/' : `/#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount to set initial active section

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavClick = (to: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (isHome) {
      // Update URL with anchor and scroll
      window.history.pushState({}, '', to === 'home' ? '/' : `/#${to}`);
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setActiveSection(to);
    } else {
      // Navigate to home with anchor
      if (to === 'home') {
        navigate('/');
      } else {
        navigate(`/#${to}`);
      }
    }
  };

  return (
    <Nav>
      <Logo to="/">Junlin Wu</Logo>
      <NavLinks>
        <NavLink 
          href="#home"
          isActive={isHome && activeSection === 'home'} 
          onClick={(e) => handleNavClick('home', e)}
        >
          Home
        </NavLink>
        <NavLink 
          href="#about"
          isActive={isHome && activeSection === 'about'} 
          onClick={(e) => handleNavClick('about', e)}
        >
          About
        </NavLink>
        <NavLink 
          href="#projects"
          isActive={isHome && activeSection === 'projects'} 
          onClick={(e) => handleNavClick('projects', e)}
        >
          Projects
        </NavLink>
        <NavLink 
          href="#contact"
          isActive={isHome && activeSection === 'contact'} 
          onClick={(e) => handleNavClick('contact', e)}
        >
          Contact
        </NavLink>
        <RouterLink 
          to="/devtools" 
          style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/devtools' ? '#3498db' : '#333',
            fontWeight: 500
          }}
        >
          Dev Tools
        </RouterLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
