"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { freeQuestions, type Question } from "@/lib/questions-free";
import { premiumQuestions } from "@/lib/questions-premium";
import KomojuButton from "./KomojuButton";
import MascotSprite from "./MascotSprite";
import CorrectBurst from "./CorrectBurst";
import { useBGM } from "@/hooks/useBGM";
import { useSE } from "@/hooks/useSE";
import { ScorePopLayer, type ScorePopItem } from "./ScorePop";
import { LottiePlayer } from "./LottiePlayer";
import { StreakFlame } from "./StreakFlame";

//  Web Speech API 
function speakReading(text: string) {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.9;
  utter.pitch = 1.1;
  speechSynthesis.speak(utter);
}

//  段位認定証 Canvas生成 
function getScoreRank(score: number): { rank: string; badge: string } {
  if (score >= 96) return { rank: "名人", badge: "" };
  if (score >= 86) return { rank: "五段", badge: "️" };
  if (score >= 71) return { rank: "四段", badge: "️" };
  if (score >= 51) return { rank: "三段", badge: "" };
  if (score >= 31) return { rank: "二段", badge: "" };
  return { rank: "初段", badge: "" };
}

function downloadCertificate(score: number, totalScore: number, diffLabel: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 背景グラデーション
  const grad = ctx.createLinearGradient(0, 0, 800, 500);
  grad.addColorStop(0, "#1a1a2e");
  grad.addColorStop(1, "#16213e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 500);

  // 和風ライン装飾（上下）
  ctx.strokeStyle = "rgba(220,38,38,0.6)";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 760, 460);
  ctx.strokeStyle = "rgba(251,191,36,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, 740, 440);

  // タイトル
  ctx.fillStyle = "rgba(252,165,165,0.9)";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("読み仮名 段位認定証", 400, 90);

  // 難易度
  ctx.fillStyle = "rgba(168,162,158,0.8)";
  ctx.font = "18px sans-serif";
  ctx.fillText(diffLabel + " モード", 400, 128);

  // 段位
  const correctCount = Math.round(totalScore / 100);
  const { rank } = getScoreRank(correctCount);
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 80px sans-serif";
  ctx.fillText(rank, 400, 250);

  // スコア
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 56px sans-serif";
  ctx.fillText(`${correctCount}問正解`, 400, 330);

  // ポイント
  ctx.fillStyle = "rgba(252,165,165,0.7)";
  ctx.font = "22px sans-serif";
  ctx.fillText(`${totalScore}点`, 400, 370);

  // 日付
  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  ctx.fillStyle = "rgba(120,113,108,0.8)";
  ctx.font = "16px sans-serif";
  ctx.fillText(today, 400, 415);

  // ハッシュタグ
  ctx.fillStyle = "rgba(220,38,38,0.7)";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("#読み仮名スプリント", 400, 445);

  // ダウンロード
  const link = document.createElement("a");
  link.download = `yomigana-certificate-${rank}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function CertificateButton({ score, diffLabel }: { score: number; diffLabel: string }) {
  const handleDownload = () => {
    downloadCertificate(Math.round(score / 100), score, diffLabel);
  };

  const correctCount = Math.round(score / 100);
  const { rank } = getScoreRank(correctCount);
  const shareText = `【読み仮名スプリント】段位認定「${rank}」を取得！${score}点達成 #読み仮名スプリント #難読漢字`;
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://yomigana-sprint.vercel.app")}`;

  return (
    <div className="rounded-2xl p-4 mb-3" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)" }}>
      <p className="text-center text-xs font-bold mb-3" style={{ color: "#fbbf24" }}>段位認定証を取得する</p>
      <div className="flex gap-2">
        <button
          aria-label="段位認定証をダウンロード"
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 font-black py-2.5 rounded-xl text-sm active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #d97706, #92400e)", color: "#fff" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          認定証DL
        </button>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 font-black py-2.5 rounded-xl text-sm active:scale-95 transition-transform"
          style={{ background: "#18181b", color: "#fff" }}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          段位シェア
        </a>
      </div>
    </div>
  );
}

const FREE_LIMIT = 10;
const STORAGE_KEY = "yomigana_daily";
const TA_BEST_KEY = "yomigana_ta_best";
const DIFFICULTY_KEY = "yomigana_difficulty";
const WEAK_LIST_KEY = "yomigana_weak_list";
const VOICE_KEY = "yomigana_voice_enabled";
const STREAK_FREEZE_KEY = "yomigana_streak_freeze";
const BGM_MUTE_KEY = "yomigana_bgm_muted";

function getSavedBgmMuted(): boolean {
  try { return localStorage.getItem(BGM_MUTE_KEY) === "1"; } catch { return false; }
}
function saveBgmMuted(v: boolean) {
  try { localStorage.setItem(BGM_MUTE_KEY, v ? "1" : "0"); } catch { /* noop */ }
}

//  Streak Freeze（Duolingo型継続設計） 
function getStreakFreezeCount(): number {
  try { return parseInt(localStorage.getItem(STREAK_FREEZE_KEY) ?? "0", 10) || 0; } catch { return 0; }
}
function saveStreakFreezeCount(n: number) {
  try { localStorage.setItem(STREAK_FREEZE_KEY, String(Math.max(0, n))); } catch { /* noop */ }
}
// ストリークがリセット寸前の状態（昨日からデータが来ていない）かを確認
function isStreakAtRisk(): boolean {
  try {
    const data = JSON.parse(localStorage.getItem("yomigana_streak") ?? "{}");
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    // 最後プレイが昨日より前 = リスクあり（でも今日まだプレイしていない）
    if (!data.lastDate) return false;
    return data.lastDate !== today && data.lastDate !== yesterday && data.streak >= 3;
  } catch { return false; }
}
// Streak Freezeを使ってストリークを保護する
function applyStreakFreeze(): boolean {
  const count = getStreakFreezeCount();
  if (count <= 0) return false;
  saveStreakFreezeCount(count - 1);
  // ストリークのlastDateを昨日に更新して連続を維持
  try {
    const data = JSON.parse(localStorage.getItem("yomigana_streak") ?? "{}");
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    localStorage.setItem("yomigana_streak", JSON.stringify({ ...data, lastDate: yesterday }));
  } catch { /* noop */ }
  return true;
}

