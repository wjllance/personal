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
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 100%;
  min-height: 400px;

  @media (max-width: 968px) {
    padding: 24px;
    min-height: 350px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    min-height: 300px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 968px) {
    justify-content: center;
    width: 100%;
  }
`;

const BitcoinLogo = styled.img`
  width: 32px;
  height: 32px;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #64ffda;
  margin: 0;

  @media (max-width: 968px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? '#00ff9d' : '#ff6b6b'};
  font-size: 1rem;
  margin-left: 8px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const TimeframeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(100, 255, 218, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? '#ffffff' : '#64ffda'};
  border: 1px solid rgba(100, 255, 218, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-2px);
  }
`;

const ChartContent = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 80px);

  @media (max-width: 968px) {
    height: calc(100% - 100px);
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(10, 25, 47, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 16px;
`;

const LoadingText = styled.p`
  color: #64ffda;
  font-size: 1.1rem;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  font-size: 1rem;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const RetryButton = styled(motion.button)`
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  border: 1px solid rgba(100, 255, 218, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`;

const BitcoinTrend: React.FC<BitcoinTrendProps> = ({ id }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [priceChange, setPriceChange] = useState<{ value: number; percentage: number } | null>(null);

  const fetchPriceData = async () => {
    setLoading(true);
    setError(null);
    let retries = 3;

    while (retries > 0) {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${
            timeframeMap[timeframe].days
          }`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }

        const data: PriceData = await response.json();
        
        // Calculate price change
        if (data.prices.length >= 2) {
          const startPrice = data.prices[0][1];
          const endPrice = data.prices[data.prices.length - 1][1];
          const change = endPrice - startPrice;
          const changePercentage = (change / startPrice) * 100;
          
          setPriceChange({
            value: change,
            percentage: changePercentage
          });
        }

        setPriceData(data);
        setLoading(false);
        return;
      } catch (error) {
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
  }, [timeframe]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchPriceData();
  };

  if (error) {
    return (
      <Container id={id}>
        <ChartHeader>
          <TitleContainer>
            <BitcoinLogo src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" alt="Bitcoin logo" />
            <Title>BTC/USD Live</Title>
          </TitleContainer>
        </ChartHeader>
        <ChartContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>
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
          <TitleContainer>
            <BitcoinLogo src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" alt="Bitcoin logo" />
            <Title>
              BTC/USD Live
              {priceChange && (
                <PriceChange isPositive={priceChange.value >= 0}>
                  {priceChange.value >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%
                </PriceChange>
              )}
            </Title>
          </TitleContainer>
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
            transition={{ duration: 0.3 }}
          >
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
    labels: priceData.prices.map(([timestamp]) => formatDate(timestamp)),
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceData.prices.map(([, price]) => price),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointRadius: 0, // Hide all points
        pointHitRadius: 10, // Area around the point that will trigger tooltip
        pointHoverRadius: 4, // Size of point when hovering
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
        <TitleContainer>
          <BitcoinLogo src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" alt="Bitcoin logo" />
          <Title>
            BTC/USD Live
            {priceChange && (
              <PriceChange isPositive={priceChange.value >= 0}>
                {priceChange.value >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%
              </PriceChange>
            )}
          </Title>
        </TitleContainer>
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
        <Line data={chartData} options={options} />
      </ChartContainer>
    </Container>
  );
};

export default BitcoinTrend;
