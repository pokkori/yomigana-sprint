import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "読み仮名スプリント",
    short_name: "読み仮名",
    description: "難読漢字・地名・人名 全3,000問。ゲーム感覚で楽しく漢字の読み方を練習できる道場アプリ。",
    start_url: "/",
    display: "standalone",
    background_color: "#1c1917",
    theme_color: "#dc2626",
    orientation: "portrait",
    icons: [
      { src: "/mascot.png", sizes: "192x192", type: "image/png" },
      { src: "/og.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
