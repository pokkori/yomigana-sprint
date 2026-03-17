"use client";
import { useState, useEffect, useCallback } from "react";
import { freeQuestions, type Question } from "@/lib/questions-free";
import { premiumQuestions } from "@/lib/questions-premium";
import PayjpModal from "./PayjpModal";

const FREE_LIMIT = 10;
const STORAGE_KEY = "yomigana_daily";

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

  useEffect(() => { setDailyCount(getDailyCount()); }, []);

  const current = questions[idx];
  const shuffledChoices = useState(() => shuffle(current?.choices ?? []))[0];

  const handleAnswer = useCallback((choice: string) => {
    if (phase !== "playing") return;
    const correct = choice === current.correct;
    setSelected(choice);
    setIsCorrect(correct);
    setPhase("answered");
    if (correct) {
      setScore(s => s + 100 + streak * 10);
      setStreak(s => s + 1);
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
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        {showPaywall && <PayjpModal onClose={() => setShowPaywall(false)} />}
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">本日の無料問題が終了しました</h2>
          <p className="text-gray-500 mb-6">プレミアムで全3,000問に挑戦しよう！</p>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <p className="text-3xl font-bold text-red-600 mb-1">¥480<span className="text-base font-normal text-gray-500">/月</span></p>
            <ul className="text-sm text-gray-600 text-left space-y-2 mt-4">
              <li>✓ 全3,000問（地名・人名・難読・JLPT N1〜N5）</li>
              <li>✓ 毎日無制限でプレイ</li>
              <li>✓ ランキング機能</li>
            </ul>
          </div>
          <button onClick={() => setShowPaywall(true)}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg">
            プレミアムで続ける →
          </button>
          <p className="text-xs text-gray-400 mt-3">明日また10問無料でプレイできます</p>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const total = Math.min(idx + 1, questions.length);
    const shareText = `読み仮名スプリントで${total}問中${score / 100}問正解！スコア${score}点 #読み仮名スプリント\nhttps://yomigana-sprint.vercel.app`;
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-3xl font-bold mb-2">結果発表！</h2>
          <p className="text-5xl font-bold text-red-600 mb-1">{score}<span className="text-xl">点</span></p>
          <p className="text-gray-500 mb-6">{total}問中 正解率 {Math.round(score / total)}%</p>
          <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank"
            className="block w-full bg-black text-white font-bold py-3 rounded-xl mb-3">Xでシェア</a>
          <button onClick={() => { setIdx(0); setScore(0); setStreak(0); setPhase("playing"); }}
            className="w-full border-2 border-red-600 text-red-600 font-bold py-3 rounded-xl">もう一度挑戦</button>
        </div>
      </div>
    );
  }

  const choicesToShow = shuffle(current.choices);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">問題 {idx + 1} / {questions.length}</span>
          <span className="font-bold text-red-600">{score}点</span>
          {streak >= 3 && <span className="text-orange-500 text-sm font-bold">{streak}連続正解！</span>}
        </div>

        {/* 進捗バー */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-red-500 h-2 rounded-full transition-all"
            style={{ width: `${((idx) / questions.length) * 100}%` }} />
        </div>

        {/* 問題 */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">{current.level}</p>
          <p className="text-7xl font-bold mb-3">{current.kanji}</p>
          {current.hint && <p className="text-sm text-gray-400">ヒント: {current.hint}</p>}
        </div>

        {/* 選択肢 */}
        <div className="grid grid-cols-2 gap-3">
          {choicesToShow.map(choice => {
            let cls = "p-4 rounded-xl text-lg font-bold border-2 transition-all ";
            if (phase === "answered") {
              if (choice === current.correct) cls += "bg-green-100 border-green-500 text-green-700";
              else if (choice === selected) cls += "bg-red-100 border-red-500 text-red-700";
              else cls += "bg-gray-50 border-gray-200 text-gray-400";
            } else {
              cls += "bg-white border-gray-200 hover:border-red-400 hover:bg-red-50 active:scale-95 cursor-pointer";
            }
            return (
              <button key={choice} onClick={() => handleAnswer(choice)} disabled={phase === "answered"}
                className={cls}>
                {choice}
              </button>
            );
          })}
        </div>

        {/* 無料残り表示 */}
        {!isPremium && (
          <p className="text-center text-xs text-gray-400 mt-8">
            本日の無料問題: {FREE_LIMIT - dailyCount}問残り
          </p>
        )}
      </div>
    </div>
  );
}
