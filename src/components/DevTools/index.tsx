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

type Tool = 'json' | 'timestamp' | 'uniswap';

const tools = [
  { id: 'json' as Tool, name: 'JSON Formatter', component: JsonFormatter },
  { id: 'timestamp' as Tool, name: 'Timestamp Converter', component: TimestampConverter },
  { id: 'uniswap' as Tool, name: 'Uniswap Price Converter', component: UniswapPriceConverter }
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
