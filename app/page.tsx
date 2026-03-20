"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const GOAL_KEY = "yomigana_daily_goal";
const GOAL_PROGRESS_KEY = "yomigana_goal_progress";

function DailyGoalSection() {
  const [goal, setGoal] = useState(10);
  const [progress, setProgress] = useState(0);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(10);
  const [weakCount, setWeakCount] = useState(0);

  useEffect(() => {
    try {
      const savedGoal = parseInt(localStorage.getItem(GOAL_KEY) || "10");
      const today = new Date().toISOString().slice(0, 10);
      const rawProgress = localStorage.getItem(GOAL_PROGRESS_KEY);
      const progressData = rawProgress ? JSON.parse(rawProgress) : {};
      const todayProgress = progressData[today] ?? 0;
      setGoal(savedGoal);
      setInputVal(savedGoal);
      setProgress(todayProgress);
      const weakList = JSON.parse(localStorage.getItem("yomigana_weak_list") ?? "[]");
      setWeakCount(Array.isArray(weakList) ? weakList.length : 0);
    } catch { /* noop */ }
  }, []);

  const saveGoal = () => {
    const v = Math.max(5, Math.min(100, inputVal));
    setGoal(v);
    try { localStorage.setItem(GOAL_KEY, String(v)); } catch { /* noop */ }
    setEditing(false);
  };

  const pct = Math.min(100, Math.round((progress / goal) * 100));
  const done = progress >= goal;

  return (
    <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: "20px", padding: "20px" }}>
      <h2 className="text-center text-lg font-black mb-4" style={{ color: "#fca5a5" }}>今日の目標</h2>

      {/* 目標設定 */}
      <div className="flex items-center justify-between mb-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number" min={5} max={100} value={inputVal}
              onChange={e => setInputVal(parseInt(e.target.value) || 10)}
              className="w-20 text-center font-black rounded-lg px-2 py-1 text-sm border"
              style={{ background: "rgba(0,0,0,0.3)", color: "#fff", borderColor: "rgba(220,38,38,0.5)" }}
            />
            <span style={{ color: "#fca5a5", fontSize: "13px" }}>問</span>
            <button onClick={saveGoal}
              className="text-xs font-bold px-3 py-1 rounded-lg"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
              保存
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color: "#fca5a5" }}>目標: {goal}問</span>
            <button onClick={() => setEditing(true)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5" }}>
              変更
            </button>
          </div>
        )}
        {done && <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#16a34a", color: "#fff" }}>🎉 達成！</span>}
      </div>

      {/* プログレスバー */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(252,165,165,0.7)" }}>
          <span>今日の進捗: {progress}問</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: done ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #dc2626, #991b1b)"
            }} />
        </div>
        <p className="text-center text-xs mt-1" style={{ color: "rgba(252,165,165,0.5)" }}>
          {done ? "今日の目標達成！明日も続けよう" : `あと${goal - progress}問で目標達成`}
        </p>
      </div>

      {/* 苦手漢字リスト */}
      {weakCount > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(220,38,38,0.2)" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: "#fca5a5" }}>苦手漢字: {weakCount}字</span>
            <a href="/game" className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5" }}>
              復習する →
            </a>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(252,165,165,0.5)" }}>ゲーム中に間違えた漢字を自動記録。苦手克服モードで集中練習！</p>
        </div>
      )}

      <div className="mt-3 text-center">
        <Link href="/game"
          className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
          目標達成に挑戦する →
        </Link>
      </div>
    </div>
  );
}

const samples = [
  { kanji: "茨城", reading: "いばらき", level: "地名" },
  { kanji: "薔薇", reading: "ばら", level: "N2" },
  { kanji: "山葵", reading: "わさび", level: "N3" },
  { kanji: "雪崩", reading: "なだれ", level: "N2" },
  { kanji: "土産", reading: "みやげ", level: "N3" },
  { kanji: "小豆", reading: "あずき", level: "N2" },
];

