import React, { useState } from 'react';
import {
  Tool,
  ToolTitle,
  Input,
  Button,
  Result,
  ErrorMessage
} from '../styles';

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [timestampError, setTimestampError] = useState('');
  const [convertedTime, setConvertedTime] = useState('');

  const handleTimestampConvert = () => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }
      setConvertedTime(date.toISOString());
      setTimestampError('');
    } catch (error) {
      setTimestampError('Invalid timestamp format');
      setConvertedTime('');
    }
  };

  const handleCurrentTimestamp = () => {
    const currentTimestamp = Math.floor(Date.now() / 1000).toString();
    setTimestamp(currentTimestamp);
    setConvertedTime(new Date().toISOString());
    setTimestampError('');
  };

  return (
    <Tool>
      <ToolTitle>Timestamp Converter</ToolTitle>
      <Input
        type="text"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        placeholder="Enter Unix timestamp"
      />
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTimestampConvert}
      >
        Convert
      </Button>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCurrentTimestamp}
      >
        Current Timestamp
      </Button>
      {timestampError && <ErrorMessage>{timestampError}</ErrorMessage>}
      {convertedTime && <Result>{convertedTime}</Result>}
    </Tool>
  );
};

export default TimestampConverter;
