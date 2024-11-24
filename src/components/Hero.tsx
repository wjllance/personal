import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import BitcoinTrend from "./BitcoinTrend";

interface HeroProps {
  id?: string;
}

const HeroContainer = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 60px;

  @media (max-width: 768px) {
    padding: 80px 16px 40px;
    min-height: calc(100vh - 60px);
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
`;

const TextContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 0;
    align-items: center;
    gap: 16px;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #64ffda;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 500;
  color: #8892b0;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 4vw, 1.2rem);
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: #8892b0;
  line-height: 1.6;
  max-width: 540px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    max-width: 100%;
    padding: 0 16px;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  color: #64ffda;
  font-size: clamp(1.3rem, 3vw, 1.5rem);
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const ChartSection = styled(motion.div)`
  width: 100%;
  height: 450px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  @media (max-width: 1200px) {
    height: 400px;
    padding: 20px;
  }

  @media (max-width: 968px) {
    margin-bottom: 60px;
  }

  @media (max-width: 768px) {
    order: 1;
    height: 350px;
  }

  @media (max-width: 480px) {
    height: 300px;
    padding: 16px;
    margin-bottom: 240px;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  & > * {
    width: 100% !important;
    height: 100% !important;
  }
`;

const Hero: React.FC<HeroProps> = ({ id }) => {
  return (
    <HeroContainer id={id}>
      <HeroContent>
        <TextContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            Passionate about creating secure, efficient, and innovative
            blockchain solutions.
          </Description>
          <SocialLinks
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <SocialLink
              href="https://github.com/wjllance"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </SocialLink>
            <SocialLink
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </SocialLink>
            <SocialLink
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </SocialLink>
          </SocialLinks>
        </TextContent>
        <ChartSection
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChartWrapper>
            <BitcoinTrend />
          </ChartWrapper>
        </ChartSection>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
