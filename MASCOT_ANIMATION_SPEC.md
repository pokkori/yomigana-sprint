# キャラクター感情反応アニメ 実装仕様書
**対象プロジェクト**: 読み仮名スプリント / 漢字マージ  
**調査日**: 2026-04-01  
**差別化根拠**: 日本の漢字学習ゲームでキャラクター感情反応アニメを持つ競合はゼロ（2026年4月調査）

---

## 1. ライブラリ選定

### 1-A. Next.js (Web) のアニメーションライブラリ比較

| 項目 | lottie-react | @lottiefiles/dotlottie-react | @rive-app/react-canvas |
|---|---|---|---|
| ファイル形式 | .json (Lottie) | .lottie (圧縮) / .json | .riv (独自) |
| ファイルサイズ削減 | 基準 | 最大80%削減 | 最大90%削減 |
| レンダリング | JS | WebAssembly | WebAssembly |
| CPU使用率 | 中 | 低 | 最低 |
| 型定義 | あり | あり | あり |
| 無料素材の入手 | LottieFilesで豊富 | LottieFilesで豊富 | コミュニティ限定 |
| インタラクティブ性 | 低 | 低 | 非常に高い（State Machine） |
| 本プロジェクト推奨 | サブ（既存ファイル再生） | メイン（新規実装） | 将来移行候補 |

**結論**: 短期実装は `@lottiefiles/dotlottie-react` を採用。
- WebAssembly レンダリングで CPU 負荷が最小
- .lottie 形式で JSON 比 80% 軽量
- LottieFiles の無料素材をそのまま使用可能
- キャラクター感情反応の将来的な高度化は Rive への移行を推奨

インストール:
```bash
npm install @lottiefiles/dotlottie-react
```

---

### 1-B. React Native / Expo での選定

現在のプロジェクト（読み仮名スプリント・漢字マージ）は Next.js + Capacitor 構成のため、
Web 向けライブラリ（1-A）がそのまま適用される。

Expo SDK（lottie-react-native）が必要になった場合の参考:

| 項目 | lottie-react-native | expo-lottie (廃止済み) |
|---|---|---|
| Expo SDK 53 対応 | v7.3.1 以上 | 廃止 |
| Expo SDK 54 対応 | v7.3.1 以上 | 廃止 |
| Web 互換 | 非対応（要 dotlottie-react 併用） | - |
| 注意点 | .lottie 形式は SDK53 で Android 不具合あり（Issue #39509） | - |

**現プロジェクト（Capacitor/Next.js）では lottie-react-native は不要。**  
Web 向け `@lottiefiles/dotlottie-react` のみで両対応。

---

## 2. 無料 Lottie アニメーションファイル一覧

以下はすべて LottieFiles 上の無料（Free）アニメーション。
各ページから「Download」→「Lottie JSON」でダウンロード、または「Get CDN Link」で URL を取得。

| 用途 | ファイル名候補 | LottieFiles URL | 推奨用途 |
|---|---|---|---|
| 正解・祝福 | confetti-celebration | https://lottiefiles.com/free-animation/confetti-celebration-Lky7mp9Ixs | 正解パーティクル |
| 正解・祝福2 | confetti-celebration-2 | https://lottiefiles.com/free-animation/confetti-celebration-LXxcaxmSdk | コンボ10以上 |
| 正解・祝福3 | confetti-celebration-3 | https://lottiefiles.com/free-animation/confetti-celebration-FWJDS5I0hD | フィーバー演出 |
| 不正解 | error | https://lottiefiles.com/3541-error | 不正解リアクション |
| 読み込み+成功+失敗 | loading-success-error | https://lottiefiles.com/20102-loading-animation-with-success-and-error | 汎用UI |
| 成功完了 | success-celebration | https://lottiefiles.com/free-animations/success-celebration | ゲームクリア |
| 炎(ストリーク) | fire (コレクションから選択) | https://lottiefiles.com/free-animations/fire | ストリーク表示 |
| コンフェッティ透過 | confetti-transparent | https://lottiefiles.com/free-animation/confetti-on-transparent-background-ajhx1TPBa7 | 全画面オーバーレイ |

**ダウンロード後の配置**:
```
public/
  lottie/
    correct.json        (confetti-celebration)
    wrong.json          (error)
    fever.json          (confetti-transparent)
    game-clear.json     (success-celebration)
    streak-fire.json    (fire)
```

