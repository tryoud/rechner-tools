import { useEffect, useState } from 'react';

export function useUrlState<T extends object>(
  storageKey: string,
  initialValue: T,
  encode: (v: T) => URLSearchParams,
  decode: (p: URLSearchParams, fallback: T) => T,
  hasUrlParams: (p: URLSearchParams) => boolean
) {
   const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const searchParams = new URLSearchParams(window.location.search);
    if (hasUrlParams(searchParams)) return decode(searchParams, initialValue);
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

   useEffect(() => {
    try {
      const valueString = JSON.stringify(value);
      window.localStorage.setItem(storageKey, valueString);
    } catch {
      // Empty block - error handling not needed
    }
    const encodedParams = encode(value);
    window.history.replaceState(null, '', `${window.location.pathname}?${encodedParams}`);
  }, [storageKey, value, encode]);

  return [value, setValue] as const;
}
