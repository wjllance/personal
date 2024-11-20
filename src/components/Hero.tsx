import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import BitcoinTrend from './BitcoinTrend';

interface HeroProps {
  id?: string;
}

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  padding: 40px 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 800px;
  margin-bottom: 20px;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 40px;
`;

const SocialLink = styled.a`
  color: white;
  font-size: 2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const Hero: React.FC<HeroProps> = ({ id }) => {
  return (
    <HeroSection id={id}>
      <Content>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hi, I'm Lance Wu
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Software Engineer | Tech Innovator
        </Subtitle>
        <SocialLinks
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SocialLink href="https://github.com/wjllance" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </SocialLink>
          <SocialLink href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </SocialLink>
          <SocialLink href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </SocialLink>
        </SocialLinks>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <BitcoinTrend />
        </motion.div>
      </Content>
    </HeroSection>
  );
};

export default Hero;
