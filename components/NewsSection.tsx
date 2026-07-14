"use client";
import { useEffect,useState } from "react";
import { Newspaper } from "lucide-react";
type News={title:string;source:string;sentiment:string;summary:string;url?:string};
export default function NewsSection(){
 const [items,setItems]=useState<News[]>([]);
 useEffect(()=>{fetch("/api/news").then(r=>r.json()).then(setItems).catch(()=>{})},[]);
 return <section id="news" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
  <p className="eyebrow">MARKET NEWS</p><h2 className="mt-3 text-3xl font-black">市場焦點</h2>
  <div className="mt-7 grid gap-4 md:grid-cols-3">
   {items.map((n,i)=><article key={i} className="glass-card p-6">
    <div className="flex justify-between"><Newspaper className="text-indigo-300"/><span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-400">{n.sentiment}</span></div>
    <h3 className="mt-7 font-black leading-7">{n.title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{n.summary}</p>
    <p className="mt-5 text-xs text-slate-600">{n.source}</p>
   </article>)}
  </div>
 </section>
}
