export default function ToolFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/70 px-6 py-5 shadow-[0_14px_40px_rgba(38,45,40,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-display font-bold text-sm text-ink">rechner.tools</span>
          <div className="mt-1.5 flex gap-4">
            <a
              href="/impressum"
              className="text-sm text-ink-muted hover:text-accent transition-colors"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="text-sm text-ink-muted hover:text-accent transition-colors"
            >
              Datenschutz
            </a>
          </div>
        </div>
        <span className="font-mono text-[11px] text-ink-faint">
          Alle Angaben ohne Gewähr · {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
