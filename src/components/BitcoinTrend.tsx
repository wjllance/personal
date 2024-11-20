import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as Title2,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import BitcoinLogoSrc from '../assets/bitcoin-logo.svg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title2,
  Tooltip,
  Legend
);

interface PriceData {
  prices: [number, number][];
}

interface BitcoinTrendProps {
  id?: string;
}

type Timeframe = '24h' | '7d' | '30d' | '180d' | '365d';

const timeframeMap: Record<Timeframe, { days: string }> = {
  '24h': { days: '1' },
  '7d': { days: '7' },
  '30d': { days: '30' },
  '180d': { days: '180' },
  '365d': { days: '365' }
};

const Container = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  margin-top: 80px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-height: 500px;

  @media (max-width: 968px) {
    padding: 24px;
    margin-top: 72px;
    min-height: 600px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    margin-top: 68px;
    border-radius: 16px;
    min-height: 650px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 968px) {
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    margin-bottom: 20px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 968px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 968px) {
    padding: 6px 12px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 4px 8px;
  }
`;

const BitcoinLogo = styled.img`
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 8px rgba(247, 147, 26, 0.3));
  animation: pulse 2s infinite ease-in-out;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #64ffda;
  margin: 0;
  white-space: nowrap;
  letter-spacing: -0.02em;

  @media (max-width: 968px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const PriceDisplay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 200px;

  @media (max-width: 968px) {
    align-items: center;
    padding: 10px 14px;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    min-width: 160px;
  }
`;

const CurrentPrice = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;
  line-height: 1.1;

  @media (max-width: 968px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? '#00ff9d' : '#ff6b6b'};
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 4px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 968px) {
    justify-content: center;
    padding: 4px 6px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    padding: 3px 4px;
  }
`;

const TimeframeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(100, 255, 218, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#64ffda' : '#ffffff'};
  border: 1px solid ${props => props.active ? 'rgba(100, 255, 218, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? 'rgba(100, 255, 218, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 0.85rem;
  }
`;

const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 400px;
  position: relative;

  @media (max-width: 968px) {
    padding: 20px;
    height: 350px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    height: 300px;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: rgba(10, 25, 47, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(100, 255, 218, 0.1);
  border-top: 3px solid #64ffda;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64ffda;
  font-size: 1.1rem;
  margin: 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  font-size: 1.1rem;
  margin: 0 0 16px 0;
`;

const RetryButton = styled(motion.button)`
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  border: 1px solid rgba(100, 255, 218, 0.2);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-2px);
  }
`;

const BitcoinTrend: React.FC<BitcoinTrendProps> = ({ id }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [priceChange, setPriceChange] = useState<{ value: number; percentage: number } | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const fetchPriceData = async () => {
    if (abortController) {
      abortController.abort();
    }
    const newController = new AbortController();
    setAbortController(newController);

    setLoading(true);
    setError(null);
    let retries = 3;

    while (retries > 0) {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${
            timeframeMap[timeframe].days
          }`,
          { signal: newController.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }

        const data: PriceData = await response.json();
        
        // Validate data structure
        if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
          throw new Error('Invalid price data received');
        }

        // Set current price
        const latestPrice = data.prices[data.prices.length - 1][1];
        if (typeof latestPrice === 'number' && !isNaN(latestPrice)) {
          setCurrentPrice(latestPrice);
        }
        
        // Calculate price change
        if (data.prices.length >= 2) {
          const startPrice = data.prices[0][1];
          const endPrice = data.prices[data.prices.length - 1][1];
          
          if (typeof startPrice === 'number' && typeof endPrice === 'number' && 
              !isNaN(startPrice) && !isNaN(endPrice) && startPrice !== 0) {
            const change = endPrice - startPrice;
            const changePercentage = (change / startPrice) * 100;
            
            setPriceChange({
              value: change,
              percentage: changePercentage
            });
          }
        }

        setPriceData(data);
        setLoading(false);
        setRetryCount(0);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        retries--;
        if (retries === 0) {
          setError('Failed to fetch Bitcoin price data. Please try again.');
          setLoading(false);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    fetchPriceData();
    
    // Update price every 30 seconds
    const interval = setInterval(() => {
      fetchPriceData();
    }, 30000);

    return () => {
      clearInterval(interval);
      if (abortController) {
        abortController.abort();
      }
    };
  }, [timeframe]);

  if (error) {
    return (
      <Container id={id}>
        <ChartHeader>
          <HeaderTop>
            <TitleGroup>
              <BitcoinLogo 
                src="" 
                alt="Bitcoin logo"
              />
              <Title>BTC/USD Live</Title>
            </TitleGroup>
          </HeaderTop>
        </ChartHeader>
        <ChartContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={() => fetchPriceData()}>
            Retry
          </RetryButton>
        </ChartContainer>
      </Container>
    );
  }

  if (!priceData || loading) {
    return (
      <Container id={id}>
        <ChartHeader>
          <HeaderTop>
            <TitleGroup>
              <BitcoinLogo 
                src={BitcoinLogoSrc} 
                alt="Bitcoin logo"
              />
              <Title>BTC/USD Live</Title>
            </TitleGroup>
            <PriceDisplay
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentPrice>
                $0.00
              </CurrentPrice>
              {priceChange && (
                <PriceChange isPositive={priceChange.value >= 0}>
                  {priceChange.value >= 0 ? '↑' : '↓'} {Math.abs(priceChange.percentage).toFixed(2)}%
                </PriceChange>
              )}
            </PriceDisplay>
          </HeaderTop>
          <TimeframeContainer>
            {(Object.keys(timeframeMap) as Timeframe[]).map((tf) => (
              <TimeframeButton
                key={tf}
                active={timeframe === tf}
                onClick={() => setTimeframe(tf)}
                disabled={loading}
                aria-label={`Show ${tf} chart`}
              >
                {tf.toUpperCase()}
              </TimeframeButton>
            ))}
          </TimeframeContainer>
        </ChartHeader>
        <ChartContainer>
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner />
            <LoadingText>Loading Bitcoin price data...</LoadingText>
          </LoadingOverlay>
        </ChartContainer>
      </Container>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === '24h') {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      });
    }
    if (timeframe === '7d') {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        hour12: true
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(timeframe === '365d' && { year: '2-digit' })
    });
  };

  const chartData = {
    labels: priceData?.prices.map(([timestamp]) => formatDate(timestamp)) ?? [],
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceData?.prices.map(([, price]) => price) ?? [],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#ffffff',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000000',
        bodyColor: '#000000',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const timestamp = priceData!.prices[context[0].dataIndex][0];
            const date = new Date(timestamp);
            if (timeframe === '24h') {
              return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
            }
            if (timeframe === '7d') {
              return date.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
            }
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: timeframe === '365d' ? '2-digit' : undefined
            });
          },
          label: (context) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          },
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value as number);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <Container id={id}>
      <ChartHeader>
        <HeaderTop>
          <TitleGroup>
            <BitcoinLogo 
              src={BitcoinLogoSrc} 
              alt="Bitcoin logo"
            />
            <Title>BTC/USD Live</Title>
          </TitleGroup>
          <PriceDisplay
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentPrice>
              ${currentPrice?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </CurrentPrice>
            {priceChange && (
              <PriceChange isPositive={priceChange.value >= 0}>
                {priceChange.value >= 0 ? '↑' : '↓'}
                {Math.abs(priceChange.percentage).toFixed(2)}%
                <span style={{ opacity: 0.7, fontSize: '0.9em' }}>
                  ({timeframe})
                </span>
              </PriceChange>
            )}
          </PriceDisplay>
        </HeaderTop>
        <TimeframeContainer>
          {(Object.keys(timeframeMap) as Timeframe[]).map((tf) => (
            <TimeframeButton
              key={tf}
              active={timeframe === tf}
              onClick={() => setTimeframe(tf)}
              disabled={loading}
              aria-label={`Show ${tf} chart`}
            >
              {tf.toUpperCase()}
            </TimeframeButton>
          ))}
        </TimeframeContainer>
      </ChartHeader>
      <ChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {loading ? (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner />
            <LoadingText>Loading Bitcoin price data...</LoadingText>
          </LoadingOverlay>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </ChartContainer>
    </Container>
  );
};

export default BitcoinTrend;
