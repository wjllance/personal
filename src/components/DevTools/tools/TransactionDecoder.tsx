import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  Tool,
  ToolTitle,
  Input,
  TextArea,
  Button,
  Result,
  ErrorMessage
} from '../styles';

const TransactionDecoder: React.FC = () => {
  const [txData, setTxData] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const decodeTx = () => {
    try {
      // Remove '0x' prefix if present
      const cleanData = txData.startsWith('0x') ? txData.slice(2) : txData;
      
      // Extract function selector (first 4 bytes / 8 characters)
      const functionSelector = cleanData.slice(0, 8);
      
      // Extract parameters (remaining data)
      const params = cleanData.slice(8);
      
      // Split parameters into 32-byte chunks
      const chunks = params.match(/.{1,64}/g) || [];
      
      let decodedResult = `Function Selector: 0x${functionSelector}\n\n`;
      decodedResult += 'Parameters:\n';
      
      chunks.forEach((chunk, index) => {
        // Try to decode as address if it starts with a lot of zeros
        if (chunk.startsWith('000000000000000000000000')) {
          const address = '0x' + chunk.slice(24);
          decodedResult += `[${index}] Address: ${address}\n`;
        }
        // Try to decode as number
        else if (!isNaN(parseInt(chunk, 16))) {
          const number = BigInt('0x' + chunk).toString();
          decodedResult += `[${index}] Number: ${number}\n`;
        }
        // Raw hex data
        else {
          decodedResult += `[${index}] Raw: 0x${chunk}\n`;
        }
      });

      setResult(decodedResult);
      setError('');
    } catch (err) {
      setError('Error decoding transaction data');
      setResult('');
    }
  };

  return (
    <Tool>
      <ToolTitle>Transaction Data Decoder</ToolTitle>
      <TextArea
        value={txData}
        onChange={(e) => setTxData(e.target.value)}
        placeholder="Enter transaction data (hex)"
      />
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={decodeTx}
      >
        Decode Transaction
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {result && <Result>{result}</Result>}
    </Tool>
  );
};

export default TransactionDecoder;
