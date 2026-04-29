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
import { calculateAbfindung, type AbfindungInputs, type TaxClass } from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.abfindung;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const fmtDec = (n: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

const initialState: AbfindungInputs = {
  grossMonthly: 4500,
  yearsOfService: 8,
  severanceAmount: 18000,
  taxClass: '1',
};

export default function AbfindungRechner() {
  const [input, setInput] = usePersistentState<AbfindungInputs>(
    'rechner-tools:abfindung:v1',
    initialState
  );

  const update = <K extends keyof AbfindungInputs>(key: K, value: AbfindungInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateAbfindung(input);

  return (
    <ToolShell
      title="Abfindungs-Rechner"
      description="Berechne die Steuer auf deine Abfindung nach der Fünftelregel (§ 34 EStG) und sieh, wie viel du gegenüber normaler Besteuerung sparst."
      category="Arbeit"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-6 text-ink">
              Die Fünftelregel glättet die Progression und spart Steuern. Trag Gehalt und
              Abfindungsbetrag ein — der Rechner zeigt Nettobetrag und Ersparnis sofort.
            </p>
          </div>
        }
        calculator={
          <div className="space-y-6">
            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="01" label="Gehalt und Dienstzeit" first />
              <NumberInput
                label="Monatsbrutto"
                hint="Aktuelles rentenversicherungspflichtiges Bruttogehalt."
                value={input.grossMonthly}
                onChange={(value) => update('grossMonthly', value)}
                min={500}
                max={30000}
                step={100}
                unit="EUR"
              />
              <NumberInput
                label="Dienstjahre"
                hint={`Faustformel: 0,5 × Monatsbrutto × Dienstjahre = ${fmt(calc.formulaAmount)} EUR.`}
                value={input.yearsOfService}
                onChange={(value) => update('yearsOfService', value)}
                min={1}
                max={50}
                step={1}
                unit="Jahre"
              />
            </div>

            <div className="[&>div:last-child]:border-b-0">
              <SectionLabel number="02" label="Abfindung und Steuer" />
              <NumberInput
                label="Abfindungsbetrag"
                hint="Tatsächlich vereinbarter Betrag. Faustformel als Richtwert im Hinweis oben."
                value={input.severanceAmount}
                onChange={(value) => update('severanceAmount', value)}
                min={0}
                max={2000000}
                step={500}
                unit="EUR"
              />
              <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                <span className="text-sm font-medium text-ink">Steuerklasse</span>
                <p className="text-xs text-ink-faint mt-0.5 mb-2.5">
                  Steuerklasse im Jahr der Abfindungsauszahlung.
                </p>
                <div className="grid grid-cols-3 gap-1 shrink-0">
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
            </div>

            <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
          </div>
        }
        result={
          <ResultCard
            label="Netto-Abfindung (Fünftelregel)"
            value={fmt(calc.netFuenftel)}
            unit="EUR"
            secondary={`Effektivrate ${fmtDec(calc.effectiveRateFuenftel)} % · Ersparnis ${fmt(calc.saving)} EUR`}
          >
            <BreakdownRow label="Abfindungsbetrag" value={`${fmt(input.severanceAmount)} EUR`} />
            <BreakdownRow
              label="Steuer (Fünftelregel)"
              value={`${fmt(calc.taxFuenftelregel)} EUR`}
            />
            <BreakdownRow label="Soli (Fünftelregel)" value={`${fmt(calc.soliOnFuenftel)} EUR`} />
            <BreakdownRow
              label="Steuer gesamt Fünftelregel"
              value={`${fmt(calc.totalTaxFuenftel)} EUR`}
            />
            <BreakdownRow
              label="Steuer ohne Fünftelregel"
              value={`${fmt(calc.totalTaxNormal)} EUR`}
            />
            <BreakdownRow
              label="Ersparnis durch Fünftelregel"
              value={`${fmt(calc.saving)} EUR`}
              highlight
            />
            <BreakdownRow
              label="Netto ohne Fünftelregel"
              value={`${fmt(calc.netNormal)} EUR`}
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
            title="Netto-Abfindung: Fünftelregel vs. normal"
            labels={[
              'Netto (Fünftelregel)',
              'Steuer (Fünftelregel)',
              'Netto (normal)',
              'Steuer (normal)',
            ]}
            values={[calc.netFuenftel, calc.totalTaxFuenftel, calc.netNormal, calc.totalTaxNormal]}
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
