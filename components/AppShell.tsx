"use client";
import Link from "next/link";
import { BarChart3, BookOpen, Menu, Newspaper, Star, X } from "lucide-react";
import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open,setOpen] = useState(false);
  const links = [
    ["/dashboard","分析中心",BarChart3],["/watchlist","自選清單",Star],
    ["/journal","交易日誌",BookOpen],["/#news","市場新聞",Newspaper]
  ] as const;
  return <div>
    <header className="sticky top-3 z-50 mx-auto mt-3 flex w-[calc(100%-1rem)] max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#08101d]/85 px-4 py-3 backdrop-blur-2xl">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-indigo-400 font-black text-slate-950">AI</span>
        <span><b className="block text-sm">MARKET MENTOR</b><small className="text-slate-500">AI 輔助看盤</small></span>
      </Link>
      <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
        {links.map(([href,label])=><Link key={href} href={href} className="hover:text-white">{label}</Link>)}
      </nav>
      <button className="md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </header>
    {open && <nav className="fixed left-3 right-3 top-20 z-40 grid rounded-2xl border border-white/10 bg-[#0a111e] p-3 md:hidden">
      {links.map(([href,label,Icon])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5"><Icon size={18}/>{label}</Link>)}
    </nav>}
    {children}
  </div>
}