function getSavedVoice(): boolean {
  try { return localStorage.getItem(VOICE_KEY) !== "0"; } catch { return true; }
}
function saveVoice(v: boolean) {
  try { localStorage.setItem(VOICE_KEY, v ? "1" : "0"); } catch { /* noop */ }
}

//  ストリークマイルストーン 
const STREAK_MILESTONES = [
  { days: 3, label: "3日連続", badge: "", color: "#f97316" },
  { days: 7, label: "7日連続", badge: "", color: "#fbbf24" },
  { days: 30, label: "30日連続", badge: "", color: "#a855f7" },
];

function getNextMilestone(streak: number): { days: number; label: string; badge: string; color: string } | null {
  for (const m of STREAK_MILESTONES) {
    if (streak < m.days) return m;
  }
  return null;
}

//  苦手リスト管理 
type WeakItem = { kanji: string; correct: string; level: string; missCount: number };

function getWeakList(): WeakItem[] {
  try { return JSON.parse(localStorage.getItem(WEAK_LIST_KEY) ?? "[]"); } catch { return []; }
}

function addToWeakList(q: Question) {
  try {
    const list = getWeakList();
    const idx = list.findIndex(w => w.kanji === q.kanji);
    if (idx >= 0) {
      list[idx].missCount += 1;
    } else {
      list.unshift({ kanji: q.kanji, correct: q.correct, level: q.level, missCount: 1 });
    }
    // 最大100件
    localStorage.setItem(WEAK_LIST_KEY, JSON.stringify(list.slice(0, 100)));
  } catch { /* noop */ }
}

function removeFromWeakList(kanji: string) {
  try {
    const list = getWeakList().filter(w => w.kanji !== kanji);
    localStorage.setItem(WEAK_LIST_KEY, JSON.stringify(list));
  } catch { /* noop */ }
}

type Difficulty = "easy" | "normal" | "hard";

const DIFFICULTY_CONFIG = {
  easy:   { label: "かんたん", emoji: "", desc: "小学1-2年レベル",  bestKey: "yomigana_best_easy",   levels: ["N5"] },
  normal: { label: "ふつう",   emoji: "", desc: "小学3-4年レベル",  bestKey: "yomigana_best_normal", levels: ["N5", "N4", "N3", "地名"] },
  hard:   { label: "むずかしい", emoji: "", desc: "小学5-6年レベル", bestKey: "yomigana_best_hard",   levels: ["N2", "N1", "人名", "地名"] },
} as const;

function getSavedDifficulty(): Difficulty {
  try { return (localStorage.getItem(DIFFICULTY_KEY) as Difficulty) || "normal"; } catch { return "normal"; }
}
function saveDifficulty(d: Difficulty) {
  try { localStorage.setItem(DIFFICULTY_KEY, d); } catch { /* noop */ }
}

function getDiffBest(d: Difficulty): number {
  try { return parseInt(localStorage.getItem(DIFFICULTY_CONFIG[d].bestKey) || "0") || 0; } catch { return 0; }
}
function saveDiffBest(d: Difficulty, n: number): boolean {
  const prev = getDiffBest(d);
  if (n > prev) { localStorage.setItem(DIFFICULTY_CONFIG[d].bestKey, String(n)); return true; }
  return false;
}

function getTaBest(): number {
  try { return parseInt(localStorage.getItem(TA_BEST_KEY) || "0") || 0; } catch { return 0; }
}
function saveTaBest(n: number): boolean {
  const prev = getTaBest();
  if (n > prev) { localStorage.setItem(TA_BEST_KEY, String(n)); return true; }
  return false;
}

function filterByDifficulty(questions: Question[], d: Difficulty): Question[] {
  const levels = DIFFICULTY_CONFIG[d].levels as readonly string[];
  const filtered = questions.filter(q => levels.includes(q.level));
  // フォールバック: 該当問題が少ない場合は全問題を使用
  return filtered.length >= 5 ? filtered : questions;
}

//  ログインストリーク 

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

type Phase = "mode_select" | "playing" | "answered" | "result" | "timeattack_result" | "paywall";
type GameMode = "normal" | "timeattack";
const TIME_ATTACK_SECONDS = 60;

function getDanLevel(correctCount: number, total: number): { badge: string; rank: string; color: string } {
  const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
  if (accuracy >= 100) return { badge: "", rank: "名人", color: "#fbbf24" };
  if (accuracy >= 90) return { badge: "️", rank: "五段", color: "#f97316" };
  if (accuracy >= 70) return { badge: "️", rank: "三段", color: "#ef4444" };
  if (accuracy >= 50) return { badge: "", rank: "初段", color: "#a78bfa" };
  return { badge: "", rank: "見習い", color: "#78716c" };
}

