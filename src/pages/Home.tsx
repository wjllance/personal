import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

const HomeContainer = styled.div`
  scroll-behavior: smooth;
  overflow-x: hidden;
  width: 100%;

  @media (max-width: 768px) {
    scroll-padding-top: 60px; // Accounts for fixed header on mobile
  }
`;

const Section = styled.section`
  width: 100%;
  scroll-margin-top: 70px;
  
  @media (max-width: 768px) {
    scroll-margin-top: 60px;
    padding: 60px 16px;
  }
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Section id="hero">
        <Hero />
      </Section>
      <Section id="about">
        <About />
      </Section>
      <Section id="projects">
        <Projects />
      </Section>
      <Section id="contact">
        <Contact />
      </Section>
    </HomeContainer>
  );
};

export default Home;
