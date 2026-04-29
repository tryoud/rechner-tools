interface ScenarioStripProps {
  title: string;
  items: { title: string; text: string }[];
}

export default function ScenarioStrip({ title, items }: ScenarioStripProps) {
  return (
    <section className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">{title}</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-white px-4 py-3">
            <h3 className="text-sm font-medium text-ink">{item.title}</h3>
            <p className="mt-1 text-sm leading-5 text-ink-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
