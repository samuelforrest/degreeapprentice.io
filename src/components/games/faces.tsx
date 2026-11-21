"use client";

import { useEffect, useRef, useState } from "react";

import { formatClock, GameProgress, Stage, useCountdown } from "@/components/games/shared";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { mean, pct, pick, shuffle } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const EMOTIONS = ["Happy", "Sad", "Angry", "Surprised", "Afraid", "Disgusted", "Neutral"] as const;
type Emotion = (typeof EMOTIONS)[number];

const PER_EMOTION = 5;
const TOTAL = EMOTIONS.length * PER_EMOTION;
const SECONDS = 180;

/**
 * Facial action, roughly following the muscle movements each emotion is known for.
 * brow*: eyebrow raise (−) or lower (+) at the inner and outer ends; eye: how open;
 * corner/top/bottom: mouth corner height and lip curve (+ is down); wrinkle: nose; asym: one-sided lip.
 */
type Face = { browIn: number; browOut: number; eye: number; corner: number; top: number; bottom: number; width: number; wrinkle: number; cheek: number; asym: number };

const NEUTRAL: Face = { browIn: 0, browOut: 0, eye: 7, corner: 0, top: 0, bottom: 0, width: 24, wrinkle: 0, cheek: 0, asym: 0 };
const ACTION: Record<Emotion, Face> = {
  Happy: { browIn: -2, browOut: -2, eye: 5, corner: -12, top: 2, bottom: 22, width: 30, wrinkle: 0, cheek: 1, asym: 0 },
  Sad: { browIn: -10, browOut: 6, eye: 6, corner: 10, top: -4, bottom: -2, width: 22, wrinkle: 0, cheek: 0, asym: 0 },
  Angry: { browIn: 10, browOut: -4, eye: 5, corner: 4, top: 0, bottom: 2, width: 20, wrinkle: 0, cheek: 0, asym: 0 },
  Surprised: { browIn: -14, browOut: -12, eye: 11, corner: 0, top: -14, bottom: 20, width: 13, wrinkle: 0, cheek: 0, asym: 0 },
  Afraid: { browIn: -12, browOut: -2, eye: 11, corner: 6, top: -4, bottom: 12, width: 30, wrinkle: 0, cheek: 0, asym: 0 },
  Disgusted: { browIn: 7, browOut: 1, eye: 4, corner: 6, top: -10, bottom: 2, width: 24, wrinkle: 1, cheek: 0, asym: 1 },
  Neutral: NEUTRAL,
};

const SKIN = ["#f6d5b8", "#e8b98f", "#c99266", "#a86f45"];
const HAIR = ["#2b1a12", "#5a3a22", "#8a5a2b", "#c9a15a", "#1a1a1a"];

type Person = { skin: string; hair: string; style: number };
type Trial = { emotion: Emotion; intensity: number; person: Person };

function blend(emotion: Emotion, intensity: number): Face {
  const target = ACTION[emotion];
  return Object.fromEntries(
    Object.entries(NEUTRAL).map(([k, v]) => [k, v + (target[k as keyof Face] - v) * intensity]),
  ) as Face;
}

