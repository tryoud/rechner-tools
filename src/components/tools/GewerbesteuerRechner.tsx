import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import ResultCard from '../ui/ResultCard';
import BreakdownRow from '../ui/BreakdownRow';
import SectionLabel from '../ui/SectionLabel';
import BreakdownChart from '../charts/BreakdownChart';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import PrintSummary from '../ui/PrintSummary';
import { calculateGewerbesteuer, type GewerbesteuerInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.gewerbesteuer;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

const initialState: GewerbesteuerInputs = {
  profit: 80000,
  legalForm: 'individual',
  hebesatz: 400,
  interestExpenses: 0,
  rentExpenses: 0,
};

export default function GewerbesteuerRechner() {
  const [input, setInput] = usePersistentState<GewerbesteuerInputs>(
    'rechner-tools:gewerbesteuer:v1',
    initialState
  );

  const update = <K extends keyof GewerbesteuerInputs>(key: K, value: GewerbesteuerInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateGewerbesteuer(input);

  return (
    <ToolShell
      title="Gewerbesteuer-Rechner"
      description="Berechne Gewerbesteuer aus Ertrag, Steuermesszahl und Hebesatz — mit Freibetrag, Hinzurechnungen und ESt-Anrechnung für Einzelunternehmer."
      category="Selbstständigkeit"
    >
      <PrintSummary
        title="Gewerbesteuer-Berechnung"
        items={[
          { label: 'Steuerlicher Gewinn', value: `${fmt(input.profit)} EUR` },
          {
            label: 'Rechtsform',
            value: input.legalForm === 'individual' ? 'Einzelunternehmen / PersGes' : 'GmbH / AG',
          },
          { label: 'Hebesatz', value: `${input.hebesatz} %` },
          { label: 'Hinzurechnungen (Netto)', value: `${fmt(calc.hinzurechnungen)} EUR` },
          { label: 'Freibetrag', value: `${fmt(calc.freibetrag)} EUR` },
          { label: 'Steuermessbetrag', value: `${fmt(calc.steuermessbetrag)} EUR` },
          {
            label: 'Gewerbesteuer',
            value: <span className="font-bold">{fmt(calc.gewerbesteuer)} EUR</span>,
          },
          {
            label: 'ESt-Anrechnung (nur Einzelunternehmer)',
            value: `${fmt(calc.estAnrechnung)} EUR`,
          },
          {
            label: 'Effektivbelastung',
            value: <span className="font-bold">{fmt(calc.effectiveBurden)} EUR</span>,
          },
        ]}
      />
      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Gib deinen Gewinn und den Hebesatz deiner Gemeinde ein. Für Einzelunternehmer
                berücksichtigt der Rechner Freibetrag und ESt-Anrechnung automatisch.
              </p>
            </div>
          }
          calculator={
            <div className="space-y-6">
              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="01" label="Betrieb" first />
                <NumberInput
                  label="Gewinn aus Gewerbebetrieb"
                  hint="Steuerlicher Gewinn — nicht der handelsrechtliche Jahresüberschuss."
                  value={input.profit}
                  onChange={(value) => update('profit', value)}
                  min={0}
                  max={10000000}
                  step={1000}
                  unit="EUR"
                />
                <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                  <span className="text-sm font-medium text-ink">Rechtsform</span>
                  <p className="text-xs text-ink-faint mt-0.5 mb-2.5">
                    Freibetrag (24.500 EUR) und ESt-Anrechnung nur für Einzelunternehmer /
                    Personengesellschaften.
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {(['individual', 'gmbh'] as const).map((lf) => (
                      <button
                        type="button"
                        key={lf}
                        onClick={() => update('legalForm', lf)}
                        className={`py-2 text-xs font-mono border rounded transition-colors ${
                          input.legalForm === lf
                            ? 'bg-accent text-white border-accent'
                            : 'border-border text-ink-muted hover:border-accent-mid hover:text-ink'
                        }`}
                      >
                        {lf === 'individual' ? 'Einzelunternehmen / PersGes' : 'GmbH / AG'}
                      </button>
                    ))}
                  </div>
                </div>
                <NumberInput
                  label="Hebesatz"
                  hint="Den Hebesatz deiner Gemeinde findest du beim Finanzamt oder auf der Gemeinde-Website."
                  value={input.hebesatz}
                  onChange={(value) => update('hebesatz', value)}
                  min={200}
                  max={900}
                  step={10}
                  unit="%"
                />
              </div>

              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="02" label="Hinzurechnungen" />
                <NumberInput
                  label="Schuldzinsen (Summe)"
                  hint="25 % werden hinzugerechnet — gemeinsamer Freibetrag 200.000 EUR mit Mieten."
                  value={input.interestExpenses}
                  onChange={(value) => update('interestExpenses', value)}
                  min={0}
                  max={5000000}
                  step={1000}
                  unit="EUR"
                />
                <NumberInput
                  label="Mieten / Pachten (Summe)"
                  hint="20 % werden hinzugerechnet — gemeinsamer Freibetrag 200.000 EUR mit Zinsen."
                  value={input.rentExpenses}
                  onChange={(value) => update('rentExpenses', value)}
                  min={0}
                  max={5000000}
                  step={1000}
                  unit="EUR"
                />
              </div>

              <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
            </div>
          }
          result={
            <ResultCard
              label="Gewerbesteuer"
              value={fmt(calc.gewerbesteuer)}
              unit="EUR"
              secondary={`Effektivbelastung ${fmtDec(calc.effectiveRate)} % · ESt-Anrechnung ${fmt(calc.estAnrechnung)} EUR`}
            >
              <BreakdownRow label="Gewerbeertrag" value={`${fmt(calc.gewerbeertrag)} EUR`} />
              <BreakdownRow label="Hinzurechnungen" value={`${fmt(calc.hinzurechnungen)} EUR`} />
              <BreakdownRow label="Freibetrag" value={`${fmt(calc.freibetrag)} EUR`} />
              <BreakdownRow
                label="Steuerpflichtiger Ertrag"
                value={`${fmt(calc.steuerpflichtigerErtrag)} EUR`}
              />
              <BreakdownRow
                label="Steuermessbetrag (3,5 %)"
                value={`${fmt(calc.steuermessbetrag)} EUR`}
              />
              <BreakdownRow label="Hebesatz" value={`${input.hebesatz} %`} />
              <BreakdownRow
                label="Gewerbesteuer"
                value={`${fmt(calc.gewerbesteuer)} EUR`}
                highlight
              />
              {input.legalForm === 'individual' && (
                <BreakdownRow
                  label="Effektivbelastung nach Anrechnung"
                  value={`${fmt(calc.effectiveBurden)} EUR`}
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
            <BreakdownChart
              title="Gewerbesteuer-Zusammensetzung"
              labels={['Verbleibender Gewinn', 'Gewerbesteuer', 'ESt-Anrechnung']}
              values={[
                Math.max(input.profit - calc.effectiveBurden, 0),
                calc.effectiveBurden,
                calc.estAnrechnung,
              ]}
              colors={[['#004b34', '#334155', '#94a3b8', '#e2e8f0']]}
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
