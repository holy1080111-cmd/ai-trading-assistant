"use client";

import { useEffect, useRef } from "react";

export default function TradingViewChart({
  symbol,
}: {
  symbol: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const inner = document.createElement("div");
    inner.className =
      "tradingview-widget-container__widget h-full";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `OKX:${symbol}`,
      interval: "60",
      timezone: "Asia/Taipei",
      theme: "dark",
      style: "1",
      locale: "zh_TW",
      backgroundColor: "rgba(8,13,23,1)",
      gridColor: "rgba(255,255,255,.05)",
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    ref.current.append(inner, script);
  }, [symbol]);

  return (
    <div
      ref={ref}
      className="tradingview-widget-container h-[460px] overflow-hidden rounded-2xl"
    />
  );
}
