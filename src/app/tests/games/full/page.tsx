import type { Metadata } from "next";

import { FullRun } from "@/components/games/full-run";

export const metadata: Metadata = {
  title: "Full game-based assessment practice",
  description: "Practise a complete game-based assessment, like Arctic Shores, with nine tasks back to back and a summary at the end. Free, no sign-up.",
  alternates: { canonical: "/tests/games/full" },
};

export default function FullRunPage() {
  return <FullRun />;
}
