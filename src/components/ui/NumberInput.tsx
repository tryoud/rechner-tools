import { useState } from 'react';

interface NumberInputProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  unitPosition?: 'left' | 'right';
}

export default function NumberInput({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  unitPosition = 'right',
}: NumberInputProps) {
  const [raw, setRaw] = useState<string | null>(null);

  const displayValue = raw !== null ? raw : String(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setRaw(text);
    const num = parseFloat(text);
    if (!Number.isNaN(num)) {
      onChange(num);
    }
  }

  function handleBlur() {
    setRaw(null);

    const num = parseFloat(displayValue);
    if (Number.isNaN(num)) {
      const fallbackValue = min ?? 0;
      onChange(fallbackValue);
    }
  }

  return (
    <div className="group flex flex-col gap-3 border-b border-border/80 px-3 py-4 transition-colors hover:bg-surface-elevated min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between min-[430px]:gap-4 sm:rounded-xl">
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="text-xs text-ink-faint mt-0.5 leading-4">{hint}</span>}
      </div>
      <div className="flex w-full items-center gap-1.5 min-[430px]:w-auto min-[430px]:shrink-0">
        {unit && unitPosition === 'left' && (
          <span className="font-mono text-[11px] text-ink-faint shrink-0">{unit}</span>
        )}
        <input
          type="number"
          value={displayValue}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          onBlur={handleBlur}
          className="min-h-11 w-full rounded-xl border border-border bg-white px-3 py-2 text-right font-mono text-[14px] font-medium text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 min-[430px]:w-32"
        />
        {unit && unitPosition === 'right' && (
          <span className="min-w-10 shrink-0 font-mono text-[11px] text-ink-faint">{unit}</span>
        )}
      </div>
    </div>
  );
}
