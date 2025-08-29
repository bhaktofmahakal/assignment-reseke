import { OHLCVData, BollingerBandsOptions, BollingerBandsResult } from '../types';

/**
 * Calculate Simple Moving Average (SMA)
 * @param values Array of numbers
 * @param period Period for SMA calculation
 * @returns Array of SMA values
 */
function calculateSMA(values: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = values.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      sma.push(sum / period);
    }
  }
  
  return sma;
}

/**
 * Calculate Standard Deviation (Population)
 * Using population standard deviation as it's more commonly used in trading indicators
 * @param values Array of numbers
 * @param period Period for standard deviation calculation
 * @param smaValues Corresponding SMA values
 * @returns Array of standard deviation values
 */
function calculateStandardDeviation(values: number[], period: number, smaValues: number[]): number[] {
  const stdDev: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1 || isNaN(smaValues[i])) {
      stdDev.push(NaN);
    } else {
      const mean = smaValues[i];
      const slice = values.slice(i - period + 1, i + 1);
      const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
      stdDev.push(Math.sqrt(variance));
    }
  }
  
  return stdDev;
}

/**
 * Apply offset to data array
 * @param data Array of data
 * @param offset Number of positions to shift (positive = forward, negative = backward)
 * @returns Shifted array
 */
function applyOffset<T>(data: T[], offset: number): T[] {
  if (offset === 0) return data;
  
  const result = new Array(data.length);
  
  if (offset > 0) {
    // Shift forward (right)
    for (let i = 0; i < data.length; i++) {
      if (i + offset < data.length) {
        result[i + offset] = data[i];
      }
    }
  } else {
    // Shift backward (left)
    for (let i = 0; i < data.length; i++) {
      if (i - Math.abs(offset) >= 0) {
        result[i - Math.abs(offset)] = data[i];
      }
    }
  }
  
  return result;
}

/**
 * Compute Bollinger Bands indicator
 * @param data Array of OHLCV data
 * @param options Bollinger Bands configuration options
 * @returns Array of Bollinger Bands results
 */
export function computeBollingerBands(
  data: OHLCVData[],
  options: BollingerBandsOptions
): BollingerBandsResult[] {
  if (data.length === 0) return [];
  
  const { length, source, stdDevMultiplier, offset } = options;
  
  // Extract source values
  const sourceValues = data.map(candle => candle[source]);
  
  // Calculate SMA (basis line)
  const smaValues = calculateSMA(sourceValues, length);
  
  // Calculate Standard Deviation
  const stdDevValues = calculateStandardDeviation(sourceValues, length, smaValues);
  
  // Calculate upper and lower bands
  const upperValues = smaValues.map((sma, i) => 
    isNaN(sma) || isNaN(stdDevValues[i]) ? NaN : sma + (stdDevMultiplier * stdDevValues[i])
  );
  
  const lowerValues = smaValues.map((sma, i) => 
    isNaN(sma) || isNaN(stdDevValues[i]) ? NaN : sma - (stdDevMultiplier * stdDevValues[i])
  );
  
  // Apply offset if specified
  const offsetBasis = applyOffset(smaValues, offset);
  const offsetUpper = applyOffset(upperValues, offset);
  const offsetLower = applyOffset(lowerValues, offset);
  
  // Create result array
  const results: BollingerBandsResult[] = data.map((candle, i) => ({
    timestamp: candle.timestamp,
    basis: offsetBasis[i] || NaN,
    upper: offsetUpper[i] || NaN,
    lower: offsetLower[i] || NaN,
  }));
  
  return results;
}

/**
 * Get default Bollinger Bands options
 * @returns Default options object
 */
export function getDefaultBollingerBandsOptions(): BollingerBandsOptions {
  return {
    length: 20,
    source: 'close',
    stdDevMultiplier: 2,
    offset: 0,
    maType: 'SMA',
  };
}