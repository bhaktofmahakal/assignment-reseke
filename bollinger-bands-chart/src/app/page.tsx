'use client';

import React, { useState, useEffect } from 'react';
import Chart from '@/components/Chart';
import BollingerSettings from '@/components/BollingerSettings';
import { OHLCVData, BollingerBandsSettings } from '@/lib/types';
import { getDefaultBollingerBandsOptions } from '@/lib/indicators/bollinger';

export default function Home() {
  const [data, setData] = useState<OHLCVData[]>([]);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bollingerSettings, setBollingerSettings] = useState<BollingerBandsSettings>({
    inputs: getDefaultBollingerBandsOptions(),
    style: {
      basis: {
        visible: true,
        color: '#FF6D00',
        lineWidth: 1,
        lineStyle: 'solid',
      },
      upper: {
        visible: true,
        color: '#2196F3',
        lineWidth: 1,
        lineStyle: 'solid',
      },
      lower: {
        visible: true,
        color: '#2196F3',
        lineWidth: 1,
        lineStyle: 'solid',
      },
      fill: {
        visible: true,
        opacity: 0.1,
      },
    },
  });

  // Load demo data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ohlcv.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleAddIndicator = () => {
    setShowBollinger(true);
    setShowSettings(true);
  };

  const handleRemoveIndicator = () => {
    setShowBollinger(false);
  };

  const handleSettingsChange = (newSettings: BollingerBandsSettings) => {
    setBollingerSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Bollinger Bands Chart</h1>
          <div className="flex items-center space-x-4">
            {!showBollinger ? (
              <button
                onClick={handleAddIndicator}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                Add Bollinger Bands
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleRemoveIndicator}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 p-4">
        <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          {data.length > 0 ? (
            <Chart
              data={data}
              bollingerSettings={bollingerSettings}
              showBollinger={showBollinger}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Data Points:</span>
            <span className="ml-2 font-medium">{data.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Bollinger Bands:</span>
            <span className="ml-2 font-medium">{showBollinger ? 'Active' : 'Inactive'}</span>
          </div>
          <div>
            <span className="text-gray-400">Length:</span>
            <span className="ml-2 font-medium">{bollingerSettings.inputs.length}</span>
          </div>
          <div>
            <span className="text-gray-400">StdDev Multiplier:</span>
            <span className="ml-2 font-medium">{bollingerSettings.inputs.stdDevMultiplier}</span>
          </div>
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <BollingerSettings
          settings={bollingerSettings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
