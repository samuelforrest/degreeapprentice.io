import type { Metadata } from "next";

import { CvBuilder } from "@/components/cv/cv-builder";

export const metadata: Metadata = {
  title: "Free CV builder for degree apprenticeships",
  description:
    "Build a one-page school-leaver CV from a strong example, then download it as a PDF. Free, no sign-up, and nothing leaves your browser.",
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  return <CvBuilder />;
}
