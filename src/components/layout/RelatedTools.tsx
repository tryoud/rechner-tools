import React, { useEffect, useState } from 'react';
import { TOOLS, type Tool } from '../../lib/tools';

export function RelatedTools() {
  const [related, setRelated] = useState<Tool[]>([]);

  useEffect(() => {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const currentTool = TOOLS.find((t) => t.slug === currentPath);

    let candidates: Tool[];

    if (currentTool?.related && currentTool.related.length > 0) {
      candidates = currentTool.related
        .map((id) => TOOLS.find((t) => t.id === id && t.available))
        .filter((t): t is Tool => t !== undefined);
    } else {
      const available = TOOLS.filter((t) => t.available && t.slug !== currentPath);
      candidates = [...available].sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    setRelated(candidates.slice(0, 3));
  }, []);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border/80 pt-8">
      <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Passende Rechner
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {related.map((tool) => (
          <a
            key={tool.id}
            href={tool.slug}
            className="group block rounded-2xl border border-border bg-white p-4 shadow-[0_8px_24px_rgba(38,45,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-accent-mid hover:shadow-[0_16px_34px_rgba(20,83,45,0.09)]"
          >
            <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
              {tool.category}
            </span>
            <h4 className="font-display text-sm font-bold text-ink transition-colors group-hover:text-accent">
              {tool.title}
            </h4>
            <p className="mt-1 text-xs text-ink-muted line-clamp-2">{tool.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
