import { useState } from 'react';
import type { ReactNode } from 'react';

interface CollapsibleSectionProps {
  number: string;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  hint?: string;
}

export default function CollapsibleSection({
  number,
  label,
  children,
  defaultOpen = false,
  hint,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 border-t border-border/80 pb-2 pt-7 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light font-mono text-[10px] font-bold text-accent-strong">
          {number}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          {label}
        </span>
        {hint && !open && (
          <span className="ml-1 rounded-full bg-surface-elevated px-2 py-0.5 font-mono text-[9px] text-ink-faint">
            {hint}
          </span>
        )}
        <div className="ml-1 h-px flex-1 bg-border" />
        <span
          className={`font-mono text-xs text-ink-faint transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      {open && <div className="[&>div:last-child]:border-b-0">{children}</div>}
    </div>
  );
}
