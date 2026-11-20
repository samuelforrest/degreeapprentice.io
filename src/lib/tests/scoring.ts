import type { Answer, Question } from "@/lib/tests/types";

/** A score from 0 to 1. Situational judgement questions give partial credit, as real SJTs do. */
export function scoreQuestion(q: Question, a: Answer | undefined): number {
  if (!a) return 0;
  switch (q.kind) {
    case "choice":
    case "figures":
      return a.choice === q.answer ? 1 : 0;
    case "most-least":
      return (Number(a.most === q.most) + Number(a.least === q.least)) / 2;
    case "rate": {
      // Full credit for the expert rating, half credit for one step either side.
      const points = q.responses.map((r, i) => {
        const given = a.ratings?.[i];
        if (given === undefined) return 0;
        const off = Math.abs(given - r.rating);
        return off === 0 ? 1 : off === 1 ? 0.5 : 0;
      });
      return points.reduce<number>((sum, p) => sum + p, 0) / q.responses.length;
    }
  }
}

export function isAnswered(q: Question, a: Answer | undefined): boolean {
  if (!a) return false;
  switch (q.kind) {
    case "choice":
    case "figures":
      return a.choice !== undefined;
    case "most-least":
      return a.most !== undefined && a.least !== undefined;
    case "rate":
      return q.responses.every((_, i) => a.ratings?.[i] !== undefined);
  }
}

/** Overall percentage, rounded to a whole number. */
export function scoreTest(questions: Question[], answers: Record<number, Answer>): number {
  const total = questions.reduce((sum, q, i) => sum + scoreQuestion(q, answers[i]), 0);
  return Math.round((total / questions.length) * 100);
}
