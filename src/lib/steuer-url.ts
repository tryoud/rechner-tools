import type { SteuerrechnerInputs } from './calculators';

const KEYS: Record<keyof SteuerrechnerInputs, string> = {
  annualIncome: 'e',
  werbungskosten: 'w',
  sonderausgaben: 'sa',
  vorsorgeaufwendungen: 'v',
  aussergewoehnlicheBelastungen: 'ab',
  childrenUnder25: 'k',
  filingStatus: 'fs',
  churchTax: 'kt',
  state: 'bl',
};

const REVERSE = Object.fromEntries(
  Object.entries(KEYS).map(([field, short]) => [short, field as keyof SteuerrechnerInputs])
);

const ALLOWED: Partial<Record<keyof SteuerrechnerInputs, string[]>> = {
  filingStatus: ['single', 'married'],
  state: [
    'bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv',
    'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th',
  ],
};

export function encodeSteuer(state: SteuerrechnerInputs): URLSearchParams {
  const p = new URLSearchParams();
  for (const key of Object.keys(KEYS) as Array<keyof SteuerrechnerInputs>) {
    const val = state[key];
    p.set(KEYS[key], typeof val === 'boolean' ? (val ? '1' : '0') : String(val));
  }
  return p;
}

export function decodeSteuer(
  params: URLSearchParams,
  fallback: SteuerrechnerInputs
): SteuerrechnerInputs {
  const result = { ...fallback };
  for (const short of Object.keys(REVERSE)) {
    const field = REVERSE[short] as keyof SteuerrechnerInputs;
    const raw = params.get(short);
    if (raw === null) continue;
    const sample = fallback[field];
    if (typeof sample === 'boolean') {
      (result as Record<string, unknown>)[field] = raw === '1';
    } else if (typeof sample === 'number') {
      const n = Number(raw);
      if (!isNaN(n)) (result as Record<string, unknown>)[field] = n;
    } else {
      const allowed = ALLOWED[field];
      if (!allowed || allowed.includes(raw)) {
        (result as Record<string, unknown>)[field] = raw;
      }
    }
  }
  return result;
}

export function steuerHasUrlState(params: URLSearchParams): boolean {
  return Object.values(KEYS).some((k) => params.has(k));
}
