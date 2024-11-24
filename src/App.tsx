import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Home from "./pages/Home";
import DevTools from "./pages/DevTools";
import SolanaTools from "./pages/SolanaTools";

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

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devtools" element={<DevTools />} />
        <Route path="/solana" element={<SolanaTools />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
