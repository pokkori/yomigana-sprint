"use client";
import React, { useState, useEffect } from "react";

export type MascotPose = "idle" | "correct" | "wrong" | "excited";

interface MascotSpriteProps {
  pose?: MascotPose;
  size?: number;
}

export default function MascotSprite({ pose = "idle", size = 80 }: MascotSpriteProps) {
  const [eyeScale, setEyeScale] = useState(1);

  // 目パチ: 4秒おきに150ms間だけ細くする
  useEffect(() => {
    if (pose !== "idle" && pose !== "excited") return;
    const tick = () => {
      setEyeScale(0.1);
      setTimeout(() => setEyeScale(1), 150);
    };
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, [pose]);

  const isWrong = pose === "wrong";
  const isCorrect = pose === "correct";
  const isExcited = pose === "excited";

  // 体のアニメーション CSS クラス名
  const bodyAnim = isCorrect || isExcited
    ? "mascot-bounce"
    : "mascot-breathe";

  const shakeAnim = isWrong ? "mascot-shake" : "";

  return (
    <>
      <style>{`
        @keyframes mascotBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes mascotBounce {
          0%   { transform: scale(1) translateY(0); }
          30%  { transform: scale(1.15) translateY(-10px); }
          60%  { transform: scale(0.95) translateY(4px); }
          80%  { transform: scale(1.05) translateY(-4px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes mascotShake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        .mascot-breathe { animation: mascotBreathe 3s ease-in-out infinite; }
        .mascot-bounce  { animation: mascotBounce 0.6s ease-in-out; }
        .mascot-shake   { animation: mascotShake 0.5s ease-in-out; }
      `}</style>
      <div
        className={`${bodyAnim} ${shakeAnim}`}
        style={{ display: "inline-block", width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* グロー背景 */}
          <defs>
            <radialGradient id={`mascotGlow${pose}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7B2FBE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
            </radialGradient>
            {/* キラキラ目（correct/excited 用） */}
            <radialGradient id="eyeShine" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFD93D" />
              <stop offset="100%" stopColor="#00F5FF" />
            </radialGradient>
          </defs>

          {/* グロー */}
          <ellipse cx="50" cy="55" rx="38" ry="12" fill={`url(#mascotGlow${pose})`} />

          {/* ボディ（丸）*/}
          <circle
            cx="50" cy="50" r="36"
            fill="#2D1B69"
            stroke="#7B2FBE"
            strokeWidth="2.5"
          />
          {/* ボディ内グラデ */}
          <ellipse cx="42" cy="38" rx="14" ry="10"
            fill="rgba(123,47,190,0.25)" />

          {/* 耳 */}
          <ellipse cx="22" cy="30" rx="8" ry="10" fill="#3D2580" stroke="#7B2FBE" strokeWidth="1.5" />
          <ellipse cx="78" cy="30" rx="8" ry="10" fill="#3D2580" stroke="#7B2FBE" strokeWidth="1.5" />
          <ellipse cx="22" cy="30" rx="4" ry="6" fill="#7B2FBE" opacity="0.5" />
          <ellipse cx="78" cy="30" rx="4" ry="6" fill="#7B2FBE" opacity="0.5" />

          {/* 目 */}
          {isCorrect || isExcited ? (
            // キラキラ目
            <>
              <ellipse cx="37" cy="46" rx="7" ry={7 * eyeScale}
                fill="url(#eyeShine)" />
              <ellipse cx="63" cy="46" rx="7" ry={7 * eyeScale}
                fill="url(#eyeShine)" />
              {/* 光点 */}
              <circle cx="39" cy="44" r="2" fill="#fff" opacity="0.9" />
              <circle cx="65" cy="44" r="2" fill="#fff" opacity="0.9" />
            </>
          ) : (
            // 通常目
            <>
              <ellipse cx="37" cy="47" rx="6" ry={6 * eyeScale}
                fill="#ffffff" />
              <ellipse cx="63" cy="47" rx="6" ry={6 * eyeScale}
                fill="#ffffff" />
              {/* 瞳 */}
              <circle cx="38" cy="48" r="3.5" fill="#1a0a40" />
              <circle cx="64" cy="48" r="3.5" fill="#1a0a40" />
              {/* 光点 */}
              <circle cx="39.5" cy="46.5" r="1.2" fill="#fff" />
              <circle cx="65.5" cy="46.5" r="1.2" fill="#fff" />
            </>
          )}

          {/* 口 */}
          {isWrong ? (
            // への字口
            <path d="M 38 62 Q 50 57 62 62" stroke="#fca5a5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : isCorrect || isExcited ? (
            // 大笑い口
            <path d="M 36 60 Q 50 72 64 60" stroke="#FFD93D" strokeWidth="2.5" fill="rgba(255,217,61,0.15)" strokeLinecap="round" />
          ) : (
            // 通常笑顔
            <path d="M 38 60 Q 50 68 62 60" stroke="#00F5FF" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* 頬 (correct/excited) */}
          {(isCorrect || isExcited) && (
            <>
              <ellipse cx="26" cy="58" rx="7" ry="4" fill="rgba(255,0,110,0.25)" />
              <ellipse cx="74" cy="58" rx="7" ry="4" fill="rgba(255,0,110,0.25)" />
            </>
          )}
        </svg>
      </div>
    </>
  );
}
