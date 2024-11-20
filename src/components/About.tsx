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
  padding: 0 20px;

  @media (max-width: 968px) {
    padding: 0;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  @media (max-width: 480px) {
    gap: 32px;
  }
`;

const AboutText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 968px) {
    text-align: center;
    align-items: center;
  }
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  color: #64ffda;
  margin-bottom: 20px;

  @media (max-width: 968px) {
    font-size: 2.2rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #8892b0;
  line-height: 1.8;
  margin: 0;

  @media (max-width: 968px) {
    font-size: 1rem;
    max-width: 600px;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.7;
  }
`;

const SkillsContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 968px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const SkillsTitle = styled.h3`
  font-size: 1.5rem;
  color: #64ffda;
  margin-bottom: 20px;

  @media (max-width: 968px) {
    text-align: center;
    font-size: 1.3rem;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
`;

const SkillBadge = styled(motion.div)`
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(100, 255, 218, 0.2);
  transition: all 0.3s ease;

  @media (max-width: 968px) {
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 8px 10px;
  }

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-2px);
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
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillBadge
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {skill}
              </SkillBadge>
            ))}
          </SkillsGrid>
        </SkillsContainer>
      </Content>
    </AboutContainer>
  );
};

export default About;
