"use client";
import React from "react";

// 8方向パーティクル爆発（正解時）
// CSS アニメーションのみ、JSループなし

const PARTICLES = [
  { angle: 0,   color: "#FFD93D", delay: 0 },
  { angle: 45,  color: "#00F5FF", delay: 0.04 },
  { angle: 90,  color: "#7B2FBE", delay: 0.08 },
  { angle: 135, color: "#FFD93D", delay: 0.04 },
  { angle: 180, color: "#00F5FF", delay: 0 },
  { angle: 225, color: "#7B2FBE", delay: 0.04 },
  { angle: 270, color: "#FFD93D", delay: 0.08 },
  { angle: 315, color: "#00F5FF", delay: 0.04 },
];

interface CorrectBurstProps {
  active: boolean;
}

export default function CorrectBurst({ active }: CorrectBurstProps) {
  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes burstParticle {
          0%   { transform: translate(var(--bx0), var(--by0)) scale(1);   opacity: 1; }
          70%  { opacity: 0.8; }
          100% { transform: translate(var(--bx1), var(--by1)) scale(0.3); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          zIndex: 10,
        }}
        aria-hidden="true"
      >
        {PARTICLES.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * 48;
          const dy = Math.sin(rad) * 48;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: p.color,
                boxShadow: `0 0 6px ${p.color}`,
                // CSS カスタムプロパティで始点・終点を渡す
                ["--bx0" as string]: "0px",
                ["--by0" as string]: "0px",
                ["--bx1" as string]: `${dx}px`,
                ["--by1" as string]: `${dy}px`,
                animation: `burstParticle 0.8s ease-out ${p.delay}s forwards`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
