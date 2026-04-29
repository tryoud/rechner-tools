interface TrustPanelProps {
  summary: string;
  updatedAt: string;
  checkedAgainst: string;
  sources: { label: string; url: string }[];
}

export default function TrustPanel({
  summary,
  updatedAt,
  checkedAgainst,
  sources,
}: TrustPanelProps) {
  return (
    <section className="rounded-2xl border border-accent/15 bg-[linear-gradient(135deg,#ffffff_0%,#edf7f0_100%)] p-5 shadow-[0_12px_30px_rgba(38,45,40,0.05)] sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-strong">
        Stand und Einordnung
      </p>
      <p className="mt-3 text-sm leading-6 text-ink">{summary}</p>
      <div className="mt-4 space-y-2 text-sm leading-6 text-ink-muted">
        <p>
          <span className="font-semibold text-ink">Zuletzt aktualisiert:</span> {updatedAt}
        </p>
        {checkedAgainst && (
          <p>
            <span className="font-semibold text-ink">Einordnung:</span> {checkedAgainst}
          </p>
        )}
      </div>
      {sources.length > 0 && (
        <div className="mt-4 border-t border-accent/10 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Quellen
          </p>
          <ul className="space-y-1.5">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  className="text-sm text-accent hover:text-accent-strong hover:underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
