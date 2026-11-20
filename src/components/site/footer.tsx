import Link from "next/link";

import { site } from "@/config/site";
import { LEVELS } from "@/lib/taxonomy";

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 lg:px-6">
        <div className="space-y-2">
          <p className="font-semibold">{site.name}</p>
          <p className="text-muted-foreground">
            Free and open source. Listings are maintained by the community: always check details on the
            employer&apos;s own site before applying.
          </p>
        </div>
        <nav aria-label="Browse" className="grid content-start gap-2">
          <p className="font-medium">Browse</p>
          {LEVELS.map((l) => (
            <Link key={l.id} href={`/apprenticeships?level=${l.id}`} className="text-muted-foreground hover:text-foreground">
              {l.label} ({l.qualification.toLowerCase()})
            </Link>
          ))}
          {["Technology", "Engineering", "Construction & Property", "Banking & Finance"].map((s) => (
            <Link key={s} href={`/apprenticeships?sector=${encodeURIComponent(s)}`} className="text-muted-foreground hover:text-foreground">
              {s}
            </Link>
          ))}
        </nav>
        <nav aria-label="Project" className="grid content-start gap-2">
          <p className="font-medium">Project</p>
          <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          <Link href="/contribute" className="text-muted-foreground hover:text-foreground">Contribute</Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
          <a href={site.repoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
