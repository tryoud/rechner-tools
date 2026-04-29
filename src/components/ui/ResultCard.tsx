import type { ReactNode } from 'react';
import { useCountUp } from '../../lib/useCountUp';

const fmtDE = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

interface ResultCardProps {
  label: string;
  value: ReactNode;
  unit: string;
  secondary?: string;
  children?: ReactNode;
  /** When provided, the main value is animated from old → new over 300 ms */
  numericValue?: number;
}

function AnimatedValue({ target }: { target: number }) {
  const n = useCountUp(target);
  return <>{fmtDE.format(n)}</>;
}

export default function ResultCard({
  label,
  value,
  unit,
  secondary,
  children,
  numericValue,
}: ResultCardProps) {
  return (
    <div className="result-summary overflow-hidden rounded-2xl border border-accent/20 bg-[linear-gradient(160deg,#0f5138_0%,#183027_100%)] shadow-[0_18px_42px_rgba(15,81,56,0.16)] lg:sticky lg:top-[85px]">
      <div className="relative px-6 py-7 sm:py-8">
        <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
          {label}
        </span>
        <div className="relative mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display font-bold text-5xl lg:text-[3.5rem] leading-none text-white tracking-tight break-words">
            {numericValue !== undefined ? <AnimatedValue target={numericValue} /> : value}
          </span>
          <span className="font-mono text-xl font-semibold text-white/90">{unit}</span>
        </div>
        {secondary && (
          <p className="relative mt-4 text-[13px] font-medium leading-relaxed text-white/82">
            {secondary}
          </p>
        )}
      </div>
      {children && (
        <div className="border-t border-white/10 bg-white/[0.04] px-6 pb-5 pt-2">
          {children}
        </div>
      )}
    </div>
  );
}
