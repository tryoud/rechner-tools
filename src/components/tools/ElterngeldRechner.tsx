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
import { calculateElterngeld, type ElterngeldInputs } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.elterngeld;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const initialState: ElterngeldInputs = {
  monthlyNetBeforeBirth: 2400,
  monthlyNetAfterBirth: 0,
  mode: 'basis',
  durationMonths: 12,
  siblingBonus: false,
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

export default function ElterngeldRechner() {
  const [input, setInput] = usePersistentState<ElterngeldInputs>(
    'rechner-tools:elterngeld:v1',
    initialState
  );

  const update = <K extends keyof ElterngeldInputs>(key: K, value: ElterngeldInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateElterngeld(input);

  return (
    <ToolShell
      title="Elterngeld-Rechner"
      description="Plane Basiselterngeld und ElterngeldPlus mit Mindestbetrag, Höchstbetrag, Geschwisterbonus und direkter Monatsvorschau."
      category="Familie"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Gib dein Nettoeinkommen ein und wähle Modell und Dauer — der Rechner zeigt sofort
              Monatsbetrag, Gesamtauszahlung und den Effekt des Geschwisterbonus.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Einkommen" first />
              <NumberInput
                label="Netto vor Geburt"
                hint="Durchschnittliches Monatsnetto im relevanten Bemessungszeitraum."
                value={input.monthlyNetBeforeBirth}
                onChange={(value) => update('monthlyNetBeforeBirth', value)}
                min={0}
                max={10000}
                step={50}
                unit="EUR"
              />
              <NumberInput
                label="Netto nach Geburt"
                hint="Teilzeit- oder Restnetto während des Bezugs."
                value={input.monthlyNetAfterBirth}
                onChange={(value) => update('monthlyNetAfterBirth', value)}
                min={0}
                max={10000}
                step={50}
                unit="EUR"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Leistungsart" />
              <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                <span className="text-sm font-medium text-ink">Modell</span>
                <p className="text-xs text-ink-faint mt-0.5 mb-2.5">
                  Basis für höheres Monatsgeld oder Plus für längere Strecke.
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {(['basis', 'plus'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => update('mode', m)}
                      className={`py-2 text-xs font-mono border rounded transition-colors ${
                        input.mode === m
                          ? 'bg-accent text-white border-accent'
                          : 'border-border text-ink-muted hover:border-accent-mid hover:text-ink'
                      }`}
                    >
                      {m === 'basis' ? 'Basiselterngeld' : 'ElterngeldPlus'}
                    </button>
                  ))}
                </div>
              </div>
              <NumberInput
                label="Bezugsdauer"
                hint={`Empfohlener Richtwert für ${input.mode === 'basis' ? 'Basiselterngeld' : 'ElterngeldPlus'}: ${calc.recommendedDuration} Monate.`}
                value={input.durationMonths}
                onChange={(value) => update('durationMonths', value)}
                min={1}
                max={28}
                step={1}
                unit="Mon"
              />
              <ToggleRow
                label="Geschwisterbonus"
                hint="Optionaler Zuschlag von 10 Prozent mit Mindestbetrag."
              >
                <ToggleGroup
                  options={[
                    { label: 'Aus', value: 'off' },
                    { label: 'An', value: 'on' },
                  ]}
                  value={input.siblingBonus ? 'on' : 'off'}
                  onChange={(value) => update('siblingBonus', value === 'on')}
                />
              </ToggleRow>
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label="Geschätztes Monatselterngeld"
            value={fmt(calc.finalMonthly)}
            unit="EUR"
            secondary={`Gesamtauszahlung bei ${input.durationMonths} Monaten: ${fmt(calc.totalPayout)} EUR`}
          >
            <BreakdownRow
              label="Ersatzrate"
              value={`${Math.round(calc.replacementRate * 100)} %`}
            />
            <BreakdownRow label="Wegfallendes Netto" value={`${fmt(calc.incomeLoss)} EUR`} />
            <BreakdownRow label="Basiselterngeld" value={`${fmt(calc.baseAmount)} EUR`} />
            <BreakdownRow label="ElterngeldPlus" value={`${fmt(calc.plusAmount)} EUR`} />
            <BreakdownRow label="Geschwisterbonus" value={`${fmt(calc.siblingBonus)} EUR`} />
            <BreakdownRow
              label="Auszahlungsdauer"
              value={`${fmt(calc.durationMonths)} Monate`}
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
            title="Monatslogik"
            labels={['Einkommensausfall', 'Basisbetrag', 'Bonus']}
            values={[calc.incomeLoss, calc.baseAmount, calc.siblingBonus]}
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
