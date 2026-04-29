import type { SparrechnerInputs } from './calculators';

const KEYS: Record<keyof SparrechnerInputs, string> = {
  initialAmount: 's',
  monthlyContribution: 'm',
  annualInterestRate: 'z',
  durationYears: 'j',
};

const REVERSE = Object.fromEntries(
  Object.entries(KEYS).map(([field, short]) => [short, field as keyof SparrechnerInputs])
);

export function encodeSpar(state: SparrechnerInputs): URLSearchParams {
  const p = new URLSearchParams();
  for (const key of Object.keys(KEYS) as Array<keyof SparrechnerInputs>) {
    p.set(KEYS[key], String(state[key]));
  }
  return p;
}

export function decodeSpar(
  params: URLSearchParams,
  fallback: SparrechnerInputs
): SparrechnerInputs {
  const result = { ...fallback };
  for (const short of Object.keys(REVERSE)) {
    const field = REVERSE[short] as keyof SparrechnerInputs;
    const raw = params.get(short);
    if (raw === null) continue;
    const n = Number(raw);
    if (!isNaN(n)) (result as Record<string, unknown>)[field] = n;
  }
  return result;
}

export function sparHasUrlState(params: URLSearchParams): boolean {
  return Object.values(KEYS).some((k) => params.has(k));
}