**CDN 利用の注意**: LottieFiles の CDN URL（assets6.lottiefiles.com）は
ファイアウォール環境でブロックされる場合がある。
本番環境では必ず public/ に JSON を配置してセルフホスティングすること。

---

## 3. Next.js App Router での実装コード

### 3-A. SSR 対策の正しいパターン

App Router では Lottie は必ず Client Component として分離する。
`dynamic import + ssr: false` はサーバーコンポーネントでは使用不可。
クライアントコンポーネント内でのみ有効。

**パターン1（推奨）: "use client" を付けた専用コンポーネントを作成**

```tsx
// components/LottiePlayer.tsx
"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottiePlayerProps {
  src: string;          // "/lottie/correct.json" など
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
}

export default function LottiePlayer({
  src,
  loop = false,
  autoplay = true,
  style,
}: LottiePlayerProps) {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      style={{ width: 200, height: 200, ...style }}
    />
  );
}
```

**パターン2: dynamic import でコード分割（Page から使う場合）**

```tsx
// app/game/page.tsx （Server Component）
import dynamic from "next/dynamic";

// ssr: false は Client Component の中でのみ有効
// → Wrapper を挟む必要がある
const LottiePlayer = dynamic(() => import("@/components/LottiePlayer"), {
  ssr: false,
  loading: () => <div style={{ width: 200, height: 200 }} />,
});
```

---

### 3-B. キャラクター感情反応 統合コンポーネント（コピペ可能）

```tsx
// components/MascotWithLottie.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

// マスコットの状態型
export type MascotState = "idle" | "happy" | "sad" | "fever";

interface MascotWithLottieProps {
  mascotState: MascotState;
  onAnimationComplete?: () => void;
  size?: number;
}

// 状態→Lottieファイルのマッピング
const LOTTIE_MAP: Record<Exclude<MascotState, "idle">, string> = {
  happy: "/lottie/correct.json",
  sad:   "/lottie/wrong.json",
  fever: "/lottie/fever.json",
};

export default function MascotWithLottie({
  mascotState,
  onAnimationComplete,
  size = 200,
}: MascotWithLottieProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const prevStateRef = useRef<MascotState>("idle");

  // DotLottie インスタンス取得コールバック
  const dotLottieRefCallback = (instance: DotLottie | null) => {
    setDotLottie(instance);
  };

  // 状態変化を検知してアニメーション再生
  useEffect(() => {
    if (!dotLottie) return;
    if (mascotState === "idle") return;
    if (prevStateRef.current === mascotState) return;

    prevStateRef.current = mascotState;
    dotLottie.play();
  }, [mascotState, dotLottie]);

  // アニメーション完了時コールバック登録
  useEffect(() => {
    if (!dotLottie || !onAnimationComplete) return;
    const handler = () => onAnimationComplete();
    dotLottie.addEventListener("complete", handler);
    return () => dotLottie.removeEventListener("complete", handler);
  }, [dotLottie, onAnimationComplete]);

  // idle 状態では Lottie を非表示（SVGマスコットを別途表示）
  if (mascotState === "idle") return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <DotLottieReact
        src={LOTTIE_MAP[mascotState]}
        autoplay={false}
        loop={mascotState === "fever"}
        dotLottieRefCallback={dotLottieRefCallback}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
```

---

### 3-C. ゲーム本体での状態管理パターン（コピペ可能）

