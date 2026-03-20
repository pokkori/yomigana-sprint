import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://yomigana-sprint.vercel.app";
const TITLE = "読み仮名スプリント — 難読漢字クイズ｜茨城・薔薇・山葵を読める？";
const DESC = "難読漢字・地名・人名の読み方を楽しく学べるクイズゲーム。茨城・岐阜など地名から薔薇・山葵などの難読漢字まで全3,000問以上。毎日10問無料・JLPT対応・段位認定付き。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["難読漢字", "読み仮名クイズ", "漢字クイズ", "地名 難読", "難読漢字 問題", "JLPT 漢字", "漢字 読み方", "薔薇 読み方", "茨城 読み方", "山葵 読み方", "難読漢字 練習"],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "読み仮名スプリント",
    type: "website",
    locale: "ja_JP",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "読み仮名スプリント" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "読み仮名スプリント",
      "url": SITE_URL,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "毎日10問無料" },
      "description": DESC,
      "publisher": { "@type": "Organization", "name": "ポッコリラボ" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "難読漢字の練習に使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。茨城・薔薇・山葵・雪崩・土産など日本語の難読漢字・地名・人名を全3,000問以上収録しています。JLPT N5〜N1レベルに対応しており、初心者から上級者まで楽しめます。" } },
        { "@type": "Question", "name": "小学生でも使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。難易度「かんたん（小学1-2年）」から「むずかしい（小学5-6年）」まで選べます。学年別モードで自分のレベルに合った問題に挑戦できます。" } },
        { "@type": "Question", "name": "JLPT対策にも使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。N5〜N1レベルの漢字に対応しており、JLPT対策としてご活用いただけます。プレミアムプランでは全3,000問以上に無制限でアクセスできます。" } },
        { "@type": "Question", "name": "苦手な漢字だけ復習できますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。不正解の漢字は自動的に「苦手リスト」に記録されます。苦手克服タブから過去に間違えた漢字を確認・復習できます。" } },
        { "@type": "Question", "name": "毎日無料で使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。毎日10問は無料でプレイできます。プレミアムプラン（¥480/月）に登録すると全3,000問を無制限でプレイできます。" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
