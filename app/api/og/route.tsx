import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get("score") ?? "0";
  const total = searchParams.get("total") ?? "10";
  const level = searchParams.get("level") ?? "";

  const correctNum = parseInt(score, 10);
  const totalNum = parseInt(total, 10);
  const accuracy = totalNum > 0 ? Math.round((correctNum / totalNum) * 100) : 0;

  const rankLabel =
    accuracy >= 90 ? "漢字マスター" :
    accuracy >= 70 ? "漢字上級者" :
    accuracy >= 50 ? "漢字中級者" :
    "漢字修行中";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #7f1d1d 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 背景装飾 */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        {/* タイトル */}
        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "32px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            marginBottom: "8px",
          }}
        >
          難読漢字クイズ
        </p>
        <p
          style={{
            color: "#ffffff",
            fontSize: "64px",
            fontWeight: "900",
            letterSpacing: "0.05em",
            marginBottom: "40px",
          }}
        >
          読み仮名スプリント
        </p>

        {/* スコアカード */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "24px",
            padding: "32px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "28px",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            {level ? `レベル ${level} ` : ""}挑戦結果
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: "100px",
              fontWeight: "900",
              lineHeight: "1",
              marginBottom: "8px",
            }}
          >
            {score}
            <span style={{ fontSize: "48px", fontWeight: "700" }}>
              /{total}問正解
            </span>
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "36px",
              fontWeight: "700",
            }}
          >
            正解率 {accuracy}% — {rankLabel}
          </p>
        </div>

        {/* フッター */}
        <p
          style={{
            position: "absolute",
            bottom: "28px",
            right: "48px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "22px",
          }}
        >
          yomigana-sprint.vercel.app
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
