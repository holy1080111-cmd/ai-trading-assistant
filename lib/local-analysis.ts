import type { AnalysisResult, MarketSnapshot } from "@/types/market";

export function buildLocalAnalysis(m: MarketSnapshot): AnalysisResult {
  const { rsi14, ema20, ema50, macd, macdSignal, trend } = m.indicators;
  let score = 50;
  if (trend === "bullish") score += 14;
  if (trend === "bearish") score -= 14;
  if (m.price > ema20) score += 7; else score -= 7;
  if (ema20 > ema50) score += 8; else score -= 8;
  if (macd > macdSignal) score += 7; else score -= 7;
  if (rsi14 > 70) score -= 6;
  if (rsi14 < 30) score += 6;
  score = Math.max(5, Math.min(95, Math.round(score)));

  const bias = score >= 62 ? "偏多" : score <= 38 ? "偏空" : "中性";
  const distToResistance = ((m.levels.resistance - m.price) / m.price) * 100;
  const risk = Math.abs(m.change24h) > 7 || rsi14 > 76 || rsi14 < 24 ? "高" : Math.abs(m.change24h) > 4 ? "中" : "低";

  return {
    score,
    bias,
    risk,
    summary: `${m.ticker} 目前${bias}。趨勢為${trend === "bullish" ? "多頭" : trend === "bearish" ? "空頭" : "整理"}，RSI 為 ${rsi14.toFixed(1)}，價格距離壓力約 ${Math.max(0, distToResistance).toFixed(2)}%。`,
    structure: `EMA20 ${ema20 > ema50 ? "位於 EMA50 上方" : "位於 EMA50 下方"}，目前支撐約 ${m.levels.support.toLocaleString()}，壓力約 ${m.levels.resistance.toLocaleString()}。`,
    momentum: `MACD ${macd > macdSignal ? "高於訊號線，動能偏強" : "低於訊號線，動能偏弱"}；RSI 尚${rsi14 > 70 ? "偏熱，避免追價" : rsi14 < 30 ? "偏低，留意反彈" : "未進入極端區" }。`,
    entryPlan: bias === "偏多" ? "等待回踩支撐或 EMA20 附近，出現止跌 K 線與成交量承接後再評估。" : bias === "偏空" ? "等待反彈至壓力區，確認無法突破後再評估空方機會。" : "等待突破壓力或跌破支撐後回測確認，避免在區間中央進場。",
    invalidation: bias === "偏多" ? `跌破 ${m.levels.support.toLocaleString()} 且無法重新站回。` : bias === "偏空" ? `突破 ${m.levels.resistance.toLocaleString()} 且回踩守住。` : "區間方向尚未確認，任一側假突破都應視為失效。",
    riskPlan: `單筆預計虧損不超過總資金 1%，風險報酬至少 1:2；目前風險等級：${risk}。`,
    generatedBy: "local",
  };
}
