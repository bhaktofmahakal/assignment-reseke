'use client';

import React, { useEffect, useRef, useState } from 'react';
import { init, dispose } from 'klinecharts';
import { OHLCVData, BollingerBandsSettings, BollingerBandsResult, KLineData } from '@/lib/types';
import { computeBollingerBands } from '@/lib/indicators/bollinger';

interface ChartProps {
  data: OHLCVData[];
  bollingerSettings: BollingerBandsSettings;
  showBollinger: boolean;
}

const Chart: React.FC<ChartProps> = ({ 
  data, 
  bollingerSettings, 
  showBollinger
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<unknown>(null);
  const [bollingerData, setBollingerData] = useState<BollingerBandsResult[]>([]);

  // Convert OHLCV data to KLineCharts format
  const convertToKLineData = (ohlcvData: OHLCVData[]): KLineData[] => {
    return ohlcvData.map(item => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  };

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    const currentChartRef = chartRef.current;

    try {
      const chart = init(currentChartRef, {
        styles: 'dark'
      });
      
      if (!chart) return;
      
      chartInstanceRef.current = chart;

      // Set up crosshair event listener if available
      // Note: KLineCharts v10 API may have different event subscription methods
      // This will be implemented once the correct API is confirmed

    } catch (error) {
      console.error('Error initializing chart:', error);
    }

    return () => {
      if (chartInstanceRef.current && currentChartRef) {
        try {
          dispose(currentChartRef);
        } catch (error) {
          console.error('Error disposing chart:', error);
        }
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!chartInstanceRef.current || !data.length) return;

    try {
      const klineData = convertToKLineData(data);
      
      // Use the correct method name for KLineCharts v10
      const chart = chartInstanceRef.current as Record<string, unknown>;
      if (typeof chart.applyNewData === 'function') {
        (chart.applyNewData as (data: KLineData[]) => void)(klineData);
      } else if (typeof chart.setData === 'function') {
        (chart.setData as (data: KLineData[]) => void)(klineData);
      }
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  }, [data]);

  // Calculate Bollinger Bands
  useEffect(() => {
    if (!data.length) return;

    try {
      const newBollingerData = computeBollingerBands(data, bollingerSettings.inputs);
      setBollingerData(newBollingerData);
    } catch (error) {
      console.error('Error calculating Bollinger Bands:', error);
    }
  }, [data, bollingerSettings.inputs]);

  // Update Bollinger Bands indicator
  useEffect(() => {
    if (!chartInstanceRef.current || !bollingerData.length) return;

    try {
      const chart = chartInstanceRef.current as Record<string, unknown>;

      // Remove existing Bollinger Bands indicator if it exists
      if (typeof chart.removeIndicator === 'function') {
        (chart.removeIndicator as (id: string) => void)('bollinger_bands');
      }

      if (!showBollinger) return;

      // Create custom Bollinger Bands indicator data
      const indicatorData = bollingerData.map((item) => {
        const result: Record<string, unknown> = { timestamp: item.timestamp };
        
        if (bollingerSettings.style.upper.visible && !isNaN(item.upper)) {
          result.upper = item.upper;
        }
        
        if (bollingerSettings.style.basis.visible && !isNaN(item.basis)) {
          result.basis = item.basis;
        }
        
        if (bollingerSettings.style.lower.visible && !isNaN(item.lower)) {
          result.lower = item.lower;
        }
        
        return result;
      });

      // Try to create indicator using available methods
      if (typeof chart.createIndicator === 'function') {
        const bollingerIndicator = {
          name: 'bollinger_bands',
          shortName: 'BB',
          calcParams: [],
          plots: [
            {
              key: 'upper',
              title: 'Upper',
              type: 'line',
              color: bollingerSettings.style.upper.color,
              isStroke: bollingerSettings.style.upper.visible,
              lineWidth: bollingerSettings.style.upper.lineWidth
            },
            {
              key: 'basis',
              title: 'Basis',
              type: 'line',
              color: bollingerSettings.style.basis.color,
              isStroke: bollingerSettings.style.basis.visible,
              lineWidth: bollingerSettings.style.basis.lineWidth
            },
            {
              key: 'lower',
              title: 'Lower',
              type: 'line',
              color: bollingerSettings.style.lower.color,
              isStroke: bollingerSettings.style.lower.visible,
              lineWidth: bollingerSettings.style.lower.lineWidth
            }
          ],
          calc: () => indicatorData
        };

        (chart.createIndicator as (indicator: unknown, paneId: boolean, options: Record<string, unknown>) => void)(
          bollingerIndicator, 
          false, 
          { id: 'bollinger_bands' }
        );
      }

    } catch (error) {
      console.error('Error updating Bollinger Bands indicator:', error);
    }
  }, [bollingerData, bollingerSettings, showBollinger]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full bg-gray-900"
      style={{ minHeight: '500px' }}
    />
  );
};

export default Chart;