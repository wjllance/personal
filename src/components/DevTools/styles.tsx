import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DevToolsSection = styled.section`
  min-height: 100vh;
  padding: 100px 20px;
  background: #f8f9fa;
  margin-top: 80px;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 50px;
  font-size: 2.5rem;
`;

export const ToolsContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const TabList = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 15px 20px;
  border: none;
  background: ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.active ? '#2980b9' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: ${props => props.active ? '#3498db' : '#f8f9fa'};
  }
`;

export const ToolContent = styled.div`
  flex: 1;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
