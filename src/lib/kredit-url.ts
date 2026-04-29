import type { KreditrechnerInputs } from './calculators';

const KEYS: Record<keyof KreditrechnerInputs, string> = {
  loanAmount: 'k',
  interestRate: 'z',
  loanTerm: 'l',
  extraPaymentMonthly: 'st',
};

const REVERSE = Object.fromEntries(
  Object.entries(KEYS).map(([field, short]) => [short, field as keyof KreditrechnerInputs])
);

export function encodeKredit(state: KreditrechnerInputs): URLSearchParams {
  const p = new URLSearchParams();
  const keys = Object.keys(KEYS) as Array<keyof KreditrechnerInputs>;
  for (const key of keys) {
    p.set(KEYS[key], String(state[key]));
  }
  return p;
}

export function decodeKredit(
  params: URLSearchParams,
  fallback: KreditrechnerInputs
): KreditrechnerInputs {
  const result = { ...fallback };
  for (const short of Object.keys(REVERSE)) {
    const field = REVERSE[short] as keyof KreditrechnerInputs;
    const raw = params.get(short);
    if (raw === null) continue;
    const n = Number(raw);
    if (!isNaN(n)) {
      (result as Record<string, unknown>)[field] = n;
    }
  }
  return result;
}

export function kreditHasUrlState(params: URLSearchParams): boolean {
  return Object.values(KEYS).some((k) => params.has(k));
}
