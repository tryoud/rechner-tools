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
  calculateKapitalertrag,
  type KapitalertragInputs,
  type FilingStatus,
} from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.kapitalertrag;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

const initialState: KapitalertragInputs = {
  capitalIncome: 5000,
  losses: 0,
  filingStatus: 'single',
  churchTaxRate: 0,
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

export default function KapitalertragRechner() {
  const [input, setInput] = usePersistentState<KapitalertragInputs>(
    'rechner-tools:kapitalertrag:v1',
    initialState
  );

  const update = <K extends keyof KapitalertragInputs>(key: K, value: KapitalertragInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateKapitalertrag(input);

  return (
    <ToolShell
      title="Kapitalertrag-Rechner"
      description="Berechne Abgeltungsteuer, Soli und Kirchensteuer auf Kapitalerträge — nach Sparerpauschbetrag und verrechenbaren Verlusten."
      category="Finanzen"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Gib deine Kapitalerträge ein — Dividenden, Zinsen und Kursgewinne addiert. Der Rechner
              zieht Sparerpauschbetrag und Verluste ab und zeigt die genaue Steuerlast.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Kapitalerträge" first />
              <NumberInput
                label="Kapitalerträge brutto"
                hint="Summe aus Dividenden, Zinsen und realisierten Kursgewinnen."
                value={input.capitalIncome}
                onChange={(value) => update('capitalIncome', value)}
                min={0}
                max={500000}
                step={100}
                unit="EUR"
              />
              <NumberInput
                label="Verrechenbare Verluste"
                hint="Realisierte Verluste aus Kapitalanlagen im selben Kalenderjahr."
                value={input.losses}
                onChange={(value) => update('losses', value)}
                min={0}
                max={500000}
                step={100}
                unit="EUR"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Persönliche Angaben" />
              <ToggleRow
                label="Veranlagung"
                hint="Verheiratete erhalten doppelten Sparerpauschbetrag (2.000 EUR)."
              >
                <ToggleGroup
                  options={[
                    { label: 'Ledig', value: 'single' },
                    { label: 'Verheiratet', value: 'married' },
                  ]}
                  value={input.filingStatus}
                  onChange={(value) => update('filingStatus', value as FilingStatus)}
                />
              </ToggleRow>
              <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                <span className="text-sm font-medium text-ink">Kirchensteuer</span>
                <p className="text-xs text-ink-faint mt-0.5 mb-2.5">
                  8 % (BY/BW) oder 9 % (übrige Länder). Beeinflusst die Abgeltungsteuer via
                  Divisormethode.
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {([0, 8, 9] as const).map((rate) => (
                    <button
                      type="button"
                      key={rate}
                      onClick={() => update('churchTaxRate', rate)}
                      className={`py-2 text-xs font-mono border rounded transition-colors ${
                        input.churchTaxRate === rate
                          ? 'bg-accent text-white border-accent'
                          : 'border-border text-ink-muted hover:border-accent-mid hover:text-ink'
                      }`}
                    >
                      {rate === 0 ? 'Keine' : `${rate} %`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label="Nettobetrag nach Steuer"
            value={fmt(calc.netPayout)}
            unit="EUR"
            secondary={`Steuerlast gesamt ${fmt(calc.totalTax)} EUR · Effektivrate ${fmtDec(calc.effectiveRate)} %`}
          >
            <BreakdownRow label="Sparerpauschbetrag" value={`${fmt(calc.pauschbetrag)} EUR`} />
            <BreakdownRow label="Bemessungsgrundlage" value={`${fmt(calc.taxableIncome)} EUR`} />
            <BreakdownRow
              label="Abgeltungsteuer (25 %)"
              value={`${fmt(calc.abgeltungsteuer)} EUR`}
            />
            <BreakdownRow label="Solidaritätszuschlag" value={`${fmt(calc.soli)} EUR`} />
            <BreakdownRow label="Kirchensteuer" value={`${fmt(calc.kirchensteuer)} EUR`} />
            <BreakdownRow label="Steuerlast gesamt" value={`${fmt(calc.totalTax)} EUR`} highlight />
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
          <BreakdownChart
            title="Verteilung der Kapitalerträge"
            labels={['Nettobetrag', 'Abgeltungsteuer', 'Soli', 'Kirchensteuer']}
            values={[calc.netPayout, calc.abgeltungsteuer, calc.soli, calc.kirchensteuer]}
            colors={['#004b34', '#334155', '#94a3b8', '#e2e8f0']}
          />
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
