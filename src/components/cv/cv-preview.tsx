"use client";

import { useEffect, useRef, useState } from "react";

import { contactLine, lines, visibleSections, type Cv } from "@/lib/cv/types";

// A live preview that mirrors cv-pdf.tsx. Sizes use container query units (cqw), where an A4 page is
// 100cqw wide and 1pt = 100 / 595.28 cqw, so the preview is the PDF scaled to fit the screen.

const A4_RATIO = 297 / 210;

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-[0.25cqw] space-y-[0.25cqw]">
      {items.map((item, i) => (
        <li key={i} className="flex">
          <span className="w-[1.68cqw] shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Reports how many A4 pages the CV fills, so we can warn when it runs past one page. */
export function CvPreview({ cv, onPagesChange }: { cv: Cv; onPagesChange?: (pages: number) => void }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;
    const observer = new ResizeObserver(() => {
      const width = page.clientWidth;
      const height = width * A4_RATIO;
      // Content plus the page's top and bottom margins (6.05cqw each).
      const used = content.offsetHeight + width * 0.121;
      const count = Math.max(1, Math.ceil(used / height - 0.01));
      setPageHeight(height);
      setPages(count);
      onPagesChange?.(count);
    });
    observer.observe(page);
    observer.observe(content);
    return () => observer.disconnect();
  }, [onPagesChange]);

  const contact = contactLine(cv);

  return (
    <div className="@container">
      <div
        ref={pageRef}
        aria-label="CV preview"
        className="relative w-full rounded-md bg-white px-[7.06cqw] py-[6.05cqw] font-[Helvetica,Arial,sans-serif] text-[1.6cqw] leading-[1.35] text-[#111] shadow-lg ring-1 ring-black/10"
        style={{ height: pageHeight ? pages * pageHeight : undefined }}
      >
        <div ref={contentRef}>
        {cv.name.trim() && <p className="text-[3.36cqw] leading-[1.1] font-bold">{cv.name}</p>}
        {cv.headline.trim() && <p className="mt-[0.5cqw] text-[1.76cqw] text-[#333]">{cv.headline}</p>}
        {contact.length > 0 && <p className="mt-[0.67cqw] text-[1.51cqw] text-[#444]">{contact.join("  ·  ")}</p>}

        {visibleSections(cv).map((section) => (
          <section key={section.id} className="mt-[2.02cqw]">
            <h2 className="mb-[0.84cqw] border-b-[0.13cqw] border-[#999] pb-[0.34cqw] text-[1.76cqw] font-bold tracking-[0.1cqw] uppercase">
              {section.title}
            </h2>
            {section.kind === "text" && <p className="whitespace-pre-line">{section.body}</p>}
            {section.kind === "list" && <Bullets items={lines(section.items)} />}
            {section.kind === "entries" &&
              section.entries.map((e) => (
                <div key={e.id} className="mb-[1.01cqw]">
                  <div className="flex justify-between gap-[1.34cqw]">
                    <p className="font-bold">{e.title}</p>
                    {e.dates.trim() && <p className="shrink-0 text-[#444]">{e.dates}</p>}
                  </div>
                  {(e.organisation.trim() || e.location.trim()) && (
                    <p className="text-[#333] italic">{[e.organisation, e.location].filter((s) => s.trim()).join(", ")}</p>
                  )}
                  <Bullets items={lines(e.bullets)} />
                </div>
              ))}
          </section>
        ))}
        </div>

        {/* Where each new page would begin in the PDF. */}
        {Array.from({ length: pages - 1 }, (_, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-red-400/80"
            style={{ top: (i + 1) * pageHeight }}
          >
            <span className="absolute right-[2cqw] -top-[2.6cqw] rounded bg-red-500 px-[0.8cqw] text-[1.3cqw] font-medium text-white">
              Page {i + 2}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
