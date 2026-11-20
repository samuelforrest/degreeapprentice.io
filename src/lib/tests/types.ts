// Practice assessments on /tests. Every question is original, written to mirror the
// formats employers use in online assessments, not copied from any test publisher.

export type TestCategory = "situational" | "numerical" | "verbal" | "logical";

/** One shape in a reasoning figure. Cells are a 3×3 grid, numbered 0–8 left to right, top to bottom. */
export type FigureItem = {
  shape: "circle" | "square" | "triangle" | "diamond" | "arrow";
  cell: number;
  filled?: boolean;
  /** Degrees clockwise. An unrotated arrow points up. */
  rotate?: number;
};
export type Figure = FigureItem[];

/** Shared material that several questions refer to: a data table or a reading passage. */
export type Stimulus =
  | { kind: "table"; title: string; columns: string[]; rows: (string | number)[][]; note?: string }
  | { kind: "passage"; title: string; text: string };

/** Ratings for the "rate each response" format, matching the Civil Service Judgement Test scale. */
export const RATINGS = ["Counterproductive", "Ineffective", "Fairly effective", "Effective"] as const;
export type Rating = 1 | 2 | 3 | 4;

export type Question =
  | {
      kind: "choice";
      prompt: string;
      options: string[];
      answer: number;
      explanation: string;
      /** Key into the test's `stimuli`. */
      stimulus?: string;
    }
  | {
      kind: "figures";
      prompt: string;
      /** The series shown before the "?"; empty for odd-one-out questions. */
      sequence: Figure[];
      options: Figure[];
      answer: number;
      explanation: string;
    }
  | {
      kind: "most-least";
      scenario: string;
      responses: string[];
      most: number;
      least: number;
      explanation: string;
    }
  | {
      kind: "rate";
      scenario: string;
      responses: { text: string; rating: Rating; why: string }[];
    };

export type Test = {
  slug: string;
  category: TestCategory;
  title: string;
  description: string;
  /** Seconds. Every test is timed; candidates can still choose to practise without the timer. */
  timeLimit: number;
  instructions: string[];
  stimuli?: Record<string, Stimulus>;
  questions: Question[];
};

/** What the candidate has picked for one question. */
export type Answer = { choice?: number; most?: number; least?: number; ratings?: (Rating | undefined)[] };
