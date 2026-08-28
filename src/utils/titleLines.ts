/** Splits a multi-line title into trimmed, non-empty lines, falling back to a default value. */
export function titleLines(value: string | undefined, fallback: string): string[] {
  const source = value?.trim() ? value : fallback;
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
