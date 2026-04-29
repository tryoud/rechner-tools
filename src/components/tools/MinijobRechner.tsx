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
import { calculateMinijob, type MinijobInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.minijob;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const initialState: MinijobInputs = {
  monthlyEarnings: 538,
  isPensionInsured: false,
  pensionRate: 0,
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

export default function MinijobRechner() {
  const [input, setInput] = usePersistentState<MinijobInputs>(
    'rechner-tools:minijob:v1',
    initialState
  );

  const update = <K extends keyof MinijobInputs>(key: K, value: MinijobInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateMinijob(input);

  return (
    <ToolShell
      title="Minijob-Rechner"
      description="Minijob bis 538 €/Monat berechnen: Arbeitgeberkosten, Arbeitnehmernetto und optionale Rentenversicherung (0%, 5% oder 15%)."
      category="Arbeit"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Minijobs bis 538 €/Monat sind sozialversicherungsfrei (außer optional RV). Hier
              siehst du sofort, was netto für dich übrig bleibt und was der Arbeitgeber zahlt.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Verdienst" first />
              <NumberInput
                label="Monatsverdienst"
                hint="Dein Bruttogehalt aus dem Minijob. Maximal 538 €/Monat für Minijob-Status."
                value={input.monthlyEarnings}
                onChange={(value) => update('monthlyEarnings', value)}
                min={0}
                max={1000}
                step={10}
                unit="EUR"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Rentenversicherung" />
              <ToggleRow
                label="RV-pflichtig?"
                hint="Ohne RV-Pflicht = keine Abzüge. Mit RV-Pflicht kannst du zwischen 5% und 15% wählen."
              >
                <ToggleGroup
                  options={[
                    { label: 'Nein', value: 'false' },
                    { label: 'Ja', value: 'true' },
                  ]}
                  value={input.isPensionInsured ? 'true' : 'false'}
                  onChange={(value) => {
                    const isInsured = value === 'true';
                    update('isPensionInsured', isInsured);
                    update('pensionRate', isInsured ? 0.15 : 0);
                  }}
                />
              </ToggleRow>
              {input.isPensionInsured && (
                <ToggleRow
                  label="RV-Beitragssatz"
                  hint="Wähle 15% für volle Rentenanwartschaft oder 5% für ermäßigten Satz."
                >
                  <ToggleGroup
                  options={[
                    { label: '5%', value: '0.05' },
                    { label: '15%', value: '0.15' },
                  ]}
                  value={input.pensionRate.toString()}
                  onChange={(value) => update('pensionRate', parseFloat(value) as MinijobInputs['pensionRate'])}
                />
                </ToggleRow>
              )}
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label={calc.isMinijob ? 'Minijob' : 'Kein Minijob (über 538 €)'}
            value={fmt(calc.employeeNet)}
            unit="EUR Netto"
            secondary={
              calc.isMinijob
                ? `Arbeitgeber zahlt ${fmt(calc.employerTotalCost)} EUR · RV: ${fmt(calc.pensionRatePercent)}%`
                : `Überschreitet die Minijob-Grenze von ${fmt(calc.earningsLimit)} EUR`
            }
          >
            {calc.isMinijob ? (
              <>
                <BreakdownRow label="Brutto" value={`${fmt(input.monthlyEarnings)} EUR`} />
                <BreakdownRow label="RV-Abzug" value={`${fmt(calc.employeePensionDeduction)} EUR`} />
                <BreakdownRow label="Netto" value={`${fmt(calc.employeeNet)} EUR`} highlight />
                <BreakdownRow label="Arbeitgeberkosten gesamt" value={`${fmt(calc.employerTotalCost)} EUR`} />
                <BreakdownRow label="  - Pauschalsteuer (15%)" value={`${fmt(calc.employerPauschalTax)} EUR`} />
                <BreakdownRow label="  - Sozialabgaben (15%)" value={`${fmt(calc.employerSocial)} EUR`} />
              </>
            ) : (
              <>
                <BreakdownRow label="Brutto" value={`${fmt(input.monthlyEarnings)} EUR`} />
                <BreakdownRow label="Grenze" value={`${fmt(calc.earningsLimit)} EUR`} />
                <BreakdownRow
                  label="Überschreitung"
                  value={`${fmt(input.monthlyEarnings - calc.earningsLimit)} EUR`}
                  highlight
                />
              </>
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
          calc.isMinijob ? (
            <BreakdownChart
              title="Verteilung des Minijob-Verdiensts"
              labels={['Netto', 'RV-Abzug']}
              values={[calc.employeeNet, calc.employeePensionDeduction]}
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
