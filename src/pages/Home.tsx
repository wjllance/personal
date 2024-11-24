import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-x: hidden;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, #1a365d 0%, #0a192f 100%);
    z-index: -1;
  }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  scroll-margin-top: 70px;

  @media (max-width: 968px) {
    padding: 100px 16px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 80px 16px 40px;
    min-height: auto;
  }
`;

const Home: React.FC = () => {
  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Section id="home">
          <Hero id="home" />
        </Section>

        <Section id="about">
          <About id="about" />
        </Section>
        <Section id="projects">
          <Projects id="projects" />
        </Section>
        <Section id="contact">
          <Contact id="contact" />
        </Section>
      </MainContent>
    </AppContainer>
  );
};

export default Home;
