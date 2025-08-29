'use client';

import React, { useState } from 'react';
import { BollingerBandsSettings } from '@/lib/types';

interface BollingerSettingsProps {
  settings: BollingerBandsSettings;
  onSettingsChange: (settings: BollingerBandsSettings) => void;
  onClose: () => void;
}

const BollingerSettings: React.FC<BollingerSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inputs' | 'style'>('inputs');

  const handleInputChange = (key: keyof typeof settings.inputs, value: string | number) => {
    const newSettings = {
      ...settings,
      inputs: {
        ...settings.inputs,
        [key]: value,
      },
    };
    onSettingsChange(newSettings);
  };

  const handleStyleChange = (
    section: keyof typeof settings.style,
    key: string,
    value: string | number | boolean
  ) => {
    const newSettings = {
      ...settings,
      style: {
        ...settings.style,
        [section]: {
          ...settings.style[section],
          [key]: value,
        },
      },
    };
    onSettingsChange(newSettings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bollinger Bands Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'inputs'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'style'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Style
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'inputs' && (
            <div className="space-y-4">
              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={settings.inputs.length}
                  onChange={(e) => handleInputChange('length', parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <select
                  value={settings.inputs.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="close">Close</option>
                  <option value="open">Open</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* MA Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  MA Type
                </label>
                <select
                  value={settings.inputs.maType}
                  onChange={(e) => handleInputChange('maType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="SMA">SMA</option>
                </select>
              </div>

              {/* StdDev Multiplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  StdDev (multiplier)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={settings.inputs.stdDevMultiplier}
                  onChange={(e) => handleInputChange('stdDevMultiplier', parseFloat(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Offset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Offset
                </label>
                <input
                  type="number"
                  min="-100"
                  max="100"
                  value={settings.inputs.offset}
                  onChange={(e) => handleInputChange('offset', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Basis (Middle Band) */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Basis (Middle Band)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.basis.visible}
                      onChange={(e) => handleStyleChange('basis', 'visible', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Visible</label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Color</label>
                    <input
                      type="color"
                      value={settings.style.basis.color}
                      onChange={(e) => handleStyleChange('basis', 'color', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Line Width</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={settings.style.basis.lineWidth}
                      onChange={(e) => handleStyleChange('basis', 'lineWidth', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Line Style</label>
                    <select
                      value={settings.style.basis.lineStyle}
                      onChange={(e) => handleStyleChange('basis', 'lineStyle', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upper Band */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Upper Band
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.upper.visible}
                      onChange={(e) => handleStyleChange('upper', 'visible', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Visible</label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Color</label>
                    <input
                      type="color"
                      value={settings.style.upper.color}
                      onChange={(e) => handleStyleChange('upper', 'color', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Line Width</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={settings.style.upper.lineWidth}
                      onChange={(e) => handleStyleChange('upper', 'lineWidth', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Line Style</label>
                    <select
                      value={settings.style.upper.lineStyle}
                      onChange={(e) => handleStyleChange('upper', 'lineStyle', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lower Band */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Lower Band
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.lower.visible}
                      onChange={(e) => handleStyleChange('lower', 'visible', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Visible</label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Color</label>
                    <input
                      type="color"
                      value={settings.style.lower.color}
                      onChange={(e) => handleStyleChange('lower', 'color', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Line Width</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={settings.style.lower.lineWidth}
                      onChange={(e) => handleStyleChange('lower', 'lineWidth', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Line Style</label>
                    <select
                      value={settings.style.lower.lineStyle}
                      onChange={(e) => handleStyleChange('lower', 'lineStyle', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Background Fill */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Background Fill
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.fill.visible}
                      onChange={(e) => handleStyleChange('fill', 'visible', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Visible</label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Opacity ({Math.round(settings.style.fill.opacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.style.fill.opacity}
                      onChange={(e) => handleStyleChange('fill', 'opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BollingerSettings;