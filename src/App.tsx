import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle, styled } from 'styled-components';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DevTools from './components/DevTools';
import About from './components/About';
import Contact from './components/Contact';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #0a192f;
    color: #ffffff;
    line-height: 1.6;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #0a192f;
  }

  ::-webkit-scrollbar-thumb {
    background: #3498db;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2980b9;
  }
`;

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

  &::before {
    content: '';
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
  padding: 80px 20px;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <MainContent>
                <Section id="home">
                  <Hero id="home" />
                </Section>
                <Section id="about">
                  <About id="about" />
                </Section>
                <Section id="contact">
                  <Contact id="contact" />
                </Section>
              </MainContent>
            </>
          } />
          <Route path="/devtools" element={<DevTools />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppContainer>
    </>
  );
};

export default App;
