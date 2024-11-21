import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AboutProps {
  id?: string;
}

const AboutContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const AboutText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    text-align: center;
    align-items: center;
    gap: 20px;
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 2.5rem);
  color: #64ffda;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: #8892b0;
  line-height: 1.8;
  margin: 0;
  max-width: 600px;

  @media (max-width: 768px) {
    line-height: 1.7;
    max-width: 100%;
  }
`;

const SkillsContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 100%;

  @media (max-width: 768px) {
    padding: 24px;
    margin: 0 auto;
    max-width: 500px;
  }
`;

const SkillsTitle = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: #64ffda;
  margin-bottom: 20px;
  text-align: center;
`;

const SkillsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const SkillItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #8892b0;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
  }
`;

const About: React.FC<AboutProps> = ({ id }) => {
  const skills = [
    'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts',
    'DeFi', 'NFTs', 'React', 'Node.js',
    'Blockchain', 'Hardhat', 'IPFS', 'TypeScript'
  ];

  return (
    <AboutContainer id={id}>
      <Content>
        <AboutText>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About Me
          </Title>
          <Description
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Passionate blockchain developer with a deep understanding of decentralized technologies. 
            I specialize in building secure and efficient smart contracts, DeFi protocols, and Web3 applications. 
            My expertise spans across the entire blockchain development stack, from writing Solidity contracts 
            to creating intuitive front-end experiences.
          </Description>
          <Description
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Currently focused on advancing DeFi innovation and exploring new possibilities in the Web3 space. 
            I'm particularly interested in decentralized finance, NFT technologies, and cross-chain solutions.
          </Description>
        </AboutText>
        <SkillsContainer
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <SkillsTitle>Technologies & Skills</SkillsTitle>
          <SkillsList>
            {skills.map((skill, index) => (
              <SkillItem
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {skill}
              </SkillItem>
            ))}
          </SkillsList>
        </SkillsContainer>
      </Content>
    </AboutContainer>
  );
};

export default About;
