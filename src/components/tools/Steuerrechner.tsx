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
import PrintSummary from '../ui/PrintSummary';
import {
  calculateSteuer,
  type SteuerrechnerInputs,
  type FederalState,
} from '../../lib/calculators';
import { useUrlState } from '../../lib/useUrlState';
import { encodeSteuer, decodeSteuer, steuerHasUrlState } from '../../lib/steuer-url';
import { TOOL_CONTENT } from '../../lib/tool-content';

const content = TOOL_CONTENT.steuer;

const fmt = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n);
const fmtPct = (n: number) =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(n);

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

const initialState: SteuerrechnerInputs = {
  annualIncome: 60000,
  werbungskosten: 1230,
  sonderausgaben: 36,
  vorsorgeaufwendungen: 4800,
  aussergewoehnlicheBelastungen: 0,
  childrenUnder25: 0,
  filingStatus: 'single',
  churchTax: false,
  state: 'nw',
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

export default function Steuerrechner() {
  const [input, setInput] = useUrlState<SteuerrechnerInputs>(
    'rechner-tools:steuer:v1',
    initialState,
    encodeSteuer,
    decodeSteuer,
    steuerHasUrlState
  );

  const update = <K extends keyof SteuerrechnerInputs>(key: K, value: SteuerrechnerInputs[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const calc = calculateSteuer(input);

  return (
    <ToolShell
      title="Steuerrechner"
      description="Berechne deine Einkommensteuer, Soli und Kirchensteuer nach Abzügen."
      category="Finanzen"
    >
      <PrintSummary
        title="Steuerberechnung"
        items={[
          { label: 'Jahreseinkommen', value: `${fmt(input.annualIncome)} EUR` },
          { label: 'Steuerstatus', value: input.filingStatus === 'married' ? 'Verheiratet' : 'Ledig' },
          { label: 'Zu versteuerndes Einkommen', value: `${fmt(calc.zve)} EUR` },
          { label: 'Einkommensteuer', value: `${fmt(calc.einkommensteuer)} EUR` },
          { label: 'Solidaritätszuschlag', value: `${fmt(calc.soli)} EUR` },
          { label: 'Kirchensteuer', value: `${fmt(calc.kirchensteuer)} EUR` },
          { label: 'Gesamtsteuer', value: `${fmt(calc.totalTax)} EUR` },
          { label: 'Effektiver Steuersatz', value: `${fmtPct(calc.effectiveRate)} %` },
          {
            label: 'Nettoeinkommen (jährlich)',
            value: <span className="font-bold">{fmt(calc.netIncome)} EUR</span>,
          },
        ]}
      />
      <div className="print:hidden">
        <ToolPageScaffold
          heroSummary={
            <div className="rounded-[20px] border border-border bg-surface-elevated px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Die Steuerlast richtet sich nach dem zu versteuernden Einkommen — nicht dem Brutto.
                Werbungskosten, Vorsorge und Sonderausgaben mindern die Basis direkt.
              </p>
            </div>
          }
          calculator={
            <div className="space-y-6">
              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="01" label="Einkommen und Steuerstatus" first />
                <NumberInput
                  label="Jahreseinkommen brutto"
                  hint="Gesamte Einkünfte vor Abzügen (Lohn, Honorare, Einkünfte aus Vermietung)."
                  value={input.annualIncome}
                  onChange={(value) => update('annualIncome', value)}
                  min={0}
                  max={500000}
                  step={1000}
                  unit="EUR"
                />
                <ToggleRow
                  label="Steuerstatus"
                  hint="Verheiratete profitieren vom Ehegattensplitting (Splittingtarif)."
                >
                  <ToggleGroup
                    options={[
                      { label: 'Ledig', value: 'single' },
                      { label: 'Verheiratet', value: 'married' },
                    ]}
                    value={input.filingStatus}
                    onChange={(value) =>
                      update('filingStatus', value as SteuerrechnerInputs['filingStatus'])
                    }
                  />
                </ToggleRow>
                <ToggleRow label="Kirchensteuer" hint="8 % in Bayern/BW, sonst 9 % der ESt.">
                  <ToggleGroup
                    options={[
                      { label: 'Nein', value: 'off' },
                      { label: 'Ja', value: 'on' },
                    ]}
                    value={input.churchTax ? 'on' : 'off'}
                    onChange={(value) => update('churchTax', value === 'on')}
                  />
                </ToggleRow>
                {input.churchTax && (
                  <div className="border-b border-border py-3.5 hover:bg-surface-elevated transition-colors rounded-sm -mx-1 px-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <label
                          className="text-sm font-medium text-ink"
                          htmlFor="steuer-state-select"
                        >
                          Bundesland
                        </label>
                        <p className="text-xs text-ink-faint mt-0.5">
                          Relevant für den Kirchensteuersatz.
                        </p>
                      </div>
                      <select
                        id="steuer-state-select"
                        value={input.state}
                        onChange={(e) => update('state', e.target.value as FederalState)}
                        className="border border-border rounded-md text-sm px-2 py-1.5 bg-white text-ink focus:border-accent focus:outline-none font-mono shrink-0 hover:border-accent-mid transition-colors"
                      >
                        {Object.entries(stateLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <NumberInput
                  label="Kinder unter 25"
                  hint="Kinderfreibetrag (6.672 EUR je Kind) mindert Soli und Kirchensteuer."
                  value={input.childrenUnder25}
                  onChange={(value) => update('childrenUnder25', value)}
                  min={0}
                  max={10}
                  step={1}
                  unit="Kinder"
                />
              </div>

              <div className="[&>div:last-child]:border-b-0">
                <SectionLabel number="02" label="Abzüge" />
                <NumberInput
                  label="Werbungskosten"
                  hint="Fahrtkosten, Arbeitsmittel, Homeoffice. Mindest-Pauschbetrag: 1.230 EUR."
                  value={input.werbungskosten}
                  onChange={(value) => update('werbungskosten', value)}
                  min={0}
                  max={30000}
                  step={100}
                  unit="EUR"
                />
                <NumberInput
                  label="Vorsorgeaufwendungen"
                  hint="Eigene Beiträge zu Kranken- und Rentenversicherung (Arbeitnehmeranteil)."
                  value={input.vorsorgeaufwendungen}
                  onChange={(value) => update('vorsorgeaufwendungen', value)}
                  min={0}
                  max={30000}
                  step={100}
                  unit="EUR"
                />
                <NumberInput
                  label="Sonderausgaben"
                  hint="Spenden, Ausbildungskosten u. a. Pauschbetrag: 36 EUR (Single), 72 EUR (Verheiratet)."
                  value={input.sonderausgaben}
                  onChange={(value) => update('sonderausgaben', value)}
                  min={0}
                  max={50000}
                  step={100}
                  unit="EUR"
                />
                <NumberInput
                  label="Außergewöhnliche Belastungen"
                  hint="Krankheitskosten, Pflege, Katastrophenschäden über der zumutbaren Eigenbelastung."
                  value={input.aussergewoehnlicheBelastungen}
                  onChange={(value) => update('aussergewoehnlicheBelastungen', value)}
                  min={0}
                  max={50000}
                  step={100}
                  unit="EUR"
                />
              </div>

              <ScenarioStrip title="Was passiert wenn..." items={content.scenarios} />
            </div>
          }
          result={
            <div className="space-y-4">
              <ResultCard
                label="Einkommensteuer"
                value={fmt(calc.einkommensteuer)}
                numericValue={calc.einkommensteuer}
                unit="EUR"
                secondary={`ZVE ${fmt(calc.zve)} EUR · Effektivrate ${fmtPct(calc.effectiveRate)} %`}
              >
                <BreakdownRow label="Solidaritätszuschlag" value={`${fmt(calc.soli)} EUR`} />
                {input.churchTax && (
                  <BreakdownRow label="Kirchensteuer" value={`${fmt(calc.kirchensteuer)} EUR`} />
                )}
                <BreakdownRow
                  label="Gesamtsteuer"
                  value={`${fmt(calc.totalTax)} EUR`}
                  highlight
                />
                <BreakdownRow
                  label="Nettoeinkommen (jährlich)"
                  value={`${fmt(calc.netIncome)} EUR`}
                  highlight
                />
                <BreakdownRow
                  label="Grenzsteuersatz"
                  value={`${fmtPct(calc.marginalRate)} %`}
                />
              </ResultCard>
            </div>
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
                  const text = `Meine Steuerlast: ${fmt(calc.totalTax)} EUR/Jahr – hier berechnet:`;
                  if (navigator.share) {
                    await navigator.share({ title: 'Steuerrechner', text, url });
                  } else {
                    await navigator.clipboard.writeText(`${text} ${url}`);
                    alert('Link kopiert – öffnet direkt deine Kalkulation!');
                  }
                }}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors"
                aria-label="Berechnung teilen"
              >
                Berechnung teilen
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
              title="Einkommensverteilung"
              labels={['Netto', 'Einkommensteuer', 'Soli', ...(input.churchTax ? ['Kirchensteuer'] : [])]}
              values={[calc.netIncome, calc.einkommensteuer, calc.soli, ...(input.churchTax ? [calc.kirchensteuer] : [])]}
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
