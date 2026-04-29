interface SliderInputProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (val: number) => string;
  labels?: { left: string; right: string };
}

export default function SliderInput({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  labels,
}: SliderInputProps) {
  const display = formatValue ? formatValue(value) : value.toString();

  return (
    <div className="rounded-xl border-b border-border/80 px-3 py-4 transition-colors hover:bg-surface-elevated">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ink">{label}</span>
          {hint && <span className="text-xs text-ink-faint mt-0.5 leading-4">{hint}</span>}
        </div>
        <span className="shrink-0 rounded-full bg-accent-light px-2.5 py-1 font-mono text-sm font-semibold text-accent-strong">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {labels && (
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[10px] text-ink-faint">{labels.left}</span>
          <span className="font-mono text-[10px] text-ink-faint">{labels.right}</span>
        </div>
      )}
    </div>
  );
}