```tsx
// components/YomiganaGame.tsx（抜粋・追記箇所）
"use client";
import { useState, useCallback, useRef } from "react";
import MascotSprite, { type MascotPose } from "./MascotSprite";
import MascotWithLottie, { type MascotState } from "./MascotWithLottie";

// 既存の MascotPose と新しい MascotState の対応表
// MascotPose  → SVGマスコットの見た目制御（既存）
// MascotState → Lottieオーバーレイの制御（新規追加）

export default function YomiganaGame() {
  // 既存 state
  const [mascotPose, setMascotPose] = useState<MascotPose>("idle");
  const [combo, setCombo] = useState(0);

  // 新規追加: Lottie 状態
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const mascotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // マスコット状態を一時的にセットし、指定ms後に idle に戻す
  const triggerMascot = useCallback(
    (state: MascotState, durationMs: number) => {
      if (mascotTimerRef.current) clearTimeout(mascotTimerRef.current);
      setMascotState(state);
      mascotTimerRef.current = setTimeout(() => {
        setMascotState("idle");
        mascotTimerRef.current = null;
      }, durationMs);
    },
    []
  );

  // 正解処理
  const handleCorrect = useCallback(() => {
    const newCombo = combo + 1;
    setCombo(newCombo);

    if (newCombo >= 10) {
      // コンボ10以上: フィーバー（全画面オーバーレイ、2000ms）
      setMascotPose("excited");
      triggerMascot("fever", 2000);
    } else {
      // 通常正解: 300ms で happy → idle
      setMascotPose("correct");
      triggerMascot("happy", 300);
    }

    // SVGマスコットは 600ms 後に idle に戻す
    setTimeout(() => setMascotPose("idle"), 600);
  }, [combo, triggerMascot]);

  // 不正解処理
  const handleWrong = useCallback(() => {
    setCombo(0);
    // 不正解: 200ms で sad → idle
    setMascotPose("wrong");
    triggerMascot("sad", 200);

    // SVGマスコットは 500ms 後に idle に戻す
    setTimeout(() => setMascotPose("idle"), 500);
  }, [triggerMascot]);

  return (
    <div style={{ position: "relative" }}>
      {/* 既存: SVGマスコット（idle/correct/wrong/excited の見た目） */}
      <MascotSprite pose={mascotPose} size={80} />

      {/* 新規追加: Lottie 感情オーバーレイ */}
      <MascotWithLottie
        mascotState={mascotState}
        onAnimationComplete={() => setMascotState("idle")}
        size={mascotState === "fever" ? 360 : 200}
      />

      {/* 既存のゲームUI ... */}
    </div>
  );
}
```

---

## 4. ストリーク炎アニメーション（SVG + CSS）

Duolingo は Lottie + Rive を使用しているが、
本プロジェクトでは追加ライブラリなしで実装できる CSS SVG 版を提供する。

### 4-A. 3段階炎コンポーネント（コピペ可能）

