export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBandsOptions {
  length: number;
  source: 'close' | 'open' | 'high' | 'low';
  stdDevMultiplier: number;
  offset: number;
  maType: 'SMA';
}

export interface BollingerBandsResult {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}

export interface BollingerBandsStyle {
  basis: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  upper: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  lower: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  fill: {
    visible: boolean;
    opacity: number;
  };
}

export interface BollingerBandsSettings {
  inputs: BollingerBandsOptions;
  style: BollingerBandsStyle;
}

// KLineCharts data format
export interface KLineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorData {
  timestamp: number;
  [key: string]: number;
}