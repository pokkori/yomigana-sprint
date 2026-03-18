"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const end = Date.now() + 3000;
    const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#a855f7"];
    const frame = () => {
      if (Date.now() > end) return;
      const el = document.createElement("div");
      el.style.cssText = `position:fixed;top:-10px;left:${Math.random()*100}%;width:8px;height:8px;background:${colors[~~(Math.random()*colors.length)]};border-radius:50%;animation:fall 2s ease-in forwards;pointer-events:none;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
      requestAnimationFrame(frame);
    };
    const style = document.createElement("style");
    style.textContent = "@keyframes fall{to{transform:translateY(100vh) rotate(720deg);opacity:0}}";
    document.head.appendChild(style);
    frame();
    // Komoju session verify
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      fetch(`/api/komoju/verify?session_id=${sessionId}`).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md w-full text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold mb-2">プレミアム登録完了！</h1>
      <p className="text-gray-500 mb-8">全3,000問が解放されました</p>
      <div className="bg-white rounded-2xl shadow p-6 mb-6 text-left space-y-3">
        <h2 className="font-bold text-gray-700">解放された機能</h2>
        <p>✓ 全3,000問（地名・人名・難読・JLPT）</p>
        <p>✓ 毎日無制限プレイ</p>
        <p>✓ ランキング機能</p>
      </div>
      <Link href="/game" className="block w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg">
        今すぐ挑戦する →
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
