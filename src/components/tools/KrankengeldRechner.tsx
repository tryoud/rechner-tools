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
import { calculateKrankengeld, type KrankengeldInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.krankengeld;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const initialState: KrankengeldInputs = {
  grossMonthly: 4000,
  netMonthly: 2650,
  healthInsuranceMode: 'statutory',
  privateKrankentagegeldDaily: 80,
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

export default function KrankengeldRechner() {
  const [input, setInput] = usePersistentState<KrankengeldInputs>(
    'rechner-tools:krankengeld:v1',
    initialState
  );

  const update = <K extends keyof KrankengeldInputs>(key: K, value: KrankengeldInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateKrankengeld(input);

  return (
    <ToolShell
      title="Krankengeld-Rechner"
      description="Berechne dein GKV-Krankengeld nach SGB V § 47: 70 % des Brutto, max. 90 % des Netto, Einkommensverlust und Bezugsdauer."
      category="Soziales"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Nach 6 Wochen Lohnfortzahlung übernimmt die Krankenkasse. Hier siehst du sofort, wie
              groß die Lücke ist — und wie lange der Schutz reicht.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Einkommen" first />
              <NumberInput
                label="Monatsbrutto"
                hint="Rentenversicherungspflichtiges Bruttogehalt ohne Sonderzahlungen."
                value={input.grossMonthly}
                onChange={(value) => update('grossMonthly', value)}
                min={500}
                max={15000}
                step={100}
                unit="EUR"
              />
              <NumberInput
                label="Monatsnetto"
                hint="Tatsächlicher Netto-Auszahlungsbetrag laut Gehaltszettel."
                value={input.netMonthly}
                onChange={(value) => update('netMonthly', value)}
                min={400}
                max={12000}
                step={50}
                unit="EUR"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Krankenversicherung" />
              <ToggleRow
                label="Versicherungsart"
                hint="GKV berechnet das gesetzliche Krankengeld, PKV nutzt dein Krankentagegeld."
              >
                <ToggleGroup
                  options={[
                    { label: 'GKV', value: 'statutory' },
                    { label: 'PKV', value: 'private' },
                  ]}
                  value={input.healthInsuranceMode}
                  onChange={(value) =>
                    update('healthInsuranceMode', value as KrankengeldInputs['healthInsuranceMode'])
                  }
                />
              </ToggleRow>
              {input.healthInsuranceMode === 'private' && (
                <NumberInput
                  label="Krankentagegeld / Tag"
                  hint="Vertraglich vereinbartes tägliches Krankentagegeld aus deiner PKV-Police."
                  value={input.privateKrankentagegeldDaily}
                  onChange={(value) => update('privateKrankentagegeldDaily', value)}
                  min={0}
                  max={300}
                  step={5}
                  unit="EUR/Tag"
                />
              )}
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label={
              input.healthInsuranceMode === 'statutory'
                ? 'GKV-Krankengeld / Monat'
                : 'Krankentagegeld / Monat'
            }
            value={fmt(calc.effectiveMonthly)}
            unit="EUR"
            secondary={
              input.healthInsuranceMode === 'statutory'
                ? `Einkommensverlust ${fmt(calc.incomeLossMonthly)} EUR · Bezugsdauer bis zu ${calc.gkvDurationWeeks} Wochen`
                : `Einkommensverlust ${fmt(calc.incomeLossMonthly)} EUR · Vertraglich vereinbart`
            }
          >
            <BreakdownRow label="Monatsbrutto" value={`${fmt(input.grossMonthly)} EUR`} />
            <BreakdownRow label="Monatsnetto" value={`${fmt(input.netMonthly)} EUR`} />
            {input.healthInsuranceMode === 'statutory' ? (
              <>
                <BreakdownRow label="Krankengeld täglich" value={`${fmt(calc.gkvDaily)} EUR`} />
                <BreakdownRow label="Krankengeld monatlich" value={`${fmt(calc.gkvMonthly)} EUR`} />
                <BreakdownRow
                  label="Lohnfortzahlung (AG)"
                  value={`${calc.entgeltfortzahlungWeeks} Wochen`}
                />
                <BreakdownRow
                  label="Max. Auszahlung gesamt"
                  value={`${fmt(calc.maxGkvPayout)} EUR`}
                  highlight
                />
              </>
            ) : (
              <>
                <BreakdownRow
                  label="Krankentagegeld täglich"
                  value={`${fmt(input.privateKrankentagegeldDaily)} EUR`}
                />
                <BreakdownRow
                  label="Krankentagegeld monatlich"
                  value={`${fmt(calc.privateMonthly)} EUR`}
                />
                <BreakdownRow
                  label="Einkommensverlust / Mo"
                  value={`${fmt(calc.incomeLossMonthly)} EUR`}
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
          <BreakdownChart
            title="Einkommensverteilung im Krankheitsfall"
            labels={['Krankengeld / Krankentagegeld', 'Einkommensverlust']}
            values={[calc.effectiveMonthly, calc.incomeLossMonthly]}
            colors={[['#004b34', '#334155']]}
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
