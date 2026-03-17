import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "読み仮名スプリント — 難読漢字クイズ",
  description: "難読漢字・地名・人名の読み方を楽しく学べるクイズゲーム。茨城・岐阜など地名から薔薇・山葵などの難読漢字まで全3000問以上。",
  metadataBase: new URL("https://yomigana-sprint.vercel.app"),
  openGraph: {
    title: "読み仮名スプリント — 難読漢字クイズ",
    description: "難読漢字・地名・人名の読み方クイズ。毎日10問無料！",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
