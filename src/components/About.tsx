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

const ProfileImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const TextContent = styled.div`
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

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const Skill = styled(motion.div)`
  background: #3498db;
  color: white;
  padding: 0.8rem;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
`;

const About: React.FC = () => {
  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python',
    'AWS', 'Docker', 'Git', 'CI/CD'
  ];

  return (
    <AboutSection id="about">
      <Container>
        <Content>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ProfileImage src="/images/Avatar.jpg" alt="Junlin Wu" />
          </motion.div>
          <TextContent>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2>About Me</h2>
              <p>
                I am a passionate software engineer with a strong foundation in full-stack development.
                My journey in tech has been driven by a desire to create impactful solutions that solve
                real-world problems. I specialize in building scalable web applications and enjoy
                working with modern technologies.
              </p>
              <h3>Skills</h3>
              <SkillsGrid>
                {skills.map((skill, index) => (
                  <Skill
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {skill}
                  </Skill>
                ))}
              </SkillsGrid>
            </motion.div>
          </TextContent>
        </Content>
      </Container>
    </AboutSection>
  );
};

export default About;
