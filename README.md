# AI Market Mentor — 完整 MVP

這是可直接部署的完整第一版產品，不只是 UI 原型。

## 已完成
- Next.js 16 App Router、React 19、TypeScript、Tailwind CSS 4
- Binance 真實 24H 行情與 120 根 K 線
- RSI、EMA20、EMA50、MACD、ATR、支撐與壓力
- OpenAI Responses API 分析；沒有金鑰時自動使用本機規則分析
- TradingView 即時圖表
- 新聞 API 模組與無金鑰 fallback
- 自選清單、交易日誌（localStorage）
- Supabase 資料表與 RLS SQL
- 響應式手機版、錯誤處理、載入狀態、PWA manifest
- Vercel 可直接部署

## 安裝
需要 Node.js 20.9+。

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

## 環境變數
複製 `.env.example` 為 `.env.local`。

```bash
OPENAI_API_KEY=你的金鑰
OPENAI_MODEL=gpt-5-mini
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEWS_API_KEY=
```

只有 `OPENAI_API_KEY` 會讓 AI 從本機規則模式切換成 OpenAI。所有秘密金鑰只能放 Vercel Environment Variables，禁止提交到 GitHub。

## GitHub 上傳
請用此專案的全部內容完整取代舊版。GitHub 網頁上傳不會上傳空資料夾，但本專案沒有依賴空資料夾。

## Vercel
1. 使用 GitHub 登入 Vercel
2. Import `holy1080111-cmd/ai-trading-assistant`
3. Framework 選 Next.js
4. 加入環境變數
5. Deploy

## Supabase
建立專案後，在 SQL Editor 執行 `supabase.sql`。目前 UI 預設使用 localStorage；資料庫結構已準備好，正式會員登入可在下一個迭代接上。

## 重要限制
- Binance API 在部分地區可能無法連線；可改成其他交易所 API。
- OpenAI、新��� API 與 Supabase 需自行申請帳號與金鑰。
- AI 分析不構成投資建議，不能視為保證獲利或自動交易訊號。
