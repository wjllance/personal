import React, { useState } from 'react';
import {
  Tool,
  ToolTitle,
  Input,
  Button,
  Result,
  ErrorMessage
} from '../styles';

const UniswapPriceConverter: React.FC = () => {
  const [price, setPrice] = useState('');
  const [sqrtPrice, setSqrtPrice] = useState('');
  const [priceError, setPriceError] = useState('');

  const priceToSqrtX96 = (price: number): string => {
    if (isNaN(price) || price < 0) throw new Error('Invalid price');
    return (BigInt(Math.floor(Math.sqrt(price) * 2 ** 96))).toString();
  };

  const sqrtX96ToPrice = (sqrtPriceX96: bigint): { price: string; invertedPrice: string } => {
    const numerator = sqrtPriceX96 * sqrtPriceX96;
    const denominator = BigInt(2 ** 192);
    
    let priceStr: string;
    // For very small numbers, we need to maintain precision
    if (numerator < denominator) {
      // Convert to decimal string with high precision
      const precisionFactor = BigInt(10 ** 20); // Use 20 decimal places
      const scaledPrice = (numerator * precisionFactor) / denominator;
      const priceString = scaledPrice.toString().padStart(21, '0');
      const integerPart = priceString.slice(0, -20) || '0';
      const decimalPart = priceString.slice(-20).replace(/0+$/, '');
      
      priceStr = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    } else {
      // For larger numbers, we can use regular number conversion
      priceStr = (Number(numerator) / Number(denominator)).toString();
    }

    // Calculate inverted price (1/price)
    const priceNum = parseFloat(priceStr);
    const invertedPriceStr = (1 / priceNum).toString();

    return {
      price: priceStr,
      invertedPrice: invertedPriceStr
    };
  };

  const handlePriceToSqrtX96 = () => {
    try {
      const priceNum = parseFloat(price);
      const result = priceToSqrtX96(priceNum);
      setSqrtPrice(result);
      setPriceError('');
    } catch (error) {
      setPriceError('Invalid price format');
      setSqrtPrice('');
    }
  };

  const handleSqrtX96ToPrice = () => {
    try {
      const sqrtPriceX96 = BigInt(sqrtPrice);
      const result = sqrtX96ToPrice(sqrtPriceX96);
      setPrice(result.price);
      setPriceError('');
    } catch (error) {
      setPriceError('Invalid sqrtX96Price format');
      setPrice('');
    }
  };

  return (
    <Tool>
      <ToolTitle>Uniswap V3 SqrtX96 Price Converter</ToolTitle>
      <Input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price (e.g., 1.5)"
      />
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePriceToSqrtX96}
      >
        Price → SqrtX96
      </Button>
      <Input
        type="text"
        value={sqrtPrice}
        onChange={(e) => setSqrtPrice(e.target.value)}
        placeholder="Enter sqrtX96Price"
      />
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSqrtX96ToPrice}
      >
        SqrtX96 → Price
      </Button>
      {priceError && <ErrorMessage>{priceError}</ErrorMessage>}
      <Result>
        {price && (
          <>
            Token0/Token1 Price: {price}
            {Number(price) < 1e-6 && (
              <>
                {'\n'}Scientific: {Number(price).toExponential(6)}
              </>
            )}
            {'\n\n'}
            Token1/Token0 Price: {(1 / Number(price)).toString()}
            {Number(price) > 1e6 && (
              <>
                {'\n'}Scientific: {(1 / Number(price)).toExponential(6)}
              </>
            )}
          </>
        )}
      </Result>
    </Tool>
  );
};

export default UniswapPriceConverter;
