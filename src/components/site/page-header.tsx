import { cn } from "@/lib/utils";

/**
 * The centred title block at the top of every main page (Roles, Tests, Guides, CV, AI, About), so
 * headings, intro text and spacing match across the site. `actions` sit centred underneath.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-5 text-center", className)}>
      <div className="mx-auto max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}

/** The outer wrapper for main pages: consistent spacing between the header and each section. */
export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-10", className)}>{children}</div>;
}
