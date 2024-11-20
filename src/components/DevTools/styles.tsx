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

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  background-color: white;
  cursor: pointer;
  color: #2c3e50;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 40px;

  &:hover {
    border-color: #3498db;
  }

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  & option {
    color: #2c3e50;
    padding: 8px;
  }
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

export const Result = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  border: 1px solid #fecaca;
  margin: 10px 0;
`;

export const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  margin: 20px auto;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
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
`;

export const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

export const ResultLabel = styled.span`
  font-weight: 500;
  color: #4a5568;
`;

export const ResultValue = styled.span`
  color: #2d3748;
  word-break: break-all;
  text-align: right;
  max-width: 70%;
`;
