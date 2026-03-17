"use client";
import { useState, useEffect, useCallback } from "react";
import { freeQuestions, type Question } from "@/lib/questions-free";
import { premiumQuestions } from "@/lib/questions-premium";
import PayjpModal from "./PayjpModal";

const FREE_LIMIT = 10;
const STORAGE_KEY = "yomigana_daily";

// ─── ログインストリーク ─────────────────────────────────────────────────────

function getYomiganaStreakData(): { streak: number; lastDate: string } {
  try {
    return JSON.parse(localStorage.getItem("yomigana_streak") ?? "{}") ?? { streak: 0, lastDate: "" };
  } catch { return { streak: 0, lastDate: "" }; }
}

function updateYomiganaStreak(): { streak: number; isNew: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const data = getYomiganaStreakData();
  if (data.lastDate === today) return { streak: data.streak, isNew: false };
  const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
  localStorage.setItem("yomigana_streak", JSON.stringify({ streak: newStreak, lastDate: today }));
  return { streak: newStreak, isNew: true };
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyCount(): number {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data.date === getTodayKey() ? (data.count ?? 0) : 0;
  } catch { return 0; }
}

function incrementDailyCount() {
  const count = getDailyCount() + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), count }));
  return count;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Phase = "playing" | "answered" | "result" | "paywall";

function getDanLevel(correctCount: number, total: number): { badge: string; rank: string; color: string } {
  const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
  if (accuracy >= 100) return { badge: "👑", rank: "名人", color: "#fbbf24" };
  if (accuracy >= 90) return { badge: "⚔️", rank: "五段", color: "#f97316" };
  if (accuracy >= 70) return { badge: "⚔️", rank: "三段", color: "#ef4444" };
  if (accuracy >= 50) return { badge: "🥋", rank: "初段", color: "#a78bfa" };
  return { badge: "📖", rank: "見習い", color: "#78716c" };
}

