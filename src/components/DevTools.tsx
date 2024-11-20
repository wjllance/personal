import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DevToolsSection = styled.section`
  padding: 100px 20px;
  min-height: 100vh;
  background: #f8f9fa;
  margin-top: 80px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Tool = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ToolTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Courier New', Courier, monospace;
  resize: vertical;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;

  &:hover {
    background: #2980b9;
  }
`;

const Result = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f1f1f1;
  border-radius: 5px;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 0.5rem;
`;

interface TimeResult {
  timestamp: number;
  iso: string;
  local: string;
  utc: string;
}

const DevTools: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonResult, setJsonResult] = useState('');
  const [jsonError, setJsonError] = useState('');
  
  const [timestamp, setTimestamp] = useState('');
  const [timeResult, setTimeResult] = useState<TimeResult | null>(null);
  const [timeError, setTimeError] = useState('');

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonResult(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (error) {
      setJsonError('Invalid JSON format');
      setJsonResult('');
    }
  };

  const handleJsonMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonResult(JSON.stringify(parsed));
      setJsonError('');
    } catch (error) {
      setJsonError('Invalid JSON format');
      setJsonResult('');
    }
  };

  const handleTimeConvert = () => {
    try {
      let timestampNum: number;
      
      // Handle different timestamp formats
      if (timestamp.length === 13) {
        timestampNum = parseInt(timestamp);
      } else if (timestamp.length === 10) {
        timestampNum = parseInt(timestamp) * 1000;
      } else {
        throw new Error('Invalid timestamp length');
      }

      const date = new Date(timestampNum);
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }

      setTimeResult({
        timestamp: timestampNum,
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString()
      });
      setTimeError('');
    } catch (error) {
      setTimeError('Invalid timestamp format');
      setTimeResult(null);
    }
  };

  const getCurrentTimestamp = () => {
    const now = Date.now();
    setTimestamp(now.toString());
    handleTimeConvert();
  };

  return (
    <DevToolsSection id="devtools">
      <Container>
        <Title>Developer Tools</Title>
        <ToolsGrid>
          <Tool>
            <ToolTitle>JSON Formatter</ToolTitle>
            <TextArea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON here..."
            />
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJsonFormat}
            >
              Format
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJsonMinify}
            >
              Minify
            </Button>
            {jsonError && <ErrorMessage>{jsonError}</ErrorMessage>}
            {jsonResult && <Result>{jsonResult}</Result>}
          </Tool>

          <Tool>
            <ToolTitle>Timestamp Converter</ToolTitle>
            <Input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="Enter timestamp (10 or 13 digits)"
            />
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTimeConvert}
            >
              Convert
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getCurrentTimestamp}
            >
              Current Time
            </Button>
            {timeError && <ErrorMessage>{timeError}</ErrorMessage>}
            {timeResult && (
              <Result>
                {`Timestamp (ms): ${timeResult.timestamp}
Timestamp (s): ${Math.floor(timeResult.timestamp / 1000)}
ISO: ${timeResult.iso}
Local: ${timeResult.local}
UTC: ${timeResult.utc}`}
              </Result>
            )}
          </Tool>
        </ToolsGrid>
      </Container>
    </DevToolsSection>
  );
};

export default DevTools;
