import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import SliderInput from '../ui/SliderInput';
import ToggleGroup from '../ui/ToggleGroup';
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
import { calculateStundensatz, type StundensatzInputs } from '../../lib/calculators';
import { useUrlState } from '../../lib/useUrlState';
import {
  encodeStundensatz,
  decodeStundensatz,
  stundensatzHasUrlState,
} from '../../lib/stundensatz-url';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.stundensatz;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const initialState: StundensatzInputs = {
  desiredNetMonthly: 4200,
  taxRatePercent: 30,
  vatMode: 'standard',
  healthInsuranceMode: 'statutory',
  privateHealthMonthly: 650,
  fixedCostsMonthly: 650,
  pensionReserveMonthly: 400,
  profitMarginPercent: 18,
  utilizationPercent: 68,
  billableHoursPerDay: 6,
  vacationDays: 25,
  sickDays: 8,
  adminDaysPerMonth: 3,
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

export default function StundensatzRechner() {
  const [input, setInput] = useUrlState<StundensatzInputs>(
    'rechner-tools:stundensatz:v2',
    initialState,
    encodeStundensatz,
    decodeStundensatz,
    stundensatzHasUrlState
  );

  const update = <K extends keyof StundensatzInputs>(key: K, value: StundensatzInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateStundensatz(input);

  return (
    <ToolShell
      title="Stundensatz-Rechner"
      description="Leite deinen Mindeststundensatz aus Zielnetto, Fixkosten, Auslastung und Risiko ab."
      category="Selbstständigkeit"
    >
      <PrintSummary
        title="Stundensatz-Kalkulation"
        items={[
          { label: 'Ziel-Netto (monatlich)', value: `${fmt(input.desiredNetMonthly)} EUR` },
          { label: 'Fixkosten (monatlich)', value: `${fmt(input.fixedCostsMonthly)} EUR` },
          {
            label: 'Rücklagen & PKV',
            value: `${fmt((input.healthInsuranceMode === 'private' ? input.privateHealthMonthly : 0) + input.pensionReserveMonthly)} EUR / Monat`,
          },
          { label: 'Gewinnmarge', value: `${input.profitMarginPercent} %` },
          {
            label: 'Urlaub & Krankheit',
            value: `${input.vacationDays + input.sickDays} Tage / Jahr`,
          },
          { label: 'Abrechenbare Stunden pro Tag', value: `${input.billableHoursPerDay} h` },
          { label: 'Abrechenbare Stunden pro Jahr', value: `${fmt(calc.billableHours)} h` },
          {
            label: 'Zielumsatz inkl. Marge',
            value: `${fmt(calc.revenueTarget)} EUR`,
          },
          {
            label: 'Berechneter Stundensatz',
            value: <span className="font-bold">{fmt(calc.netRate)} EUR</span>,
          },
        ]}
      />
      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Ein tragfaehiger Satz entsteht nicht aus Wunschgehalt geteilt durch Stunden, sondern
                aus verfuegbarer Zeit, Kosten und Reserve.
              </p>
            </div>
          }
          calculator={
            <div className="space-y-6">
              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="01" label="Ziel und Preislogik" first />
                <NumberInput
                  label="Gewuenschtes Netto"
                  hint="Monatlicher Betrag, den du dir real auszahlen willst."
                  value={input.desiredNetMonthly}
                  onChange={(value) => update('desiredNetMonthly', value)}
                  min={500}
                  max={30000}
                  step={100}
                  unit="EUR/Mo"
                />
                <NumberInput
                  label="Steuerquote"
                  hint="Pauschale Zielquote fuer Einkommensteuer und Soli."
                  value={input.taxRatePercent}
                  onChange={(value) => update('taxRatePercent', value)}
                  min={0}
                  max={55}
                  step={1}
                  unit="%"
                />
                <NumberInput
                  label="Gewinnmarge"
                  hint="Reserve fuer Wachstum, Leerlauf und unternehmerisches Risiko."
                  value={input.profitMarginPercent}
                  onChange={(value) => update('profitMarginPercent', value)}
                  min={0}
                  max={50}
                  step={1}
                  unit="%"
                />
                <ToggleRow label="Umsatzsteuer" hint="Standard oder Kleinunternehmer-Modus.">
                  <ToggleGroup
                    options={[
                      { label: '19% USt', value: 'standard' },
                      { label: 'Kleinunt.', value: 'small-business' },
                    ]}
                    value={input.vatMode}
                    onChange={(value) => update('vatMode', value as StundensatzInputs['vatMode'])}
                  />
                </ToggleRow>
              </div>

              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="02" label="Fixkosten und Versicherung" />
                <ToggleRow
                  label="Krankenversicherung"
                  hint="Gesetzliche Naeherung oder eigener PKV-Beitrag."
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
                        value as StundensatzInputs['healthInsuranceMode']
                      )
                    }
                  />
                </ToggleRow>
                {input.healthInsuranceMode === 'private' && (
                  <NumberInput
                    label="PKV pro Monat"
                    hint="Eigener Monatsbetrag inklusive Pflegepflicht."
                    value={input.privateHealthMonthly}
                    onChange={(value) => update('privateHealthMonthly', value)}
                    min={100}
                    max={2500}
                    step={10}
                    unit="EUR/Mo"
                  />
                )}
                <NumberInput
                  label="Fixkosten pro Monat"
                  hint="Software, Buero, Weiterbildung, Buchhaltung und Lizenzen."
                  value={input.fixedCostsMonthly}
                  onChange={(value) => update('fixedCostsMonthly', value)}
                  min={0}
                  max={15000}
                  step={50}
                  unit="EUR/Mo"
                />
                <NumberInput
                  label="Altersvorsorge / Ruecklage"
                  hint="Monatlicher Puffer, den du bewusst mitfinanzieren willst."
                  value={input.pensionReserveMonthly}
                  onChange={(value) => update('pensionReserveMonthly', value)}
                  min={0}
                  max={5000}
                  step={50}
                  unit="EUR/Mo"
                />
              </div>

              <CollapsibleSection number="03" label="Arbeitsrealität" hint="optional">
                <div className="[&>div:last-child]:border-b-0">
                <SliderInput
                  label="Auslastung"
                  hint="Wie viel deiner verfuegbaren Zeit wirklich abrechenbar ist."
                  value={input.utilizationPercent}
                  onChange={(value) => update('utilizationPercent', value)}
                  min={20}
                  max={100}
                  step={1}
                  formatValue={(v) => `${v}%`}
                  labels={{ left: '20% vorsichtig', right: '100% voll' }}
                />
                <NumberInput
                  label="Abrechenbare Stunden / Tag"
                  hint="Konservativ: Calls und Admin zaehlen nicht voll mit."
                  value={input.billableHoursPerDay}
                  onChange={(value) => update('billableHoursPerDay', value)}
                  min={1}
                  max={10}
                  step={0.5}
                  unit="Std"
                />
                <NumberInput
                  label="Urlaubstage"
                  hint="Nicht verfuegbare Arbeitstage pro Jahr."
                  value={input.vacationDays}
                  onChange={(value) => update('vacationDays', value)}
                  min={0}
                  max={60}
                  step={1}
                  unit="Tage"
                />
                <NumberInput
                  label="Krankheitstage"
                  hint="Sicherheitsreserve fuer realistische Ausfallzeiten."
                  value={input.sickDays}
                  onChange={(value) => update('sickDays', value)}
                  min={0}
                  max={40}
                  step={1}
                  unit="Tage"
                />
                <NumberInput
                  label="Admin-Tage pro Monat"
                  hint="Akquise, Angebote, Buchhaltung, Orga."
                  value={input.adminDaysPerMonth}
                  onChange={(value) => update('adminDaysPerMonth', value)}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="Tage"
                />
                </div>
              </CollapsibleSection>

              <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
            </div>
          }
          result={
            <ResultCard
              label="Mindeststundensatz"
              value={fmt(calc.netRate)}
              numericValue={calc.netRate}
              unit="EUR/h"
              secondary={`Tagessatz ${fmt(calc.dayRate)} EUR · Inkl. USt ${fmt(calc.grossRate)} EUR/h`}
            >
              <BreakdownRow label="Nettoziel pro Jahr" value={`${fmt(calc.netAnnual)} EUR`} />
              <BreakdownRow
                label="Bruttobedarf vor Steuern"
                value={`${fmt(calc.grossNeedBeforeTax)} EUR`}
              />
              <BreakdownRow label="Krankenversicherung" value={`${fmt(calc.healthAnnual)} EUR`} />
              <BreakdownRow label="Fixkosten pro Jahr" value={`${fmt(calc.fixedAnnual)} EUR`} />
              <BreakdownRow
                label="Altersvorsorge / Rücklage"
                value={`${fmt(calc.pensionAnnual)} EUR`}
              />
              <BreakdownRow label="Fakturierbare Tage" value={`${fmt(calc.billableDays)} Tage`} />
              <BreakdownRow
                label="Fakturierbare Stunden"
                value={`${fmt(calc.billableHours)} h`}
                highlight
              />
              <BreakdownRow
                label="Zielumsatz inkl. Marge"
                value={`${fmt(calc.revenueTarget)} EUR`}
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
                aria-label="Ergebnis drucken oder als PDF sichern"
              >
                Ergebnis drucken / als PDF sichern
              </button>
              <button
                type="button"
                onClick={async () => {
                  const url = window.location.href;
                  const text = `Mein Mindeststundensatz: ${fmt(calc.netRate)} EUR/h – hier berechnet:`;
                  if (navigator.share) {
                    await navigator.share({ title: 'Stundensatz-Rechner', text, url });
                  } else {
                    await navigator.clipboard.writeText(`${text} ${url}`);
                    alert('Link kopiert – öffnet direkt deine Kalkulation!');
                  }
                }}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors"
                aria-label="Mit Kollegen teilen"
              >
                Mit Kollegen teilen
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
              title="Was deinen Zielumsatz treibt"
              labels={['Nettoziel', 'Krankenvers.', 'Fixkosten', 'Rücklage']}
              values={[calc.netAnnual, calc.healthAnnual, calc.fixedAnnual, calc.pensionAnnual]}
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
