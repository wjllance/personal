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

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
const PROVIDER_URL = `https://mainnet.infura.io/v3/${INFURA_KEY}`;

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];

const TokenDecoder: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const decodeToken = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      const formattedSupply = ethers.formatUnits(totalSupply, decimals);
      
      setResult(
        `Token Name: ${name}\n` +
        `Symbol: ${symbol}\n` +
        `Decimals: ${decimals}\n` +
        `Total Supply: ${formattedSupply} ${symbol}`
      );
      setError('');
    } catch (err) {
      setError('Error fetching token information. Make sure the address is valid.');
      setResult('');
    }
  };

  return (
    <Tool>
      <ToolTitle>ERC20 Token Decoder</ToolTitle>
      <Input
        type="text"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Enter ERC20 token contract address"
      />
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={decodeToken}
      >
        Decode Token
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {result && <Result>{result}</Result>}
    </Tool>
  );
};

export default TokenDecoder;
