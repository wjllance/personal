import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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
  Title,
  Tooltip,
  Legend
);

interface BitcoinTrendProps {
  id?: string;
}

const Container = styled.section`
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 20px;
`;

const ChartTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
`;

const BitcoinLogo = styled.img`
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 8px rgba(247, 147, 26, 0.5));
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.h3`
  color: #64ffda;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
`;

const SubTitle = styled.span`
  color: #8892b0;
  font-size: 0.9rem;
  margin-top: 4px;
`;

const PriceHighlight = styled.span`
  color: #f7931a;
  font-weight: 700;
`;

const TimeframeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TimeframeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 8px 16px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #ffffff;
  font-size: 1.2rem;
  opacity: 0.8;
`;

interface PriceData {
  prices: [number, number][];
}

type Timeframe = '24h' | '7d' | '30d' | '180d' | '365d';

const timeframeMap: Record<Timeframe, { days: string }> = {
  '24h': { days: '1' },
  '7d': { days: '7' },
  '30d': { days: '30' },
  '180d': { days: '180' },
  '365d': { days: '365' }
};

const BitcoinTrend: React.FC<BitcoinTrendProps> = ({ id }) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { days } = timeframeMap[timeframe];
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
        );
        const data = await response.json();
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [timeframe]);

  if (!priceData || loading) {
    return (
      <Container id={id}>
        <ChartTitle>
          <BitcoinLogo src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" alt="Bitcoin logo" />
          <TitleText>
            <MainTitle>
              BTC/USD <PriceHighlight>Live</PriceHighlight>
            </MainTitle>
            <SubTitle>Real-time Bitcoin price chart</SubTitle>
          </TitleText>
        </ChartTitle>
        <LoadingText>Loading Bitcoin price data...</LoadingText>
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
      <ChartTitle>
        <BitcoinLogo src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" alt="Bitcoin logo" />
        <TitleText>
          <MainTitle>
            BTC/USD <PriceHighlight>Live</PriceHighlight>
          </MainTitle>
          <SubTitle>Real-time Bitcoin price chart</SubTitle>
        </TitleText>
      </ChartTitle>
      <TimeframeContainer>
        {(Object.keys(timeframeMap) as Timeframe[]).map((tf) => (
          <TimeframeButton
            key={tf}
            active={timeframe === tf}
            onClick={() => setTimeframe(tf)}
          >
            {tf.toUpperCase()}
          </TimeframeButton>
        ))}
      </TimeframeContainer>
      <ChartContainer>
        <Line data={chartData} options={options} />
      </ChartContainer>
    </Container>
  );
};

export default BitcoinTrend;
