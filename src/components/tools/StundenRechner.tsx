import { useMemo, useCallback, useState } from 'react';
import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import {
  calculateStundenrechner,
  type StundenrechnerInputs,
  type TimeEntry,
} from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.stundenrechner;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(n);

const generateId = () => Math.random().toString(36).substring(2, 9);

const intentBadges = ['Kostenlos', 'Keine Anmeldung', 'Sofort-Berechnung', 'PDF-Druck'];

const quickChoices = [
  { label: '8h', startTime: '09:00', endTime: '17:00', breakMinutes: 0 },
  { label: '8h mit Pause', startTime: '09:00', endTime: '17:30', breakMinutes: 30 },
  { label: '7,5h', startTime: '09:00', endTime: '17:00', breakMinutes: 30 },
];

const flowSteps = [
  { number: '1', label: 'Zeiten eingeben' },
  { number: '2', label: 'Pause abziehen' },
  { number: '3', label: 'Ergebnis sichern' },
];

const seoSections = [
  {
    title: 'Das Wichtigste in Kürze',
    items: [
      'Berechnet Arbeitszeit aus Start, Ende und Pause.',
      'Zeigt das Ergebnis als Stunden:Minuten und als Dezimalstunden.',
      'Bei Bedarf lässt sich der Lohn aus Stundensatz und Industriestunden einblenden.',
    ],
  },
  {
    title: 'Für wen ist der Rechner?',
    items: [
      'Arbeitnehmer dokumentieren Arbeitsstunden und Pausen.',
      'Schichtarbeit lässt sich auch über Mitternacht berechnen.',
      'Freelancer erhalten Dezimalstunden für Rechnung und Stundenzettel.',
      'Arbeitgeber können Nettoarbeitszeit grob plausibilisieren.',
    ],
  },
  {
    title: 'Dezimalstunden & Industriestunden',
    items: [
      '7:30 Stunden entsprechen 7,5 Dezimalstunden.',
      '45 Minuten entsprechen 0,75 Industriestunden.',
      'Dezimalstunden sind praktisch für Lohnabrechnung und Rechnungen.',
    ],
  },
  {
    title: 'Pausen richtig abziehen',
    items: [
      'Die Pause wird in Minuten eingegeben und von der Anwesenheitszeit abgezogen.',
      'Nach ArbZG sind bei mehr als 6 bis 9 Stunden mindestens 30 Minuten Pause vorgesehen.',
      'Bei mehr als 9 Stunden sind mindestens 45 Minuten Pause vorgesehen.',
    ],
  },
  {
    title: 'Häufige Fehler',
    items: [
      '7,45 bedeutet nicht 7 Stunden 45 Minuten, sondern 7 Stunden und 45 Prozent einer Stunde.',
      'Vergessene Pausen führen zu einer zu hohen Nettoarbeitszeit.',
      'Wenn das Ende vor dem Start liegt, wird die Arbeitszeit als Nachtschicht berechnet.',
    ],
  },
];

const primarySeoSection = seoSections[0];
const secondarySeoSections = seoSections.slice(1);

const initialState: StundenrechnerInputs = {
  hourlyRate: 50,
  entries: [
    {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '16:00',
      breakMinutes: 30,
    },
  ],
};

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/.svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/.svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

