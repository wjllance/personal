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
  background: linear-gradient(to right, #000046, #1CB5E0);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  height: 300px;
`;

const ChartTitle = styled.h3`
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #ffffff;
  font-size: 1.2rem;
`;

interface PriceData {
  prices: [number, number][];
}

const BitcoinTrend: React.FC<BitcoinTrendProps> = ({ id }) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
        );
        const data = await response.json();
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchData();
  }, []);

  if (!priceData) {
    return (
      <Container id={id}>
        <LoadingText>Loading Bitcoin price data...</LoadingText>
      </Container>
    );
  }

  const labels = priceData.prices.map(([timestamp]) => 
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  );

  const prices = priceData.prices.map(([, price]) => price);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: prices,
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.1)',
        pointBackgroundColor: '#00f2fe',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#00f2fe',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000046',
        bodyColor: '#000046',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        displayColors: false,
        callbacks: {
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
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
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
      <ChartTitle>Bitcoin Price Trend</ChartTitle>
      <ChartContainer>
        <Line data={chartData} options={options} />
      </ChartContainer>
    </Container>
  );
};

export default BitcoinTrend;
