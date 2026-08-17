import type { ReactNode } from "react";

export const inputClass =
  "w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
