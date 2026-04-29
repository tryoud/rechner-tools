interface SectionLabelProps {
  number: string;
  label: string;
  first?: boolean;
}

export default function SectionLabel({ number, label, first }: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-2 pb-2 ${first ? 'pt-0' : 'pt-7 border-t border-border/80'}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-light font-mono text-[10px] font-bold text-accent-strong">
        {number}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </span>
      <div className="ml-1 h-px flex-1 bg-border" />
    </div>
  );
}
