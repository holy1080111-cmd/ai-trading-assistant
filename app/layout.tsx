import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
 title:"AI Market Mentor｜AI 輔助看盤系統",
 description:"真實行情、技術指標、AI 解說、交易日誌與風險管理。",
 manifest:"/manifest.webmanifest"
};
export const viewport: Viewport = { themeColor:"#060a12", width:"device-width", initialScale:1 };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="zh-Hant"><body><AppShell>{children}</AppShell></body></html>
}
