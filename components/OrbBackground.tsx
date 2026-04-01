"use client";
import React from "react";

const orbs = [
  { size: 320, left: 10, top: 5, color: "rgba(123,47,190,0.15)", duration: 8, delay: 0, blur: 80 },
  { size: 240, left: 75, top: 10, color: "rgba(0,245,255,0.08)", duration: 11, delay: 1.5, blur: 70 },
  { size: 280, left: 40, top: 60, color: "rgba(255,217,61,0.10)", duration: 9, delay: 0.8, blur: 90 },
  { size: 200, left: 85, top: 55, color: "rgba(123,47,190,0.12)", duration: 7, delay: 2.2, blur: 60 },
  { size: 360, left: 5, top: 70, color: "rgba(255,0,110,0.06)", duration: 12, delay: 0.3, blur: 100 },
  { size: 180, left: 55, top: 20, color: "rgba(0,245,255,0.07)", duration: 6, delay: 1.0, blur: 65 },
  { size: 260, left: 30, top: 40, color: "rgba(255,217,61,0.08)", duration: 10, delay: 3.0, blur: 85 },
  { size: 220, left: 65, top: 80, color: "rgba(123,47,190,0.10)", duration: 8, delay: 0.6, blur: 75 },
  { size: 300, left: 90, top: 30, color: "rgba(255,0,110,0.05)", duration: 13, delay: 1.8, blur: 95 },
  { size: 160, left: 20, top: 85, color: "rgba(0,245,255,0.09)", duration: 5, delay: 2.5, blur: 60 },
  { size: 340, left: 50, top: 5, color: "rgba(255,0,110,0.07)", duration: 11, delay: 0.4, blur: 88 },
  { size: 190, left: 15, top: 45, color: "rgba(255,217,61,0.09)", duration: 7, delay: 1.2, blur: 70 },
];

const OrbBackground = React.memo(function OrbBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1);      opacity: 0.6; }
          25%  { transform: translate(18px, -24px) scale(1.08); opacity: 0.9; }
          50%  { transform: translate(-12px, -40px) scale(0.94); opacity: 0.7; }
          75%  { transform: translate(24px, -16px) scale(1.04); opacity: 0.85; }
          100% { transform: translate(0, 0) scale(1);      opacity: 0.6; }
        }
      `}</style>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            animation: `orbFloat ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            willChange: "transform, opacity",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
});

export default OrbBackground;
