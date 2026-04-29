import type { ReactNode } from 'react';
import ToolNav from './ToolNav';
import ToolFooter from './ToolFooter';

interface ToolShellProps {
  title: string;
  description: string;
  category: string;
  children: ReactNode;
}

export default function ToolShell({ title, description, category, children }: ToolShellProps) {
  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <ToolNav />
      </div>
      <main className="mx-auto max-w-6xl px-3 pb-14 pt-5 sm:px-6 sm:pt-7 print:px-0 print:pt-0">
        <div className="overflow-hidden rounded-[18px] border border-white/70 bg-white/82 shadow-[0_24px_70px_rgba(38,45,40,0.10)] backdrop-blur sm:rounded-[24px] print:border-0 print:rounded-none print:shadow-none">
          <div className="relative overflow-hidden border-b border-border px-5 pb-7 pt-7 sm:px-10 sm:pb-8 sm:pt-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#168a5a,#d69d2f,#168a5a)]" />
            <span className="inline-flex rounded-full bg-accent-light px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-strong">
              {category}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
              {description}
            </p>
          </div>
          <div className="px-5 py-7 sm:px-10 sm:py-9">{children}</div>
        </div>
      </main>
      <div className="print:hidden">
        <ToolFooter />
      </div>
    </div>
  );
}
