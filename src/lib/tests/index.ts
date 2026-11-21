import { logicalTests } from "@/lib/tests/data/logical";
import { numericalTests } from "@/lib/tests/data/numerical";
import { situationalTests } from "@/lib/tests/data/situational";
import { verbalTests } from "@/lib/tests/data/verbal";
import type { TestCategory } from "@/lib/tests/types";

export const CATEGORIES: { id: TestCategory; label: string; description: string }[] = [
  {
    id: "situational",
    label: "Situational judgement",
    description:
      "Workplace scenarios where you choose or rate the best responses. Most large employers use them, often as the first test.",
  },
  {
    id: "numerical",
    label: "Numerical reasoning",
    description: "Interpret tables of data: percentages, ratios, currency conversions and averages under time pressure.",
  },
  {
    id: "verbal",
    label: "Verbal reasoning",
    description: "Read short passages and judge whether statements are true, false or can't be decided from the text.",
  },
  {
    id: "logical",
    label: "Logical reasoning",
    description: "Spot patterns in shape sequences (inductive) and work out what must follow from a set of statements (deductive).",
  },
];

export const TESTS = [...situationalTests, ...numericalTests, ...verbalTests, ...logicalTests];

export const getTest = (slug: string) => TESTS.find((t) => t.slug === slug) ?? null;

/** The title without its category prefix, for lists already grouped by category: "Numerical reasoning: business data" → "Business data". */
export function shortTitle(title: string) {
  const rest = title.replace(/^[^:]+:\s*/, "");
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

export const categoryLabel = (id: TestCategory) => CATEGORIES.find((c) => c.id === id)!.label;

export const formatTimeLimit = (seconds: number) => `${Math.round(seconds / 60)} minutes`;
