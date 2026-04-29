import type { ReactNode } from 'react';
import { AdSlot } from '../ads/AdSlot';
import { RelatedTools } from './RelatedTools';

interface ToolPageScaffoldProps {
  heroSummary?: ReactNode;
  calculator: ReactNode;
  result: ReactNode;
  sidebar?: ReactNode;
  analysis?: ReactNode;
  trust: ReactNode;
}

export default function ToolPageScaffold({
  heroSummary,
  calculator,
  result,
  sidebar,
  analysis,
  trust,
}: ToolPageScaffoldProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
        <div className="space-y-6">
          {heroSummary}
          {calculator}
        </div>
        <aside className="space-y-3">
          {result}
          <div className="py-2 print:hidden">
            <AdSlot id="result-proximity" layout="in-article" />
          </div>
          <div className="print:hidden">{sidebar}</div>
        </aside>
      </section>

      {analysis && <section>{analysis}</section>}

      <div className="py-4 print:hidden">
        <AdSlot id="content-divider" layout="in-feed" />
      </div>

      <section className="print:hidden">{trust}</section>

      <div className="print:hidden">
        <RelatedTools />
      </div>
    </div>
  );
}
