import type { StundensatzInputs } from './calculators';

// Short URL keys to keep the share link compact
const KEYS: Record<keyof StundensatzInputs, string> = {
  desiredNetMonthly: 'n',
  taxRatePercent: 'st',
  vatMode: 'ust',
  healthInsuranceMode: 'kv',
  privateHealthMonthly: 'pkv',
  fixedCostsMonthly: 'fix',
  pensionReserveMonthly: 'rv',
  profitMarginPercent: 'mg',
  utilizationPercent: 'aus',
  billableHoursPerDay: 'h',
  vacationDays: 'ferien',
  sickDays: 'krank',
  adminDaysPerMonth: 'adm',
};

const REVERSE = Object.fromEntries(
  Object.entries(KEYS).map(([field, short]) => [short, field as keyof StundensatzInputs])
);

// Allowed values for string enum fields — anything else is silently dropped
const ALLOWED: Partial<Record<keyof StundensatzInputs, string[]>> = {
  vatMode: ['standard', 'small-business'],
  healthInsuranceMode: ['statutory', 'private'],
};

export function encodeStundensatz(state: StundensatzInputs): URLSearchParams {
  const p = new URLSearchParams();
  const keys = Object.keys(KEYS) as Array<keyof StundensatzInputs>;
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    const key = keys[i];
    const short = KEYS[key];
    const value = state[key];
    const stringValue = String(value);
    p.set(short, stringValue);
  }
  return p;
}

export function decodeStundensatz(
  params: URLSearchParams,
  fallback: StundensatzInputs
): StundensatzInputs {
  const result = { ...fallback };
  const keys = Object.keys(REVERSE) as Array<keyof StundensatzInputs>;
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    const short = keys[i];
    const field = REVERSE[short];
    const raw = params.get(short);
    if (raw === null) continue;
    const key = field as keyof StundensatzInputs;
    const sample = fallback[key];
    if (typeof sample === 'number') {
      const n = Number(raw);
      if (!isNaN(n)) {
        const numValue = n;
        (result as Record<string, unknown>)[key] = numValue;
      }
    } else {
      const allowed = ALLOWED[key];
      if (!allowed || allowed.includes(raw)) {
        const stringValue = raw;
        (result as Record<string, unknown>)[key] = stringValue;
      }
      // Invalid enum value → keep fallback, don't write anything
    }
  }
  return result;
}

export function stundensatzHasUrlState(params: URLSearchParams): boolean {
  return Object.values(KEYS).some((k) => params.has(k));
}
