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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.section`
  padding: 50px 20px;
  background: #ffffff;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const ChartTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 20px;
  color: #e74c3c;
`;

interface PriceData {
  prices: [number, number][];
}

const BitcoinTrend: React.FC<{ id: string }> = ({ id }) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin price data');
        }

        const data: PriceData = await response.json();
        setPriceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();
  }, []);

  const chartData = {
    labels: priceData?.prices.map(price => 
      new Date(price[0]).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ) || [],
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceData?.prices.map(price => price[1]) || [],
        borderColor: '#f7931a',
        backgroundColor: 'rgba(247, 147, 26, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Container>
        <ChartTitle>Bitcoin Price Trend</ChartTitle>
        <ChartContainer>
          <LoadingText>Loading Bitcoin price data...</LoadingText>
        </ChartContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ChartTitle>Bitcoin Price Trend</ChartTitle>
        <ChartContainer>
          <ErrorText>{error}</ErrorText>
        </ChartContainer>
      </Container>
    );
  }

  return (
    <Container id={id}>
      <ChartTitle>Bitcoin Price Trend</ChartTitle>
      <ChartContainer>
        <Line data={chartData} options={options} />
      </ChartContainer>
    </Container>
  );
};

export default BitcoinTrend;
