import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import SliderInput from '../ui/SliderInput';
import ResultCard from '../ui/ResultCard';
import BreakdownRow from '../ui/BreakdownRow';
import SectionLabel from '../ui/SectionLabel';
import CollapsibleSection from '../ui/CollapsibleSection';
import BreakdownChart from '../charts/BreakdownChart';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import PrintSummary from '../ui/PrintSummary';
import { calculateKredit, type KreditrechnerInputs } from '../../lib/calculators';
import { useUrlState } from '../../lib/useUrlState';
import { encodeKredit, decodeKredit, kreditHasUrlState } from '../../lib/kredit-url';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.kredit;

const fmt = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(n);

const fmtInt = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const initialState: KreditrechnerInputs = {
  loanAmount: 20000,
  interestRate: 4.5,
  loanTerm: 5,
  extraPaymentMonthly: 0,
};

export default function Kreditrechner() {
  const [input, setInput] = useUrlState<KreditrechnerInputs>(
    'rechner-tools:kredit:v1',
    initialState,
    encodeKredit,
    decodeKredit,
    kreditHasUrlState
  );

  const update = <K extends keyof KreditrechnerInputs>(key: K, value: KreditrechnerInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateKredit(input);

  const actualYears = Math.ceil(calc.actualMonths / 12);
  const savedMonths = input.loanTerm * 12 - calc.actualMonths;

  return (
    <ToolShell
      title="Kreditrechner"
      description="Berechne monatliche Raten, Zinsen und Tilgungspläne für Kredite."
      category="Finanzen"
    >
      <PrintSummary
        title="Kreditkalkulation"
        items={[
          { label: 'Kreditsumme', value: `${fmtInt(input.loanAmount)} EUR` },
          { label: 'Zinssatz', value: `${fmt(input.interestRate)} %` },
          { label: 'Laufzeit', value: `${input.loanTerm} Jahre` },
          {
            label: 'Sondertilgung',
            value: `${fmtInt(input.extraPaymentMonthly)} EUR / Monat`,
          },
          {
            label: 'Monatliche Rate',
            value: <span className="font-bold">{fmt(calc.monthlyPayment)} EUR</span>,
          },
          { label: 'Gesamtzahlung', value: `${fmt(calc.totalPayment)} EUR` },
          { label: 'Gesamtzinsen', value: `${fmt(calc.totalInterest)} EUR` },
          {
            label: 'Tatsächliche Laufzeit',
            value: `${actualYears} ${actualYears === 1 ? 'Jahr' : 'Jahre'}`,
          },
        ]}
      />
      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Die Annuitätenrate bleibt konstant — doch der Zinsanteil sinkt monatlich, während der
                Tilgungsanteil steigt. Sondertilgungen beschleunigen diesen Effekt deutlich.
              </p>
            </div>
          }
          calculator={
            <div className="space-y-6">
              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="01" label="Kreditdetails" first />
                <NumberInput
                  label="Kreditsumme"
                  hint="Die Höhe des Darlehens, das du aufnehmen möchtest."
                  value={input.loanAmount}
                  onChange={(value) => update('loanAmount', value)}
                  min={1000}
                  max={1000000}
                  step={500}
                  unit="EUR"
                />
                <NumberInput
                  label="Sollzinssatz"
                  hint="Der jährliche Nominalzins aus deinem Kreditangebot."
                  value={input.interestRate}
                  onChange={(value) => update('interestRate', value)}
                  min={0.1}
                  max={20}
                  step={0.1}
                  unit="% p.a."
                />
                <SliderInput
                  label="Laufzeit"
                  hint="Wie lange der Kredit planmäßig läuft."
                  value={input.loanTerm}
                  onChange={(value) => update('loanTerm', value)}
                  min={1}
                  max={30}
                  step={1}
                  formatValue={(v) => `${v} J.`}
                  labels={{ left: '1 Jahr', right: '30 Jahre' }}
                />
              </div>

              <CollapsibleSection number="02" label="Sondertilgung" hint="optional">
                <div className="[&>div:last-child]:border-b-0">
                <NumberInput
                  label="Sondertilgung pro Monat"
                  hint="Zusätzliche Tilgung über die Annuitätenrate hinaus – reduziert Laufzeit und Zinslast."
                  value={input.extraPaymentMonthly}
                  onChange={(value) => update('extraPaymentMonthly', value)}
                  min={0}
                  max={10000}
                  step={50}
                  unit="EUR"
                />
                </div>
              </CollapsibleSection>

              <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
            </div>
          }
          result={
            <div className="space-y-4">
              <ResultCard
                label="Monatliche Rate"
                value={fmt(calc.monthlyPayment)}
                numericValue={calc.monthlyPayment}
                unit="EUR"
                secondary={`Kreditsumme ${fmtInt(input.loanAmount)} EUR · ${fmt(input.interestRate)} % Zinsen`}
              >
                <BreakdownRow label="Gesamtzahlung" value={`${fmt(calc.totalPayment)} EUR`} />
                <BreakdownRow
                  label="Gesamtzinsen"
                  value={`${fmt(calc.totalInterest)} EUR`}
                  highlight
                />
                <BreakdownRow
                  label="Tatsächliche Laufzeit"
                  value={`${actualYears} ${actualYears === 1 ? 'Jahr' : 'Jahre'}`}
                />
                {savedMonths > 0 && (
                  <BreakdownRow
                    label="Laufzeit gespart"
                    value={`${savedMonths} ${savedMonths === 1 ? 'Monat' : 'Monate'}`}
                    highlight
                  />
                )}
              </ResultCard>
            </div>
          }
          sidebar={
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors"
                aria-label="Ergebnis drucken oder als PDF sichern"
              >
                Ergebnis drucken / als PDF sichern
              </button>
              <button
                type="button"
                onClick={async () => {
                  const url = window.location.href;
                  const text = `Meine Kreditkalkulation: ${fmt(calc.monthlyPayment)} EUR/Monat – hier berechnet:`;
                  if (navigator.share) {
                    await navigator.share({ title: 'Kreditrechner', text, url });
                  } else {
                    await navigator.clipboard.writeText(`${text} ${url}`);
                    alert('Link kopiert – öffnet direkt deine Kalkulation!');
                  }
                }}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors"
                aria-label="Kalkulation teilen"
              >
                Kalkulation teilen
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
              title="Tilgung vs. Zinsen pro Jahr"
              labels={calc.yearlyData.map((d) => `Jahr ${d.year}`)}
              values={[
                calc.yearlyData.map((d) => d.principal),
                calc.yearlyData.map((d) => d.interest),
              ]}
              colors={['#004b34', '#94a3b8']}
              seriesLabels={['Tilgung', 'Zinsen']}
              stacked
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
      </div>
    </ToolShell>
  );
}