export default function YomiganaGame({ isPremium }: { isPremium: boolean }) {
  const basePool = isPremium ? [...freeQuestions, ...premiumQuestions] : freeQuestions;
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [questions, setQuestions] = useState<Question[]>(() => shuffle(basePool));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<Phase>("mode_select");
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [loginStreak, setLoginStreak] = useState(0);
  const [showLoginStreakBanner, setShowLoginStreakBanner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_ATTACK_SECONDS);
  const [taCorrect, setTaCorrect] = useState(0);
  const [taBest, setTaBest] = useState(0);
  const [taNewRecord, setTaNewRecord] = useState(false);
  const [diffBest, setDiffBest] = useState(0);
  const [diffNewRecord, setDiffNewRecord] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [weakList, setWeakList] = useState<WeakItem[]>([]);
  const [resultTab, setResultTab] = useState<"result" | "weak">("result");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  // Wordle式グリッド用: 各問の正誤を記録
  const [questionResults, setQuestionResults] = useState<boolean[]>([]);
  // Streak Freeze
  const [streakFreezeCount, setStreakFreezeCount] = useState(0);
  const [streakAtRisk, setStreakAtRisk] = useState(false);
  const [freezeApplied, setFreezeApplied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // デザイン改修 2026
  const [mascotPose, setMascotPose] = useState<"idle" | "correct" | "wrong" | "excited">("idle");
  const [shakeActive, setShakeActive] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [wrongOverlay, setWrongOverlay] = useState(false);
  // Lottieキャラ感情反応
  type LottieState = 'idle' | 'happy' | 'sad' | 'fever';
  const [lottieState, setLottieState] = useState<LottieState>('idle');
  // ScorePop
  const [scorePopItems, setScorePopItems] = useState<ScorePopItem[]>([]);
  const scorePopIdRef = useRef(0);
  // BGM / SE
  const [bgmMuted, setBgmMuted] = useState(false);
  const bgm = useBGM();
  const se = useSE();

  useEffect(() => {
    setDailyCount(getDailyCount());
    setTaBest(getTaBest());
    const savedDiff = getSavedDifficulty();
    setDifficulty(savedDiff);
    setDiffBest(getDiffBest(savedDiff));
    setWeakList(getWeakList());
    setVoiceEnabled(getSavedVoice());
    // ログインストリーク更新
    const { streak: ls, isNew } = updateYomiganaStreak();
    setLoginStreak(ls);
    if (isNew && ls >= 2) {
      setShowLoginStreakBanner(true);
      setTimeout(() => setShowLoginStreakBanner(false), 3000);
    }
    // Streak Freeze初期化
    setStreakFreezeCount(getStreakFreezeCount());
    setStreakAtRisk(isStreakAtRisk());
    // BGMミュート状態初期化
    const muted = getSavedBgmMuted();
    setBgmMuted(muted);
    bgm.setMuted(muted);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // BGM: playing フェーズ中のみ再生
  useEffect(() => {
    if (phase === "playing" || phase === "answered") {
      bgm.start();
    } else {
      bgm.stop();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // 難易度変更時に問題セットを更新
  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d);
    saveDifficulty(d);
    setDiffBest(getDiffBest(d));
    setQuestions(shuffle(filterByDifficulty(basePool, d)));
  }, [basePool]); // eslint-disable-line

  // タイムアタックタイマー
  useEffect(() => {
    if (gameMode !== "timeattack" || phase === "mode_select" || phase === "timeattack_result") return;
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      se.playGameOver();
      setTaNewRecord(saveTaBest(taCorrect));
      setTaBest(getTaBest());
      setPhase("timeattack_result");
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          se.playGameOver();
          setPhase("timeattack_result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameMode, phase === "mode_select", timeLeft === TIME_ATTACK_SECONDS]); // eslint-disable-line

  const current = questions[idx];
  // idxが変わるたびにシャッフルし直す（useMemoで問題ごとに固定）
  const shuffledChoices = useMemo(() => shuffle(current?.choices ?? []), [idx]); // eslint-disable-line

  const handleAnswer = useCallback((choice: string) => {
    if (phase !== "playing" && phase !== "answered") return;
    if (phase !== "playing") return;
    const correct = choice === current.correct;
    setSelected(choice);
    setIsCorrect(correct);
    setPhase("answered");
    // Wordle式グリッド用に正誤を記録（通常モードのみ）
    if (gameMode === "normal") {
      setQuestionResults(prev => [...prev, correct]);
    }
    if (correct) {
      const newStreak = streak + 1;
      const pts = 100 + streak * 10;
      setScore(s => s + pts);
      setStreak(newStreak);
      // ScorePop発火
      const popId = ++scorePopIdRef.current;
      setScorePopItems(prev => [
        ...prev,
        {
          id: popId,
          value: pts,
          combo: newStreak,
          x: window.innerWidth / 2,
          y: window.innerHeight * 0.4,
        },
      ]);
      if (gameMode === "timeattack") setTaCorrect(c => c + 1);
      if (newStreak >= 3) {
        // コンボSE（正解SEより優先して発火）
        se.playCombo(newStreak);
        setShowStreakBanner(true);
        setTimeout(() => setShowStreakBanner(false), 1500);
      } else {
        // 通常正解SE
        se.playCorrect();
      }
      // 音声読み上げ
      if (voiceEnabled) speakReading(current.correct);
      // デザイン改修: 正解演出
      setMascotPose(newStreak >= 3 ? "excited" : "correct");
      setBurstActive(true);
      setTimeout(() => { setBurstActive(false); setMascotPose("idle"); }, 900);
      // Lottieキャラ感情反応: コンボ10以上→fever、それ以外→happy
      if (newStreak >= 10) {
        setLottieState('fever');
      } else {
        setLottieState('happy');
      }
    } else {
      // 不正解SE
      se.playWrong();
      // 不正解時も正解読み上げ
      if (voiceEnabled) speakReading(current.correct);
      setStreak(0);
      // 間違えた問題を記録
      setWrongQuestions(prev => {
        if (prev.find(q => q.kanji === current.kanji)) return prev;
        return [...prev, current];
      });
      addToWeakList(current);
      setWeakList(getWeakList());
      // デザイン改修: 不正解演出
      setMascotPose("wrong");
      // Lottieキャラ感情反応: 不正解→sad
      setLottieState('sad');
      setShakeActive(true);
      setWrongOverlay(true);
      setTimeout(() => { setShakeActive(false); setWrongOverlay(false); setMascotPose("idle"); }, 500);
    }

    const delay = gameMode === "timeattack" ? 600 : 1000;
    setTimeout(() => {
      if (gameMode === "timeattack") {
        // タイムアタックモードは時間切れまで無限に問題を出す
        setIdx(i => (i + 1) % questions.length);
        setSelected(null);
        setIsCorrect(null);
        setPhase("playing");
        return;
      }
      const newCount = incrementDailyCount();
      setDailyCount(newCount);
      if (!isPremium && newCount >= FREE_LIMIT) {
        setPhase("paywall");
        return;
      }
      if (idx + 1 >= questions.length) {
        se.playGameOver();
        setPhase("result");
      } else {
        setIdx(i => i + 1);
        setSelected(null);
        setIsCorrect(null);
        setPhase("playing");
      }
    }, delay);
  }, [phase, current, streak, idx, questions.length, isPremium, gameMode]);

  // モード選択画面
  if (phase === "mode_select") {
    const nextMilestone = getNextMilestone(loginStreak);
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="max-w-md w-full text-center">
          {/* よみまるマスコット（idle） */}
          <div className="flex justify-center mb-3">
            <MascotSprite pose="idle" size={88} />
          </div>
          <h2 className="text-3xl font-black mb-2"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #E2DCFF 50%, #00F5FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(0,245,255,0.3))",
            }}>
            モードを選択
          </h2>
          <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>どちらのモードで道場に入門しますか？</p>

          {/* ストリークマイルストーン */}
          {loginStreak > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {STREAK_MILESTONES.map(m => (
                  <div key={m.days} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black border-2 transition-all ${loginStreak >= m.days ? "scale-110" : "opacity-40"}`}
                      style={{
                        background: loginStreak >= m.days ? `${m.color}33` : "rgba(68,64,60,0.4)",
                        borderColor: loginStreak >= m.days ? m.color : "rgba(68,64,60,0.6)",
                      }}>
                      {m.badge}
                    </div>
                    <span className="text-[9px] font-bold" style={{ color: loginStreak >= m.days ? m.color : "rgba(120,113,108,0.5)" }}>{m.label}</span>
                  </div>
                ))}
              </div>
              {nextMilestone && (
                <p className="text-xs font-bold" style={{ color: "#78716c" }}>
                  あと{nextMilestone.days - loginStreak}日で {nextMilestone.badge} {nextMilestone.label}達成！
                </p>
              )}
              {!nextMilestone && (
                <p className="text-xs font-bold" style={{ color: "#a855f7" }}>全マイルストーン達成！{loginStreak}日連続継続中</p>
              )}
            </div>
          )}

          {/* Streak Freeze バナー */}
          {streakAtRisk && loginStreak >= 3 && (
            <div className="mb-4 rounded-xl p-3" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}>
              <p className="text-xs font-black mb-1" style={{ color: "#fca5a5" }}>{loginStreak}日連続のストリークが危険！</p>
              {streakFreezeCount > 0 ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: "rgba(252,165,165,0.7)" }}>
                    ストリークフリーズを使ってストリークを守れます（残り{streakFreezeCount}回）
                  </p>
                  <button
                    onClick={() => {
                      const ok = applyStreakFreeze();
                      if (ok) {
                        setStreakFreezeCount(getStreakFreezeCount());
                        setStreakAtRisk(false);
                        setFreezeApplied(true);
                      }
                    }}
                    className="text-xs font-black px-3 py-1.5 rounded-full ml-2 shrink-0"
                    style={{ background: "rgba(239,68,68,0.3)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.6)" }}
                  >
                     フリーズ使用
                  </button>
                </div>
              ) : (
                <p className="text-xs" style={{ color: "rgba(252,165,165,0.5)" }}>
                  今日プレイするとストリークを維持できます！
                </p>
              )}
            </div>
          )}
          {freezeApplied && (
            <div className="mb-3 text-center text-xs font-black animate-bounce" style={{ color: "#34d399" }}>
               ストリークフリーズ発動！ストリークを守りました！
            </div>
          )}

          {/* 音声読み上げトグル & BGMミュート */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <button
              aria-label="音声読み上げのオン/オフを切り替え"
              onClick={() => { const v = !voiceEnabled; setVoiceEnabled(v); saveVoice(v); }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={voiceEnabled
                ? { background: "rgba(220,38,38,0.2)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.5)" }
                : { background: "rgba(68,64,60,0.4)", color: "#78716c", border: "1px solid rgba(68,64,60,0.6)" }
              }
            >
              {voiceEnabled ? " 読み上げON" : " 読み上げOFF"}
            </button>
            <button
              aria-label={bgmMuted ? "BGMをオンにする" : "BGMをオフにする"}
              onClick={() => {
                const next = !bgmMuted;
                setBgmMuted(next);
                saveBgmMuted(next);
                bgm.setMuted(next);
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={!bgmMuted
                ? { background: "rgba(123,47,190,0.2)", color: "#c084fc", border: "1px solid rgba(123,47,190,0.5)" }
                : { background: "rgba(68,64,60,0.4)", color: "#78716c", border: "1px solid rgba(68,64,60,0.6)" }
              }
            >
              {bgmMuted ? " BGM OFF" : " BGM ON"}
            </button>
          </div>

          {/* 難易度選択 */}
          <div className="mb-6">
            <p className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: "rgba(220,38,38,0.7)" }}>難易度</p>
            <div className="flex gap-2 justify-center">
              {(["easy", "normal", "hard"] as Difficulty[]).map((d) => {
                const cfg = DIFFICULTY_CONFIG[d];
                const isSelected = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => handleDifficultyChange(d)}
                    className="flex-1 py-2 px-2 rounded-full font-black text-sm transition-all active:scale-95"
                    style={isSelected
                      ? { background: "rgba(220,38,38,0.35)", color: "#fca5a5", border: "2px solid rgba(220,38,38,0.7)" }
                      : { background: "rgba(68,64,60,0.4)", color: "#78716c", border: "2px solid rgba(68,64,60,0.6)" }
                    }
                  >
                    <span className="block text-base">{cfg.emoji}</span>
                    <span className="block">{cfg.label}</span>
                    <span className="block text-xs font-normal mt-0.5" style={{ color: isSelected ? "#fca5a5" : "rgba(120,113,108,0.6)" }}>{cfg.desc}</span>
                    {getDiffBest(d) > 0 && (
                      <span className="block text-xs mt-1" style={{ color: isSelected ? "#fbbf24" : "rgba(120,113,108,0.5)" }}>
                        最高 {getDiffBest(d)}問
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                se.playStart();
                const filtered = shuffle(filterByDifficulty(basePool, difficulty));
                setQuestions(filtered);
                setGameMode("normal");
                setIdx(0);
                setScore(0);
                setStreak(0);
                setDiffNewRecord(false);
                setQuestionResults([]);
                setPhase("playing");
              }}
              aria-label="通常モードを開始"
              className="w-full p-5 rounded-2xl text-left transition-all active:scale-95"
              style={{ background: "rgba(68,64,60,0.6)", border: "2px solid rgba(120,113,108,0.4)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl"></span>
                <div>
                  <p className="text-lg font-black" style={{ color: "#e7e5e4" }}>通常モード</p>
                  <p className="text-xs mt-0.5" style={{ color: "#78716c" }}>10問に挑戦・段位認定あり</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                se.playStart();
                const filtered = shuffle(filterByDifficulty(basePool, difficulty));
                setQuestions(filtered);
                setGameMode("timeattack");
                setTimeLeft(TIME_ATTACK_SECONDS);
                setTaCorrect(0);
                setPhase("playing");
              }}
              aria-label="タイムアタック60秒モードを開始"
              className="w-full p-5 rounded-2xl text-left transition-all active:scale-95"
              style={{ background: "rgba(220,38,38,0.15)", border: "2px solid rgba(220,38,38,0.5)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl"></span>
                <div>
                  <p className="text-lg font-black" style={{ color: "#fca5a5" }}>タイムアタック 60秒</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a87e70" }}>60秒で何問解けるか勝負！スコアをXでシェア</p>
                </div>
              </div>
              <div className="mt-2 text-xs font-bold px-2 py-1 rounded-full w-fit"
                style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5" }}>NEW </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // タイムアタック結果画面
  if (phase === "timeattack_result") {
    const baseUrl = "https://yomigana-sprint.vercel.app";
    const danLevel = getDanLevel(taCorrect, taCorrect + Math.max(0, idx - taCorrect));
    const shareText = `【読み仮名スプリント】60秒タイムアタックで${taCorrect}問正解！段位:${danLevel.rank}${danLevel.badge}\n茨城・薔薇・山葵…あなたは60秒で何問読める？ → ${baseUrl} #難読漢字 #タイムアタック #漢字クイズ`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const tier = taCorrect >= 20 ? "legendary" : taCorrect >= 15 ? "master" : taCorrect >= 10 ? "expert" : "beginner";
    const tierLabel = { legendary: " 伝説の読み師！", master: "️ 漢字マスター！", expert: " なかなかやるね！", beginner: " 練習あるのみ！" }[tier];
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="max-w-md w-full text-center">
          <div className="glass-card rounded-2xl p-6 mb-2 backdrop-blur-md" style={{ background: "rgba(26,26,46,0.85)", border: "1px solid rgba(123,47,190,0.3)", boxShadow: "0 8px 32px rgba(123,47,190,0.15)" }}>
          <div className="text-6xl mb-3 animate-bounce">️</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "#e7e5e4" }}>60秒終了！</h2>
          <p className="text-6xl font-black mb-1" style={{ color: "#fca5a5" }}>{taCorrect}<span className="text-2xl" style={{ color: "#78716c" }}>問正解</span></p>
          {taNewRecord ? (
            <p className="text-base font-black mb-1 animate-bounce" style={{ color: "#fbbf24" }}> NEW RECORD！</p>
          ) : (
            <p className="text-sm mb-1" style={{ color: "#78716c" }}> 自己最高: {taBest}問 {taCorrect >= taBest ? "" : `（あと${taBest - taCorrect + 1}問で更新）`}</p>
          )}
          <p className="text-lg font-black mb-4" style={{ color: "#fbbf24" }}>{tierLabel}</p>
          {/* スコアバー */}
          <div className="w-full rounded-full h-3 mb-6" style={{ background: "rgba(68,64,60,0.6)" }}>
            <div className="h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, taCorrect * 5)}%`, background: "linear-gradient(90deg, #dc2626, #fbbf24)" }} />
          </div>
          <a href={tweetUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full font-bold px-8 py-3 rounded-2xl text-lg mb-3 active:scale-95"
            style={{ background: "#000", color: "#fff" }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {taCorrect}問をXでシェア！
          </a>
          <button
            aria-label="もう一度タイムアタックに挑戦"
            onClick={() => { setIdx(0); setScore(0); setStreak(0); setTaCorrect(0); setTimeLeft(TIME_ATTACK_SECONDS); setPhase("mode_select"); setSelected(null); setIsCorrect(null); }}
            className="w-full font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg, #7B2FBE 0%, #DC2626 50%, #FFD93D 100%)",
              color: "#fff",
              animation: "btnPulse 2s ease-in-out infinite",
              minHeight: 56,
            }}>
            もう一度！
          </button>
          </div>{/* glassmorphism card end */}
        </div>
      </div>
    );
  }

  if (phase === "paywall" || showPaywall) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#e7e5e4" }}>本日の無料問題が終了しました</h2>
          <p className="mb-6" style={{ color: "#78716c" }}>プレミアムで全3,000問に挑戦しよう！</p>
          <div className="rounded-2xl p-6 mb-4"
            style={{ background: "rgba(68,64,60,0.5)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <p className="text-3xl font-black mb-1" style={{ color: "#fca5a5" }}>¥480<span className="text-base font-normal" style={{ color: "#78716c" }}>/月</span></p>
            <ul className="text-sm text-left space-y-2 mt-4" style={{ color: "#a8a29e" }}>
              <li> 全3,000問（地名・人名・難読・JLPT N1〜N5）</li>
              <li> 毎日無制限でプレイ</li>
              <li> ランキング機能</li>
            </ul>
          </div>
          <KomojuButton
            planId="standard"
            planLabel=" プレミアムで道場を続ける →"
            className="w-full font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform disabled:opacity-50 bg-red-700 hover:bg-red-800 text-white"
          />
          <p className="text-xs mt-3" style={{ color: "rgba(120,113,108,0.5)" }}>明日また10問無料でプレイできます</p>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const total = Math.min(idx + 1, questions.length);
    const correctCount = Math.round(score / 100);
    const diffCfg = DIFFICULTY_CONFIG[difficulty];
    const levelLabel = diffCfg.label;
    const baseUrl = "https://yomigana-sprint.vercel.app";
    const ogUrl = `${baseUrl}/api/og?score=${correctCount}&total=${total}&level=${encodeURIComponent(levelLabel)}`;
    const accuracy = Math.round((correctCount / total) * 100);
    const danLevel = getDanLevel(correctCount, total);
    const rankLabel = accuracy >= 90 ? "漢字マスター級！" : accuracy >= 70 ? "なかなかやるね！" : "もっと練習だ！";
    const topPercent = accuracy >= 100 ? "上位1%" : accuracy >= 90 ? "上位5%" : accuracy >= 70 ? "上位20%" : accuracy >= 50 ? "上位50%" : "入門者";
    const isNewDiffRecord = saveDiffBest(difficulty, correctCount);
    if (isNewDiffRecord && !diffNewRecord) setDiffNewRecord(true);
    const currentDiffBest = getDiffBest(difficulty);
    const missCount = wrongQuestions.length;
    const weakListAll = weakList;
    const shareText = `【読み仮名スプリント】${diffCfg.emoji}${diffCfg.label} ${correctCount}/${total}問正解！${topPercent}の漢字力！段位:${danLevel.rank}${danLevel.badge}${missCount > 0 ? ` (苦手${missCount}問を克服中)` : " 全問正解！"} 茨城・薔薇・山葵…あなたは全部読める？ → ${baseUrl} #難読漢字 #読み仮名 #漢字クイズ`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogUrl)}`;
    return (
      <div className="min-h-screen px-4 py-8"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="max-w-md mx-auto text-center">
          {/* スコアカード */}
          <div className="glass-card rounded-2xl p-6 mb-4 backdrop-blur-md" style={{ background: "rgba(26,26,46,0.85)", border: "1px solid rgba(123,47,190,0.3)", boxShadow: "0 8px 32px rgba(123,47,190,0.15)" }}>
          {/* よみまるマスコット（結果画面） */}
          <div className="flex justify-center mb-2">
            <MascotSprite pose="excited" size={72} />
          </div>
          {/* 段位バッジ */}
          <div className="text-7xl mb-2">{danLevel.badge}</div>
          <div className="inline-block px-5 py-2 rounded-full font-black text-xl mb-2"
            style={{ background: "rgba(220,38,38,0.2)", color: danLevel.color, border: `1px solid ${danLevel.color}` }}>
            {danLevel.rank}
          </div>
          {/* 難易度バッジ */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-black"
              style={{ background: "rgba(68,64,60,0.6)", color: "#a8a29e", border: "1px solid rgba(120,113,108,0.4)" }}>
              {diffCfg.emoji} {diffCfg.label}
            </span>
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "#e7e5e4" }}>結果発表！</h2>
          <p className="text-5xl font-black mb-1" style={{ color: "#fca5a5" }}>{score}<span className="text-xl" style={{ color: "#a8a29e" }}>点</span></p>
          <p className="mb-1" style={{ color: "#78716c" }}>{total}問中 {correctCount}問正解 / 正解率{accuracy}%</p>
          {isNewDiffRecord ? (
            <p className="text-sm font-black mb-1 animate-bounce" style={{ color: "#fbbf24" }}> [{diffCfg.label}] 自己記録更新！{correctCount}問</p>
          ) : (
            <p className="text-xs mb-1" style={{ color: "#78716c" }}> [{diffCfg.label}] 最高: {currentDiffBest}問</p>
          )}
          <p className="text-sm font-bold mb-4" style={{ color: danLevel.color }}>{rankLabel}</p>

          {/* タブ切り替え */}
          <div className="flex gap-2 mb-4">
            <button
              aria-label="結果タブを表示"
              onClick={() => setResultTab("result")}
              className="flex-1 py-2 rounded-xl text-sm font-black transition-all"
              style={resultTab === "result"
                ? { background: "rgba(220,38,38,0.35)", color: "#fca5a5", border: "2px solid rgba(220,38,38,0.7)" }
                : { background: "rgba(68,64,60,0.4)", color: "#78716c", border: "2px solid rgba(68,64,60,0.6)" }}
            >
               結果
            </button>
            <button
              aria-label="苦手克服タブを表示"
              onClick={() => setResultTab("weak")}
              className="flex-1 py-2 rounded-xl text-sm font-black transition-all relative"
              style={resultTab === "weak"
                ? { background: "rgba(220,38,38,0.35)", color: "#fca5a5", border: "2px solid rgba(220,38,38,0.7)" }
                : { background: "rgba(68,64,60,0.4)", color: "#78716c", border: "2px solid rgba(68,64,60,0.6)" }}
            >
               苦手克服
              {weakListAll.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: "#dc2626", color: "#fff", minWidth: "20px" }}>
                  {weakListAll.length}
                </span>
              )}
            </button>
          </div>

          {resultTab === "result" ? (
            <>
              {/* 今回の間違い */}
              {wrongQuestions.length > 0 && (
                <div className="rounded-2xl p-4 mb-4 text-left"
                  style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                  <p className="text-xs font-black mb-2" style={{ color: "#fca5a5" }}>今回間違えた {wrongQuestions.length}問 — 苦手リストに追加済み</p>
                  <div className="space-y-1.5">
                    {wrongQuestions.map(q => (
                      <div key={q.kanji} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                        style={{ background: "rgba(68,64,60,0.5)" }}>
                        <span className="text-lg font-black" style={{ color: "#fff" }}>{q.kanji}</span>
                        <span className="text-sm font-bold" style={{ color: "#fca5a5" }}>{q.correct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Streak Freeze獲得（全問正解ボーナス） */}
              {correctCount === total && total >= 5 && (
                <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.4)" }}>
                  <p className="text-xs font-black mb-1" style={{ color: "#38bdf8" }}> ストリークフリーズ獲得！</p>
                  <p className="text-xs mb-2" style={{ color: "rgba(56,189,248,0.7)" }}>
                    全問正解ボーナス！ストリークフリーズが1個追加されました。<br />
                    万が一プレイできない日があってもストリークを守れます。
                  </p>
                  <p className="text-xs font-bold" style={{ color: "#38bdf8" }}>
                     残りフリーズ: {streakFreezeCount + 1}個
                  </p>
                  {typeof window !== "undefined" && (() => {
                    // 付与処理（表示と同時に実行）
                    const newCount = getStreakFreezeCount() + 1;
                    // 重複付与防止: todayキーで管理
                    const todayKey = `yomigana_freeze_awarded_${new Date().toISOString().slice(0, 10)}`;
                    if (!localStorage.getItem(todayKey)) {
                      saveStreakFreezeCount(newCount);
                      localStorage.setItem(todayKey, "1");
                    }
                    return null;
                  })()}
                </div>
              )}
              <CertificateButton score={score} diffLabel={diffCfg.label} />
              {/* Wordle式グリッドシェア */}
              {questionResults.length > 0 && (
                <div className="rounded-2xl p-4 mb-3" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)" }}>
                  <p className="text-center text-xs font-bold mb-2" style={{ color: "#fca5a5" }}> 今日の結果グリッド</p>
                  <div className="text-center text-2xl tracking-widest mb-3 leading-relaxed">
                    {questionResults.map(r => r ? '' : '').join('')}
                  </div>
                  <button
                    onClick={() => {
                      const grid = questionResults.map(r => r ? '' : '').join('');
                      const correctN = questionResults.filter(Boolean).length;
                      const text = `今日の難読漢字 ${correctN}/${questionResults.length}\n${grid}\n#読み仮名スプリント`;
                      const url = 'https://yomigana-sprint.vercel.app';
                      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 w-full font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-transform"
                    style={{ background: "#18181b", color: "#fff" }}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    今日の結果をXでシェア
                  </button>
                </div>
              )}
              <a href={tweetUrl} target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full font-bold px-8 py-3 rounded-2xl text-lg mb-3 transition-all active:scale-95"
                style={{ background: "#000", color: "#fff" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {danLevel.rank}をXで自慢する {danLevel.badge}
              </a>
              <button
                onClick={() => { setIdx(0); setScore(0); setStreak(0); setDiffNewRecord(false); setWrongQuestions([]); setQuestionResults([]); setResultTab("result"); setPhase("mode_select"); setShowStreakBanner(false); }}
                aria-label="もう一度挑戦する"
                className="w-full font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #7B2FBE 0%, #DC2626 50%, #FFD93D 100%)",
                  color: "#fff",
                  animation: "btnPulse 2s ease-in-out infinite",
                  minHeight: 56,
                }}>
                もう一度挑戦！
              </button>
            </>
          ) : (
            /* 苦手克服タブ */
            <div className="text-left">
              {weakListAll.length === 0 ? (
                <div className="text-center py-8" style={{ color: "#78716c" }}>
                  <div className="text-4xl mb-3"></div>
                  <p className="font-black" style={{ color: "#fca5a5" }}>苦手リストが空です！</p>
                  <p className="text-sm mt-1">まだ間違えていません。このまま続けよう！</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold mb-3" style={{ color: "rgba(252,165,165,0.6)" }}>
                    累計 {weakListAll.length}問の苦手漢字 — 何度も復習して克服しよう！
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {weakListAll.map(w => (
                      <div key={w.kanji}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(68,64,60,0.5)", border: "1px solid rgba(220,38,38,0.2)" }}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black" style={{ color: "#fff" }}>{w.kanji}</span>
                          <div>
                            <span className="text-base font-bold block" style={{ color: "#fca5a5" }}>{w.correct}</span>
                            <span className="text-xs" style={{ color: "rgba(120,113,108,0.8)" }}>{w.level} • {w.missCount}回ミス</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { removeFromWeakList(w.kanji); setWeakList(getWeakList()); }}
                          className="text-xs px-2 py-1 rounded-lg transition-all"
                          style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", border: "1px solid rgba(34,197,94,0.4)" }}>
                          覚えた
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-center mt-3" style={{ color: "rgba(120,113,108,0.5)" }}>
                    「覚えた」を押すとリストから削除されます
                  </p>
                </>
              )}
              <button
                onClick={() => { setIdx(0); setScore(0); setStreak(0); setDiffNewRecord(false); setWrongQuestions([]); setQuestionResults([]); setResultTab("result"); setPhase("mode_select"); setShowStreakBanner(false); }}
                aria-label="もう一度挑戦する"
                className="w-full font-black py-4 rounded-2xl text-lg active:scale-95 transition-transform shadow-lg mt-4"
                style={{
                  background: "linear-gradient(135deg, #7B2FBE 0%, #DC2626 50%, #FFD93D 100%)",
                  color: "#fff",
                  animation: "btnPulse 2s ease-in-out infinite",
                  minHeight: 56,
                }}>
                もう一度挑戦！
              </button>
            </div>
          )}
        </div>
          </div>{/* glassmorphism card end */}
      </div>
    );
  }

  const choicesToShow = shuffle(current.choices);

  return (
    <div
      id="game-container"
      className={`min-h-screen px-4 py-8 relative ${shakeActive ? "animate-shake" : ""}`}
      style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 50%, #0f3460 100%)" }}
    >
      {/* ScorePopLayer: fixed overlay */}
      <ScorePopLayer
        items={scorePopItems}
        onRemove={id => setScorePopItems(prev => prev.filter(p => p.id !== id))}
      />

      {/* Lottieキャラ感情反応アニメーション */}
      <LottiePlayer
        state={lottieState}
        onComplete={() => setLottieState('idle')}
      />

      {/* 不正解赤フラッシュオーバーレイ */}
      {wrongOverlay && (
        <div
          className="fixed inset-0 pointer-events-none z-50 animate-wrong-flash"
          aria-hidden="true"
        />
      )}

      {/* ログインストリークバナー */}
      {showLoginStreakBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3 rounded-2xl font-black text-white text-lg shadow-2xl animate-bounce"
            style={{ background: "linear-gradient(135deg, #7B2FBE, #FFD93D)", boxShadow: "0 0 30px rgba(123,47,190,0.7)" }}>
            {loginStreak}日連続道場入門！
          </div>
        </div>
      )}

      {/* 3連続正解フラッシュバナー（グラスモーフィズム + ゴールドグロー） */}
      {showStreakBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-8 py-3 rounded-2xl font-black text-white text-xl glass-card"
            style={{
              background: "rgba(255,217,61,0.18)",
              border: "1px solid rgba(255,217,61,0.5)",
              boxShadow: "0 0 32px rgba(255,217,61,0.6), 0 0 64px rgba(255,217,61,0.2)",
              color: "#FFD93D",
            }}>
            {streak}連続正解！
          </div>
        </div>
      )}

      {/* よみまるマスコット（右上コーナー常時表示） */}
      <div className="fixed top-4 right-4 z-40 pointer-events-none">
        <MascotSprite pose={mascotPose} size={64} />
      </div>

      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        {gameMode === "timeattack" ? (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(123,47,190,0.25)", color: "#c084fc", border: "1px solid rgba(123,47,190,0.5)" }}>
              タイムアタック
            </span>
            <div className={`text-3xl font-black tabular-nums transition-all ${timeLeft <= 10 ? "animate-pulse" : ""}`}
              style={{ color: timeLeft <= 10 ? "#ef4444" : "#FFD93D" }}>
              {timeLeft}<span className="text-base font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>s</span>
            </div>
            <div className="text-right">
              <span className="font-black text-lg block tabular-nums" style={{ color: "#FFD93D" }}>{taCorrect}</span>
              {taBest > 0 && <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>最高{taBest}</span>}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>問題 {idx + 1} / {questions.length}</span>
            <span className="font-black text-lg tabular-nums" style={{ color: "var(--xp-yellow)", textShadow: "0 0 12px rgba(255,217,61,0.6)" }}>{score}点</span>
            {streak >= 3 ? (
              <span className="text-sm font-black px-3 py-1 rounded-full glass-card"
                style={{
                  background: "rgba(255,150,0,0.15)",
                  color: "var(--streak-orange)",
                  border: "1px solid rgba(255,150,0,0.5)",
                  boxShadow: "0 0 12px rgba(255,150,0,0.4)",
                }}>
                {streak}連続
              </span>
            ) : (
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>連続: {streak}</span>
            )}
          </div>
        )}

        {/* ログインストリーク表示 + StreakFlame */}
        {loginStreak >= 1 && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card"
              style={{ background: "rgba(123,47,190,0.15)", border: "1px solid rgba(123,47,190,0.35)" }}>
              <StreakFlame streak={loginStreak} />
              <span className="text-sm font-bold" style={{ color: "#c084fc" }}>{loginStreak}日連続道場</span>
            </div>
          </div>
        )}

        {/* 進捗バー */}
        <div className="w-full rounded-full h-2 mb-8" style={{ background: "rgba(255,255,255,0.08)" }}>
          {gameMode === "timeattack" ? (
            <div className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / TIME_ATTACK_SECONDS) * 100}%`, background: timeLeft <= 10 ? "linear-gradient(90deg, #dc2626, #ef4444)" : "linear-gradient(90deg, #7B2FBE, #00F5FF)" }} />
          ) : (
            <div className="h-2 rounded-full transition-all"
              style={{ width: `${((idx) / questions.length) * 100}%`, background: "linear-gradient(90deg, #7B2FBE, #00F5FF)" }} />
          )}
        </div>

        {/* 問題カード（glass-card） */}
        <div className="glass-card text-center mb-6 px-6 py-8 animate-fade-in relative"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <p className="text-xs mb-3 uppercase tracking-widest font-bold"
            style={{ color: "rgba(0,245,255,0.7)" }}>{current.level}</p>
          <p
            className={`text-7xl font-black mb-3 ${isCorrect === true ? "animate-kanji-glow" : ""}`}
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #E2DCFF 50%, #00F5FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(0,245,255,0.3))",
            }}
          >
            {current.kanji}
          </p>
          {current.hint && (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ヒント: {current.hint}</p>
          )}
          {/* 正解バースト */}
          <CorrectBurst active={burstActive} />
        </div>

        {/* 選択肢（glass-card化・56px以上・正解=緑グロー・不正解=赤グロー） */}
        <div className="grid grid-cols-2 gap-3">
          {choicesToShow.map(choice => {
            let extraStyle: React.CSSProperties = {};
            let extraCls = "";
            if (phase === "answered") {
              if (choice === current.correct) {
                extraStyle = {
                  background: "rgba(88,204,2,0.18)",
                  border: "2px solid var(--correct-green)",
                  color: "#a3f07a",
                  boxShadow: "0 0 20px rgba(88,204,2,0.5), 0 0 40px rgba(88,204,2,0.2)",
                };
              } else if (choice === selected) {
                extraStyle = {
                  background: "rgba(255,75,75,0.18)",
                  border: "2px solid var(--incorrect-red)",
                  color: "#ffb3b3",
                  boxShadow: "0 0 16px rgba(255,75,75,0.4)",
                };
              } else {
                extraStyle = {
                  background: "rgba(255,255,255,0.03)",
                  border: "2px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.25)",
                };
              }
            } else {
              extraCls = "cursor-pointer active:scale-95 hover:border-[rgba(123,47,190,0.6)]";
              extraStyle = {
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.12)",
                color: "#E2DCFF",
              };
            }
            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={phase === "answered"}
                aria-label={`選択肢: ${choice}`}
                className={`glass-card rounded-xl text-lg font-black transition-all ${extraCls}`}
                style={{
                  minHeight: 56,
                  padding: "12px 8px",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  ...extraStyle,
                }}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* 音声トグル & BGMミュート & 無料残り表示 */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { const v = !voiceEnabled; setVoiceEnabled(v); saveVoice(v); }}
              aria-label={voiceEnabled ? "音声読み上げをオフにする" : "音声読み上げをオンにする"}
              className="text-xs px-3 py-2 rounded-full transition-all min-h-[44px]"
              style={voiceEnabled
                ? { background: "rgba(123,47,190,0.2)", color: "#c084fc", border: "1px solid rgba(123,47,190,0.4)" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {voiceEnabled ? "読み上げON" : "読み上げOFF"}
            </button>
            <button
              onClick={() => {
                const next = !bgmMuted;
                setBgmMuted(next);
                saveBgmMuted(next);
                bgm.setMuted(next);
              }}
              aria-label={bgmMuted ? "BGMをオンにする" : "BGMをオフにする"}
              className="text-xs px-3 py-2 rounded-full transition-all min-h-[44px]"
              style={!bgmMuted
                ? { background: "rgba(220,38,38,0.2)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.4)" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {bgmMuted ? "BGM OFF" : "BGM ON"}
            </button>
          </div>
          {!isPremium && (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              無料: {FREE_LIMIT - dailyCount}問残り
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
