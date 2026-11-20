"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CvPreview } from "@/components/cv/cv-preview";
import { PageHeader, PageShell } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { exampleCv, newEntry, SECTION_PRESETS } from "@/lib/cv/template";
import type { Cv, CvEntry, CvSection } from "@/lib/cv/types";
import { cn } from "@/lib/utils";

/**
 * Starts from the example CV every time. Nothing is saved or uploaded: a reload resets it,
 * and downloading the PDF is how people keep their CV.
 */
export function CvBuilder() {
  const [cv, setCv] = useState(exampleCv);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [pages, setPages] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edits are lost on reload, so ask before leaving once the CV has been changed.
  useEffect(() => {
    if (cv === exampleCv) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [cv]);

  const onPagesChange = useCallback((n: number) => setPages(n), []);

  const set = (patch: Partial<Cv>) => setCv((prev) => ({ ...prev, ...patch }));
  const updateSection = (id: string, patch: Partial<CvSection>) =>
    setCv((prev) => ({ ...prev, sections: prev.sections.map((s) => (s.id === id ? ({ ...s, ...patch } as CvSection) : s)) }));
  const moveSection = (index: number, by: -1 | 1) =>
    setCv((prev) => ({ ...prev, sections: move(prev.sections, index, index + by) }));
  const removeSection = (section: CvSection) => {
    if (!window.confirm(`Delete the "${section.title}" section? This can't be undone.`)) return;
    setCv((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== section.id) }));
  };

  async function downloadPdf() {
    setDownloading(true);
    setError(null);
    try {
      // The PDF library is large, so it's only loaded when it's needed.
      const [{ pdf }, { CvDocument }] = await Promise.all([import("@react-pdf/renderer"), import("@/components/cv/cv-pdf")]);
      const blob = await pdf(<CvDocument cv={cv} />).toBlob();
      saveFile(blob, `${fileName(cv.name)}.pdf`);
    } catch {
      setError("Sorry, the PDF couldn't be created. Try again, or use your browser's Print → Save as PDF.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <PageShell>
      <div className="space-y-4">
        <PageHeader
          title="CV builder"
          description="Start from our example of a strong school-leaver CV and make it yours, then download it as a PDF. Nothing is saved or uploaded, so download before you leave the page."
          actions={
            <Button size="lg" onClick={downloadPdf} disabled={downloading}>
              {downloading ? <LoaderCircleIcon className="animate-spin" data-icon="inline-start" /> : <DownloadIcon data-icon="inline-start" />}
              {downloading ? "Creating PDF…" : "Download PDF"}
            </Button>
          }
        />

        {error && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* On small screens, switch between editing and previewing. */}
        <div className="grid grid-cols-2 gap-1 rounded-lg border bg-card p-1 lg:hidden" role="tablist" aria-label="View">
          {(["edit", "preview"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn("rounded-md py-1.5 text-sm text-muted-foreground", view === v && "bg-muted font-medium text-foreground")}
            >
              {v === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className={cn("space-y-4", view === "preview" && "hidden lg:block")}>
            <Panel title="Your details" hint="Name, phone, email and town are enough. Leave out your photo, date of birth and full address.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name" value={cv.name} onChange={(v) => set({ name: v })} className="sm:col-span-2" />
                <Field
                  label="Headline"
                  value={cv.headline}
                  onChange={(v) => set({ headline: v })}
                  placeholder="e.g. A level student applying for engineering degree apprenticeships"
                  className="sm:col-span-2"
                />
                <Field label="Email" type="email" value={cv.email} onChange={(v) => set({ email: v })} />
                <Field label="Phone" type="tel" value={cv.phone} onChange={(v) => set({ phone: v })} />
                <Field label="Town or city" value={cv.location} onChange={(v) => set({ location: v })} />
                <Field label="Links (one per line)" value={cv.links} onChange={(v) => set({ links: v })} multiline placeholder="e.g. LinkedIn or portfolio" />
              </div>
            </Panel>

            {cv.sections.map((section, i) => (
              <SectionEditor
                key={section.id}
                section={section}
                first={i === 0}
                last={i === cv.sections.length - 1}
                onChange={(patch) => updateSection(section.id, patch)}
                onMove={(by) => moveSection(i, by)}
                onRemove={() => removeSection(section)}
              />
            ))}

            <div className="space-y-2 rounded-xl border border-dashed p-4">
              <p className="text-sm font-medium">Add a section</p>
              <div className="flex flex-wrap gap-2">
                {SECTION_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setCv((prev) => ({ ...prev, sections: [...prev.sections, preset.make()] }))}
                  >
                    <PlusIcon data-icon="inline-start" /> {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className={cn("space-y-3 lg:sticky lg:top-16", view === "edit" && "hidden lg:block")}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">Preview</span>
              <span className={cn("tabular-nums", pages > 1 ? "text-destructive" : "text-muted-foreground")}>
                {pages > 1 ? `${pages} pages: aim for one` : "1 page"}
              </span>
            </div>
            <div className="lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
              <CvPreview cv={cv} onPagesChange={onPagesChange} />
            </div>
            <p className="text-xs text-muted-foreground">
              Tailor your CV for every application, and read{" "}
              <Link href="/guides/why-this-apprenticeship" className="text-primary">
                how to explain why you want the role
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function SectionEditor({
  section,
  first,
  last,
  onChange,
  onMove,
  onRemove,
}: {
  section: CvSection;
  first: boolean;
  last: boolean;
  onChange: (patch: Partial<CvSection>) => void;
  onMove: (by: -1 | 1) => void;
  onRemove: () => void;
}) {
  const setEntries = (entries: CvEntry[]) => onChange({ entries } as Partial<CvSection>);

  return (
    <section className={cn("space-y-3 rounded-xl border bg-card p-4", section.hidden && "opacity-60")}>
      <div className="flex items-center gap-2">
        <Input
          aria-label="Section title"
          value={section.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="h-8 flex-1 border-transparent bg-transparent px-1 text-base font-semibold hover:border-input dark:bg-transparent"
        />
        <IconButton label="Move section up" onClick={() => onMove(-1)} disabled={first}>
          <ArrowUpIcon />
        </IconButton>
        <IconButton label="Move section down" onClick={() => onMove(1)} disabled={last}>
          <ArrowDownIcon />
        </IconButton>
        <IconButton
          label={section.hidden ? "Show section on CV" : "Hide section from CV"}
          onClick={() => onChange({ hidden: !section.hidden })}
        >
          {section.hidden ? <EyeOffIcon /> : <EyeIcon />}
        </IconButton>
        <IconButton label="Delete section" onClick={onRemove}>
          <Trash2Icon />
        </IconButton>
      </div>
      {section.hint && <p className="text-xs text-muted-foreground">{section.hint}</p>}
      {section.hidden && <p className="text-xs text-muted-foreground">Hidden: this section won&apos;t appear on your CV.</p>}

      {section.kind === "text" && (
        <Field label="Text" hideLabel multiline rows={5} value={section.body} onChange={(v) => onChange({ body: v } as Partial<CvSection>)} />
      )}

      {section.kind === "list" && (
        <Field
          label="One item per line"
          multiline
          rows={4}
          value={section.items}
          onChange={(v) => onChange({ items: v } as Partial<CvSection>)}
        />
      )}

      {section.kind === "entries" && (
        <div className="space-y-3">
          {section.entries.map((entry, i) => (
            <div key={entry.id} className="space-y-3 rounded-lg border bg-background/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">Entry {i + 1}</span>
                <div className="flex gap-1">
                  <IconButton label="Move entry up" onClick={() => setEntries(move(section.entries, i, i - 1))} disabled={i === 0}>
                    <ArrowUpIcon />
                  </IconButton>
                  <IconButton
                    label="Move entry down"
                    onClick={() => setEntries(move(section.entries, i, i + 1))}
                    disabled={i === section.entries.length - 1}
                  >
                    <ArrowDownIcon />
                  </IconButton>
                  <IconButton label="Delete entry" onClick={() => setEntries(section.entries.filter((e) => e.id !== entry.id))}>
                    <Trash2Icon />
                  </IconButton>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Title"
                  placeholder="e.g. Customer Assistant, or A levels: Maths (predicted A)…"
                  value={entry.title}
                  onChange={(v) => setEntries(section.entries.map((e) => (e.id === entry.id ? { ...e, title: v } : e)))}
                  className="sm:col-span-2"
                />
                <Field
                  label="Organisation"
                  value={entry.organisation}
                  onChange={(v) => setEntries(section.entries.map((e) => (e.id === entry.id ? { ...e, organisation: v } : e)))}
                />
                <Field
                  label="Location"
                  value={entry.location}
                  onChange={(v) => setEntries(section.entries.map((e) => (e.id === entry.id ? { ...e, location: v } : e)))}
                />
                <Field
                  label="Dates"
                  placeholder="e.g. Jun 2024 – Present"
                  value={entry.dates}
                  onChange={(v) => setEntries(section.entries.map((e) => (e.id === entry.id ? { ...e, dates: v } : e)))}
                  className="sm:col-span-2"
                />
                <Field
                  label="Bullet points (one per line)"
                  multiline
                  rows={3}
                  value={entry.bullets}
                  onChange={(v) => setEntries(section.entries.map((e) => (e.id === entry.id ? { ...e, bullets: v } : e)))}
                  className="sm:col-span-2"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setEntries([...section.entries, newEntry()])}>
            <PlusIcon data-icon="inline-start" /> Add entry
          </Button>
        </div>
      )}
    </section>
  );
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="px-1 text-base font-semibold">{title}</h2>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  rows,
  hideLabel,
  className,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  hideLabel?: boolean;
  className?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className={cn("text-xs font-medium text-muted-foreground", hideLabel && "sr-only")}>{label}</span>
      {multiline ? (
        <Textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} {...props} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} {...props} />
      )}
    </label>
  );
}

function IconButton({ label, children, ...props }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <Button variant="ghost" size="icon-sm" aria-label={label} title={label} {...props}>
      {children}
    </Button>
  );
}

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function fileName(name: string) {
  const clean = name.replace(/[^\p{L}\p{N} '-]/gu, "").trim();
  return clean ? `${clean} CV` : "CV";
}

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