```tsx
// components/StreakFlame.tsx
"use client";

type FlameLevel = "small" | "medium" | "large";

interface StreakFlameProps {
  days: number;   // 連続日数
  size?: number;  // 基準サイズ (px)
}

function getFlameLevel(days: number): FlameLevel {
  if (days >= 30) return "large";
  if (days >= 7)  return "medium";
  return "small";
}

export default function StreakFlame({ days, size = 48 }: StreakFlameProps) {
  const level = getFlameLevel(days);

  const scaleMap: Record<FlameLevel, number> = {
    small:  1.0,
    medium: 1.3,
    large:  1.7,
  };
  const sc = scaleMap[level];
  const w = size * sc;
  const h = size * sc * 1.3;

  // 演出強度に応じたアニメーション速度
  const flickerSpeed: Record<FlameLevel, string> = {
    small:  "1.4s",
    medium: "1.0s",
    large:  "0.7s",
  };

  // large 時は外炎を追加
  const showOuterFlame = level === "large";

  return (
    <>
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scaleX(1)   scaleY(1)   translateY(0); }
          25%       { transform: scaleX(0.92) scaleY(1.05) translateY(-2px); }
          50%       { transform: scaleX(1.06) scaleY(0.97) translateY(1px); }
          75%       { transform: scaleX(0.96) scaleY(1.03) translateY(-1px); }
        }
        @keyframes outerFlameFlicker {
          0%, 100% { opacity: 0.6; transform: scaleX(1)   scaleY(1); }
          33%       { opacity: 0.8; transform: scaleX(1.1) scaleY(0.95); }
          66%       { opacity: 0.5; transform: scaleX(0.9) scaleY(1.08); }
        }
        .streak-flame-inner {
          animation: flameFlicker ${flickerSpeed[level]} ease-in-out infinite;
          transform-origin: center bottom;
        }
        .streak-flame-outer {
          animation: outerFlameFlicker ${flickerSpeed[level]} ease-in-out infinite 0.2s;
          transform-origin: center bottom;
        }
      `}</style>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
        aria-label={`${days}日連続ストリーク`}
      >
        <svg
          width={w}
          height={h}
          viewBox="0 0 48 62"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            {/* メイン炎グラデ: #FF6B35 → #FFD93D */}
            <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
              <stop offset="0%"   stopColor="#FFD93D" />
              <stop offset="50%"  stopColor="#FF8C42" />
              <stop offset="100%" stopColor="#FF6B35" />
            </radialGradient>
            {/* 外炎グラデ（large 専用） */}
            <radialGradient id="outerFlameGrad" cx="50%" cy="80%" r="60%">
              <stop offset="0%"   stopColor="#FF6B35" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#CC2200" stopOpacity="0.2" />
            </radialGradient>
            {/* グロー */}
            <filter id="flameGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 外炎（30日以上のみ） */}
          {showOuterFlame && (
            <g className="streak-flame-outer">
              <path
                d="M 24 62 C 4 50 2 30 12 14 C 14 24 18 26 22 22
                   C 10 8 20 0 24 0 C 28 0 38 8 26 22
                   C 30 26 34 24 36 14 C 46 30 44 50 24 62 Z"
                fill="url(#outerFlameGrad)"
                transform="scale(1.25) translate(-4.8, -7.5)"
              />
            </g>
          )}

          {/* メイン炎 */}
          <g className="streak-flame-inner" filter="url(#flameGlow)">
            <path
              d="M 24 60 C 8 50 6 32 14 18 C 16 26 20 28 22 24
                 C 12 10 22 2 24 2 C 26 2 36 10 26 24
                 C 28 28 32 26 34 18 C 42 32 40 50 24 60 Z"
              fill="url(#flameGrad)"
            />
            {/* ハイライト（炎の輝き） */}
            <ellipse
              cx="21" cy="36"
              rx="5" ry="10"
              fill="rgba(255,255,200,0.35)"
              transform="rotate(-8, 21, 36)"
            />
          </g>
        </svg>

        {/* 日数テキスト */}
        <span
          style={{
            fontWeight: 800,
            fontSize: size * 0.33,
            color: level === "large" ? "#FFD93D" : "#FF8C42",
            textShadow: "0 0 8px rgba(255,107,53,0.8)",
            letterSpacing: -0.5,
            lineHeight: 1,
          }}
        >
          {days}日
        </span>
      </div>
    </>
  );
}
```

### 4-B. 3段階演出仕様

| 連続日数 | レベル | 炎サイズ | アニメ速度 | 外炎 | テキスト色 |
|---|---|---|---|---|---|
| 1〜6日 | small | 1.0倍 | 1.4秒 | なし | #FF8C42 |
| 7〜29日 | medium | 1.3倍 | 1.0秒 | なし | #FF8C42 |
| 30日以上 | large | 1.7倍 | 0.7秒 | あり | #FFD93D |

---

## 5. フィーバー全画面オーバーレイ（コンボ10以上）

```tsx
// components/FeverOverlay.tsx
"use client";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface FeverOverlayProps {
  active: boolean;
  onComplete: () => void;
}

