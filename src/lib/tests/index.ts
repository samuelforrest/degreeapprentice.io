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
      "Workplace scenarios where you choose or rate the best responses. Used by most large apprenticeship employers, and often the first test you'll sit.",
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

export const categoryLabel = (id: TestCategory) => CATEGORIES.find((c) => c.id === id)!.label;

export const formatTimeLimit = (seconds: number) => `${Math.round(seconds / 60)} minutes`;
