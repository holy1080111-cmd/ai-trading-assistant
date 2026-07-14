export type Ticker = "BTC" | "ETH" | "SOL" | "XRP";

export type MarketSnapshot = {
  ticker: Ticker;
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  updatedAt: string;
  indicators: {
    rsi14: number;
    ema20: number;
    ema50: number;
    macd: number;
    macdSignal: number;
    atr14: number;
    trend: "bullish" | "bearish" | "neutral";
  };
  levels: {
    support: number;
    resistance: number;
  };
  candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }>;
};

export type AnalysisResult = {
  score: number;
  bias: "偏多" | "偏空" | "中性";
  risk: "低" | "中" | "高";
  summary: string;
  structure: string;
  momentum: string;
  entryPlan: string;
  invalidation: string;
  riskPlan: string;
  generatedBy: "openai" | "local";
};
