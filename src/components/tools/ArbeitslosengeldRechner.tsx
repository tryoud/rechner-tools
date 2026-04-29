import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import ToggleGroup from '../ui/ToggleGroup';
import ResultCard from '../ui/ResultCard';
import BreakdownRow from '../ui/BreakdownRow';
import SectionLabel from '../ui/SectionLabel';
import BreakdownChart from '../charts/BreakdownChart';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import {
  calculateArbeitslosengeld,
  type ArbeitslosengeldInputs,
} from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.arbeitslosengeld;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

const initialState: ArbeitslosengeldInputs = {
  grossMonthly: 4000,
  netMonthly: 2650,
  hasChildren: false,
  employmentMonths: 24,
  isEastGermany: false,
};

function ToggleRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
      <div>
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <p className="text-xs text-ink-faint mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function SliderRow({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}) {
  return (
    <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-sm font-medium text-ink">{label}</span>
          {hint && <p className="text-xs text-ink-faint mt-0.5">{hint}</p>}
        </div>
        <span className="text-sm font-medium text-ink tabular-nums">
          {fmt(value)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-bg-lifted rounded-full appearance-none cursor-pointer accent-accent"
      />
    </div>
  );
}

export default function ArbeitslosengeldRechner() {
  const [input, setInput] = usePersistentState<ArbeitslosengeldInputs>(
    'rechner-tools:arbeitslosengeld:v1',
    initialState
  );

  const update = <K extends keyof ArbeitslosengeldInputs>(key: K, value: ArbeitslosengeldInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateArbeitslosengeld(input);

  return (
    <ToolShell
      title="Arbeitslosengeld-Rechner"
      description="Berechne dein Arbeitslosengeld I nach SGB III: 60 % / 67 % mit Kind des letzten Nettolohns, Bezugsdauer und Einkommensverlust."
      category="Arbeit"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Nach jobverlust übernimmt die Bundesagentur für Arbeit die Unterstützung. Hier
              siehst du sofort, wie hoch dein Arbeitslosengeld I ausfällt und wie lange der
              Anspruch besteht.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Einkommen" first />
              <NumberInput
                label="Monatsbrutto"
                hint="Rentenversicherungspflichtiges Bruttogehalt aus dem letzten Beschäftigungsverhältnis."
                value={input.grossMonthly}
                onChange={(value) => update('grossMonthly', value)}
                min={500}
                max={15000}
                step={100}
                unit="EUR"
              />
              <NumberInput
                label="Monatsnetto"
                hint="Tatsächlicher Netto-Auszahlungsbetrag laut letzter Gehaltsabrechnung."
                value={input.netMonthly}
                onChange={(value) => update('netMonthly', value)}
                min={400}
                max={12000}
                step={50}
                unit="EUR"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Persönliche Angaben" />
              <ToggleRow
                label="Kinder im Haushalt"
                hint="Mit Kind erhöht sich der Leistungssatz von 60 % auf 67 %."
              >
                <ToggleGroup
                  options={[
                    { label: 'Nein', value: 'false' },
                    { label: 'Ja', value: 'true' },
                  ]}
                  value={input.hasChildren ? 'true' : 'false'}
                  onChange={(value) => update('hasChildren', value === 'true')}
                />
              </ToggleRow>
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="03" label="Versicherungsdauer" />
              <SliderRow
                label="Beitragsmonate in den letzten 2 Jahren"
                hint="Mindestens 12 Monate für Anspruch auf Arbeitslosengeld I."
                value={input.employmentMonths}
                onChange={(value) => update('employmentMonths', value)}
                min={0}
                max={24}
                step={1}
                unit="Monate"
              />
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label={calc.hasClaim ? 'Arbeitslosengeld I / Monat' : 'Kein Anspruch'}
            value={calc.hasClaim ? fmt(calc.monthlyALG) : '—'}
            unit="EUR"
            secondary={
              calc.hasClaim
                ? `Leistungssatz ${fmt(calc.effectiveRate)}% · Bezugsdauer bis zu ${calc.durationWeeks} Wochen`
                : 'Mindestens 12 Monate Versicherungsdauer erforderlich'
            }
          >
            {calc.hasClaim ? (
              <>
                <BreakdownRow label="Monatsbrutto" value={`${fmt(input.grossMonthly)} EUR`} />
                <BreakdownRow label="Monatsnetto" value={`${fmt(input.netMonthly)} EUR`} />
                <BreakdownRow
                  label="Arbeitslosengeld täglich"
                  value={`${fmt(calc.dailyALG)} EUR`}
                />
                <BreakdownRow
                  label="Arbeitslosengeld wöchentlich"
                  value={`${fmt(calc.weeklyALG)} EUR`}
                />
                <BreakdownRow
                  label="Arbeitslosengeld monatlich"
                  value={`${fmt(calc.monthlyALG)} EUR`}
                />
                <BreakdownRow
                  label="Einkommensverlust / Monat"
                  value={`${fmt(calc.incomeLossMonthly)} EUR`}
                  highlight
                />
                <BreakdownRow
                  label="Max. Auszahlung gesamt"
                  value={`${fmt(calc.maxPayout)} EUR`}
                  highlight
                />
              </>
            ) : (
              <BreakdownRow
                label="Fehlende Monate"
                value={`${fmt(Math.max(12 - input.employmentMonths, 0))} Monate`}
                highlight
              />
            )}
          </ResultCard>
        }
        sidebar={
          <>
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors"
            >
              Ergebnis drucken / als PDF sichern
            </button>
            <TrustPanel
              summary={content.summary}
              updatedAt={content.updatedAt}
              checkedAgainst={content.checkedAgainst}
              sources={content.sources}
            />
          </>
        }
        analysis={
          calc.hasClaim ? (
            <BreakdownChart
              title="Einkommensverteilung bei Arbeitslosigkeit"
              labels={['Arbeitslosengeld', 'Einkommensverlust']}
              values={[calc.monthlyALG, calc.incomeLossMonthly]}
              colors={[['#004b34', '#334155']]}
            />
          ) : null
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
    </ToolShell>
  );
}
