import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle, styled } from 'styled-components';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DevTools from './components/DevTools';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
  }
`;

const PageWrapper = styled.div`
  padding-top: 80px; // Account for fixed navbar
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devtools" element={<DevTools />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
