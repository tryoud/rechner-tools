interface FaqListProps {
  title: string;
  items: { question: string; answer: string }[];
}

export default function FaqList({ title, items }: FaqListProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-surface-elevated p-5 shadow-[0_18px_40px_rgba(44,42,37,0.05)] sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div
            key={item.question}
            className="rounded-[22px] border border-border bg-white px-4 py-4"
          >
            <h3 className="text-sm font-semibold text-ink">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
