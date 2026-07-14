import Link from "next/link";
import { ArrowRight, BrainCircuit, ChartCandlestick, ShieldCheck } from "lucide-react";
import NewsSection from "@/components/NewsSection";
export default function Home(){
 return <main>
  <section className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
   <div><p className="eyebrow">AI MARKET INTELLIGENCE</p><h1 className="mt-5 text-5xl font-black leading-[1.08] tracking-[-.05em] sm:text-7xl">不只告訴你漲跌，<span className="block gradient-text">還教你怎麼判斷。</span></h1>
   <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">整合真實行情、技術指標、可解釋 AI 分析與交易日誌，幫助你建立自己的市場判斷流程。</p>
   <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/dashboard" className="primary">開始分析 <ArrowRight size={18}/></Link><Link href="/journal" className="secondary">建立交易日誌</Link></div></div>
   <div className="glass-card p-7"><div className="grid gap-4 sm:grid-cols-2">
    {[["真實行情",ChartCandlestick,"Binance 市場資料與多週期 K 線"],["AI 解說",BrainCircuit,"OpenAI 或本機規則分析"],["風險優先",ShieldCheck,"失效條件、倉位與風險報酬"],["學習系統",ArrowRight,"不只給方向，也說明判斷原因"]].map(([t,I,c]:any)=><div key={t} className="rounded-xl bg-white/[.035] p-5"><I className="text-emerald-300"/><h3 className="mt-5 font-black">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{c}</p></div>)}
   </div></div>
  </section>
  <NewsSection/>
 </main>
}
