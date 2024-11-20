import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
  min-height: 100vh;
  padding: 100px 20px;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const AboutText = styled.div`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #666;
    margin-bottom: 2rem;
  }
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 2rem;
`;

const SkillsContainer = styled.div`
  margin-top: 2rem;
`;

const SkillsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const SkillBadge = styled(motion.div)`
  background: #3498db;
  color: white;
  padding: 0.8rem;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
`;

interface AboutProps {
  id?: string;
}

const About: React.FC<AboutProps> = ({ id }) => {
  const skills = [
    'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts',
    'DeFi', 'NFTs', 'React', 'Node.js',
    'Blockchain', 'Hardhat', 'IPFS', 'TypeScript'
  ];

  return (
    <AboutSection id={id}>
      <Container>
        <Content>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AboutText>
              <AboutTitle>About Me</AboutTitle>
              <Description>
                Passionate blockchain developer with a deep understanding of decentralized technologies. 
                I specialize in building secure and efficient smart contracts, DeFi protocols, and Web3 applications. 
                My expertise spans across the entire blockchain development stack, from writing Solidity contracts 
                to creating intuitive front-end experiences.
              </Description>
              <Description>
                Currently focused on advancing DeFi innovation and exploring new possibilities in the Web3 space. 
                I'm particularly interested in decentralized finance, NFT technologies, and cross-chain solutions.
              </Description>
            </AboutText>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SkillsContainer>
              <SkillsTitle>Technologies & Skills</SkillsTitle>
              <SkillsGrid>
                {skills.map((skill, index) => (
                  <SkillBadge key={index}>{skill}</SkillBadge>
                ))}
              </SkillsGrid>
            </SkillsContainer>
          </motion.div>
        </Content>
      </Container>
    </AboutSection>
  );
};

export default About;
