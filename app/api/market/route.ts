import { NextRequest, NextResponse } from "next/server";
import { atr, ema, macd, rsi } from "@/lib/indicators";
import type { MarketSnapshot, Ticker } from "@/types/market";

const instruments: Record<Ticker, string> = {
  BTC: "BTC-USDT",
  ETH: "ETH-USDT",
  SOL: "SOL-USDT",
  XRP: "XRP-USDT",
};

const bars: Record<string, string> = {
  "15m": "15m",
  "1h": "1H",
  "4h": "4H",
  "1d": "1D",
};

const API_BASES = ["https://www.okx.com", "https://okx.com"];

export const revalidate = 20;

type OkxResponse<T> = {
  code: string;
  msg: string;
  data: T[];
};

type OkxTicker = {
  instId: string;
  last: string;
  open24h: string;
  high24h: string;
  low24h: string;
  volCcy24h: string;
  vol24h: string;
  ts: string;
};

async function fetchOkx<T>(path: string): Promise<OkxResponse<T>> {
  let lastError: unknown;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "AI-Market-Mentor/1.0",
        },
        next: { revalidate: 20 },
      });

      if (!response.ok) {
        throw new Error(`OKX HTTP ${response.status}`);
      }

      const json = (await response.json()) as OkxResponse<T>;

      if (json.code !== "0") {
        throw new Error(json.msg || "OKX API 回傳錯誤");
      }

      return json;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("OKX API 暫時無法使用");
}

export async function GET(req: NextRequest) {
  try {
    const ticker = (
      req.nextUrl.searchParams.get("ticker") || "BTC"
    ).toUpperCase() as Ticker;

    const requestedInterval =
      req.nextUrl.searchParams.get("interval") || "1h";

    const instId = instruments[ticker];
    const bar = bars[requestedInterval];

    if (!instId || !bar) {
      return NextResponse.json(
        { error: "不支援的幣種或週期" },
        { status: 400 },
      );
    }

    const [tickerJson, candleJson] = await Promise.all([
      fetchOkx<OkxTicker>(
        `/api/v5/market/ticker?instId=${encodeURIComponent(instId)}`,
      ),
      fetchOkx<string[]>(
        `/api/v5/market/candles?instId=${encodeURIComponent(
          instId,
        )}&bar=${encodeURIComponent(bar)}&limit=120`,
      ),
    ]);

    const tickerData = tickerJson.data[0];

    if (!tickerData || candleJson.data.length < 30) {
      throw new Error("OKX 行情資料不足");
    }

    const candles = candleJson.data
      .slice()
      .reverse()
      .map((c) => ({
        time: Number(c[0]),
        open: Number(c[1]),
        high: Number(c[2]),
        low: Number(c[3]),
        close: Number(c[4]),
        volume: Number(c[5]),
      }));

    const closes = candles.map((c) => c.close);
    const recentCandles = candles.slice(-24);
    const highs = recentCandles.map((c) => c.high);
    const lows = recentCandles.map((c) => c.low);

    const macdResult = macd(closes);
    const ema20 = ema(closes, 20);
    const ema50 = ema(closes, 50);

    const price = Number(tickerData.last);
    const open24h = Number(tickerData.open24h);
    const change24h =
      open24h > 0 ? ((price - open24h) / open24h) * 100 : 0;

    const snapshot: MarketSnapshot = {
      ticker,
      symbol: instId.replace("-", ""),
      price,
      change24h,
      high24h: Number(tickerData.high24h),
      low24h: Number(tickerData.low24h),
      volume24h: Number(tickerData.volCcy24h),
      updatedAt: new Date(Number(tickerData.ts)).toISOString(),
      indicators: {
        rsi14: rsi(closes),
        ema20,
        ema50,
        macd: macdResult.line,
        macdSignal: macdResult.signal,
        atr14: atr(candles),
        trend:
          price > ema20 && ema20 > ema50
            ? "bullish"
            : price < ema20 && ema20 < ema50
              ? "bearish"
              : "neutral",
      },
      levels: {
        support: Math.min(...lows),
        resistance: Math.max(...highs),
      },
      candles,
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("OKX market route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "OKX 市場資料錯誤",
      },
      { status: 502 },
    );
  }
}
