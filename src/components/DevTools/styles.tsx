import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DevToolsSection = styled.section`
  min-height: 100vh;
  padding: 100px 20px;
  background: #f8f9fa;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 0 20px;
`;

export const BackButton = styled.button`
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
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
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.active ? '#3498db' : '#666'};
  background-color: ${props => props.active ? '#f8f9fa' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#3498db' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #3498db;
  }
`;

export const ToolContent = styled.div`
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

export const Tool = styled.div`
  width: 100%;
`;

export const ToolTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  resize: vertical;
`;

export const Button = styled(motion.button)`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  font-weight: 500;

  &:hover {
    background: #2980b9;
  }
`;

export const Result = styled.pre`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin-top: 10px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-all;
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  background: #fde8e8;
`;
