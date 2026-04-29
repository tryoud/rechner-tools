import { TOOLS } from '../../lib/tools';

export default function ToolNav() {
  const navTools = TOOLS.filter((t) => t.available).slice(0, 4);

  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-2 font-display text-[1.05rem] font-bold tracking-tight text-ink transition-colors hover:text-accent"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-dark text-sm text-white shadow-sm">
            rt
          </span>
          <span>rechner.tools</span>
        </a>
        <div className="hidden items-center gap-1.5 sm:flex">
          {navTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.slug}
              className="rounded-full px-3 py-2 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink"
            >
              {tool.title.replace('-Rechner', '').replace('Rechner', '').trim()}
            </a>
          ))}
          <a
            href="/"
            className="ml-1 whitespace-nowrap rounded-full bg-accent-light px-3 py-2 text-[13px] font-semibold text-accent-strong transition-colors hover:bg-accent hover:text-white"
          >
            Alle Rechner →
          </a>
        </div>
      </div>
    </nav>
  );
}
