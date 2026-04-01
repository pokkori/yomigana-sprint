"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * Web Audio API を使った多声部BGMフック
 * 日本語学習ゲーム向け: 和風テイスト、BPM=120、Cメジャー
 * 4声部: ベース + コード + メロディ + アルペジオ
 * 外部ファイル不要・コード完結
 */

// ----- 音楽定数 -----
const BPM = 120;
const BEAT = 60 / BPM; // 1拍 = 0.5秒
const BAR = BEAT * 4;  // 1小節 = 2.0秒

// MIDIノート番号 → 周波数変換
function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71
// C5=72, D5=74, E5=76, F5=77, G5=79, A5=81
// C3=48, G3=55, A3=57, F3=53

// ---- コード進行: C - Am - F - G (4小節ループ) ----
// ベース音 (1オクターブ低め: C3=48, A2=45, F2=41, G2=43)
const BASS_NOTES = [48, 45, 41, 43]; // C3, A2, F2, G2

// コード構成音 (3和音・中域: C4/E4/G4, A3/C4/E4, F3/A3/C4, G3/B3/D4)
const CHORD_VOICINGS = [
  [60, 64, 67], // C major
  [57, 60, 64], // A minor
  [53, 57, 60], // F major
  [55, 59, 62], // G major
];

// メロディ (4小節ループ)
const MELODY_NOTES = [
  // 小節1: C major テーマ
  [72, 0, 74, 0, 76, 0, 77, 0],
  // 小節2: A minor 下降
  [76, 0, 74, 0, 72, 0, 69, 0],
  // 小節3: F major アーチ
  [69, 0, 72, 0, 74, 0, 72, 0],
  // 小節4: G major 解決
  [71, 0, 72, 0, 74, 0, 72, 0],
];

// アルペジオ (高音域・早い動き、C5/E5/G5ベース)
const ARPEGIO_PATTERNS = [
  [84, 88, 91, 88], // C6, E6, G6 アルペジオ
  [81, 84, 88, 84], // A5, C6, E6
  [77, 81, 84, 81], // F5, A5, C6
  [79, 83, 86, 83], // G5, B5, D6
];

// ---- オシレーター生成ヘルパー ----
function createOscillator(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  gainNode: GainNode,
  peakVol: number,
): OscillatorNode {
  const osc = ctx.createOscillator();
  const envGain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(envGain);
  envGain.connect(gainNode);
  // エンベロープ: アタック短め、サステイン、リリース
  const attack = 0.02;
  const release = 0.08;
  envGain.gain.setValueAtTime(0, startTime);
  envGain.gain.linearRampToValueAtTime(peakVol, startTime + attack);
  envGain.gain.setValueAtTime(peakVol, startTime + duration - release);
  envGain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
  return osc;
}

// ---- 1ループ分のノートをスケジュール ----
function scheduleLoop(
  ctx: AudioContext,
  masterGain: GainNode,
  startTime: number,
  loopBars: number = 4,
): void {
  const loopDuration = BAR * loopBars;

  // ===== ベース声部 =====
  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.28;
  bassGain.connect(masterGain);
  // ローパスフィルターで丸みを出す
  const bassFilter = ctx.createBiquadFilter();
  bassFilter.type = "lowpass";
  bassFilter.frequency.value = 400;
  bassGain.connect(bassFilter);
  bassFilter.connect(masterGain);

  for (let bar = 0; bar < loopBars; bar++) {
    const barStart = startTime + bar * BAR;
    const midi = BASS_NOTES[bar % BASS_NOTES.length];
    const freq = midiToHz(midi);
    // 各小節に2音 (1拍目・3拍目)
    createOscillator(ctx, freq, "sine", barStart, BEAT * 1.8, bassFilter as unknown as GainNode, 1.0);
    createOscillator(ctx, freq, "sine", barStart + BEAT * 2, BEAT * 1.8, bassFilter as unknown as GainNode, 0.8);
  }

  // ===== コード声部（パッド） =====
  const chordGain = ctx.createGain();
  chordGain.gain.value = 0.12;
  chordGain.connect(masterGain);
  const chordFilter = ctx.createBiquadFilter();
  chordFilter.type = "lowpass";
  chordFilter.frequency.value = 1200;
  chordGain.connect(chordFilter);
  chordFilter.connect(masterGain);

  for (let bar = 0; bar < loopBars; bar++) {
    const barStart = startTime + bar * BAR;
    const voicing = CHORD_VOICINGS[bar % CHORD_VOICINGS.length];
    voicing.forEach(midi => {
      const freq = midiToHz(midi);
      // 和音はほぼ小節全体をホールド（パッドっぽく）
      createOscillator(ctx, freq, "triangle", barStart, BAR * 0.95, chordFilter as unknown as GainNode, 0.9);
    });
  }

  // ===== メロディ声部 =====
  const melodyGain = ctx.createGain();
  melodyGain.gain.value = 0.22;
  melodyGain.connect(masterGain);

  for (let bar = 0; bar < loopBars; bar++) {
    const barStart = startTime + bar * BAR;
    const pattern = MELODY_NOTES[bar % MELODY_NOTES.length];
    pattern.forEach((midi, beatIdx) => {
      if (midi === 0) return; // 休符
      const noteStart = barStart + beatIdx * BEAT * 0.5;
      const freq = midiToHz(midi);
      createOscillator(ctx, freq, "sine", noteStart, BEAT * 0.45, melodyGain, 1.0);
    });
  }

  // ===== アルペジオ声部（高音域・装飾） =====
  const arpGain = ctx.createGain();
  arpGain.gain.value = 0.10;
  arpGain.connect(masterGain);

  for (let bar = 0; bar < loopBars; bar++) {
    const barStart = startTime + bar * BAR;
    const pattern = ARPEGIO_PATTERNS[bar % ARPEGIO_PATTERNS.length];
    pattern.forEach((midi, i) => {
      const noteStart = barStart + i * BEAT;
      const freq = midiToHz(midi);
      createOscillator(ctx, freq, "triangle", noteStart, BEAT * 0.35, arpGain, 0.8);
    });
  }

  // loopDurationをtsで使用するための参照（将来の拡張用）
  void loopDuration;
}

