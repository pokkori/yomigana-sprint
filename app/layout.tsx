import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

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
  other: { "theme-color": "#0F0F1A" },
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
        { "@type": "Question", "name": "読み仮名スプリントとは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "読み仮名スプリントは、難読漢字・地名・人名の読み仮名をゲーム感覚でマスターできる無料の漢字クイズアプリです。茨城・薔薇・山葵など3,000問以上を収録し、段位制・タイムアタックモード・苦手漢字自動記録など学習を楽しく続けられる機能を備えています。" } },
        { "@type": "Question", "name": "難読漢字の練習に使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。茨城・薔薇・山葵・雪崩・土産など日本語の難読漢字・地名・人名を全3,000問以上収録しています。JLPT N5〜N1レベルに対応しており、初心者から上級者まで楽しめます。" } },
        { "@type": "Question", "name": "小学生でも使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。難易度「かんたん（小学1-2年）」から「むずかしい（小学5-6年）」まで選べます。学年別モードで自分のレベルに合った問題に挑戦できます。登録不要・無料で今すぐ始められます。" } },
        { "@type": "Question", "name": "JLPT対策にも使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。N5〜N1レベルの漢字に対応しており、JLPT対策としてご活用いただけます。プレミアムプランでは全3,000問以上に無制限でアクセスできます。" } },
        { "@type": "Question", "name": "苦手な漢字だけ復習できますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。不正解の漢字は自動的に「苦手リスト」に記録されます。苦手克服タブから過去に間違えた漢字を確認・復習できます。学習レポートページで苦手カテゴリの分析も確認できます。" } },
        { "@type": "Question", "name": "毎日無料で使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。毎日10問は無料でプレイできます。プレミアムプラン（¥480/月）に登録すると全3,000問を無制限でプレイできます。登録不要・クレジットカード不要で今すぐ始められます。" } },
        { "@type": "Question", "name": "スコアや学習記録は保存されますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。ブラウザのローカルストレージにハイスコア・連続学習日数・苦手漢字リスト・過去7日間の学習記録が自動保存されます。学習レポートページで自分の成長を確認できます。" } },
        { "@type": "Question", "name": "読み仮名スプリントの問題数は何問ですか？", "acceptedAnswer": { "@type": "Answer", "text": "常用漢字2,136字に対応した読み問題を収録しています。地名・人名・食材・植物・動物など幅広いカテゴリの難読漢字問題を全3,000問以上揃えており、無料プランでは毎日10問、プレミアムプラン（¥480/月）では無制限でプレイできます。" } },
        { "@type": "Question", "name": "苦手な漢字を重点的に練習できますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。不正解の漢字は自動記録され、「苦手克服」タブから集中練習できます。苦手漢字は何度間違えたかも記録されるので、特に苦手なものを優先的に復習できます。学習レポートページで苦手カテゴリの傾向も分析できます。" } },
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
      <body className={`${notoSansJP.className} bg-[#0F0F1A] text-slate-100 antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
