interface HowToStepsProps {
  title: string;
  steps: { title: string; description: string }[];
}

export default function HowToSteps({ title, steps }: HowToStepsProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-surface-elevated p-5 shadow-[0_18px_40px_rgba(44,42,37,0.05)] sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      <div className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex gap-4 rounded-[22px] border border-border bg-white px-4 py-4"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-light font-mono text-[11px] font-semibold text-accent">
              {index + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
