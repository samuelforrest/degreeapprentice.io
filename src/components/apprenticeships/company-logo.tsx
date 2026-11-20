import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-9 rounded-lg p-1 text-sm",
  md: "size-11 rounded-xl p-1.5 text-base",
  lg: "size-16 rounded-2xl p-2 text-xl",
};

export function CompanyLogo({
  src,
  name,
  size = "md",
  className,
}: {
  src: string | null;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border bg-white font-semibold text-neutral-700",
        SIZES[size],
        className,
      )}
    >
      {src ? (
        // Plain <img>: logos come from a third-party CDN and are tiny.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="size-full object-contain" />
      ) : (
        <span aria-hidden>{name.slice(0, 1)}</span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}
