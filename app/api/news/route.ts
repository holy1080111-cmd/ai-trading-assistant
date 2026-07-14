import { NextResponse } from "next/server";

const fallback = [
  { title: "市場焦點：大型幣種波動與資金輪動", source: "Market Mentor", sentiment: "中性", summary: "觀察 BTC 主導率、成交量與風險資產同步性，避免只依單一新聞追價。" },
  { title: "風險提醒：高槓桿環境下的清算波動", source: "Market Mentor", sentiment: "偏空", summary: "急漲急跌時清算可能放大波動，交易前應先設定失效條件與最大虧損。" },
  { title: "學習重點：新聞必須搭配價格結構", source: "Market Mentor", sentiment: "中性", summary: "利多不一定上漲、利空不一定下跌；價格對消息的反應通常比消息本身更重要。" }
];

export async function GET() {
  if (!process.env.NEWS_API_KEY) return NextResponse.json(fallback);
  try {
    const url = `https://newsapi.org/v2/everything?q=bitcoin%20OR%20ethereum%20OR%20crypto&language=en&sortBy=publishedAt&pageSize=6&apiKey=${process.env.NEWS_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return NextResponse.json(data.articles.map((a: any) => ({
      title: a.title, source: a.source?.name || "News", sentiment: "待分析",
      summary: a.description || "點擊原始新聞閱讀完整內容。", url: a.url
    })));
  } catch {
    return NextResponse.json(fallback);
  }
}
