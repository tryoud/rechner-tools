import type { ReactNode } from 'react';

interface PrintSummaryProps {
  title: string;
  items: { label: string; value: string | ReactNode }[];
}

export default function PrintSummary({ title, items }: PrintSummaryProps) {
  return (
    <div className="hidden print:block max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-ink mb-2">{title}</h1>
      <p className="text-ink-muted mb-8">Erstellt am {new Date().toLocaleDateString('de-DE')}</p>

      <div className="w-full text-left border-t border-border">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between py-3 border-b border-border/50">
            <span className="text-sm text-ink-muted">{item.label}</span>
            <span className="text-sm font-medium text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
