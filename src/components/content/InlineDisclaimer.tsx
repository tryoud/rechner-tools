import type { ReactNode } from 'react';

interface InlineDisclaimerProps {
  label?: string;
  text?: ReactNode;
  children?: ReactNode;
}

export default function InlineDisclaimer({
  label = 'Praxis-Check',
  text,
  children,
}: InlineDisclaimerProps) {
  return (
    <section className="rounded-[24px] border border-border-strong/70 bg-surface-soft px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{children ?? text}</p>
    </section>
  );
}
