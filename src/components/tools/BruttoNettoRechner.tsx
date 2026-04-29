import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import NumberInput from '../ui/NumberInput';
import ToggleGroup from '../ui/ToggleGroup';
import ResultCard from '../ui/ResultCard';
import BreakdownRow from '../ui/BreakdownRow';
import SectionLabel from '../ui/SectionLabel';
import CollapsibleSection from '../ui/CollapsibleSection';
import FormRow from '../ui/FormRow';
import BreakdownChart from '../charts/BreakdownChart';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import PrintSummary from '../ui/PrintSummary';
import {
  calculateBruttoNetto,
  type BruttoNettoInputs,
  type FederalState,
  type TaxClass,
} from '../../lib/calculators';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT['brutto-netto'];

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);

const stateLabels: Record<FederalState, string> = {
  bw: 'Baden-Württemberg',
  by: 'Bayern',
  be: 'Berlin',
  bb: 'Brandenburg',
  hb: 'Bremen',
  hh: 'Hamburg',
  he: 'Hessen',
  mv: 'Mecklenburg-Vorpommern',
  ni: 'Niedersachsen',
  nw: 'Nordrhein-Westfalen',
  rp: 'Rheinland-Pfalz',
  sl: 'Saarland',
  sn: 'Sachsen',
  st: 'Sachsen-Anhalt',
  sh: 'Schleswig-Holstein',
  th: 'Thüringen',
};

const initialState: BruttoNettoInputs = {
  grossMonthly: 4500,
  taxClass: '1',
  state: 'nw',
  churchTax: false,
  childrenUnder25: 0,
  healthInsuranceMode: 'statutory',
  additionalHealthRatePercent: 2.9,
  privateHealthMonthly: 520,
  companyCarMode: 'none',
  companyCarListPrice: 55000,
};

