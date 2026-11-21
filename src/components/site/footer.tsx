import Link from "next/link";

import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p>
          <span className="font-medium text-foreground">{site.name}</span> · Listings and figures may be
          inaccurate or out of date. Always check details on the employer&apos;s site before applying.
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <a href={site.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
