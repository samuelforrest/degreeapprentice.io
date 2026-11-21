export const randInt = (n: number) => Math.floor(Math.random() * n);

export const pick = <T,>(xs: readonly T[]) => xs[randInt(xs.length)];

export function shuffle<T>(xs: readonly T[]): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

export const ms = (n: number) => `${Math.round(n)} ms`;
