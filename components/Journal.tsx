"use client";
import { useEffect,useState } from "react";
import { Plus,Trash2 } from "lucide-react";
type Entry={id:string;date:string;ticker:string;direction:string;entry:string;stop:string;result:string;lesson:string};
const empty={ticker:"BTC",direction:"多",entry:"",stop:"",result:"",lesson:""};
export default function Journal(){
 const [entries,setEntries]=useState<Entry[]>([]);
 const [form,setForm]=useState(empty);
 useEffect(()=>{setEntries(JSON.parse(localStorage.getItem("amm-journal")||"[]"))},[]);
 function save(){
  if(!form.entry||!form.lesson)return;
  const next=[{...form,id:crypto.randomUUID(),date:new Date().toLocaleDateString("zh-TW")},...entries];
  setEntries(next);localStorage.setItem("amm-journal",JSON.stringify(next));setForm(empty);
 }
 function remove(id:string){const next=entries.filter(e=>e.id!==id);setEntries(next);localStorage.setItem("amm-journal",JSON.stringify(next))}
 return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  <p className="eyebrow">TRADING JOURNAL</p><h1 className="mt-3 text-4xl font-black">交易日誌</h1><p className="mt-3 text-slate-400">記錄交易理由，而不只是盈虧。</p>
  <section className="glass-card mt-8 p-6"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
   {(["ticker","direction","entry","stop","result","lesson"] as const).map(k=><label key={k} className={k==="lesson"?"lg:col-span-4":""}><small className="text-slate-500">{({ticker:"幣種",direction:"方向",entry:"進場",stop:"停損",result:"結果",lesson:"交易理由與學習"})[k]}</small>
   {k==="lesson"?<textarea value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="field mt-2 min-h-24"/>:<input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="field mt-2"/>}</label>)}
  </div><button onClick={save} className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 font-black text-slate-950"><Plus size={17}/>新增紀錄</button></section>
  <div className="mt-6 grid gap-4">{entries.map(e=><article key={e.id} className="glass-card p-5"><div className="flex justify-between"><div><b>{e.ticker}｜{e.direction}</b><p className="text-xs text-slate-500">{e.date}</p></div><button onClick={()=>remove(e.id)}><Trash2 size={18}/></button></div><p className="mt-4 text-sm text-slate-400">進場 {e.entry}｜停損 {e.stop||"-"}｜結果 {e.result||"-"}</p><p className="mt-3 leading-7">{e.lesson}</p></article>)}</div>
 </main>
}
