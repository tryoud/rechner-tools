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
import { calculateMietpreisbremse, type MietpreisbremseInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.mietpreisbremse;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const initialState: MietpreisbremseInputs = {
  currentRentMonthly: 1200,
  comparableRentMonthly: 1000,
  apartmentSizeSqm: 65,
  preExistingRent: 0,
  modernizationCostPerSqm: 0,
  isExempt: false,
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

export default function MietpreisbremseRechner() {
  const [input, setInput] = usePersistentState<MietpreisbremseInputs>(
    'rechner-tools:mietpreisbremse:v1',
    initialState
  );

  const update = <K extends keyof MietpreisbremseInputs>(key: K, value: MietpreisbremseInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateMietpreisbremse(input);

  // const statusColor = calc.isExempt
  //   ? 'text-ink-muted'
  //   : calc.isCompliant
  //   ? 'text-accent'
  //   : 'text-red-600'

  const statusLabel = calc.isExempt ? 'Ausgenommen' : calc.isCompliant ? 'Konform' : 'Überpreis';

  return (
    <ToolShell
      title="Mietpreisbremse-Rechner"
      description="Prüfe, ob deine Miete die gesetzliche Obergrenze einhält — inklusive Modernisierungszuschlag und Vormiete-Ausnahme."
      category="Wohnen"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Die ortsübliche Vergleichsmiete findest du im Mietspiegel deiner Stadt. Trag sie ein —
              der Rechner zeigt sofort, ob deine Miete im gesetzlichen Rahmen liegt.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Miete und Wohnung" first />
              <NumberInput
                label="Aktuelle Kaltmiete"
                hint="Vereinbarte monatliche Kaltmiete ohne Nebenkosten."
                value={input.currentRentMonthly}
                onChange={(value) => update('currentRentMonthly', value)}
                min={100}
                max={10000}
                step={10}
                unit="EUR/Mo"
              />
              <NumberInput
                label="Ortsübliche Vergleichsmiete"
                hint="Aus dem qualifizierten Mietspiegel deiner Gemeinde."
                value={input.comparableRentMonthly}
                onChange={(value) => update('comparableRentMonthly', value)}
                min={100}
                max={10000}
                step={10}
                unit="EUR/Mo"
              />
              <NumberInput
                label="Wohnfläche"
                hint="Für die Berechnung des Modernisierungszuschlags pro qm."
                value={input.apartmentSizeSqm}
                onChange={(value) => update('apartmentSizeSqm', value)}
                min={10}
                max={500}
                step={1}
                unit="qm"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Ausnahmen" />
              <ToggleRow
                label="Neubau oder Vollmodernisierung"
                hint="Erstbezug nach 1.10.2014 oder umfassende Modernisierung — Mietpreisbremse gilt nicht."
              >
                <ToggleGroup
                  options={[
                    { label: 'Nein', value: 'off' },
                    { label: 'Ja', value: 'on' },
                  ]}
                  value={input.isExempt ? 'on' : 'off'}
                  onChange={(value) => update('isExempt', value === 'on')}
                />
              </ToggleRow>
              <NumberInput
                label="Vormiete (falls höher)"
                hint="War die Miete des Vormieters höher als die zulässige Grenze, darf dieser Betrag weitergegeben werden. 0 = nicht anwendbar."
                value={input.preExistingRent}
                onChange={(value) => update('preExistingRent', value)}
                min={0}
                max={10000}
                step={10}
                unit="EUR/Mo"
              />
              <NumberInput
                label="Modernisierungskosten / qm"
                hint="Investierte Modernisierungskosten pro qm — max. 8 % p.a. als Zuschlag, gedeckelt auf 3 EUR/qm/Monat."
                value={input.modernizationCostPerSqm}
                onChange={(value) => update('modernizationCostPerSqm', value)}
                min={0}
                max={1000}
                step={10}
                unit="EUR/qm"
              />
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label="Zulässige Höchstmiete"
            value={fmt(calc.maxAllowedRent)}
            unit="EUR/Mo"
            secondary={`${fmtDec(calc.maxRentPerSqm)} EUR/qm · Status: ${statusLabel}`}
          >
            <BreakdownRow label="Vergleichsmiete + 10 %" value={`${fmt(calc.baseMax)} EUR`} />
            <BreakdownRow
              label="Modernisierungszuschlag"
              value={`${fmt(calc.modernizationSurchargeTotal)} EUR`}
            />
            <BreakdownRow
              label="Aktuelle Kaltmiete"
              value={`${fmt(input.currentRentMonthly)} EUR`}
            />
            <BreakdownRow label="Aktuelle Miete / qm" value={`${fmtDec(calc.rentPerSqm)} EUR`} />
            <BreakdownRow
              label="Überpreis / Monat"
              value={calc.isExempt ? 'Ausgenommen' : `${fmt(calc.overchargeMonthly)} EUR`}
              highlight
            />
            <BreakdownRow
              label="Überpreis / Jahr"
              value={calc.isExempt ? '–' : `${fmt(calc.overchargeAnnual)} EUR`}
              highlight
            />
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
            title="Erlaubte vs. aktuelle Miete"
            labels={['Zulässige Höchstmiete', 'Aktuelle Kaltmiete']}
            values={[calc.maxAllowedRent, input.currentRentMonthly]}
            colors={[['#004b34', '#334155', '#94a3b8', '#e2e8f0']]}
            mode="bar"
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
