import React, { useState } from 'react';
import styled from 'styled-components';
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const Button = styled(motion.button)`
  background: #4CAF50;
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

const Result = styled.div<{ error?: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.error ? '#fff5f5' : '#f0fff4'};
  border-radius: 6px;
  border: 1px solid ${props => props.error ? '#feb2b2' : '#9ae6b4'};
  color: ${props => props.error ? '#c53030' : '#2f855a'};
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const NetworkSelect = styled.select`
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
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 14px;
`;

const SolanaTools: React.FC = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('mainnet-beta');
  const [loading, setLoading] = useState(false);

  const getConnection = () => {
    return new Connection(clusterApiUrl(network as 'mainnet-beta' | 'testnet' | 'devnet'));
  };

  const getBalance = async () => {
    try {
      setError('');
      setLoading(true);
      const connection = getConnection();
      const pubKey = new PublicKey(address);
      const balance = await connection.getBalance(pubKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      setError('Invalid address or network error');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = (address: string) => {
    try {
      if (!address) return false;
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Container>
      <Title>Solana Tools</Title>
      <Grid>
        <Section>
          <SectionTitle>SOL Balance Checker</SectionTitle>
          <Label>Network</Label>
          <NetworkSelect
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="mainnet-beta">Mainnet Beta</option>
            <option value="testnet">Testnet</option>
            <option value="devnet">Devnet</option>
          </NetworkSelect>
          
          <Label>Solana Address</Label>
          <Input
            type="text"
            placeholder="Enter Solana address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={getBalance}
            disabled={!validateAddress(address) || loading}
          >
            {loading ? 'Checking...' : 'Check Balance'}
          </Button>
          
          {error && <Result error>{error}</Result>}
          {balance !== null && (
            <Result>
              Balance: {balance.toFixed(4)} SOL
            </Result>
          )}
        </Section>

        {/* Additional sections for future tools */}
        <Section>
          <SectionTitle>Token Balance Checker</SectionTitle>
          <Label>Coming Soon</Label>
          <Result>This feature will be available in the next update</Result>
        </Section>

        <Section>
          <SectionTitle>NFT Viewer</SectionTitle>
          <Label>Coming Soon</Label>
          <Result>This feature will be available in the next update</Result>
        </Section>
      </Grid>
    </Container>
  );
};

export default SolanaTools;
