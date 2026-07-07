export function lerp(a: number, b: number, t: number): number { return a + (b - a) * clamp01(t); }
export function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }
export function clamp(v: number, min: number, max: number): number { return Math.max(min, Math.min(max, v)); }

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function lighten(color: number, amount: number): number {
  const r = clamp(((color >> 16) & 0xff) + amount, 0, 255);
  const g = clamp(((color >> 8) & 0xff) + amount, 0, 255);
  const b = clamp((color & 0xff) + amount, 0, 255);
  return (r << 16) | (g << 8) | b;
}

export function darken(color: number, amount: number): number {
  return lighten(color, -amount);
}
