import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

export const ToolsContainer = styled.div`
  display: flex;
  gap: 30px;
  min-height: 600px;
  margin-top: 2rem;
`;

export const TabList = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  background: #f8f9fa;
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
  color: ${(props) => (props.active ? "#4caf50" : "#666")};
  background-color: ${(props) => (props.active ? "#f8f9fa" : "transparent")};
  border-left: 3px solid
    ${(props) => (props.active ? "#4caf50" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #4caf50;
  }
`;

export const ToolContent = styled.div`
  flex: 1;
  background: #f8f9fa;
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

export const Section = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const Result = styled.div<{ error?: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  background: ${(props) => (props.error ? "#fff5f5" : "#f0fff4")};
  border-radius: 6px;
  border: 1px solid ${(props) => (props.error ? "#feb2b2" : "#9ae6b4")};
  color: ${(props) => (props.error ? "#c53030" : "#2f855a")};
`;

export const SectionTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

export const NetworkSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

export const Button = styled(motion.button)`
  background: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 0.5rem;
  width: 100%;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #45a049;
  }
`;

export const TransactionList = styled.div`
  margin-top: 1rem;
  max-height: 700px;
  overflow-y: auto;
`;

export const TransactionItem = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #64ffda;
`;

export const TransactionDetails = styled.div`
  font-size: 13px;
`;

export const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(100, 255, 218, 0.1);
  border-top: 2px solid #64ffda;
  border-radius: 50%;
  margin: 1rem auto;
`;
