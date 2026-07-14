import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { buildLocalAnalysis } from "@/lib/local-analysis";
import type { MarketSnapshot, AnalysisResult } from "@/types/market";

const bodySchema = z.object({ market: z.any() });

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.parse(await req.json());
    const market = parsed.market as MarketSnapshot;
    const fallback = buildLocalAnalysis(market);
    if (!process.env.OPENAI_API_KEY) return NextResponse.json(fallback);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [
        {
          role: "system",
          content: "你是風險優先的加密貨幣市場教學分析助手。不可承諾獲利、不可叫使用者重倉。只輸出 JSON。"
        },
        {
          role: "user",
          content: `依照以下市場資料，以繁體中文輸出 JSON，欄位必須是 score(0-100), bias(偏多/偏空/中性), risk(低/中/高), summary, structure, momentum, entryPlan, invalidation, riskPlan。資料：${JSON.stringify(market)}`
        }
      ],
      text: { format: { type: "json_object" } }
    });
    const text = response.output_text;
    const result = JSON.parse(text) as AnalysisResult;
    return NextResponse.json({ ...result, generatedBy: "openai" });
  } catch {
    try {
      const body = await req.clone().json();
      return NextResponse.json(buildLocalAnalysis(body.market));
    } catch {
      return NextResponse.json({ error: "分析失敗" }, { status: 500 });
    }
  }
}
