"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// localStorage キー定義
const GOAL_PROGRESS_KEY = "yomigana_goal_progress";
const WEAK_LIST_KEY = "yomigana_weak_list";
const STREAK_KEY = "yomigana_streak";
const BEST_EASY_KEY = "yomigana_best_easy";
const BEST_NORMAL_KEY = "yomigana_best_normal";
const BEST_HARD_KEY = "yomigana_best_hard";
const TA_BEST_KEY = "yomigana_ta_best";

type WeakItem = { kanji: string; correct: string; level: string; missCount: number };

function getDateRange(daysBack: number): string[] {
  const dates: string[] = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[d.getDay()];
}

export default function ReportPage() {
  const [weekProgress, setWeekProgress] = useState<{ date: string; count: number; label: string }[]>([]);
  const [totalWeek, setTotalWeek] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weakList, setWeakList] = useState<WeakItem[]>([]);
  const [bestScores, setBestScores] = useState({ easy: 0, normal: 0, hard: 0, ta: 0 });
  const [categoryStats, setCategoryStats] = useState<{ level: string; count: number }[]>([]);

  useEffect(() => {
    try {
      // 過去7日間の進捗
      const rawProgress = localStorage.getItem(GOAL_PROGRESS_KEY);
      const progressData = rawProgress ? JSON.parse(rawProgress) : {};
      const last7 = getDateRange(7);
      const progressArr = last7.map(date => ({
        date,
        count: progressData[date] ?? 0,
        label: getDayLabel(date),
      }));
      setWeekProgress(progressArr);
      setTotalWeek(progressArr.reduce((sum, d) => sum + d.count, 0));

      // ストリーク
      const streakData = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
      setStreak(streakData.streak ?? 0);

      // 苦手リスト
      const weakRaw: WeakItem[] = JSON.parse(localStorage.getItem(WEAK_LIST_KEY) ?? "[]");
      setWeakList(weakRaw);

      // カテゴリ別苦手集計
      const levelMap: Record<string, number> = {};
      weakRaw.forEach(w => {
        levelMap[w.level] = (levelMap[w.level] ?? 0) + w.missCount;
      });
      const sorted = Object.entries(levelMap)
        .map(([level, count]) => ({ level, count }))
        .sort((a, b) => b.count - a.count);
      setCategoryStats(sorted);

      // ベストスコア
      setBestScores({
        easy: parseInt(localStorage.getItem(BEST_EASY_KEY) || "0"),
        normal: parseInt(localStorage.getItem(BEST_NORMAL_KEY) || "0"),
        hard: parseInt(localStorage.getItem(BEST_HARD_KEY) || "0"),
        ta: parseInt(localStorage.getItem(TA_BEST_KEY) || "0"),
      });
    } catch { /* noop */ }
  }, []);

  const maxCount = Math.max(...weekProgress.map(d => d.count), 1);

  const levelLabels: Record<string, string> = {
    N5: "N5（基礎）",
    N4: "N4（初級）",
    N3: "N3（中級）",
    N2: "N2（上級）",
    N1: "N1（最上級）",
    地名: "地名漢字",
    人名: "人名漢字",
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1c1917, #292524, #1c1917)" }}>
      {/* ヘッダー */}
      <header className="py-6 px-4 text-center" style={{ borderBottom: "1px solid rgba(220,38,38,0.2)" }}>
        <Link href="/" className="inline-block text-xs font-bold mb-3 px-3 py-1 rounded-full"
          style={{ background: "rgba(220,38,38,0.15)", color: "#fca5a5" }}>
          ← トップに戻る
        </Link>
        <h1 className="text-2xl font-black" style={{ color: "#fff" }}>学習レポート</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(252,165,165,0.6)" }}>あなたの漢字学習の記録</p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* 連続学習・総合サマリー */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <div className="text-3xl font-black" style={{ color: streak > 0 ? "#fbbf24" : "#78716c" }}>
              {streak > 0 ? `🔥${streak}` : "0"}
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(252,165,165,0.7)" }}>連続学習日数</div>
          </div>
          <div className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <div className="text-3xl font-black" style={{ color: "#fca5a5" }}>{totalWeek}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(252,165,165,0.7)" }}>今週の正解数</div>
          </div>
          <div className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <div className="text-3xl font-black" style={{ color: weakList.length > 0 ? "#f97316" : "#22c55e" }}>
              {weakList.length}
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(252,165,165,0.7)" }}>苦手漢字数</div>
          </div>
        </div>

        {/* 過去7日間グラフ */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <h2 className="text-base font-black mb-4" style={{ color: "#fca5a5" }}>過去7日間の学習グラフ</h2>
          <div className="flex items-end gap-1 h-28">
            {weekProgress.map((d) => {
              const heightPct = maxCount > 0 ? Math.max(4, Math.round((d.count / maxCount) * 100)) : 4;
              const isToday = d.date === new Date().toISOString().slice(0, 10);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-bold" style={{ color: "#fca5a5", fontSize: "10px" }}>
                    {d.count > 0 ? d.count : ""}
                  </div>
                  <div className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${heightPct}%`,
                      background: isToday
                        ? "linear-gradient(180deg, #fbbf24, #dc2626)"
                        : d.count > 0
                          ? "linear-gradient(180deg, #dc2626, #991b1b)"
                          : "rgba(68,64,60,0.6)",
                      minHeight: "4px",
                    }} />
                  <div className="text-xs" style={{ color: "rgba(252,165,165,0.6)", fontSize: "10px" }}>{d.label}</div>
                </div>
              );
            })}
          </div>
          {totalWeek === 0 && (
            <p className="text-center text-xs mt-3" style={{ color: "rgba(120,113,108,0.6)" }}>
              まだ記録がありません。ゲームをプレイすると記録が残ります
            </p>
          )}
        </div>

        {/* ベストスコア */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <h2 className="text-base font-black mb-4" style={{ color: "#fca5a5" }}>難易度別ベストスコア</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "🟢 かんたん", value: bestScores.easy, unit: "問" },
              { label: "🟡 ふつう", value: bestScores.normal, unit: "問" },
              { label: "🔴 むずかしい", value: bestScores.hard, unit: "問" },
              { label: "⚡ タイムアタック", value: bestScores.ta, unit: "問/60s" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3 text-center"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <div className="text-xs mb-1" style={{ color: "rgba(252,165,165,0.7)" }}>{item.label}</div>
                <div className="text-2xl font-black" style={{ color: item.value > 0 ? "#fca5a5" : "#78716c" }}>
                  {item.value > 0 ? item.value : "—"}
                </div>
                {item.value > 0 && <div className="text-xs" style={{ color: "rgba(252,165,165,0.5)" }}>{item.unit}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* 苦手カテゴリ分析 */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <h2 className="text-base font-black mb-4" style={{ color: "#fca5a5" }}>苦手カテゴリ分析</h2>
          {categoryStats.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-bold" style={{ color: "#fca5a5" }}>苦手カテゴリなし！</p>
              <p className="text-xs mt-1" style={{ color: "rgba(120,113,108,0.6)" }}>まだプレイ記録がありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryStats.slice(0, 5).map((cat, i) => {
                const maxVal = categoryStats[0].count;
                const pct = Math.round((cat.count / maxVal) * 100);
                return (
                  <div key={cat.level}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold" style={{ color: i === 0 ? "#f97316" : "#e7e5e4" }}>
                        {i === 0 ? "🔴 " : ""}{levelLabels[cat.level] ?? cat.level}
                      </span>
                      <span style={{ color: "rgba(252,165,165,0.7)" }}>ミス{cat.count}回</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(0,0,0,0.3)" }}>
                      <div className="h-2 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: i === 0 ? "linear-gradient(90deg, #f97316, #dc2626)" : "linear-gradient(90deg, #dc2626, #991b1b)",
                        }} />
                    </div>
                  </div>
                );
              })}
              {categoryStats.length > 0 && (
                <p className="text-xs mt-2" style={{ color: "rgba(252,165,165,0.5)" }}>
                  最も苦手: {levelLabels[categoryStats[0].level] ?? categoryStats[0].level} — 集中練習でマスターしよう！
                </p>
              )}
            </div>
          )}
        </div>

        {/* 苦手漢字リスト */}
        {weakList.length > 0 && (
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.2)" }}>
            <h2 className="text-base font-black mb-1" style={{ color: "#fca5a5" }}>苦手漢字リスト（上位10件）</h2>
            <p className="text-xs mb-4" style={{ color: "rgba(252,165,165,0.5)" }}>間違えた回数が多い順</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...weakList].sort((a, b) => b.missCount - a.missCount).slice(0, 10).map((w) => (
                <div key={w.kanji} className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black" style={{ color: "#fff" }}>{w.kanji}</span>
                    <div>
                      <span className="text-sm font-bold" style={{ color: "#fca5a5" }}>{w.correct}</span>
                      <span className="text-xs ml-2" style={{ color: "rgba(120,113,108,0.8)" }}>{w.level}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5" }}>
                    {w.missCount}回ミス
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="space-y-3">
          <Link href="/game"
            className="flex items-center justify-center font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
            🥋 苦手漢字を復習する →
          </Link>
          <Link href="/"
            className="flex items-center justify-center font-black py-3 rounded-2xl text-sm active:scale-95 transition-transform"
            style={{ background: "rgba(68,64,60,0.6)", border: "1px solid rgba(120,113,108,0.4)", color: "#e7e5e4" }}>
            トップページへ
          </Link>
        </div>

        {/* 学習アドバイス */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)" }}>
          <h2 className="text-sm font-black mb-3" style={{ color: "#fca5a5" }}>学習アドバイス</h2>
          <div className="space-y-2 text-xs" style={{ color: "rgba(252,165,165,0.75)" }}>
            {streak >= 7 && <p>🏆 7日以上連続！この調子を続ければ漢字力が着実にアップします。</p>}
            {streak >= 3 && streak < 7 && <p>🔥 {streak}日連続！あと{7 - streak}日続けると習慣化のゴールです。</p>}
            {streak < 3 && <p>📅 毎日少しずつ練習すると記憶が定着します。1日10問を目標にしよう！</p>}
            {weakList.length >= 10 && <p>📖 苦手漢字が{weakList.length}字あります。苦手克服モードで集中的に練習しましょう。</p>}
            {totalWeek >= 50 && <p>⚡ 今週{totalWeek}問達成！タイムアタックでさらに速読力を鍛えよう。</p>}
            {totalWeek < 10 && <p>🌱 今週はまだ{totalWeek}問。毎日少しずつ積み上げることが大切です。</p>}
          </div>
        </div>

      </div>

      <footer className="text-center text-xs pb-8 mt-4" style={{ color: "rgba(120,113,108,0.6)" }}>
        <p>© 2026 ポッコリラボ</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="/legal" className="underline hover:opacity-70">特定商取引法</a>
          <a href="/privacy" className="underline hover:opacity-70">プライバシーポリシー</a>
        </div>
      </footer>
    </div>
  );
}
