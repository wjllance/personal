import React, { useState } from 'react';
import {
  Tool,
  ToolTitle,
  TextArea,
  Button,
  ErrorMessage,
  Result
} from '../styles';

const JsonFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonResult, setJsonResult] = useState('');

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

  return (
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
  );
};

export default JsonFormatter;
