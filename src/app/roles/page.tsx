import type { Metadata } from "next";
import { Suspense } from "react";

import { Directory } from "@/components/roles/directory";
import { getRoles, toSummary } from "@/lib/roles";
import { PageHeader, PageShell } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "All degree apprenticeships",
  description: "Search every UK Level 6 and 7 degree apprenticeship in one place, with salaries and closing dates.",
  alternates: { canonical: "/roles" },
};

export default function RolesPage() {
  const summaries = getRoles().map(toSummary);
  return (
    <PageShell>
      <PageHeader
        title="All degree apprenticeships"
        description="Level 6 and 7 apprenticeships across the UK: a full degree, a salary and no tuition fees."
      />
      {/* useSearchParams needs a Suspense boundary so the rest of the page can pre-render. */}
      <Suspense>
        <Directory roles={summaries} />
      </Suspense>
    </PageShell>
  );
}
