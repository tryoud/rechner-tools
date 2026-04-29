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
import { calculateNebenkosten, type NebenkostenInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.nebenkosten;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const initialState: NebenkostenInputs = {
  annualHeatingCost: 16000,
  consumptionSharePercent: 65,
  apartmentSizeSqm: 70,
  buildingSizeSqm: 700,
  ownConsumptionUnits: 820,
  totalConsumptionUnits: 9500,
  heatingSystem: 'gas',
};

export default function NebenkostenRechner() {
  const [input, setInput] = usePersistentState<NebenkostenInputs>(
    'rechner-tools:nebenkosten:v1',
    initialState
  );

  const update = <K extends keyof NebenkostenInputs>(key: K, value: NebenkostenInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateNebenkosten(input);

  return (
    <ToolShell
      title="Nebenkosten-Rechner"
      description="Verteile Heizkosten nach Verbrauch und Wohnfläche, prüfe Benchmarks und teste schnell, wie sich andere Annahmen auswirken."
      category="Wohnen"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Gib deinen Verbrauch und deine Wohnfläche ein — der Rechner zeigt sofort, wie sich
              dein Heizkostenanteil nach HeizkostenV zusammensetzt.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Gesamtkosten" first />
              <NumberInput
                label="Heizkosten gesamt / Jahr"
                hint="Nur der zu verteilende Heizkostenblock des Gebäudes."
                value={input.annualHeatingCost}
                onChange={(value) => update('annualHeatingCost', value)}
                min={0}
                max={1000000}
                step={100}
                unit="EUR"
              />
              <SliderInput
                label="Verbrauchsanteil"
                hint="HeizkostenV-konform zwischen 50 und 70 Prozent."
                value={input.consumptionSharePercent}
                onChange={(value) => update('consumptionSharePercent', value)}
                min={50}
                max={70}
                step={1}
                formatValue={(v) => `${v}%`}
                labels={{ left: '50% Minimum', right: '70% Maximum' }}
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Dein Anteil" />
              <NumberInput
                label="Wohnfläche Wohnung"
                hint="Deine Wohnfläche für den flächenscharfen Kostenanteil."
                value={input.apartmentSizeSqm}
                onChange={(value) => update('apartmentSizeSqm', value)}
                min={1}
                max={500}
                step={1}
                unit="qm"
              />
              <NumberInput
                label="Wohnfläche Gebäude"
                hint="Gesamtfläche aller abrechnungsrelevanten Einheiten."
                value={input.buildingSizeSqm}
                onChange={(value) => update('buildingSizeSqm', value)}
                min={1}
                max={10000}
                step={1}
                unit="qm"
              />
              <NumberInput
                label="Eigene Verbrauchseinheiten"
                hint="Abgelesener eigener Verbrauch in der Abrechnungsperiode."
                value={input.ownConsumptionUnits}
                onChange={(value) => update('ownConsumptionUnits', value)}
                min={0}
                max={100000}
                step={1}
                unit="VE"
              />
              <NumberInput
                label="Gesamtverbrauchseinheiten"
                hint="Summe aller Einheiten im Gebäude."
                value={input.totalConsumptionUnits}
                onChange={(value) => update('totalConsumptionUnits', value)}
                min={1}
                max={1000000}
                step={1}
                unit="VE"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="03" label="Heizsystem" />
              <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                <span className="text-sm font-medium text-ink">Szenario</span>
                <p className="text-xs text-ink-faint mt-0.5 mb-2.5">
                  Gas, Fernwärme oder Wärmepumpe für den What-if-Vergleich.
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {(['gas', 'district', 'heat-pump'] as const).map((sys) => (
                    <button
                      type="button"
                      key={sys}
                      onClick={() => update('heatingSystem', sys)}
                      className={`py-2 text-xs font-mono border rounded transition-colors ${
                        input.heatingSystem === sys
                          ? 'bg-accent text-white border-accent'
                          : 'border-border text-ink-muted hover:border-accent-mid hover:text-ink'
                      }`}
                    >
                      {sys === 'gas' ? 'Gas' : sys === 'district' ? 'Fernwärme' : 'Wärmepumpe'}
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
            label="Geschätzter Heizkostenanteil"
            value={fmt(calc.currentEstimate)}
            unit="EUR"
            secondary={`Benchmark für ${fmt(input.apartmentSizeSqm)} qm: 2021 ${fmt(calc.benchmark2021)} EUR · 2024 ${fmt(calc.benchmark2024)} EUR`}
          >
            <BreakdownRow label="Verbrauchsanteil" value={`${fmt(calc.consumptionShare)} %`} />
            <BreakdownRow label="Flächenquote" value={`${fmt(calc.areaShare)} %`} />
            <BreakdownRow label="Verbrauchsquote" value={`${fmt(calc.usageShare)} %`} />
            <BreakdownRow label="Flächenkosten" value={`${fmt(calc.basePart)} EUR`} />
            <BreakdownRow label="Verbrauchskosten" value={`${fmt(calc.usagePart)} EUR`} />
            <BreakdownRow
              label="Wärmepumpen-Szenario"
              value={`${fmt(calc.heatPumpEstimate)} EUR`}
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
            title="Dein Heizkostenmix"
            labels={['Flächenanteil', 'Verbrauchsanteil', 'Benchmark 2024']}
            values={[calc.basePart, calc.usagePart, calc.benchmark2024]}
            colors={['#004b34', '#334155', '#94a3b8', '#e2e8f0']}
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
