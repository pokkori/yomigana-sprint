import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "読み仮名スプリント | 小学生漢字の読み方をゲームで楽しく練習";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #450a0a 0%, #b91c1c 50%, #7f1d1d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>📖</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#fca5a5", marginBottom: 16, textAlign: "center" }}>
          読み仮名スプリント
        </div>
        <div style={{ fontSize: 28, color: "#fee2e2", textAlign: "center", maxWidth: 900 }}>
          ゲームで楽しく漢字の読み方を練習しよう！
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {["小学1〜6年生対応", "スピード練習", "無料プレイ"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(252,165,165,0.15)",
                border: "1px solid rgba(252,165,165,0.5)",
                borderRadius: 24,
                fontSize: 18,
                color: "#fca5a5",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "12px 36px",
            background: "#dc2626",
            borderRadius: 40,
            fontSize: 22,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          今すぐ無料で練習する
        </div>
      </div>
    ),
    { ...size }
  );
}
