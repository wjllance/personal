import styled from 'styled-components';
import { motion } from 'framer-motion';

// Modern Dark Theme Color Palette
const theme = {
  background: '#1a1b1e',
  surface: '#2c2e33',
  surfaceLight: '#3a3d44',
  primary: '#6366f1',
  primaryHover: '#818cf8',
  text: '#e4e6eb',
  textSecondary: '#9ca3af',
  border: '#4b5563',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b'
};

export const DevToolsSection = styled.section`
  min-height: 100vh;
  padding: 100px 20px;
  background: ${theme.background};
  color: ${theme.text};
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: ${theme.surface};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 24px;
  border: 1px solid ${theme.border};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 0 20px;
  color: ${theme.text};
`;

export const BackButton = styled.button`
  padding: 8px 16px;
  background-color: ${theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.primaryHover};
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: ${theme.text};
`;

export const ToolsContainer = styled.div`
  display: flex;
  gap: 30px;
  min-height: 600px;
`;

export const TabList = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  background: ${theme.surface};
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.surfaceLight};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.border};
    border-radius: 4px;
  }
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.active ? theme.primary : theme.textSecondary};
  background-color: ${props => props.active ? theme.surfaceLight : 'transparent'};
  border-left: 3px solid ${props => props.active ? theme.primary : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.surfaceLight};
    color: ${theme.primary};
  }
`;

export const ToolContent = styled.div`
  flex: 1;
  background: ${theme.surface};
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.surfaceLight};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.border};
    border-radius: 4px;
  }
`;

export const Tool = styled.div`
  width: 100%;
`;

export const ToolTitle = styled.h3`
  color: ${theme.text};
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: ${theme.surfaceLight};
  border: 1px solid ${theme.border};
  border-radius: 8px;
  color: ${theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 2px ${theme.primary}33;
  }

  &::placeholder {
    color: ${theme.textSecondary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  background: ${theme.surfaceLight};
  border: 1px solid ${theme.border};
  border-radius: 8px;
  color: ${theme.text};
  font-size: 1rem;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 2px ${theme.primary}33;
  }

  &::placeholder {
    color: ${theme.textSecondary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: ${theme.surfaceLight};
  border: 1px solid ${theme.border};
  border-radius: 8px;
  color: ${theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 2px ${theme.primary}33;
  }

  option {
    background: ${theme.surface};
    color: ${theme.text};
  }
`;

export const Button = styled(motion.button)`
  padding: 12px 24px;
  background-color: ${theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 12px;

  &:hover:not(:disabled) {
    background-color: ${theme.primaryHover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background: ${theme.surfaceLight};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${theme.border};
  color: ${theme.text};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const Result = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${theme.surfaceLight};
  border-radius: 6px;
  border: 1px solid ${theme.border};
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background-color: ${theme.error};
  color: white;
  border-radius: 6px;
  border: 1px solid ${theme.error};
  margin: 10px 0;
`;

export const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  margin: 20px auto;
  border: 3px solid ${theme.surfaceLight};
  border-top: 3px solid ${theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ResultTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${theme.surfaceLight};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${theme.border};
`;

export const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const ResultLabel = styled.span`
  font-weight: 500;
  color: ${theme.textSecondary};
`;

export const ResultValue = styled.span`
  color: ${theme.text};
  word-break: break-all;
  text-align: right;
  max-width: 70%;
`;