export default function BruttoNettoRechner() {
  const [input, setInput] = usePersistentState<BruttoNettoInputs>(
    'rechner-tools:brutto-netto:v1',
    initialState
  );

  const update = <K extends keyof BruttoNettoInputs>(key: K, value: BruttoNettoInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateBruttoNetto(input);

  return (
    <ToolShell
      title="Brutto-Netto-Rechner"
      description="Schätze dein Monatsnetto 2026 aus Brutto, Steuerklasse, Sozialabgaben, Kirchensteuer und Firmenwagen."
      category="Gehalt"
    >
      <PrintSummary
        title="Brutto-Netto-Berechnung"
        items={[
          { label: 'Bruttogehalt (monatlich)', value: `${fmt(input.grossMonthly)} EUR` },
          { label: 'Steuerklasse', value: input.taxClass },
          { label: 'Bundesland', value: stateLabels[input.state] },
          { label: 'Kirchensteuer', value: input.churchTax ? 'Ja' : 'Nein' },
          {
            label: 'Krankenversicherung',
            value: input.healthInsuranceMode === 'statutory' ? 'Gesetzlich' : 'Privat',
          },
          { label: 'Lohnsteuer (jährlich)', value: `${fmt(calc.incomeTaxAnnual)} EUR` },
          { label: 'Sozialabgaben (monatlich)', value: `${fmt(calc.employeeSocialMonthly)} EUR` },
          { label: 'Netto (jährlich)', value: `${fmt(calc.netAnnual)} EUR` },
          {
            label: 'Geschätztes Monatsnetto',
            value: <span className="font-bold">{fmt(calc.netMonthly)} EUR</span>,
          },
        ]}
      />
      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Du gibst nur die relevanten Merkmale ein und bekommst sofort eine belastbare
                Netto-Schaetzung, statt dich durch lange Erklaertexte zu arbeiten.
              </p>
            </div>
          }
          calculator={
            <div className="space-y-6">
              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="01" label="Brutto und Lohnsteuer" first />
                <NumberInput
                  label="Monatsbrutto"
                  hint="Reguläres steuerpflichtiges Gehalt ohne Sonderzahlungen."
                  value={input.grossMonthly}
                  onChange={(value) => update('grossMonthly', value)}
                  min={500}
                  max={30000}
                  step={100}
                  unit="EUR"
                />
                <FormRow
                  label="Steuerklasse"
                  hint="Vereinfachte 2026-Schätzung für Klassen I-VI."
                  align="start"
                >
                  <div className="grid w-full grid-cols-3 gap-1.5 min-[520px]:w-auto">
                    {(['1', '2', '3', '4', '5', '6'] as TaxClass[]).map((taxClass) => (
                      <button
                        type="button"
                        key={taxClass}
                        onClick={() => update('taxClass', taxClass)}
                        className={`min-h-9 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 ${
                          input.taxClass === taxClass
                            ? 'border-accent bg-accent text-white shadow-sm'
                            : 'border-border bg-white text-ink-muted hover:border-accent-mid hover:text-ink'
                        }`}
                      >
                        {taxClass}
                      </button>
                    ))}
                  </div>
                </FormRow>
                <FormRow
                  label={<label htmlFor="state-select">Bundesland</label>}
                  hint="Relevant für Kirchensteuer und Pflegeversicherung."
                  align="start"
                >
                  <select
                    id="state-select"
                    value={input.state}
                    onChange={(e) => update('state', e.target.value as FederalState)}
                    className="min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 font-mono text-sm text-ink transition-colors hover:border-accent-mid focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 min-[520px]:w-56"
                  >
                    {Object.entries(stateLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </FormRow>
                <FormRow label="Kirchensteuer" hint="8% in BY/BW, sonst 9%.">
                  <ToggleGroup
                    options={[
                      { label: 'Nein', value: 'off' },
                      { label: 'Ja', value: 'on' },
                    ]}
                    value={input.churchTax ? 'on' : 'off'}
                    onChange={(value) => update('churchTax', value === 'on')}
                  />
                </FormRow>
              </div>

              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="02" label="Sozialversicherung" />
                <NumberInput
                  label="Kinder unter 25"
                  hint="Beeinflusst den Arbeitnehmeranteil in der Pflegeversicherung."
                  value={input.childrenUnder25}
                  onChange={(value) => update('childrenUnder25', value)}
                  min={0}
                  max={5}
                  step={1}
                  unit="Anz"
                />
                <FormRow
                  label="Krankenversicherung"
                  hint="Gesetzliche Näherung oder eigene PKV-Schätzung."
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
                        value as BruttoNettoInputs['healthInsuranceMode']
                      )
                    }
                  />
                </FormRow>
                {input.healthInsuranceMode === 'statutory' ? (
                  <NumberInput
                    label="Zusatzbeitrag"
                    hint="Durchschnittlicher Zusatzbeitrag 2026, halbiert im AN-Anteil."
                    value={input.additionalHealthRatePercent}
                    onChange={(value) => update('additionalHealthRatePercent', value)}
                    min={0}
                    max={5}
                    step={0.1}
                    unit="%"
                  />
                ) : (
                  <NumberInput
                    label="PKV pro Monat"
                    hint="Eigener PKV- und Pflegepflichtbeitrag."
                    value={input.privateHealthMonthly}
                    onChange={(value) => update('privateHealthMonthly', value)}
                    min={100}
                    max={3000}
                    step={10}
                    unit="EUR"
                  />
                )}
              </div>

              <CollapsibleSection number="03" label="Firmenwagen" hint="optional">
                <div className="[&>div:last-child]:border-b-0">
                <FormRow
                  label="Geldwerter Vorteil"
                  hint="1-%-Regel (Verbrenner) oder 0,25-% (E-Auto)."
                  align="start"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {(['none', 'regular', 'electric'] as const).map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => update('companyCarMode', mode)}
                        className={`min-h-10 rounded-md border px-3 py-2 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 ${
                          input.companyCarMode === mode
                            ? 'border-accent bg-accent text-white shadow-sm'
                            : 'border-border bg-white text-ink-muted hover:border-accent-mid hover:text-ink'
                        }`}
                      >
                        {mode === 'none' ? 'Keiner' : mode === 'regular' ? '1 %' : '0,25 %'}
                      </button>
                    ))}
                  </div>
                </FormRow>
                {input.companyCarMode !== 'none' && (
                  <NumberInput
                    label="Bruttolistenpreis"
                    hint="Für 0,25%: Grenze bei 100.000 EUR."
                    value={input.companyCarListPrice}
                    onChange={(value) => update('companyCarListPrice', value)}
                    min={5000}
                    max={150000}
                    step={1000}
                    unit="EUR"
                  />
                )}
                </div>
              </CollapsibleSection>

              <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
            </div>
          }
          result={
            <ResultCard
              label="Geschätztes Monatsnetto"
              value={fmt(calc.netMonthly)}
              unit="EUR"
              secondary={`Jahresnetto ${fmt(calc.netAnnual)} EUR · Brutto steuerpflichtig ${fmt(calc.taxableMonthlyGross)} EUR`}
            >
              <BreakdownRow
                label="Rentenversicherung AN"
                value={`${fmt(calc.pensionMonthly)} EUR`}
              />
              <BreakdownRow
                label="Arbeitslosenvers. AN"
                value={`${fmt(calc.unemploymentMonthly)} EUR`}
              />
              <BreakdownRow
                label="Krankenversicherung AN"
                value={`${fmt(calc.healthMonthly)} EUR`}
              />
              <BreakdownRow label="Pflegeversicherung AN" value={`${fmt(calc.careMonthly)} EUR`} />
              <BreakdownRow
                label="Sozialabgaben gesamt / Mo"
                value={`${fmt(calc.employeeSocialMonthly)} EUR`}
              />
              <BreakdownRow label="Lohnsteuer / Jahr" value={`${fmt(calc.incomeTaxAnnual)} EUR`} />
              <BreakdownRow label="Soli / Jahr" value={`${fmt(calc.solidarityAnnual)} EUR`} />
              <BreakdownRow label="Kirchensteuer / Jahr" value={`${fmt(calc.churchAnnual)} EUR`} />
              <BreakdownRow
                label="Geldwerter Vorteil / Mo"
                value={`${fmt(calc.taxableCarBenefitMonthly)} EUR`}
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
              title="Monatliche Verteilung"
              labels={['Netto', 'Sozialabgaben', 'Lohnsteuer', 'Firmenwagen']}
              values={[
                calc.netMonthly,
                calc.employeeSocialMonthly,
                calc.incomeTaxAnnual / 12,
                calc.taxableCarBenefitMonthly,
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
      </div>
    </ToolShell>
  );
}
