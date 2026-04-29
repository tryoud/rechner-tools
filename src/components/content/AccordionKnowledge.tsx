interface AccordionKnowledgeProps {
  title: string;
  items: { title: string; body: string }[];
}

export default function AccordionKnowledge({ title, items }: AccordionKnowledgeProps) {
  return (
    <section className="rounded-[20px] border border-border bg-surface-elevated">
      <div className="border-b border-border px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      </div>
      <div>
        {items.map((item, index) => (
          <details
            key={item.title}
            className={`group px-5 py-4 ${index > 0 ? 'border-t border-border' : ''}`}
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
              <span>{item.title}</span>
              <span className="font-mono text-xs text-ink-faint transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="faq-answer mt-3 max-w-3xl pr-6 text-sm leading-6 text-ink-muted">{item.body}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
