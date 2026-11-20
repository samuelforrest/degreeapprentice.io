import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TestRunner } from "@/components/tests/test-runner";
import { categoryLabel, getTest, TESTS } from "@/lib/tests";

// Anything not pre-rendered is a real 404, not a soft one.
export const dynamicParams = false;

export function generateStaticParams() {
  return TESTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tests/[slug]">): Promise<Metadata> {
  const test = getTest((await params).slug);
  if (!test) return {};
  return {
    title: `${test.title}: free practice test`,
    description: `${test.description} Free ${categoryLabel(test.category).toLowerCase()} practice with explanations for every answer.`,
    alternates: { canonical: `/tests/${test.slug}` },
  };
}

export default async function TestPage({ params }: PageProps<"/tests/[slug]">) {
  const test = getTest((await params).slug);
  if (!test) notFound();
  return <TestRunner test={test} />;
}
