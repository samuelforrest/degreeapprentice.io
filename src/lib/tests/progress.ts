// Practice scores, kept in the browser's localStorage: no account, nothing sent to a server.

export type Progress = Record<string, { best: number; last: number; at: string }>;

const KEY = "tests:progress:v1";
const EVENT = "tests:progress";

export function readProgress(raw: string | null): Progress {
  try {
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveResult(slug: string, score: number) {
  try {
    const progress = readProgress(localStorage.getItem(KEY));
    const best = Math.max(score, progress[slug]?.best ?? 0);
    progress[slug] = { best, last: score, at: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage can be unavailable (private browsing, full quota); scores just aren't kept.
  }
}

// For useSyncExternalStore: the raw string is a stable snapshot between changes.
export function subscribeProgress(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function getProgressSnapshot(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
