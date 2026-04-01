"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window { Payjp: (key: string) => { createToken: (el: unknown) => Promise<{ id?: string; error?: unknown }> }; }
}

export default function PayjpModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://js.pay.jp/v2/pay.js";
    document.head.appendChild(s);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payjp = window.Payjp(process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!);
      const el = (e.currentTarget as HTMLFormElement).querySelector("[data-payjp]");
      const { id, error: err } = await payjp.createToken(el);
      if (err || !id) { setError("カード情報が正しくありません"); setLoading(false); return; }
      const res = await fetch("/api/payjp/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: id, plan: "standard" }),
      });
      const data = await res.json();
      if (data.ok) window.location.href = "/success";
      else setError(data.error || "エラーが発生しました");
    } catch { setError("エラーが発生しました"); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative">
        <button onClick={onClose} aria-label="モーダルを閉じる" className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <h2 className="text-xl font-bold mb-1">プレミアムプラン</h2>
        <p className="text-gray-500 text-sm mb-4">¥480/月 — 全3,000問 + JLPT別 + 地名 + 人名</p>
        <form onSubmit={handleSubmit}>
          <div data-payjp data-payjp-card-brand-logos className="border rounded-lg p-3 mb-4 min-h-[48px]" />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
            {loading ? "処理中..." : "¥480/月で始める"}
          </button>
        </form>
      </div>
    </div>
  );
}
