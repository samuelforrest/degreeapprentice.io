import { cn } from "@/lib/utils";

/**
 * A titled card for long-form pages (About, AI), so their text sits at the same width and
 * indent. Pass `id` to make the section linkable, e.g. /about#contribute.
 */
export function ContentCard({
  id,
  title,
  children,
  className,
}: {
  id?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-20 space-y-4 rounded-xl border bg-card p-5 md:p-6", className)}
    >
      <h2 id={headingId} className="text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}
