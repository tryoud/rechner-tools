interface BreakdownRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function BreakdownRow({ label, value, highlight }: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="min-w-0 text-[13px] font-medium leading-5 text-white/82">{label}</span>
      <span
        className={`shrink-0 text-right font-mono text-[13px] ${
          highlight ? 'text-white font-bold tracking-wide' : 'text-white/90'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
