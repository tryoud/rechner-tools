import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import SliderInput from '../ui/SliderInput';
import ResultCard from '../ui/ResultCard';
import BreakdownRow from '../ui/BreakdownRow';
import SectionLabel from '../ui/SectionLabel';
import BreakdownChart from '../charts/BreakdownChart';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import PrintSummary from '../ui/PrintSummary';
import { calculateSpar, type SparrechnerInputs } from '../../lib/calculators';
import { useUrlState } from '../../lib/useUrlState';
import { encodeSpar, decodeSpar, sparHasUrlState } from '../../lib/spar-url';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.spar;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(n);

const initialState: SparrechnerInputs = {
  initialAmount: 5000,
  monthlyContribution: 200,
  annualInterestRate: 4.0,
  durationYears: 20,
};

// Limit chart labels for long durations — show every Nth year
function buildChartLabels(years: number[]): string[] {
  const total = years.length;
  if (total <= 15) return years.map((y) => `Jahr ${y}`);
  const step = Math.ceil(total / 15);
  return years.map((y) => (y % step === 0 || y === total ? `${y}` : ''));
}

export default function Sparrechner() {
  const [input, setInput] = useUrlState<SparrechnerInputs>(
    'rechner-tools:spar:v1',
    initialState,
    encodeSpar,
    decodeSpar,
    sparHasUrlState
  );

  const update = <K extends keyof SparrechnerInputs>(key: K, value: SparrechnerInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateSpar(input);

  const chartLabels = buildChartLabels(calc.yearlyData.map((d) => d.year));
  const contributedValues = calc.yearlyData.map((d) => d.totalContributed);
  const interestValues = calc.yearlyData.map((d) => d.totalInterest);

  return (
    <ToolShell
      title="Sparrechner"
      description="Berechne Zinsen, Endbeträge und den Zinseszinseffekt für deinen Sparplan."
      category="Finanzen"
    >
      <PrintSummary
        title="Sparkalkulation"
        items={[
          { label: 'Startkapital', value: `${fmt(input.initialAmount)} EUR` },
          { label: 'Monatliche Einzahlung', value: `${fmt(input.monthlyContribution)} EUR` },
          { label: 'Jahreszins', value: `${fmtDec(input.annualInterestRate)} %` },
          { label: 'Anlagedauer', value: `${input.durationYears} Jahre` },
          { label: 'Gesamt eingezahlt', value: `${fmt(calc.totalContributed)} EUR` },
          { label: 'Zinsen gesamt', value: `${fmt(calc.totalInterest)} EUR` },
          {
            label: 'Endguthaben',
            value: <span className="font-bold">{fmt(calc.finalBalance)} EUR</span>,
          },
        ]}
      />
      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Der Zinseszinseffekt ist am Anfang kaum spürbar — und wächst mit der Zeit
                exponentiell. Schon wenige Jahre früher starten kann den Endbetrag verdoppeln.
              </p>
            </div>
          }
          calculator={
            <div className="space-y-6">
              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="01" label="Anlagedetails" first />
                <NumberInput
                  label="Startkapital"
                  hint="Bereits vorhandenes Kapital, das sofort angelegt wird."
                  value={input.initialAmount}
                  onChange={(value) => update('initialAmount', value)}
                  min={0}
                  max={1000000}
                  step={500}
                  unit="EUR"
                />
                <NumberInput
                  label="Monatliche Einzahlung"
                  hint="Regelmäßige Sparrate, die jeden Monat hinzukommt."
                  value={input.monthlyContribution}
                  onChange={(value) => update('monthlyContribution', value)}
                  min={0}
                  max={10000}
                  step={50}
                  unit="EUR/Mo"
                />
                <NumberInput
                  label="Jahreszins"
                  hint="Erwarteter durchschnittlicher Zinssatz oder ETF-Rendite p. a."
                  value={input.annualInterestRate}
                  onChange={(value) => update('annualInterestRate', value)}
                  min={0}
                  max={25}
                  step={0.1}
                  unit="% p.a."
                />
                <SliderInput
                  label="Anlagedauer"
                  hint="Wie lange du regelmäßig sparst."
                  value={input.durationYears}
                  onChange={(value) => update('durationYears', value)}
                  min={1}
                  max={40}
                  step={1}
                  formatValue={(v) => `${v} J.`}
                  labels={{ left: '1 Jahr', right: '40 Jahre' }}
                />
              </div>

              <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
            </div>
          }
          result={
            <div className="space-y-4">
              <ResultCard
                label="Endguthaben"
                value={fmt(calc.finalBalance)}
                numericValue={calc.finalBalance}
                unit="EUR"
                secondary={`${input.durationYears} Jahre · ${fmtDec(input.annualInterestRate)} % p.a.`}
              >
                <BreakdownRow
                  label="Gesamt eingezahlt"
                  value={`${fmt(calc.totalContributed)} EUR`}
                />
                <BreakdownRow
                  label="Zinsen (Zinseszins)"
                  value={`${fmt(calc.totalInterest)} EUR`}
                  highlight
                />
                <BreakdownRow
                  label="Zinsanteil am Endguthaben"
                  value={`${calc.finalBalance > 0 ? Math.round((calc.totalInterest / calc.finalBalance) * 100) : 0} %`}
                />
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
                  const text = `Mein Sparziel: ${fmt(calc.finalBalance)} EUR in ${input.durationYears} Jahren – hier berechnet:`;
                  if (navigator.share) {
                    await navigator.share({ title: 'Sparrechner', text, url });
                  } else {
                    await navigator.clipboard.writeText(`${text} ${url}`);
                    alert('Link kopiert – öffnet direkt deine Kalkulation!');
                  }
                }}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors"
                aria-label="Sparplan teilen"
              >
                Sparplan teilen
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
              title="Vermögensentwicklung nach Jahr"
              labels={chartLabels}
              values={[contributedValues, interestValues]}
              colors={['#334155', '#004b34']}
              seriesLabels={['Eingezahlt', 'Zinsen']}
              mode="bar"
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