export default function FeverOverlay({ active, onComplete }: FeverOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        // グラスモーフィズム背景
        background: "rgba(123, 47, 190, 0.15)",
        backdropFilter: "blur(4px)",
      }}
      aria-hidden="true"
    >
      {/* テキスト */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 48,
          fontWeight: 900,
          color: "#FFD93D",
          textShadow: "0 0 20px rgba(255,217,61,0.9), 0 0 40px rgba(255,107,53,0.6)",
          letterSpacing: 4,
          whiteSpace: "nowrap",
          animation: "feverTextPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        FEVER!!
      </div>

      {/* Lottie コンフェッティ */}
      <DotLottieReact
        src="/lottie/fever.json"
        autoplay
        loop={false}
        style={{ width: "100vw", height: "100vh" }}
      />

      <style>{`
        @keyframes feverTextPop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.5); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
```

---

## 6. 統合後の完全な状態管理パターン

```typescript
// ゲームコンポーネント内の型定義と状態管理（設計仕様）

// 状態型
type MascotState = "idle" | "happy" | "sad" | "fever";
type MascotPose  = "idle" | "correct" | "wrong" | "excited"; // 既存

// タイムライン（各演出の持続時間）
const MASCOT_TIMING = {
  happy: {
    lottieDuration:  300,  // Lottie 表示時間 (ms)
    svgPoseDuration: 600,  // SVGマスコット正解ポーズ持続 (ms)
  },
  sad: {
    lottieDuration:  200,  // Lottie 表示時間 (ms)
    svgPoseDuration: 500,  // SVGマスコット不正解ポーズ持続 (ms)
  },
  fever: {
    lottieDuration:  2000, // Lottie 全画面表示時間 (ms)
    svgPoseDuration: 2000,
  },
} as const;

// 正解時の演出フロー
// t=0ms   : SVGマスコット → "correct" ポーズ / Lottie → "happy" アニメ開始
// t=300ms : Lottie → "idle" （非表示）
// t=600ms : SVGマスコット → "idle" ポーズ

// 不正解時の演出フロー
// t=0ms   : SVGマスコット → "wrong" ポーズ / Lottie → "sad" アニメ開始
// t=200ms : Lottie → "idle" （非表示）
// t=500ms : SVGマスコット → "idle" ポーズ

// コンボ10以上の演出フロー
// t=0ms    : SVGマスコット → "excited" ポーズ / FeverOverlay 表示
// t=2000ms : FeverOverlay 非表示 / SVGマスコット → "idle" ポーズ
```

---

## 7. 実装優先順位（spec-writer 向け）

### 表現性スコア向上のための優先実装（+3〜+4点）

1. **MascotWithLottie コンポーネント追加**（最優先）
   - 既存 MascotSprite.tsx はそのまま維持
   - オーバーレイとして Lottie を重ねるだけ
   - 推定工数: 2時間

2. **FeverOverlay コンポーネント追加**（2番目）
   - コンボ10以上でのみ表示
   - 既存のコンボカウンタ変数に条件分岐を追加するだけ
   - 推定工数: 1時間

3. **StreakFlame コンポーネント追加**（3番目）
   - 連続日数データが存在する場合のみ実装
   - 追加ライブラリ不要（純 CSS SVG）
   - 推定工数: 1時間

### 必ず避けるべき設計

- **Lottie を毎フレーム再生成しない**: `key` prop を変えてマウント/アンマウントを繰り返すとメモリリークの原因になる。`dotLottie.play()` で制御する
- **全画面 Lottie を常時 DOM に置かない**: idle 時は `display: none` ではなく条件レンダリング（`if (!active) return null`）で DOM から除去する

---

## 8. Soundraw BGM プロンプト（ゲーム状況連動）

### 読み仮名スプリント 通常BGM
```
Genre: Electronic / Chiptune
BPM: 132
Instruments: Synth Lead, Chiptune Bass, Hi-hat, Snare
Mood: Focused, Playful
Duration: 60s loop
Keywords: 8-bit, study, concentration, light tension
```

### フィーバーBGM（コンボ10以上時に切り替え）
```
Genre: Electronic / Dance
BPM: 148
Instruments: Synth, Rave Bass, Full Drum Kit, Stabs
Mood: Exciting, Euphoric
Duration: 15s loop (フィーバー終了後に通常BGMにクロスフェード)
Keywords: fever, hype, celebration, intense
```

---

## Sources（調査元）

- [lottie-react npm](https://www.npmjs.com/package/lottie-react)
- [dotlottie-react Developers Guide](https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-react/)
- [LottieFiles Free Confetti Celebration by Bryan GR](https://lottiefiles.com/free-animation/confetti-celebration-Lky7mp9Ixs)
- [LottieFiles Free Confetti by Sergey Riznyk](https://lottiefiles.com/free-animation/confetti-celebration-LXxcaxmSdk)
- [LottieFiles Free Confetti by Eric Puigmarti](https://lottiefiles.com/free-animation/confetti-celebration-FWJDS5I0hD)
- [LottieFiles Free Error Animation](https://lottiefiles.com/3541-error)
- [LottieFiles Success Celebration](https://lottiefiles.com/free-animations/success-celebration)
- [LottieFiles Confetti Transparent](https://lottiefiles.com/free-animation/confetti-on-transparent-background-ajhx1TPBa7)
- [Rive React Docs](https://rive.app/docs/runtimes/react/react)
- [Engineering Interactive Mascots with Rive](https://dev.to/uianimation/engineering-interactive-mascots-with-rives-state-machine-and-runtime-architecture-4e2h)
- [Duolingo Streak Animation Blog](https://blog.duolingo.com/streak-milestone-design-animation/)
- [lottie-react-native SDK53 .lottie Android Issue](https://github.com/expo/expo/issues/39509)
- [Next.js Lazy Loading Guide](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [8awake Lottie Best Practices](https://www.8awake.com/best-practices-implementing-lottie-animations-on-the-web/)
