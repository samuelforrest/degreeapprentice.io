import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GameShell } from "@/components/games/game-shell";
import { getGame, PLAYABLE } from "@/lib/games";

// Anything not pre-rendered is a real 404, not a soft one.
export const dynamicParams = false;

export function generateStaticParams() {
  return PLAYABLE.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tests/games/[slug]">): Promise<Metadata> {
  const game = getGame((await params).slug);
  if (!game) return {};
  return {
    title: `${game.title}: free game-based assessment practice`,
    description: `${game.description} Practise for game-based assessments like Arctic Shores. Measures: ${game.measures.toLowerCase()}.`,
    alternates: { canonical: `/tests/games/${game.slug}` },
  };
}

export default async function GamePage({ params }: PageProps<"/tests/games/[slug]">) {
  const { slug } = await params;
  if (!getGame(slug)) notFound();
  return <GameShell slug={slug} />;
}
