interface ScenarioGridProps {
  title: string;
  items: { title: string; text: string }[];
}

export default function ScenarioGrid({ title, items }: ScenarioGridProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-surface-elevated p-5 shadow-[0_18px_40px_rgba(44,42,37,0.05)] sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-[22px] border border-border bg-white px-4 py-4">
            <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
