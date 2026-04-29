import type { ReactNode } from 'react';

interface FormRowProps {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  align?: 'center' | 'start';
}

export default function FormRow({ label, hint, children, align = 'center' }: FormRowProps) {
  return (
    <div
      className={`flex flex-col gap-3 border-b border-border/80 px-3 py-4 transition-colors hover:bg-surface-elevated min-[520px]:flex-row min-[520px]:justify-between min-[520px]:gap-4 sm:rounded-xl ${
        align === 'start' ? 'min-[520px]:items-start' : 'min-[520px]:items-center'
      }`}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-ink">{label}</div>
        {hint && <p className="mt-0.5 text-xs leading-4 text-ink-faint">{hint}</p>}
      </div>
      <div className="min-[520px]:shrink-0">{children}</div>
    </div>
  );
}