export default function StundenRechner() {
  const [input, setInput] = usePersistentState<StundenrechnerInputs>(
    'rechner-tools:stundenrechner:v1',
    initialState
  );
  const [showWage, setShowWage] = useState(false);

  const updateRate = useCallback(
    (value: number) => {
      setInput({ ...input, hourlyRate: value });
    },
    [input, setInput]
  );

  const updateEntry = useCallback(
    (id: string, key: keyof TimeEntry, value: string | number) => {
      setInput({
        ...input,
        entries: input.entries.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
      });
    },
    [input, setInput]
  );

  const addEntry = useCallback(() => {
    const lastEntry = input.entries[input.entries.length - 1];
    let nextDate = new Date().toISOString().split('T')[0];

    if (lastEntry && lastEntry.date) {
      const d = new Date(lastEntry.date);
      d.setDate(d.getDate() + 1);
      nextDate = d.toISOString().split('T')[0];
    }

    setInput({
      ...input,
      entries: [
        ...input.entries,
        {
          id: generateId(),
          date: nextDate,
          startTime: lastEntry?.startTime || '08:00',
          endTime: lastEntry?.endTime || '16:00',
          breakMinutes: lastEntry?.breakMinutes || 30,
        },
      ],
    });
  }, [input, setInput]);

  const applyQuickChoice = useCallback(
    (choice: (typeof quickChoices)[number]) => {
      const firstEntry = input.entries[0] ?? initialState.entries[0];
      const nextEntry = {
        ...firstEntry,
        startTime: choice.startTime,
        endTime: choice.endTime,
        breakMinutes: choice.breakMinutes,
      };

      setInput({
        ...input,
        entries: [nextEntry, ...input.entries.slice(1)],
      });
    },
    [input, setInput]
  );

  const removeEntry = useCallback(
    (id: string) => {
      if (input.entries.length <= 1) return;
      setInput({
        ...input,
        entries: input.entries.filter((e) => e.id !== id),
      });
    },
    [input, setInput]
  );

  const calc = useMemo(() => calculateStundenrechner(input), [input]);
  const resultColumns = showWage ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <ToolShell
      title="Arbeitszeitrechner & Stundenrechner"
      description="Arbeitszeit mit Pause berechnen, in Dezimalstunden umwandeln und optional Lohn oder Stundenzettel erstellen."
      category="Arbeit"
    >
      {/* 
        Print View (Only visible when printing)
      */}
      <div className="hidden print:block max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-ink mb-2">Arbeitszeitnachweis</h1>
        <p className="text-ink-muted mb-8">Erstellt am {new Date().toLocaleDateString('de-DE')}</p>

        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-sm text-ink-muted font-medium">Datum</th>
              <th className="py-2 text-sm text-ink-muted font-medium">Start</th>
              <th className="py-2 text-sm text-ink-muted font-medium">Ende</th>
              <th className="py-2 text-sm text-ink-muted font-medium text-right">Pause</th>
              <th className="py-2 text-sm text-ink-muted font-medium text-right">Netto-Zeit</th>
            </tr>
          </thead>
          <tbody>
            {input.entries.map((entry) => {
              const [startH, startM] = entry.startTime.split(':').map(Number);
              const [endH, endM] = entry.endTime.split(':').map(Number);
              const isEndBeforeStart =
                !isNaN(startH) &&
                !isNaN(startM) &&
                !isNaN(endH) &&
                !isNaN(endM) &&
                (endH < startH || (endH === startH && endM < startM));
              const workMinutes = isEndBeforeStart
                ? 0
                : endH * 60 + endM - (startH * 60 + startM) - entry.breakMinutes;
              const hours = Math.floor(workMinutes / 60);
              const mins = workMinutes % 60;
              const formattedWorkTime = `${hours}h ${mins}m`;

              return (
                <tr
                  key={entry.id}
                  className={`border-b border-border ${isEndBeforeStart ? 'bg-red-50' : ''}`}
                >
                  <td className="py-2 text-sm text-ink">{entry.date}</td>
                  <td className="py-2 text-sm text-ink">{entry.startTime}</td>
                  <td className="py-2 text-sm text-ink">{entry.endTime}</td>
                  <td className="py-2 text-sm text-ink text-right">{entry.breakMinutes} m</td>
                  <td className="py-2 text-sm text-ink text-right font-medium">
                    {formattedWorkTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Industriestunden:</span>
              <span className="font-medium text-ink">{fmt(calc.decimalHours)} h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Stundensatz:</span>
              <span className="font-medium text-ink">{fmt(input.hourlyRate)} EUR/h</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 mt-1 border-t border-border">
              <span className="text-ink">Gesamtsumme:</span>
              <span className="text-ink">{fmt(calc.grossPay)} EUR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated">
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm leading-6 text-ink">
                  Gib von, bis und Pause ein. Der Rechner zeigt Arbeitszeit, Dezimalstunden und
                  Lohn sofort an.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {intentBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-accent/15 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-strong"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`grid gap-3 px-5 py-4 ${resultColumns}`}>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                    Arbeitszeit
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink">
                    {calc.formattedTime}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                    Dezimalstunden
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink">
                    {fmt(calc.decimalHours)} h
                  </p>
                </div>
                {showWage && (
                  <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    Lohn
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-accent-strong">
                    {fmt(calc.grossPay)} EUR
                  </p>
                  </div>
                )}
              </div>
              <div className="grid border-t border-border text-xs font-medium text-ink-muted sm:grid-cols-3">
                {flowSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex items-center gap-2 border-border px-5 py-3 sm:border-l first:sm:border-l-0"
                  >
                    <span className="font-mono text-accent">{step.number}</span>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          }
          calculator={
            <>
              <div className="space-y-5">
                <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-ink">
                        Arbeitszeit berechnen
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-ink-muted">
                        Start, Ende und Pause reichen. Mehrere Tage kannst du als weitere Zeilen
                        erfassen.
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-ink-faint">
                      {calc.entryCount} {calc.entryCount === 1 ? 'Tag' : 'Tage'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {quickChoices.map((choice) => (
                        <button
                          key={choice.label}
                          type="button"
                          onClick={() => applyQuickChoice(choice)}
                          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-accent-mid hover:text-ink"
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>
                    <div className="hidden grid-cols-[1fr_1fr_90px_40px] gap-3 px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint sm:grid">
                      <div>Von</div>
                      <div>Bis</div>
                      <div>Pause</div>
                      <div></div>
                    </div>

                    {input.entries.map((entry) => {
                        const [startH, startM] = entry.startTime.split(':').map(Number);
                        const [endH, endM] = entry.endTime.split(':').map(Number);
                        const isEndBeforeStart =
                          !isNaN(startH) &&
                          !isNaN(startM) &&
                          !isNaN(endH) &&
                          !isNaN(endM) &&
                          (endH < startH || (endH === startH && endM < startM));

                        return (
                          <div
                            key={entry.id}
                            className={`grid gap-3 rounded-xl border bg-surface-elevated p-3 sm:grid-cols-[1fr_1fr_90px_40px] sm:items-center sm:bg-white sm:p-2 ${
                              isEndBeforeStart ? 'border-red-300 bg-red-50' : 'border-border'
                            }`}
                          >
                            <div>
                              <label className="text-xs text-ink-muted mb-1 block sm:hidden">
                                Von
                              </label>
                              <input
                                type="time"
                                value={entry.startTime}
                                onChange={(e) => updateEntry(entry.id, 'startTime', e.target.value)}
                                className="min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                                aria-label="Startzeit"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-ink-muted mb-1 block sm:hidden">
                                Bis
                              </label>
                              <input
                                type="time"
                                value={entry.endTime}
                                onChange={(e) => updateEntry(entry.id, 'endTime', e.target.value)}
                                className="min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                                aria-label="Endzeit"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-ink-muted mb-1 block sm:hidden">
                                Pause (Min)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  step="5"
                                  value={entry.breakMinutes}
                                  onChange={(e) =>
                                    updateEntry(
                                      entry.id,
                                      'breakMinutes',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 pr-8 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                                  aria-label="Pause in Minuten"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint">
                                  m
                                </span>
                              </div>
                            </div>
                            <div className="sm:flex sm:justify-end">
                              <button
                                type="button"
                                onClick={() => removeEntry(entry.id)}
                                disabled={input.entries.length <= 1}
                                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-muted"
                                title="Eintrag löschen"
                                aria-label="Eintrag löschen"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                            {isEndBeforeStart && (
                              <div className="col-span-full text-xs text-red-600" role="alert">
                                Die Endzeit liegt vor der Startzeit.
                              </div>
                            )}
                            <details className="col-span-full">
                              <summary className="cursor-pointer list-none text-xs font-medium text-ink-muted hover:text-ink">
                                Datum ändern
                              </summary>
                              <div className="mt-2 max-w-xs">
                                <label className="mb-1 block text-xs text-ink-muted">Datum</label>
                                <input
                                  type="date"
                                  value={entry.date}
                                  onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                                  className="min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                                  aria-label="Datum"
                                />
                              </div>
                            </details>
                          </div>
                        );
                      })}
                    <button
                      type="button"
                      onClick={addEntry}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-ink-muted transition-all hover:border-ink-faint hover:bg-surface-elevated hover:text-ink"
                      aria-label="Weiteren Tag hinzufügen"
                    >
                      <PlusIcon /> Tag hinzufügen
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-border bg-white">
                  <button
                    type="button"
                    onClick={() => setShowWage((current) => !current)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                    aria-expanded={showWage}
                  >
                    <span>
                      <span className="block font-display text-lg font-bold text-ink">
                        Lohn berechnen
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-ink-muted">
                        Optional: Stundensatz einblenden und Lohn berechnen.
                      </span>
                    </span>
                    <span className="font-mono text-xl text-ink-faint">{showWage ? '-' : '+'}</span>
                  </button>
                  <div className={`${showWage ? 'block' : 'hidden'} border-t border-border px-4 pb-4 sm:px-5`}>
                    <div className="[&>div:last-child]:border-b-0">
                      <NumberInput
                        label="Stundensatz"
                        hint="Wird mit den Dezimalstunden multipliziert."
                        value={input.hourlyRate}
                        onChange={updateRate}
                        min={0}
                        max={1000}
                        step={1}
                        unit="EUR/h"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-6">
                <ScenarioStrip title="Kurze Fakten" items={content.scenarios} />
              </div>
              <section className="mt-6 rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  Arbeitszeit verstehen
                </p>
                <div className="mt-4 space-y-3">
                  <article className="rounded-xl border border-border bg-white p-4">
                    <h3 className="font-display text-base font-bold text-ink">
                      {primarySeoSection.title}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-muted">
                      {primarySeoSection.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {secondarySeoSections.map((section) => (
                      <details
                        key={section.title}
                        className="rounded-xl border border-border bg-white p-4"
                      >
                        <summary className="cursor-pointer list-none font-display text-base font-bold text-ink">
                          {section.title}
                        </summary>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-muted">
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            </>
          }
          result={
            <div className="hidden rounded-2xl border border-border bg-white p-5 lg:block">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Stundenzettel
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-ink">Bereit zum Export</h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Drucke die aktuelle Berechnung als kompakten Arbeitszeitnachweis.
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-accent"
                aria-label="Als Stundenzettel drucken oder PDF"
              >
                Drucken / PDF
              </button>
              {input.entries.some((entry) => {
                const [startH, startM] = entry.startTime.split(':').map(Number);
                const [endH, endM] = entry.endTime.split(':').map(Number);
                return (
                  !isNaN(startH) &&
                  !isNaN(startM) &&
                  !isNaN(endH) &&
                  !isNaN(endM) &&
                  (endH < startH || (endH === startH && endM < startM))
                );
              }) && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                  role="alert"
                >
                  Einige Einträge haben eine Endzeit, die vor der Startzeit liegt. Bitte überprüfe
                  deine Eingaben.
                </div>
              )}
            </div>
          }
          sidebar={
            <>
              <div>
                <TrustPanel
                  summary={content.summary}
                  updatedAt={content.updatedAt}
                  checkedAgainst={content.checkedAgainst}
                  sources={content.sources}
                />
              </div>
            </>
          }
          trust={
            <div className="space-y-4">
              <InlineDisclaimer text={content.disclaimer} />
              <AccordionKnowledge
                title="Wissen und Orientierung"
                items={[
                  ...content.faqs.map((item) => ({ title: item.question, body: item.answer })),
                  ...content.howTo.map((item) => ({ title: item.title, body: item.description })),
                ]}
              />
            </div>
          }
        />
      </div>
    </ToolShell>
  );
}
