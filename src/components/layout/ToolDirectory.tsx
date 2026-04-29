import React, { useState } from 'react';
import type { Tool } from '../../lib/tools';

interface ToolDirectoryProps {
  tools: Tool[];
  featured?: Tool;
}

export function ToolDirectory({ tools, featured }: ToolDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const liveTools = tools.filter((t) => t.available);
  const nextTools = tools.filter((t) => !t.available);

  const filteredTools = liveTools.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If searching, show all matches. If not searching, separate featured and the rest.
  const displayTools = searchQuery
    ? filteredTools
    : filteredTools.filter((t) => t.id !== featured?.id);

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mx-auto mb-8 max-w-3xl">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Welchen Rechner suchst du? (z.B. Brutto-Netto, Elterngeld...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="min-h-14 w-full rounded-2xl border border-border bg-white py-3 pl-12 pr-4 text-base text-ink shadow-[0_12px_30px_rgba(38,45,40,0.07)] transition-all placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {/* Featured Tool (only show if no active search) */}
      {!searchQuery && featured && (
        <div className="mb-6">
          <a
            href={featured.slug}
            className="group block overflow-hidden rounded-2xl border border-accent/20 bg-[linear-gradient(135deg,#ffffff_0%,#f2f8f3_100%)] p-5 shadow-[0_16px_36px_rgba(38,45,40,0.07)] transition-all hover:-translate-y-0.5 hover:border-accent-mid hover:shadow-[0_20px_44px_rgba(20,83,45,0.12)] sm:p-6"
          >
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                    {featured.category}
                  </span>
                  {featured.new && (
                    <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                      NEU
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent-strong sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
                  {featured.description}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm transition-colors group-hover:bg-accent group-hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Live Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {displayTools.map((tool) => (
          <a
            key={tool.id}
            href={tool.slug}
            className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(38,45,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-accent-mid hover:shadow-[0_16px_34px_rgba(20,83,45,0.10)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-surface-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted transition-colors group-hover:bg-accent-light group-hover:text-accent-strong">
                {tool.category}
              </span>
              {tool.new && !searchQuery && (
                <span className="rounded-full bg-highlight/15 px-2 py-0.5 font-mono text-[9px] text-ink-muted">
                  NEU
                </span>
              )}
            </div>
            <h2 className="font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-accent-strong">
              {tool.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted line-clamp-2">
              {tool.description}
            </p>
            <div className="mt-4 flex justify-end">
              <svg
                className="h-4 w-4 text-ink-faint transition-colors group-hover:text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-ink-muted">Kein Rechner für "{searchQuery}" gefunden.</p>
        </div>
      )}

      {/* Coming Soon (only if no search) */}
      {!searchQuery && nextTools.length > 0 && (
        <div className="mt-16 border-t border-border/70 pt-8">
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            In Vorbereitung
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {nextTools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-xl border border-border/70 bg-surface-elevated px-4 py-3 opacity-75"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-sm text-ink">{tool.title}</h3>
                  <span className="font-mono text-[9px] border border-border text-ink-faint px-1.5 py-0.5 rounded-sm">
                    BALD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
