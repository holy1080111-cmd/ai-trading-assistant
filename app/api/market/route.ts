import { NextRequest, NextResponse } from "next/server";
import { atr, ema, macd, rsi } from "@/lib/indicators";
import type { MarketSnapshot, Ticker } from "@/types/market";

const symbols: Record<Ticker, string> = {
  BTC: "BTCUSDT", ETH: "ETHUSDT", SOL: "SOLUSDT", XRP: "XRPUSDT"
};

export const revalidate = 30;

export async function GET(req: NextRequest) {
  try {
    const ticker = (req.nextUrl.searchParams.get("ticker") || "BTC").toUpperCase() as Ticker;
    const interval = req.nextUrl.searchParams.get("interval") || "1h";
    const symbol = symbols[ticker];
    if (!symbol) return NextResponse.json({ error: "不支援的幣種" }, { status: 400 });

    const [tickerRes, candleRes] = await Promise.all([
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { next: { revalidate: 20 } }),
      fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=120`, { next: { revalidate: 30 } })
    ]);
    if (!tickerRes.ok || !candleRes.ok) throw new Error("Binance API 暫時無法使用");

    const t = await tickerRes.json();
    const raw = await candleRes.json();
    const candles = raw.map((c: unknown[]) => ({
      time: Number(c[0]), open: Number(c[1]), high: Number(c[2]),
      low: Number(c[3]), close: Number(c[4]), volume: Number(c[5])
    }));
    const closes = candles.map((c: {close:number}) => c.close);
    const highs = candles.slice(-24).map((c: {high:number}) => c.high);
    const lows = candles.slice(-24).map((c: {low:number}) => c.low);
    const macdResult = macd(closes);
    const e20 = ema(closes, 20), e50 = ema(closes, 50);
    const price = Number(t.lastPrice);

    const snapshot: MarketSnapshot = {
      ticker, symbol, price,
      change24h: Number(t.priceChangePercent),
      high24h: Number(t.highPrice), low24h: Number(t.lowPrice),
      volume24h: Number(t.quoteVolume), updatedAt: new Date().toISOString(),
      indicators: {
        rsi14: rsi(closes), ema20: e20, ema50: e50,
        macd: macdResult.line, macdSignal: macdResult.signal,
        atr14: atr(candles),
        trend: price > e20 && e20 > e50 ? "bullish" : price < e20 && e20 < e50 ? "bearish" : "neutral"
      },
      levels: { support: Math.min(...lows), resistance: Math.max(...highs) },
      candles
    };
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "市場資料錯誤" }, { status: 502 });
  }
}
