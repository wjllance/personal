import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  Tool,
  ToolTitle,
  Input,
  Button,
  Result,
  ErrorMessage
} from '../styles';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
const PROVIDER_URL = `https://mainnet.infura.io/v3/${INFURA_KEY}`;

const EthAddressValidator: React.FC = () => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const validateAddress = () => {
    try {
      if (ethers.isAddress(address)) {
        const checksumAddress = ethers.getAddress(address);
        setResult(`✓ Valid Ethereum address\nChecksum address: ${checksumAddress}`);
        setError('');
      } else {
        throw new Error('Invalid Ethereum address');
      }
    } catch (err) {
      setError('Invalid Ethereum address format');
      setResult('');
    }
  };

  const handleENSLookup = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      if (address.endsWith('.eth')) {
        const resolvedAddress = await provider.resolveName(address);
        if (resolvedAddress) {
          setResult(`ENS Name: ${address}\nResolved Address: ${resolvedAddress}`);
          setError('');
        } else {
          throw new Error('Could not resolve ENS name');
        }
      } else {
        const ensName = await provider.lookupAddress(address);
        if (ensName) {
          setResult(`Address: ${address}\nENS Name: ${ensName}`);
          setError('');
        } else {
          setResult('No ENS name found for this address');
          setError('');
        }
      }
    } catch (err) {
      setError('Error looking up ENS name');
      setResult('');
    }
  };

  return (
    <Tool>
      <ToolTitle>Ethereum Address Validator & ENS Resolver</ToolTitle>
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter ETH address or ENS name (e.g., vitalik.eth)"
      />
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={validateAddress}
      >
        Validate Address
      </Button>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleENSLookup}
      >
        ENS Lookup
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {result && <Result>{result}</Result>}
    </Tool>
  );
};

export default EthAddressValidator;