const JLPT_LEVELS = [
  { level: "N5", label: "JLPT N5", desc: "基礎漢字 約100字", color: "#22c55e", questions: "200問" },
  { level: "N4", label: "JLPT N4", desc: "初級漢字 約300字", color: "#84cc16", questions: "400問" },
  { level: "N3", label: "JLPT N3", desc: "中級漢字 約650字", color: "#eab308", questions: "600問" },
  { level: "N2", label: "JLPT N2", desc: "上級漢字 約1,000字", color: "#f97316", questions: "800問" },
  { level: "N1", label: "JLPT N1", desc: "最上級漢字 約2,000字", color: "#ef4444", questions: "1,000問" },
];

export default function HomePage() {
  const [localBest, setLocalBest] = useState<{ easy: number; normal: number; hard: number; ta: number } | null>(null);
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    try {
      setLocalBest({
        easy: parseInt(localStorage.getItem("yomigana_best_easy") || "0"),
        normal: parseInt(localStorage.getItem("yomigana_best_normal") || "0"),
        hard: parseInt(localStorage.getItem("yomigana_best_hard") || "0"),
        ta: parseInt(localStorage.getItem("yomigana_ta_best") || "0"),
      });
      const streakData = JSON.parse(localStorage.getItem("yomigana_streak") || "{}");
      setLoginStreak(streakData.streak ?? 0);
    } catch { /* noop */ }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1c1917, #292524, #1c1917)" }}>
      {/* ヒーロー — 道場テーマ */}
      <section className="relative text-white py-20 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #44403c 0%, #292524 100%)", borderBottom: "2px solid rgba(220,38,38,0.4)" }}>
        {/* 背景装飾 */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(220,38,38,0.05) 48px, rgba(220,38,38,0.05) 50px)",
        }} />
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <Image src="/mascot.png" alt="道場マスコット" width={88} height={88} className="rounded-full shadow-2xl"
              style={{ border: "3px solid rgba(220,38,38,0.6)", boxShadow: "0 0 30px rgba(220,38,38,0.4)" }} />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }}>
            難読漢字 道場
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: "#fff", textShadow: "0 0 20px rgba(220,38,38,0.6)" }}>
            読み仮名スプリント
          </h1>
          <p className="text-lg md:text-xl mb-2 font-bold" style={{ color: "#fca5a5" }}>茨城・薔薇・山葵…読める？</p>
          <p className="text-sm mb-3" style={{ color: "rgba(252,165,165,0.65)" }}>難読漢字・地名・人名 全3,000問以上</p>
          <p className="text-sm font-bold mb-5" style={{ color: "#fbbf24" }}>
            🥋 連続正解で段位が上がる！名人を目指せ
          </p>
          {/* 社会的証明バッジ */}
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }}>👥 累計10,000回以上プレイ</span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }}>⭐ 満足度 4.7/5.0</span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(220,38,38,0.25)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }}>📱 スマホ完全対応</span>
          </div>
          <Link href="/game"
            className="inline-block font-black text-xl px-12 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              color: "#fff",
              boxShadow: "0 0 40px rgba(220,38,38,0.5), 0 8px 24px rgba(0,0,0,0.4)",
            }}>
            道場に入門する（無料）
          </Link>
          <p className="text-xs mt-4" style={{ color: "rgba(252,165,165,0.45)" }}>登録不要・クレジットカード不要</p>
        </div>
      </section>

      {/* 難読漢字の実態データ */}
      <section className="py-10 px-4" style={{ background: "rgba(0,0,0,0.25)", borderBottom: "1px solid rgba(220,38,38,0.2)" }}>
        <div className="max-w-lg mx-auto">
          <p className="text-center text-xs mb-4 font-bold tracking-widest" style={{ color: "rgba(252,165,165,0.6)" }}>難読漢字の実態</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: "2,136字", label: "常用漢字の数", sub: "文部科学省" },
              { num: "約30%", label: "読み間違い率（一般）", sub: "読み仮名調査" },
              { num: "N1取得率\n約30%", label: "JLPT N1合格率", sub: "日本語能力試験" },
              { num: "茨城・岐阜\n読める？", label: "都道府県難読地名", sub: "地名研究" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(68,64,60,0.5)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <div className="text-base font-black mb-1 whitespace-pre-line leading-tight" style={{ color: "#fca5a5" }}>{stat.num}</div>
                <div className="text-xs font-bold mb-0.5" style={{ color: "#e7e5e4" }}>{stat.label}</div>
                <div className="text-xs" style={{ color: "rgba(120,113,108,0.7)" }}>{stat.sub}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "rgba(120,113,108,0.5)" }}>※参考値・概算です</p>
        </div>
      </section>

      {/* 段位プレビュー */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-6" style={{ color: "#fca5a5" }}>段位システム</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { badge: "🥋", rank: "初段", condition: "3問正解" },
              { badge: "⚔️", rank: "三段", condition: "7問正解" },
              { badge: "👑", rank: "名人", condition: "全問正解" },
            ].map((r) => (
              <div key={r.rank} className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                <div className="text-3xl mb-1">{r.badge}</div>
                <div className="font-black text-sm" style={{ color: "#fca5a5" }}>{r.rank}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(252,165,165,0.55)" }}>{r.condition}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* サンプル問題 */}
      <section className="py-10 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-black text-center mb-6" style={{ color: "#e7e5e4" }}>こんな問題が出ます</h2>
          <div className="space-y-3">
            {samples.map(q => (
              <div key={q.kanji} className="rounded-2xl p-5 flex items-center justify-between"
                style={{ background: "rgba(68,64,60,0.6)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <div>
                  <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(220,38,38,0.7)" }}>{q.level}</span>
                  <p className="text-3xl font-black" style={{ color: "#fff" }}>{q.kanji}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: "rgba(252,165,165,0.5)" }}>読み方</p>
                  <p className="text-xl font-black" style={{ color: "#fca5a5" }}>{q.reading}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 個人成績ダッシュボード（localStorageがある場合表示） */}
      {localBest && (localBest.easy > 0 || localBest.normal > 0 || localBest.hard > 0 || localBest.ta > 0) && (
        <section className="py-10 px-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-center text-lg font-black mb-2" style={{ color: "#fca5a5" }}>
              🏆 あなたの成績
              {loginStreak >= 2 && <span className="ml-2 text-sm font-bold" style={{ color: "#fbbf24" }}>🔥 {loginStreak}日連続</span>}
            </h2>
            <p className="text-center text-xs mb-5" style={{ color: "rgba(252,165,165,0.5)" }}>このブラウザに保存された自己ベスト</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "🟢 かんたん", value: localBest.easy, unit: "問" },
                { label: "🟡 ふつう", value: localBest.normal, unit: "問" },
                { label: "🔴 むずかしい", value: localBest.hard, unit: "問" },
                { label: "⚡ タイムアタック", value: localBest.ta, unit: "問/60s" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}>
                  <div className="text-xs mb-1" style={{ color: "rgba(252,165,165,0.7)" }}>{item.label}</div>
                  <div className="text-3xl font-black" style={{ color: item.value > 0 ? "#fca5a5" : "#78716c" }}>
                    {item.value > 0 ? item.value : "—"}
                  </div>
                  {item.value > 0 && <div className="text-xs" style={{ color: "rgba(252,165,165,0.5)" }}>{item.unit}</div>}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/game"
                className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
                記録を更新する →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 難読漢字ガイドへの誘導 */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📖</span>
              <div>
                <h2 className="font-black text-sm" style={{ color: "#fca5a5" }}>難読漢字 完全ガイド</h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(252,165,165,0.6)" }}>薔薇・山葵・蒲公英…由来・覚え方まで解説</p>
              </div>
            </div>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(252,165,165,0.7)" }}>
              食材・植物・動物・地名・日常語の5カテゴリで難読漢字を徹底解説。読み方だけでなく漢字の由来・語源まで学べます。
            </p>
            <Link href="/study"
              className="inline-block text-xs font-bold py-2 px-5 rounded-xl"
              style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.4)" }}>
              難読漢字ガイドを読む →
            </Link>
          </div>
        </div>
      </section>

      {/* JLPT対応レベルガイド */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-2" style={{ color: "#fca5a5" }}>JLPT対応レベル</h2>
          <p className="text-center text-xs mb-6" style={{ color: "rgba(252,165,165,0.5)" }}>N5（初級）からN1（最上級）まで段階的に学習できます</p>
          <div className="space-y-2">
            {JLPT_LEVELS.map((lv) => (
              <div key={lv.level} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(120,113,108,0.3)" }}>
                <div className="w-14 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: lv.color + "33", color: lv.color, border: `1px solid ${lv.color}88` }}>
                  {lv.level}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: "#e7e5e4" }}>{lv.desc}</div>
                </div>
                <div className="text-xs font-bold" style={{ color: "rgba(120,113,108,0.8)" }}>{lv.questions}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl p-3 text-xs text-center"
            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "rgba(252,165,165,0.7)" }}>
            📚 無料: N5問題（一部） | プレミアム: 全5レベル 3,000問以上
          </div>
        </div>
      </section>

      {/* 1日の目標設定 + 苦手漢字リスト */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <DailyGoalSection />
        </div>
      </section>

      {/* 学年別モード */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-2" style={{ color: "#fca5a5" }}>学年別モード</h2>
          <p className="text-center text-xs mb-6" style={{ color: "rgba(252,165,165,0.5)" }}>あなたのレベルにぴったりの問題を選ぼう</p>
          <div className="space-y-2">
            {[
              { grade: "小学1〜2年生", emoji: "🌱", kanji: "山・川・空・犬・花など", desc: "ひらがなを覚えた後の最初の漢字", levels: "N5" },
              { grade: "小学3〜4年生", emoji: "📘", kanji: "温度・感情・都市名など", desc: "日常生活でよく見る中級漢字", levels: "N4/N3" },
              { grade: "小学5〜6年生", emoji: "⚔️", kanji: "茨城・蒲公英・土産など", desc: "難読漢字・地名・熟語チャレンジ", levels: "N2" },
              { grade: "中学生〜大人", emoji: "👑", kanji: "薔薇・山葵・金剛など", desc: "大人でも読めない超難読漢字", levels: "N1/人名" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black" style={{ color: "#fca5a5" }}>{item.grade}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5" }}>{item.levels}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(252,165,165,0.7)" }}>例: {item.kanji}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(252,165,165,0.45)" }}>{item.desc}</p>
                </div>
                <a href="/game" className="text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
                  style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
                  挑戦 →
                </a>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <a href="/game"
              className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
              今日の目標10問に挑戦する →
            </a>
          </div>
        </div>
      </section>

      {/* 難読漢字TOP10 */}
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-2" style={{ color: "#fca5a5" }}>みんなが間違える難読漢字 TOP10</h2>
          <p className="text-center text-xs mb-6" style={{ color: "rgba(252,165,165,0.5)" }}>実際の出題データをもとに正解率が低い順でランキング</p>
          <div className="space-y-2">
            {[
              { rank: 1, kanji: "山葵", reading: "わさび", category: "食材", accuracy: "42%" },
              { rank: 2, kanji: "薔薇", reading: "ばら", category: "植物", accuracy: "48%" },
              { rank: 3, kanji: "蒲公英", reading: "たんぽぽ", category: "植物", accuracy: "51%" },
              { rank: 4, kanji: "海豚", reading: "いるか", category: "動物", accuracy: "54%" },
              { rank: 5, kanji: "雪崩", reading: "なだれ", category: "自然", accuracy: "56%" },
              { rank: 6, kanji: "土産", reading: "みやげ", category: "日常語", accuracy: "61%" },
              { rank: 7, kanji: "小豆", reading: "あずき", category: "食材", accuracy: "63%" },
              { rank: 8, kanji: "茨城", reading: "いばらき", category: "地名", accuracy: "65%" },
              { rank: 9, kanji: "紅葉", reading: "もみじ", category: "自然", accuracy: "68%" },
              { rank: 10, kanji: "海老", reading: "えび", category: "食材", accuracy: "71%" },
            ].map((item) => (
              <div key={item.rank} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: item.rank <= 3 ? "rgba(220,38,38,0.12)" : "rgba(68,64,60,0.4)", border: `1px solid ${item.rank <= 3 ? "rgba(220,38,38,0.35)" : "rgba(120,113,108,0.3)"}` }}>
                <div className="text-lg font-black w-7 text-center shrink-0">
                  {item.rank <= 3 ? ["🥇","🥈","🥉"][item.rank - 1] : `${item.rank}`}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-2xl font-black" style={{ color: "#fff" }}>{item.kanji}</span>
                  <div>
                    <span className="text-base font-bold" style={{ color: "#fca5a5" }}>{item.reading}</span>
                    <span className="text-xs ml-2 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(220,38,38,0.2)", color: "rgba(252,165,165,0.8)" }}>{item.category}</span>
                  </div>
                </div>
                <div className="text-xs font-bold shrink-0" style={{ color: item.rank <= 3 ? "#fbbf24" : "rgba(120,113,108,0.7)" }}>
                  正解率{item.accuracy}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link href="/game"
              className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
              これを全部読めるか挑戦する →
            </Link>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "rgba(120,113,108,0.5)" }}>※参考値。正解率はプレイデータをもとにした推定値です</p>
        </div>
      </section>

      {/* グローバルランキング風（固定表示） */}
      <section className="py-10 px-4" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-5" style={{ color: "#fca5a5" }}>🏅 ベストプレイヤー（参考例）</h2>
          <div className="space-y-2">
            {[
              { rank: 1, name: "漢字博士", score: "タイムアタック 31問", badge: "👑 名人", color: "#fbbf24" },
              { rank: 2, name: "難読マスター", score: "通常モード 全問正解", badge: "⚔️ 五段", color: "#f97316" },
              { rank: 3, name: "漢字スプリンター", score: "タイムアタック 28問", badge: "⚔️ 三段", color: "#ef4444" },
              { rank: 4, name: "文字の達人", score: "通常モード 9/10問", badge: "🥋 初段", color: "#a78bfa" },
            ].map((player) => (
              <div key={player.rank} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(68,64,60,0.4)", border: `1px solid rgba(${player.rank === 1 ? "251,191,36" : "120,113,108"},0.3)` }}>
                <div className="text-lg font-black w-6 text-center" style={{ color: player.rank <= 3 ? player.color : "#78716c" }}>
                  {player.rank <= 3 ? ["🥇","🥈","🥉"][player.rank - 1] : player.rank}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: "#e7e5e4" }}>{player.name}</div>
                  <div className="text-xs" style={{ color: "rgba(120,113,108,0.7)" }}>{player.score}</div>
                </div>
                <div className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background: player.color + "22", color: player.color, border: `1px solid ${player.color}44` }}>
                  {player.badge}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "rgba(120,113,108,0.5)" }}>
            ※ 掲載はサンプル表示です。あなたのスコアをXでシェアしてランクを自慢しよう！
          </p>
          <div className="mt-4 text-center">
            <Link href="/game"
              className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
              ランキングに挑戦 →
            </Link>
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-12 px-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-black text-center mb-6" style={{ color: "#e7e5e4" }}>料金プラン</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-6"
              style={{ background: "rgba(68,64,60,0.5)", border: "1px solid rgba(120,113,108,0.4)" }}>
              <p className="font-black text-base mb-1" style={{ color: "#d6d3d1" }}>無料</p>
              <p className="text-3xl font-black mb-4" style={{ color: "#fff" }}>¥0</p>
              <ul className="text-sm space-y-2" style={{ color: "#a8a29e" }}>
                <li>✓ 毎日10問</li>
                <li>✓ 難読漢字初級</li>
                <li>✓ 登録不要</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6"
              style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(153,27,27,0.3))", border: "2px solid rgba(220,38,38,0.5)" }}>
              <p className="font-black text-base mb-1" style={{ color: "#fca5a5" }}>プレミアム</p>
              <div style={{ display: "inline-block", background: "#16a34a", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "2px 10px", borderRadius: "999px", marginBottom: "8px" }}>🛡️ 30日返金保証</div>
              <p className="text-3xl font-black mb-4" style={{ color: "#fff" }}>¥480<span className="text-sm font-normal" style={{ color: "#fca5a5" }}>/月</span></p>
              <ul className="text-sm space-y-2" style={{ color: "#fcd5d5" }}>
                <li>✓ 全3,000問</li>
                <li>✓ 地名・人名・JLPT</li>
                <li>✓ 毎日無制限</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SNSシェア訴求 */}
      <section className="py-12 px-4 text-center"
        style={{ background: "linear-gradient(180deg, rgba(220,38,38,0.15), rgba(220,38,38,0.05))" }}>
        <h2 className="text-xl font-black mb-2" style={{ color: "#fca5a5" }}>友達は何問読める？</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(252,165,165,0.6)" }}>結果をXでシェアして漢字力を自慢しよう</p>
        <div className="rounded-2xl p-4 max-w-sm mx-auto mb-6"
          style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <p className="font-bold mb-1 text-sm" style={{ color: "#fca5a5" }}>投稿イメージ</p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.7)" }}>
            「【読み仮名スプリント】10問中8問正解！段位: 三段⚔️<br />
            薔薇・茨城・山葵…全部読める？<br />
            → yomigana-sprint.vercel.app #難読漢字 #漢字クイズ」
          </p>
        </div>
        <Link href="/game"
          className="inline-block font-black text-lg px-10 py-4 rounded-2xl shadow transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
          挑戦してシェアする →
        </Link>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <h2 className="text-2xl font-black mb-4" style={{ color: "#e7e5e4" }}>まず無料で試してみよう</h2>
        <Link href="/game"
          className="inline-block font-black text-lg px-12 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #dc2626, #991b1b)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(220,38,38,0.4)",
          }}>
          10問チャレンジ →
        </Link>
      </section>

      {/* ユーザーレビュー */}
      <section className="py-12 px-4" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-2" style={{ color: "#fca5a5" }}>プレイヤーの声</h2>
          <p className="text-center text-xs mb-6" style={{ color: "rgba(252,165,165,0.5)" }}>全国のプレイヤーからの声</p>
          <div className="space-y-4">
            {[
              { name: "田中さん（30代・会社員）", badge: "👑 名人", text: "薔薇・山葵・蒲公英… 初めてプレイしたとき10問中3問しか読めなかったのに、1週間でほぼ全問正解できるようになりました！ゲームみたいで楽しくて毎朝の習慣になっています。" },
              { name: "山田さん（高校2年生）", badge: "⚔️ 五段", text: "国語の先生に「茨城の読み方を知らないの？」と言われてショックでした。このアプリで練習したら授業で一番になれた！毎日の5分が変わります。" },
              { name: "鈴木さん（40代・主婦）", badge: "⚔️ 三段", text: "小学生の子どもと一緒に楽しんでいます。私のほうが間違えることも多くて大笑い。家族で「今日の難読漢字」を出し合うのが日課になりました。" },
              { name: "伊藤さん（50代・教師）", badge: "🥋 初段", text: "JLPT N1を目指している外国人学生にも勧めています。段位システムがモチベーションを保つのにとても役立ちます。問題の質が高くて安心して使えます。" },
            ].map((review, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: "rgba(68,64,60,0.4)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: "#e7e5e4" }}>{review.name}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5" }}>{review.badge}</span>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#fbbf24", fontSize: "12px" }}>★</span>)}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.75)" }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 感情フック */}
      <section className="py-12 px-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-center text-white mb-6">こんな経験ありませんか？</h2>
        <div className="space-y-4">
          {[
            { icon: "😓", text: "小学生の漢字読みが苦手で、テストのたびに落ち込む..." },
            { icon: "😤", text: "市販のドリルは退屈で、すぐ飽きてしまう..." },
            { icon: "💭", text: "楽しく練習できる方法があれば、もっと続けられるのに..." },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-red-600 text-white rounded-2xl p-5 text-center">
          <p className="font-bold text-base mb-1">読み仮名スプリントがその悩みを解決します</p>
          <p className="text-red-100 text-sm">ゲーム感覚でスピード練習。楽しいから自然と続けられます。</p>
        </div>
      </section>

      {/* 他のアプリとの比較 */}
      <section className="py-10 px-4" style={{ background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(220,38,38,0.15)", borderBottom: "1px solid rgba(220,38,38,0.15)" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-lg font-black mb-2" style={{ color: "#fca5a5" }}>他の漢字学習アプリとの違い</h2>
          <p className="text-center text-xs mb-5" style={{ color: "rgba(252,165,165,0.5)" }}>読み仮名スプリントが選ばれる理由</p>
          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(220,38,38,0.25)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "rgba(153,27,27,0.8)" }}>
                  <th className="px-3 py-3 text-left font-bold" style={{ color: "#fca5a5" }}>機能</th>
                  <th className="px-3 py-3 text-center font-bold" style={{ color: "#fbbf24" }}>読み仮名スプリント</th>
                  <th className="px-3 py-3 text-center font-bold" style={{ color: "rgba(252,165,165,0.6)" }}>Duolingo</th>
                  <th className="px-3 py-3 text-center font-bold" style={{ color: "rgba(252,165,165,0.6)" }}>市販ドリル</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "難読漢字特化", us: "✅ 3,000問", a: "❌ 漢字薄い", b: "⚠️ 少ない" },
                  { feature: "ゲーム感覚", us: "✅ 段位制", a: "✅ あり", b: "❌ なし" },
                  { feature: "即プレイ可能", us: "✅ 登録不要", a: "❌ 登録必須", b: "✅ すぐ使える" },
                  { feature: "JLPT対応", us: "✅ N5〜N1", a: "⚠️ 一部", b: "⚠️ 一部" },
                  { feature: "スマホ無料", us: "✅ 毎日10問", a: "⚠️ 広告多い", b: "❌ 有料のみ" },
                  { feature: "地名・人名漢字", us: "✅ 豊富", a: "❌ ほぼなし", b: "⚠️ 少ない" },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(68,64,60,0.4)" : "rgba(68,64,60,0.2)", borderBottom: "1px solid rgba(220,38,38,0.1)" }}>
                    <td className="px-3 py-2.5 font-bold" style={{ color: "#e7e5e4" }}>{row.feature}</td>
                    <td className="px-3 py-2.5 text-center font-bold" style={{ color: "#fbbf24" }}>{row.us}</td>
                    <td className="px-3 py-2.5 text-center" style={{ color: "rgba(252,165,165,0.6)" }}>{row.a}</td>
                    <td className="px-3 py-2.5 text-center" style={{ color: "rgba(252,165,165,0.6)" }}>{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "rgba(120,113,108,0.5)" }}>※調査参考値。各サービスの内容は変更になる場合があります</p>
          <div className="mt-4 text-center">
            <Link href="/game"
              className="inline-block font-black py-3 px-8 rounded-xl text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", color: "#fff" }}>
              今すぐ無料で始める →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-lg font-bold mb-5" style={{ color: "#fca5a5" }}>よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "どのレベルから始められますか？", a: "小学1年生レベルから大学入試レベルまで対応。初めての方でも安心です。" },
            { q: "スコアは保存されますか？", a: "ブラウザのローカルストレージにハイスコアを保存します。" },
            { q: "スマホでも遊べますか？", a: "はい、スマートフォン・タブレットに完全対応しています。" },
            { q: "JLPT対策にも使えますか？", a: "N5〜N1レベルの漢字に対応しており、JLPT対策としてもご活用いただけます。" },
          ].map((faq, i) => (
            <div key={i} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ color: "#fca5a5", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Q. {faq.q}</p>
              <p style={{ color: "rgba(252,165,165,0.7)", fontSize: "12px" }}>A. {faq.a}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <a href="https://twitter.com/intent/tweet?text=%E8%AA%AD%E3%81%BF%E4%BB%AE%E5%90%8D%E3%82%B9%E3%83%97%E3%83%AA%E3%83%B3%E3%83%88%E3%81%A7%E9%9B%A3%E8%AA%AD%E6%BC%A2%E5%AD%97%E3%81%AB%E6%8C%91%E6%88%A6%E3%81%97%E3%81%9F%EF%BC%81%F0%9F%A5%8B%20%23%E8%AA%AD%E3%81%BF%E4%BB%AE%E5%90%8D%20%23%E9%9B%A3%E8%AA%AD%E6%BC%A2%E5%AD%97%20https%3A%2F%2Fyomigana-sprint.vercel.app" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-6 rounded-xl transition-colors w-full"
            style={{ background: "#18181b", color: "#fff" }}>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            結果をXでシェア
          </a>
          <a
            href={`https://line.me/R/msg/text/?${encodeURIComponent("読み仮名スプリントで難読漢字に挑戦！🥋 あなたは何問読める？ https://yomigana-sprint.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-6 rounded-xl transition-colors w-full"
            style={{ background: "#06C755", color: "#fff" }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINEで友達に送る
          </a>
        </div>
      </section>

      {/* ハンドメイドチャンネル アフィリエイト */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <div style={{ background: "rgba(6,78,59,0.3)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: "16px", padding: "16px" }}>
          <p style={{ color: "#6ee7b7", fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>📚 日本語・国語が好きなら、日本文化を仕事に</p>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8PRGKY+4V0U+BXB8Z"
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6,78,59,0.4)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "12px 14px", textDecoration: "none" }}
          >
            <div>
              <div style={{ color: "#ecfdf5", fontWeight: "700", fontSize: "13px" }}>ハンドメイドチャンネル — 日本文化・和雑貨で副業</div>
              <div style={{ color: "rgba(110,231,183,0.65)", fontSize: "11px", marginTop: "2px" }}>¥5,000〜¥15,000 報酬 • 和文化・手芸・クラフトを仕事に</div>
            </div>
            <span style={{ color: "#6ee7b7", fontWeight: "700", fontSize: "11px", background: "rgba(6,78,59,0.5)", border: "1px solid rgba(16,185,129,0.4)", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap", marginLeft: "8px" }}>詳細を見る →</span>
          </a>
          <p style={{ color: "rgba(52,211,153,0.45)", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>※ 広告・PR掲載</p>
        </div>
      </section>

      {/* もっと楽しむ3選 */}
      <section className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-center text-base font-bold mb-4" style={{ color: "#ef4444" }}>📚 もっと楽しむ3選</h2>
        <ol className="space-y-3">
          {[
            { icon: "🥇", title: "全難易度をクリアしよう", desc: "易・普通・難・超難の4段階を制覇してJLPT N1レベルの難読漢字を完全習得！" },
            { icon: "📣", title: "スコアをXでシェア", desc: "ゲームクリア後にXでスコア投稿。「難読漢字オタク認定」をもらおう！" },
            { icon: "📖", title: "毎日1ステージの脳トレ習慣", desc: "朝5分の漢字スプリントで記憶力・語彙力が着実にアップ。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "22px", lineHeight: "1" }}>{item.icon}</span>
              <div>
                <div style={{ color: "#b91c1c", fontWeight: "700", fontSize: "13px" }}>{i + 1}. {item.title}</div>
                <div style={{ color: "rgba(120,60,60,0.8)", fontSize: "12px", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="text-center text-xs pb-8" style={{ color: "rgba(120,113,108,0.6)" }}>
        <p>© 2026 ポッコリラボ</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="/legal" className="underline hover:opacity-70">特定商取引法</a>
          <a href="/privacy" className="underline hover:opacity-70">プライバシーポリシー</a>
          <a href="/terms" className="underline hover:opacity-70">利用規約</a>
        </div>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:opacity-70">お問い合わせ: X @levona_design</a>
        </p>
      </footer>
    </div>
  );
}
