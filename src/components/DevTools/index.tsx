import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  DevToolsSection,
  Container,
  Title,
  ToolsContainer,
  TabList,
  TabButton,
  ToolContent,
  Header,
  BackButton
} from './styles';

// Lazy load components
const JsonFormatter = React.lazy(() => import('./tools/JsonFormatter'));
const TimestampConverter = React.lazy(() => import('./tools/TimestampConverter'));
const UniswapPriceConverter = React.lazy(() => import('./tools/UniswapPriceConverter'));
const UniswapPoolInfo = React.lazy(() => import('./tools/UniswapPoolInfo'));
const EthAddressValidator = React.lazy(() => import('./tools/EthAddressValidator'));
const TokenDecoder = React.lazy(() => import('./tools/TokenDecoder'));

type Tool = 'json' | 'timestamp' | 'uniswap' | 'pool-info' | 'eth-address' | 'token' ;

interface ToolDefinition {
  id: Tool;
  name: string;
  component: React.LazyExoticComponent<React.FC>;
  description: string;
}

const tools: ToolDefinition[] = [
  { 
    id: 'json',
    name: 'JSON Formatter',
    component: JsonFormatter,
    description: 'Format and validate JSON data'
  },
  { 
    id: 'timestamp',
    name: 'Timestamp Converter',
    component: TimestampConverter,
    description: 'Convert between different timestamp formats'
  },
  { 
    id: 'uniswap',
    name: 'Uniswap Price',
    component: UniswapPriceConverter,
    description: 'Calculate Uniswap token prices and liquidity'
  },
  {
    id: 'pool-info',
    name: 'Uniswap Pool Info',
    component: UniswapPoolInfo,
    description: 'Fetch Uniswap V3 pool information and token details'
  },
  { 
    id: 'eth-address',
    name: 'ETH Address Validator',
    component: EthAddressValidator,
    description: 'Validate Ethereum addresses and ENS names'
  },
  { 
    id: 'token',
    name: 'ERC20 Token Decoder',
    component: TokenDecoder,
    description: 'Decode ERC20 token data and transactions'
  },
];

const LoadingSpinner = styled.div`
  border: 3px solid rgba(100, 255, 218, 0.1);
  border-top: 3px solid #64ffda;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 40px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ToolDescription = styled.p`
  color: #8892b0;
  font-size: 0.9rem;
  margin: 4px 0 0;
  opacity: 0.8;
`;

class ToolErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Tool Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>{this.state.error?.message}</ErrorMessage>
          <RetryButton onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  margin: 20px;
`;

const ErrorTitle = styled.h3`
  color: #ff6b6b;
  margin: 0 0 12px;
`;

const ErrorMessage = styled.p`
  color: #8892b0;
  margin: 0 0 20px;
`;

const RetryButton = styled.button`
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  border: 1px solid rgba(100, 255, 218, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-2px);
  }
`;

const DevTools: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tool>('json');

  const activeTool = tools.find(tool => tool.id === activeTab);

  return (
    <DevToolsSection id="devtools">
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/')} aria-label="Back to home">
            ← Back to Home
          </BackButton>
          <Title>Developer Tools</Title>
        </Header>
        <ToolsContainer>
          <TabList>
            {tools.map(tool => (
              <div key={tool.id}>
                <TabButton
                  active={activeTab === tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  aria-label={`Switch to ${tool.name}`}
                  aria-selected={activeTab === tool.id}
                  role="tab"
                >
                  {tool.name}
                </TabButton>
                <ToolDescription>{tool.description}</ToolDescription>
              </div>
            ))}
          </TabList>
          <ToolContent>
            <ToolErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                {activeTool?.component && <activeTool.component />}
              </Suspense>
            </ToolErrorBoundary>
          </ToolContent>
        </ToolsContainer>
      </Container>
    </DevToolsSection>
  );
};

export default DevTools;