export default function YomiganaGame({ isPremium }: { isPremium: boolean }) {
  const allQuestions = isPremium ? shuffle([...freeQuestions, ...premiumQuestions]) : shuffle(freeQuestions);
  const [questions] = useState<Question[]>(allQuestions);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [loginStreak, setLoginStreak] = useState(0);
  const [showLoginStreakBanner, setShowLoginStreakBanner] = useState(false);

  useEffect(() => {
    setDailyCount(getDailyCount());
    // ログインストリーク更新
    const { streak: ls, isNew } = updateYomiganaStreak();
    setLoginStreak(ls);
    if (isNew && ls >= 2) {
      setShowLoginStreakBanner(true);
      setTimeout(() => setShowLoginStreakBanner(false), 3000);
    }
  }, []);

  const current = questions[idx];
  const shuffledChoices = useState(() => shuffle(current?.choices ?? []))[0];

  const handleAnswer = useCallback((choice: string) => {
    if (phase !== "playing") return;
    const correct = choice === current.correct;
    setSelected(choice);
    setIsCorrect(correct);
    setPhase("answered");
    if (correct) {
      const newStreak = streak + 1;
      setScore(s => s + 100 + streak * 10);
      setStreak(newStreak);
      // 3連続以上でフラッシュバナー
      if (newStreak >= 3) {
        setShowStreakBanner(true);
        setTimeout(() => setShowStreakBanner(false), 1500);
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      const newCount = incrementDailyCount();
      setDailyCount(newCount);
      if (!isPremium && newCount >= FREE_LIMIT) {
        setPhase("paywall");
        return;
      }
      if (idx + 1 >= questions.length) {
        setPhase("result");
      } else {
        setIdx(i => i + 1);
        setSelected(null);
        setIsCorrect(null);
        setPhase("playing");
      }
    }, 1000);
  }, [phase, current, streak, idx, questions.length, isPremium]);

  if (phase === "paywall" || showPaywall) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #1c1917, #292524)" }}>
        {showPaywall && <PayjpModal onClose={() => setShowPaywall(false)} />}
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#e7e5e4" }}>本日の無料問題が終了しました</h2>
          <p className="mb-6" style={{ color: "#78716c" }}>プレミアムで全3,000問に挑戦しよう！</p>
          <div className="rounded-2xl p-6 mb-4"
            style={{ background: "rgba(68,64,60,0.5)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <p className="text-3xl font-black mb-1" style={{ color: "#fca5a5" }}>¥480<span className="text-base font-normal" style={{ color: "#78716c" }}>/月</span></p>
            <ul className="text-sm text-left space-y-2 mt-4" style={{ color: "#a8a29e" }}>
              <li>✓ 全3,000問（地名・人名・難読・JLPT N1〜N5）</li>
              <li>✓ 毎日無制限でプレイ</li>
              <li>✓ ランキング機能</li>
            </ul>
          </div>
          <button onClick={() => setShowPaywall(true)}
            className="w-full font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
            🥋 プレミアムで道場を続ける →
          </button>
          <p className="text-xs mt-3" style={{ color: "rgba(120,113,108,0.5)" }}>明日また10問無料でプレイできます</p>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const total = Math.min(idx + 1, questions.length);
    const correctCount = Math.round(score / 100);
    const levelLabel = isPremium ? "プレミアム" : "N5";
    const baseUrl = "https://yomigana-sprint.vercel.app";
    const ogUrl = `${baseUrl}/api/og?score=${correctCount}&total=${total}&level=${encodeURIComponent(levelLabel)}`;
    const accuracy = Math.round((correctCount / total) * 100);
    const danLevel = getDanLevel(correctCount, total);
    const rankLabel = accuracy >= 90 ? "漢字マスター級！" : accuracy >= 70 ? "なかなかやるね！" : "もっと練習だ！";
    const topPercent = accuracy >= 100 ? "上位1%" : accuracy >= 90 ? "上位5%" : accuracy >= 70 ? "上位20%" : accuracy >= 50 ? "上位50%" : "入門者";
    const shareText = `【読み仮名スプリント】${correctCount}/${total}問正解！${topPercent}の漢字力！段位:${danLevel.rank}${danLevel.badge} 茨城・薔薇・山葵…あなたは全部読める？ → ${baseUrl} #難読漢字 #読み仮名 #漢字クイズ`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogUrl)}`;
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #1c1917, #292524)" }}>
        <div className="max-w-md w-full text-center">
          {/* 段位バッジ */}
          <div className="text-7xl mb-2">{danLevel.badge}</div>
          <div className="inline-block px-5 py-2 rounded-full font-black text-xl mb-4"
            style={{ background: "rgba(220,38,38,0.2)", color: danLevel.color, border: `1px solid ${danLevel.color}` }}>
            {danLevel.rank}
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#e7e5e4" }}>結果発表！</h2>
          <p className="text-5xl font-black mb-1" style={{ color: "#fca5a5" }}>{score}<span className="text-xl" style={{ color: "#a8a29e" }}>点</span></p>
          <p className="mb-2" style={{ color: "#78716c" }}>{total}問中 {correctCount}問正解 / 正解率{accuracy}%</p>
          <p className="text-sm font-bold mb-6" style={{ color: danLevel.color }}>{rankLabel}</p>
          <a href={tweetUrl} target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full font-bold px-8 py-3 rounded-2xl text-lg mb-3 transition-all active:scale-95"
            style={{ background: "#000", color: "#fff" }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {danLevel.rank}をXで自慢する {danLevel.badge}
          </a>
          <button onClick={() => { setIdx(0); setScore(0); setStreak(0); setPhase("playing"); setShowStreakBanner(false); }}
            className="w-full font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform shadow-lg"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
            🥋 もう一度挑戦！
          </button>
        </div>
      </div>
    );
  }

  const choicesToShow = shuffle(current.choices);

  return (
    <div className="min-h-screen px-4 py-8 relative"
      style={{ background: "linear-gradient(160deg, #1c1917, #292524)" }}>

      {/* ログインストリークバナー */}
      {showLoginStreakBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3 rounded-2xl font-black text-white text-lg shadow-2xl animate-bounce"
            style={{ background: "linear-gradient(135deg, #dc2626, #fbbf24)", boxShadow: "0 0 30px rgba(220,38,38,0.7)" }}>
            🥋 {loginStreak}日連続道場入門！
          </div>
        </div>
      )}

      {/* 3連続正解フラッシュバナー */}
      {showStreakBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-8 py-3 rounded-2xl font-black text-white text-xl animate-ping"
            style={{
              background: "linear-gradient(135deg, #dc2626, #ef4444)",
              boxShadow: "0 0 40px rgba(220,38,38,0.8)",
            }}>
            🔥 {streak}連続正解！
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm" style={{ color: "#78716c" }}>問題 {idx + 1} / {questions.length}</span>
          <span className="font-black text-lg" style={{ color: "#fca5a5" }}>{score}点</span>
          {streak >= 3 && (
            <span className="text-sm font-black px-2 py-1 rounded-full"
              style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5" }}>
              🔥 {streak}連続
            </span>
          )}
          {streak < 3 && <span className="text-sm" style={{ color: "rgba(120,113,108,0.5)" }}>連続: {streak}</span>}
        </div>
        {/* ログインストリーク表示 */}
        {loginStreak >= 2 && (
          <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full w-fit mx-auto"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <span className="text-sm font-bold" style={{ color: "#fca5a5" }}>🔥 {loginStreak}日連続道場</span>
          </div>
        )}

        {/* 進捗バー */}
        <div className="w-full rounded-full h-2 mb-8" style={{ background: "rgba(68,64,60,0.6)" }}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${((idx) / questions.length) * 100}%`, background: "linear-gradient(90deg, #dc2626, #ef4444)" }} />
        </div>

        {/* 問題 */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: "rgba(220,38,38,0.7)" }}>{current.level}</p>
          <p className="text-7xl font-black mb-3" style={{ color: "#fff", textShadow: "0 0 20px rgba(255,255,255,0.1)" }}>{current.kanji}</p>
          {current.hint && <p className="text-sm" style={{ color: "#78716c" }}>ヒント: {current.hint}</p>}
        </div>

        {/* 選択肢 */}
        <div className="grid grid-cols-2 gap-3">
          {choicesToShow.map(choice => {
            let style: React.CSSProperties = {};
            let cls = "p-4 rounded-xl text-lg font-black border-2 transition-all ";
            if (phase === "answered") {
              if (choice === current.correct) {
                cls += "border-green-500";
                style = { background: "rgba(34,197,94,0.2)", color: "#86efac" };
              } else if (choice === selected) {
                cls += "border-red-500";
                style = { background: "rgba(220,38,38,0.2)", color: "#fca5a5" };
              } else {
                cls += "border-transparent";
                style = { background: "rgba(68,64,60,0.3)", color: "rgba(120,113,108,0.5)" };
              }
            } else {
              cls += "cursor-pointer active:scale-95";
              style = { background: "rgba(68,64,60,0.5)", color: "#e7e5e4", border: "2px solid rgba(120,113,108,0.4)" };
            }
            return (
              <button key={choice} onClick={() => handleAnswer(choice)} disabled={phase === "answered"}
                className={cls} style={style}>
                {choice}
              </button>
            );
          })}
        </div>

        {/* 無料残り表示 */}
        {!isPremium && (
          <p className="text-center text-xs mt-8" style={{ color: "rgba(120,113,108,0.5)" }}>
            本日の無料問題: {FREE_LIMIT - dailyCount}問残り
          </p>
        )}
      </div>
    </div>
  );
}
