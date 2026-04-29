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
  calculateSonderzahlung,
  type SonderzahlungInputs,
  type TaxClass,
} from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.sonderzahlung;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

const initialState: SonderzahlungInputs = {
  grossMonthly: 3800,
  bonusAmount: 2000,
  taxClass: '1',
  healthInsuranceMode: 'statutory',
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

export default function SonderzahlungRechner() {
  const [input, setInput] = usePersistentState<SonderzahlungInputs>(
    'rechner-tools:sonderzahlung:v1',
    initialState
  );

  const update = <K extends keyof SonderzahlungInputs>(key: K, value: SonderzahlungInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateSonderzahlung(input);

  return (
    <ToolShell
      title="Urlaubsgeld-Rechner"
      description="Berechne den Nettobetrag von Urlaubsgeld und Weihnachtsgeld — nach Lohnsteuer, Solidaritätszuschlag und Sozialversicherungsbeiträgen."
      category="Gehalt"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Urlaubsgeld und Weihnachtsgeld werden nach der Hochrechnungsmethode besteuert. Gib
              Gehalt und Sonderzahlung ein — der Rechner zeigt sofort, was netto ankommt.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Gehalt" first />
              <NumberInput
                label="Monatsbrutto"
                hint="Reguläres steuerpflichtiges Bruttogehalt ohne Sonderzahlungen."
                value={input.grossMonthly}
                onChange={(value) => update('grossMonthly', value)}
                min={500}
                max={30000}
                step={100}
                unit="EUR"
              />
              <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                <span className="text-sm font-medium text-ink">Steuerklasse</span>
                <p className="text-xs text-ink-faint mt-0.5 mb-2.5">
                  Im Jahr der Sonderzahlung maßgebliche Steuerklasse.
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {(['1', '2', '3', '4', '5', '6'] as TaxClass[]).map((tc) => (
                    <button
                      type="button"
                      key={tc}
                      onClick={() => update('taxClass', tc)}
                      className={`px-3 py-1.5 text-xs font-mono border rounded transition-colors ${
                        input.taxClass === tc
                          ? 'bg-accent text-white border-accent'
                          : 'border-border text-ink-muted hover:border-accent-mid hover:text-ink'
                      }`}
                    >
                      {tc}
                    </button>
                  ))}
                </div>
              </div>
              <ToggleRow
                label="Krankenversicherung"
                hint="GKV: Sozialversicherungsbeiträge auf die Sonderzahlung. PKV: keine einkommensabhängigen Beiträge."
              >
                <ToggleGroup
                  options={[
                    { label: 'GKV', value: 'statutory' },
                    { label: 'PKV', value: 'private' },
                  ]}
                  value={input.healthInsuranceMode}
                  onChange={(value) =>
                    update(
                      'healthInsuranceMode',
                      value as SonderzahlungInputs['healthInsuranceMode']
                    )
                  }
                />
              </ToggleRow>
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Sonderzahlung" />
              <NumberInput
                label="Urlaubsgeld / Weihnachtsgeld"
                hint="Bruttobetrag der Sonderzahlung."
                value={input.bonusAmount}
                onChange={(value) => update('bonusAmount', value)}
                min={0}
                max={100000}
                step={100}
                unit="EUR"
              />
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label="Netto-Sonderzahlung"
            value={fmt(calc.netBonus)}
            unit="EUR"
            secondary={`von ${fmt(input.bonusAmount)} EUR brutto · Nettoquote ${fmtDec(calc.effectiveNetRate)} %`}
          >
            <BreakdownRow label="Lohnsteuer" value={`${fmt(calc.incomeTaxOnBonus)} EUR`} />
            <BreakdownRow label="Solidaritätszuschlag" value={`${fmt(calc.soliOnBonus)} EUR`} />
            <BreakdownRow label="Rentenversicherung AN" value={`${fmt(calc.pensionOnBonus)} EUR`} />
            <BreakdownRow
              label="Arbeitslosenvers. AN"
              value={`${fmt(calc.unemploymentOnBonus)} EUR`}
            />
            <BreakdownRow label="Krankenversicherung AN" value={`${fmt(calc.healthOnBonus)} EUR`} />
            <BreakdownRow label="Pflegeversicherung AN" value={`${fmt(calc.careOnBonus)} EUR`} />
            <BreakdownRow
              label="Abzüge gesamt"
              value={`${fmt(calc.totalDeductions)} EUR`}
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
            title="Verteilung der Sonderzahlung"
            labels={['Nettobetrag', 'Lohnsteuer', 'Sozialversicherung']}
            values={[calc.netBonus, calc.incomeTaxOnBonus + calc.soliOnBonus, calc.socialOnBonus]}
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
    </ToolShell>
  );
}