// ---- フック本体 ----
export function useBGM() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const playingRef = useRef(false);
  const schedulerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextLoopStartRef = useRef<number>(0);
  const mutedRef = useRef(false);

  // AudioContext の遅延初期化（ユーザーインタラクション後）
  const getContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) throw new Error("Web Audio API not supported");
      ctxRef.current = new AudioContextClass();
      const master = ctxRef.current.createGain();
      master.gain.value = 0.5;
      master.connect(ctxRef.current.destination);
      masterGainRef.current = master;
    }
    return ctxRef.current;
  }, []);

  // ループスケジューラー（先読みしてギャップなくループ）
  const scheduleNext = useCallback(() => {
    if (!playingRef.current) return;
    try {
      const ctx = getContext();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {/* noop */});
      }
      const master = masterGainRef.current;
      if (!master) return;

      const now = ctx.currentTime;
      const loopDuration = BAR * 4; // 4小節ループ
      const LOOK_AHEAD = 0.1; // 100ms先読み

      // まだ先読み時間より先にループが始まる予定なら何もしない
      if (nextLoopStartRef.current > now + LOOK_AHEAD) {
        schedulerTimerRef.current = setTimeout(scheduleNext, 50);
        return;
      }

      // 次のループ開始時刻（初回は now + 0.05、以降は前ループの終端）
      const loopStart = nextLoopStartRef.current <= now
        ? now + 0.05
        : nextLoopStartRef.current;

      scheduleLoop(ctx, master, loopStart, 4);
      nextLoopStartRef.current = loopStart + loopDuration;

      // 次回チェックは50ms後
      schedulerTimerRef.current = setTimeout(scheduleNext, 50);
    } catch {
      // AudioContext生成失敗等は無視
    }
  }, [getContext]);

  // BGM 開始
  const start = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    nextLoopStartRef.current = 0;
    try {
      const ctx = getContext();
      if (ctx.state === "suspended") {
        ctx.resume().then(() => scheduleNext()).catch(() => {/* noop */});
      } else {
        scheduleNext();
      }
    } catch {
      // 非対応ブラウザは無音で続行
    }
  }, [getContext, scheduleNext]);

  // BGM 停止
  const stop = useCallback(() => {
    playingRef.current = false;
    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    // masterGain を素早くフェードアウト
    if (masterGainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      masterGainRef.current.gain.setValueAtTime(
        masterGainRef.current.gain.value,
        now,
      );
      masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.3);
      // 0.4秒後にゲインを戻す（次回start時のため）
      setTimeout(() => {
        if (masterGainRef.current) {
          masterGainRef.current.gain.value = mutedRef.current ? 0 : 0.5;
        }
      }, 400);
    }
  }, []);

  // ミュート切り替え
  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
    if (masterGainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      masterGainRef.current.gain.setValueAtTime(
        masterGainRef.current.gain.value,
        now,
      );
      masterGainRef.current.gain.linearRampToValueAtTime(
        muted ? 0 : 0.5,
        now + 0.2,
      );
    }
  }, []);

  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      playingRef.current = false;
      if (schedulerTimerRef.current) clearTimeout(schedulerTimerRef.current);
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {/* noop */});
      }
    };
  }, []);

  return { start, stop, setMuted };
}
