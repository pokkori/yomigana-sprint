"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * Web Audio API を使ったSEフック
 * 外部MP3ファイル不要・コード完結
 */

// ---- 低レベルヘルパー ----
function playTone(
  ctx: AudioContext,
  freqs: number | number[],
  duration: number,
  wave: OscillatorType,
  vol: number,
  pitchRamp?: { from: number; to: number },
): void {
  const now = ctx.currentTime;
  const freqArr = Array.isArray(freqs) ? freqs : [freqs];
  const interval = duration / 1000 / freqArr.length;

  freqArr.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    if (pitchRamp && freqArr.length === 1) {
      osc.frequency.setValueAtTime(pitchRamp.from, now + i * interval);
      osc.frequency.linearRampToValueAtTime(pitchRamp.to, now + (i + 1) * interval);
    } else {
      osc.frequency.value = f;
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    const start = now + i * interval;
    const end = start + interval;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.01);
    gain.gain.setValueAtTime(vol, end - 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, end);
    osc.start(start);
    osc.stop(end);
  });
}

// 和音（同時発音）
function playChord(
  ctx: AudioContext,
  freqs: number[],
  duration: number,
  wave: OscillatorType,
  vol: number,
): void {
  const now = ctx.currentTime;
  const dur = duration / 1000;
  freqs.forEach(f => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = f;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol / freqs.length, now + 0.02);
    gain.gain.setValueAtTime(vol / freqs.length, now + dur - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.start(now);
    osc.stop(now + dur);
  });
}

// ---- フック本体 ----
export function useSE() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return null;
        ctxRef.current = new AudioContextClass();
      } catch {
        return null;
      }
    }
    // サスペンド状態なら再開
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {/* noop */});
    }
    return ctxRef.current;
  }, []);

  /**
   * 正解音: 明るい上昇音 (C5→E5→G5) 200ms
   */
  const playCorrect = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    // 上昇アルペジオ (C5=523Hz, E5=659Hz, G5=784Hz)
    playTone(ctx, [523, 659, 784], 200, "sine", 0.55);
  }, [getContext]);

  /**
   * 不正解音: 低い下降音 (B3→G3→E3) 200ms
   */
  const playWrong = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    // 下降音 (B3=247Hz, G3=196Hz, E3=165Hz)
    playTone(ctx, [247, 196, 165], 200, "sawtooth", 0.40);
  }, [getContext]);

  /**
   * コンボ音: 上昇アルペジオ (連続正解の快感) 300ms
   * comboCount に応じて音程が変わる (3連=通常, 5連=高め, 7連+=最高)
   */
  const playCombo = useCallback((comboCount: number = 3) => {
    const ctx = getContext();
    if (!ctx) return;
    if (comboCount >= 7) {
      // 最高コンボ: ファンファーレ和音
      playChord(ctx, [523, 659, 784, 1047], 300, "sine", 0.65);
      setTimeout(() => {
        if (ctx.state !== "closed") playChord(ctx, [659, 784, 988, 1319], 200, "sine", 0.55);
      }, 150);
    } else if (comboCount >= 5) {
      // 高コンボ: 広域アルペジオ
      playTone(ctx, [659, 784, 988, 1319], 300, "triangle", 0.60);
    } else {
      // 通常コンボ (3連〜)
      playTone(ctx, [523, 659, 784], 300, "triangle", 0.55);
    }
  }, [getContext]);

  /**
   * ゲームオーバー音: 下降音 (500ms)
   */
  const playGameOver = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    // 重い下降音列
    playTone(ctx, [392, 330, 262, 196], 500, "sawtooth", 0.50);
    // 低音のうなり（同時）
    setTimeout(() => {
      if (ctx.state !== "closed") {
        playTone(ctx, 80, 400, "sine", 0.30, { from: 100, to: 60 });
      }
    }, 0);
  }, [getContext]);

  /**
   * ゲーム開始音: 上昇ファンファーレ (300ms)
   */
  const playStart = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    // C4→G4→C5 ファンファーレ
    playTone(ctx, [262, 392, 523], 300, "sine", 0.55);
    // わずかに遅れてコード追加
    setTimeout(() => {
      if (ctx.state !== "closed") {
        playChord(ctx, [523, 659, 784], 200, "triangle", 0.35);
      }
    }, 150);
  }, [getContext]);

  // アンマウント時クリーンアップ
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {/* noop */});
      }
    };
  }, []);

  return {
    playCorrect,
    playWrong,
    playCombo,
    playGameOver,
    playStart,
  };
}
