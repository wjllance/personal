import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);

  @media (max-width: 768px) {
    padding: 0 24px;
    height: 60px;
  }
`;

const Logo = styled(motion.span)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #64ffda;
  letter-spacing: -0.02em;
  
  &:hover {
    color: #fff;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #64ffda;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: ${props => props.active ? '#64ffda' : 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  padding: 5px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: #64ffda;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #64ffda;
    
    &::after {
      width: 100%;
    }
  }
`;

const DevToolsLink = styled(Link)<{ active?: boolean }>`
  color: ${props => props.active ? '#64ffda' : 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  padding: 6px 16px;
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(100, 255, 218, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(100, 255, 218, 0.2)' : 'transparent'};

  &:hover {
    color: #64ffda;
    background: rgba(100, 255, 218, 0.1);
    border: 1px solid rgba(100, 255, 218, 0.2);
    transform: translateY(-1px);
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #64ffda;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: rgba(100, 255, 218, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled(motion.div)<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: rgba(10, 25, 47, 0.98);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
  z-index: 999;
  overflow: hidden;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(motion.a)`
  display: block;
  padding: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 1.1rem;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  text-align: center;
  background: rgba(100, 255, 218, 0.05);

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    color: #64ffda;
    background: rgba(100, 255, 218, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MobileNavDevToolsLink = styled(MobileNavLink)`
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
  color: #64ffda;
`;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = React.useRef<number>(0);
  const lastActiveSection = React.useRef(activeSection);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle to prevent excessive updates
      const now = Date.now();
      if (now - lastScrollTime.current < 150) {
        return;
      }
      
      if (scrollTimeout.current) {
        return;
      }

      lastScrollTime.current = now;
      scrollTimeout.current = setTimeout(() => {
        const sections = ['home', 'bitcoin', 'about', 'contact'];
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        if (current && lastActiveSection.current !== current) {
          setActiveSection(current);
          lastActiveSection.current = current;
          // Only update history when section actually changes
          window.history.replaceState(null, '', `/#${current}`);
        }

        scrollTimeout.current = null;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (section: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const menuVariants = {
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeIn',
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  return (
    <>
      <Nav>
        <LogoLink to="/" onClick={() => handleNavClick('home')}>
          <Logo
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LW
          </Logo>
        </LogoLink>
        <NavLinks>
          <NavLink 
            onClick={() => handleNavClick('home')}
            active={activeSection === 'home'}
          >
            Home
          </NavLink>
          <NavLink 
            onClick={() => handleNavClick('about')}
            active={activeSection === 'about'}
          >
            About
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
        <MobileMenuButton 
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.div>
        </MobileMenuButton>
      </Nav>
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            isOpen={isOpen}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <MobileNavLink
              as={motion.a}
              variants={itemVariants}
              onClick={() => handleNavClick('home')}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              as={motion.a}
              variants={itemVariants}
              onClick={() => handleNavClick('about')}
            >
              About
            </MobileNavLink>
            <MobileNavLink
              as={motion.a}
              variants={itemVariants}
              onClick={() => handleNavClick('contact')}
            >
              Contact
            </MobileNavLink>
            <MobileNavDevToolsLink
              as={motion(Link)}
              variants={itemVariants}
              to="/devtools"
              onClick={() => setIsOpen(false)}
            >
              DevTools
            </MobileNavDevToolsLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
