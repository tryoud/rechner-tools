interface ToggleGroupProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

export default function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  const columnCount = options.length === 4 ? 2 : options.length;

  return (
    <div
      className="grid w-full max-w-full gap-1 rounded-xl border border-border bg-surface-elevated p-1 shadow-inner min-[520px]:w-fit"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => {
            const selectedValue = opt.value;
            onChange(selectedValue);
          }}
          className={`min-h-10 min-w-[4.5rem] rounded-lg px-3 py-2 text-center font-mono text-[12px] font-medium leading-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 ${
            value === opt.value
              ? 'bg-accent text-white shadow-sm'
              : 'text-ink-muted hover:bg-white hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
