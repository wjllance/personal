import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import BitcoinTrend from './BitcoinTrend';

interface HeroProps {
  id?: string;
}

const HeroSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  padding: 0 20px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 60px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  color: #64ffda;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 500;
  color: #8892b0;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #8892b0;
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  color: #64ffda;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const ChartContainer = styled(motion.div)`
  width: 100%;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 968px) {
    height: 300px;
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
          Blockchain Developer | Web3 Innovator | DeFi Enthusiast
        </Subtitle>
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Building the future of decentralized finance and Web3 applications. 
          Passionate about creating secure, efficient, and innovative blockchain solutions.
        </Description>
        <SocialLinks
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SocialLink href="https://github.com/wjllance" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </SocialLink>
          <SocialLink href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </SocialLink>
          <SocialLink href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </SocialLink>
        </SocialLinks>
      </Content>
      <ChartContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <BitcoinTrend />
      </ChartContainer>
    </HeroSection>
  );
};

export default Hero;
