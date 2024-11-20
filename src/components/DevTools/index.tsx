import React, { useState } from 'react';
import {
  DevToolsSection,
  Container,
  Title,
  ToolsContainer,
  TabList,
  TabButton,
  ToolContent
} from './styles';
import JsonFormatter from './tools/JsonFormatter';
import TimestampConverter from './tools/TimestampConverter';
import UniswapPriceConverter from './tools/UniswapPriceConverter';
import EthAddressValidator from './tools/EthAddressValidator';
import TokenDecoder from './tools/TokenDecoder';
import TransactionDecoder from './tools/TransactionDecoder';

type Tool = 'json' | 'timestamp' | 'uniswap' | 'eth-address' | 'token' | 'transaction';

const tools = [
  { id: 'json' as Tool, name: 'JSON Formatter', component: JsonFormatter },
  { id: 'timestamp' as Tool, name: 'Timestamp Converter', component: TimestampConverter },
  { id: 'uniswap' as Tool, name: 'Uniswap Price Converter', component: UniswapPriceConverter },
  { id: 'eth-address' as Tool, name: 'ETH Address Validator', component: EthAddressValidator },
  { id: 'token' as Tool, name: 'ERC20 Token Decoder', component: TokenDecoder },
  { id: 'transaction' as Tool, name: 'Transaction Decoder', component: TransactionDecoder }
];

const DevTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tool>('json');

  const ActiveComponent = tools.find(tool => tool.id === activeTab)?.component || JsonFormatter;

  return (
    <DevToolsSection id="devtools">
      <Container>
        <Title>Developer Tools</Title>
        <ToolsContainer>
          <TabList>
            {tools.map(tool => (
              <TabButton
                key={tool.id}
                active={activeTab === tool.id}
                onClick={() => setActiveTab(tool.id)}
              >
                {tool.name}
              </TabButton>
            ))}
          </TabList>
          <ToolContent>
            <ActiveComponent />
          </ToolContent>
        </ToolsContainer>
      </Container>
    </DevToolsSection>
  );
};

export default DevTools;
