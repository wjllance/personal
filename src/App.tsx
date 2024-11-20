import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle, styled } from 'styled-components';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DevTools from './components/DevTools/index';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import BitcoinTrend from './components/BitcoinTrend';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa;
    color: #2c3e50;
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding-top: 60px; // Height of the navbar
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={
            <MainContent>
              <Hero id="home" />
              <BitcoinTrend id="bitcoin" />
              <About id="about" />
              <Projects id="projects" />
              <Contact id="contact" />
            </MainContent>
          } />
          <Route path="/devtools" element={<DevTools />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageWrapper>
    </>
  );
};

export default App;
