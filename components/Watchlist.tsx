"use client";
import { useEffect,useState } from "react";
import { Star,Trash2 } from "lucide-react";
const all=["BTC","ETH","SOL","XRP","BNB","DOGE","ADA","AVAX"];
export default function Watchlist(){
 const [list,setList]=useState<string[]>([]);
 useEffect(()=>setList(JSON.parse(localStorage.getItem("amm-watchlist")||'["BTC","ETH"]')),[]);
 function toggle(t:string){const n=list.includes(t)?list.filter(x=>x!==t):[...list,t];setList(n);localStorage.setItem("amm-watchlist",JSON.stringify(n))}
 return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><p className="eyebrow">WATCHLIST</p><h1 className="mt-3 text-4xl font-black">自選清單</h1>
 <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{all.map(t=><button key={t} onClick={()=>toggle(t)} className={`glass-card flex items-center justify-between p-5 text-left ${list.includes(t)?"border-emerald-300/40":""}`}><div><small className="text-slate-500">USDT 市場</small><b className="mt-1 block text-xl">{t}</b></div>{list.includes(t)?<Trash2 className="text-rose-300"/>:<Star className="text-slate-600"/>}</button>)}</div>
 <p className="mt-6 text-sm text-slate-500">目前儲存在此瀏覽器；設定 Supabase 後可改為跨裝置同步。</p></main>
}
