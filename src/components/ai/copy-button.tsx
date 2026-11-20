"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }}
    >
      {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // The async clipboard API can be blocked (no focus, older browsers): fall back to a hidden textarea.
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.append(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

/** A block of code or text with a copy button. */
export function CopyBlock({ text, label, prose = false }: { text: string; label?: string; prose?: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-background p-2 pl-3">
      <pre
        className={cn(
          "min-w-0 flex-1 py-1 leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]",
          prose ? "font-sans text-sm" : "font-mono text-[13px]",
        )}
      >
        {text}
      </pre>
      <CopyButton text={text} label={label} />
    </div>
  );
}