function FaceDrawing({ trial }: { trial: Trial }) {
  const f = blend(trial.emotion, trial.intensity);
  const { skin, hair, style } = trial.person;
  const ink = "#2b1a12";
  const brow = hair === "#c9a15a" ? "#7a5530" : hair;
  const by = 172;
  const open = f.bottom - f.top > 6;
  const cl = by + f.corner - 8 * f.asym;
  const cr = by + f.corner;
  const mouth = `M${100 - f.width} ${cl} Q100 ${by + f.top} ${100 + f.width} ${cr} Q100 ${by + f.bottom} ${100 - f.width} ${cl} Z`;

  return (
    <svg viewBox="0 0 200 240" className="h-64 w-auto" role="img" aria-label="A face showing an emotion">
      {style === 2 && <rect x={22} y={70} width={156} height={160} rx={50} fill={hair} />}
      <ellipse cx={28} cy={138} rx={10} ry={16} fill={skin} />
      <ellipse cx={172} cy={138} rx={10} ry={16} fill={skin} />
      <ellipse cx={100} cy={132} rx={72} ry={92} fill={skin} />
      {style === 1 ? (
        <path d="M28 118 Q 26 34 104 36 Q 174 36 172 118 Q 164 72 120 62 Q 70 76 28 118 Z" fill={hair} />
      ) : (
        <path d="M28 120 Q 28 32 100 34 Q 172 32 172 120 Q 160 68 100 64 Q 40 68 28 120 Z" fill={hair} />
      )}

      {/* Brows */}
      {[-1, 1].map((side) => (
        <line
          key={side}
          x1={100 + side * 14}
          y1={94 + f.browIn}
          x2={100 + side * 44}
          y2={94 + f.browOut}
          stroke={brow}
          strokeWidth={5.5}
          strokeLinecap="round"
        />
      ))}

      {/* Eyes */}
      {[72, 128].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={114} rx={12} ry={f.eye} fill="#fff" stroke={ink} strokeWidth={1.5} />
          <circle cx={x} cy={114} r={Math.min(5, f.eye)} fill={ink} />
        </g>
      ))}
      {f.cheek > 0.3 &&
        [72, 128].map((x) => (
          <path key={x} d={`M${x - 13} ${128} q13 ${7 * f.cheek} 26 0`} fill="none" stroke={ink} strokeOpacity={0.35} strokeWidth={2} />
        ))}

      {/* Nose */}
      <path d="M100 122 L93 150 Q100 155 107 150" fill="none" stroke={ink} strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" />
      {f.wrinkle > 0.3 && (
        <path d="M90 128 q4 3 8 0 M102 128 q4 3 8 0" fill="none" stroke={ink} strokeOpacity={0.5} strokeWidth={1.75} />
      )}

      <path d={mouth} fill={open ? "#5b2626" : "none"} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

function makeTrials(): Trial[] {
  return shuffle(EMOTIONS.flatMap((emotion) => Array.from({ length: PER_EMOTION }, () => emotion))).map((emotion) => ({
    emotion,
    // Some faces are subtle on purpose.
    intensity: 0.55 + Math.random() * 0.45,
    person: { skin: pick(SKIN), hair: pick(HAIR), style: pick([0, 1, 2]) },
  }));
}

type Answer = { emotion: Emotion; chosen: Emotion; ms: number };

const now = () => performance.now();

export function FacesGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [trials] = useState(makeTrials);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = now();
  }, []);

  const finish = (all: Answer[]) => {
    const right = all.filter((a) => a.emotion === a.chosen).length;
    const byEmotion = EMOTIONS.map((e) => {
      const of = all.filter((a) => a.emotion === e);
      return { e, acc: of.length ? of.filter((a) => a.chosen === e).length / of.length : 1 };
    }).sort((a, b) => a.acc - b.acc);
    const hardest = byEmotion[0];
    onFinish({
      headline: `${pct(right, TOTAL)}% recognised`,
      score: pct(right, TOTAL),
      metrics: [
        { label: "Correct", value: `${right} of ${TOTAL}` },
        { label: "Answered", value: `${all.length} of ${TOTAL}` },
        { label: "Average time per face", value: all.length ? `${(mean(all.map((a) => a.ms)) / 1000).toFixed(1)}s` : "–" },
        { label: "Hardest for you", value: hardest.acc < 1 ? hardest.e : "None missed" },
      ],
      insight: `${
        hardest.acc < 1
          ? `You found ${hardest.e.toLowerCase()} faces hardest. `
          : ""
      }Fear and surprise (both wide-eyed) and anger and disgust (both with lowered brows) are the pairs people mix up most. Look at the mouth to tell them apart: fear stretches it sideways, surprise drops it open; disgust raises the upper lip, anger presses the lips together. Real assessments use photos, which are harder than these drawings.`,
    });
  };

  const remaining = useCountdown(SECONDS, () => finish(answers));

  const choose = (chosen: Emotion) => {
    const next = [...answers, { emotion: trials[answers.length].emotion, chosen, ms: now() - shownAt.current }];
    setAnswers(next);
    shownAt.current = now();
    if (next.length >= TOTAL) finish(next);
  };

  const trial = trials[Math.min(answers.length, TOTAL - 1)];

  return (
    <div className="space-y-4">
      <GameProgress value={answers.length} total={TOTAL} label={formatClock(remaining)} />
      <Stage className="py-4">
        <FaceDrawing key={answers.length} trial={trial} />
      </Stage>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {EMOTIONS.map((e, i) => (
          <Button key={e} variant="outline" size="lg" className={cn("h-12", i === EMOTIONS.length - 1 && "col-span-2 sm:col-span-1")} onClick={() => choose(e)}>
            {e}
          </Button>
        ))}
      </div>
    </div>
  );
}
