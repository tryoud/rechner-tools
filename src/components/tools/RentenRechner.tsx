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
import { calculateRente, type RentenInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.rente;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const initialState: RentenInputs = {
  currentAge: 38,
  retirementAge: 67,
  currentGrossMonthly: 4200,
  earnedPointsSoFar: 12.5,
  annualIncomeGrowthPercent: 2,
};

export default function RentenRechner() {
  const [input, setInput] = usePersistentState<RentenInputs>(
    'rechner-tools:rente:v1',
    initialState
  );

  const update = <K extends keyof RentenInputs>(key: K, value: RentenInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateRente(input);

  return (
    <ToolShell
      title="Renten-Rechner"
      description="Schätze deine gesetzliche Rente aus Entgeltpunkten, Einkommen und Renteneintrittsalter — mit Ab- und Zuschlägen."
      category="Altersvorsorge"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Den Stand deiner Entgeltpunkte findest du auf der jährlichen Renteninformation der
              DRV. Trag ihn ein — der Rest ist Mathematik.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Deine Situation" first />
              <NumberInput
                label="Aktuelles Alter"
                hint="Dein heutiges Lebensalter in Jahren."
                value={input.currentAge}
                onChange={(value) => update('currentAge', value)}
                min={18}
                max={66}
                step={1}
                unit="Jahre"
              />
              <NumberInput
                label="Geplanter Renteneintritt"
                hint="Standard: 67 Jahre. Früher = Abschlag, später = Zuschlag."
                value={input.retirementAge}
                onChange={(value) => update('retirementAge', value)}
                min={63}
                max={72}
                step={1}
                unit="Jahre"
              />
              <NumberInput
                label="Monatsbrutto heute"
                hint="Aktuelles rentenversicherungspflichtiges Bruttoeinkommen."
                value={input.currentGrossMonthly}
                onChange={(value) => update('currentGrossMonthly', value)}
                min={500}
                max={8450}
                step={100}
                unit="EUR"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Bisherige Rentenansprüche" />
              <NumberInput
                label="Entgeltpunkte bisher"
                hint="Aus deiner DRV-Renteninformation — Spalte 'Bereits erreichte Entgeltpunkte'."
                value={input.earnedPointsSoFar}
                onChange={(value) => update('earnedPointsSoFar', value)}
                min={0}
                max={60}
                step={0.1}
                unit="EP"
              />
            </div>

            <CollapsibleSection number="03" label="Annahmen" hint="optional">
              <div className="[&>div:last-child]:border-b-0">
              <SliderInput
                label="Jährliches Einkommenswachstum"
                hint="Erwartete Gehaltserhöhung pro Jahr bis zur Rente."
                value={input.annualIncomeGrowthPercent}
                onChange={(value) => update('annualIncomeGrowthPercent', value)}
                min={0}
                max={6}
                step={0.5}
                formatValue={(v) => `${v} %`}
                labels={{ left: '0 % (konstant)', right: '6 %' }}
              />
              </div>
            </CollapsibleSection>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label="Geschätzte Monatsrente"
            value={fmt(calc.monthlyPension)}
            unit="EUR"
            secondary={`Jahresrente ${fmt(calc.annualPension)} EUR · Rentenwert ${fmtDec(calc.rentenwert)} EUR`}
          >
            <BreakdownRow
              label="Jahre bis zur Rente"
              value={`${calc.yearsUntilRetirement} Jahre`}
            />
            <BreakdownRow label="Entgeltpunkte bisher" value={fmtDec(input.earnedPointsSoFar)} />
            <BreakdownRow label="Zukünftige Entgeltpunkte" value={fmtDec(calc.futurePoints)} />
            <BreakdownRow label="Entgeltpunkte gesamt" value={fmtDec(calc.totalPoints)} />
            <BreakdownRow label="Zugangsfaktor" value={fmtDec(calc.zugangsfaktor)} />
            <BreakdownRow
              label="RV-Beitrag AN / Mo"
              value={`${fmt(calc.pensionContributionMonthly)} EUR`}
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
            title="Entgeltpunkte: bisher vs. künftig"
            labels={['Bisherige Punkte', 'Zukünftige Punkte']}
            values={[
              input.earnedPointsSoFar * calc.rentenwert,
              calc.futurePoints * calc.rentenwert,
            ]}
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
