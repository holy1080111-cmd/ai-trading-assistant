"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, BrainCircuit, Gauge, LoaderCircle, RefreshCw, ShieldCheck, Target, TrendingUp } from "lucide-react";
import TradingViewChart from "./TradingViewChart";
import type { AnalysisResult, MarketSnapshot, Ticker } from "@/types/market";

const tickers: Ticker[] = ["BTC","ETH","SOL","XRP"];
const intervals = ["15m","1h","4h","1d"];

const fmt = (n:number) => new Intl.NumberFormat("en-US",{maximumFractionDigits:n<10?4:2}).format(n);

export default function Dashboard() {
  const [ticker,setTicker]=useState<Ticker>("BTC");
  const [interval,setInterval]=useState("1h");
  const [market,setMarket]=useState<MarketSnapshot|null>(null);
  const [analysis,setAnalysis]=useState<AnalysisResult|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  async function load(){
    setLoading(true); setError(""); setAnalysis(null);
    try{
      const mres=await fetch(`/api/market?ticker=${ticker}&interval=${interval}`,{cache:"no-store"});
      if(!mres.ok) throw new Error((await mres.json()).error||"市場資料讀取失敗");
      const m=await mres.json(); setMarket(m);
      const ares=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({market:m})});
      if(!ares.ok) throw new Error("分析失敗");
      setAnalysis(await ares.json());
    }catch(e){setError(e instanceof Error?e.message:"未知錯誤")}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[ticker,interval]);

  const gauge = analysis?.score ?? 50;
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <section className="mb-8">
      <p className="eyebrow">AI ANALYSIS DASHBOARD</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">市場分析中心</h1>
      <p className="mt-3 text-slate-400">真實 Binance 行情＋技術指標＋可解釋 AI 分析。</p>
    </section>

    <div className="mb-5 flex flex-wrap gap-2">
      {tickers.map(t=><button key={t} onClick={()=>setTicker(t)} className={`pill ${ticker===t?"active":""}`}>{t}/USDT</button>)}
      <span className="mx-1 hidden h-9 w-px bg-white/10 sm:block"/>
      {intervals.map(i=><button key={i} onClick={()=>setInterval(i)} className={`pill ${interval===i?"active":""}`}>{i}</button>)}
      <button onClick={load} className="pill ml-auto flex items-center gap-2"><RefreshCw size={15}/>更新</button>
    </div>

    {error && <div className="mb-5 flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-rose-200"><AlertTriangle/>{error}</div>}
    {loading && <div className="glass-card grid min-h-[420px] place-items-center"><div className="text-center text-slate-400"><LoaderCircle className="mx-auto mb-3 animate-spin"/><p>取得行情並分析中…</p></div></div>}

    {!loading && market && analysis && <>
      <div className="grid gap-5 lg:grid-cols-[1fr_.42fr]">
        <div className="glass-card p-3 sm:p-5"><TradingViewChart symbol={market.symbol}/></div>
        <aside className="glass-card p-6">
          <div className="flex justify-between"><div><p className="text-slate-500">即時價格</p><h2 className="mt-1 text-3xl font-black">${fmt(market.price)}</h2><p className={market.change24h>=0?"text-emerald-300":"text-rose-300"}>{market.change24h>=0?"+":""}{market.change24h.toFixed(2)}%</p></div><Gauge className="text-emerald-300"/></div>
          <div className="mx-auto my-8 grid size-40 place-items-center rounded-full" style={{background:`radial-gradient(circle,#0d1625 58%,transparent 60%),conic-gradient(#6ee7b7 0 ${gauge}%,rgba(255,255,255,.07) ${gauge}% 100%)`}}>
            <div className="text-center"><b className="block text-4xl">{gauge}</b><small className="text-slate-500">AI 評分</small></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="方向" value={analysis.bias}/><Metric label="風險" value={analysis.risk}/>
            <Metric label="RSI" value={market.indicators.rsi14.toFixed(1)}/><Metric label="來源" value={analysis.generatedBy==="openai"?"OpenAI":"本機分析"}/>
          </div>
        </aside>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3"><BrainCircuit className="text-indigo-300"/><h2 className="text-xl font-black">AI 總結</h2></div>
          <p className="mt-5 leading-8 text-slate-300">{analysis.summary}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info icon={TrendingUp} title="市場結構" text={analysis.structure}/>
            <Info icon={Activity} title="動能" text={analysis.momentum}/>
            <Info icon={Target} title="入場計畫" text={analysis.entryPlan}/>
            <Info icon={ShieldCheck} title="失效與風控" text={`${analysis.invalidation} ${analysis.riskPlan}`}/>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-black">技術資料</h2>
          <div className="mt-5 divide-y divide-white/5">
            <Row label="EMA 20" value={fmt(market.indicators.ema20)}/>
            <Row label="EMA 50" value={fmt(market.indicators.ema50)}/>
            <Row label="MACD" value={market.indicators.macd.toFixed(4)}/>
            <Row label="ATR 14" value={fmt(market.indicators.atr14)}/>
            <Row label="支撐" value={`$${fmt(market.levels.support)}`}/>
            <Row label="壓力" value={`$${fmt(market.levels.resistance)}`}/>
            <Row label="24H 成交額" value={`$${new Intl.NumberFormat("en-US",{notation:"compact"}).format(market.volume24h)}`}/>
          </div>
        </div>
      </section>
    </>}
    <p className="mt-6 text-xs leading-6 text-slate-500">分析只供學習，不構成投資建議；市場資料可能延遲，交易前請自行核對。</p>
  </main>
}
function Metric({label,value}:{label:string,value:string}){return <div className="rounded-xl bg-white/[.035] p-3"><small className="text-slate-500">{label}</small><b className="mt-1 block">{value}</b></div>}
function Row({label,value}:{label:string,value:string}){return <div className="flex justify-between py-4"><span className="text-slate-500">{label}</span><b>{value}</b></div>}
function Info({icon:Icon,title,text}:{icon:any,title:string,text:string}){return <div className="rounded-xl border border-white/5 bg-white/[.025] p-4"><Icon className="text-emerald-300" size={20}/><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>}
