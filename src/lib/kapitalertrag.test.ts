import { describe, expect, it } from 'vitest';
import { calculateKapitalertrag } from './calculators';

describe('kapitalertrag calculator tests', () => {
  it('applies sparerpauschbetrag correctly for single filing status', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 1000,
      losses: 0,
      filingStatus: 'single',
      churchTaxRate: 0,
    });

    expect(result.pauschbetrag).toBeGreaterThan(0);
    expect(result.taxableIncome).toBeLessThanOrEqual(1000);
  });

  it('applies sparerpauschbetrag correctly for married filing status', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 1000,
      losses: 0,
      filingStatus: 'married',
      churchTaxRate: 0,
    });

    expect(result.pauschbetrag).toBeGreaterThan(0);
    expect(result.taxableIncome).toBeLessThanOrEqual(1000);
  });

  it('calculates abgeltungsteuer correctly', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 2000,
      losses: 0,
      filingStatus: 'single',
      churchTaxRate: 0,
    });

    expect(result.abgeltungsteuer).toBeGreaterThan(0);
  });

  it('calculates kirchensteuer correctly', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 2000,
      losses: 0,
      filingStatus: 'single',
      churchTaxRate: 9,
    });

    expect(result.kirchensteuer).toBeGreaterThan(0);
  });

  it('calculates total tax correctly', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 2000,
      losses: 0,
      filingStatus: 'single',
      churchTaxRate: 9,
    });

    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.totalTax).toBe(result.abgeltungsteuer + result.soli + result.kirchensteuer);
  });

  it('handles losses correctly', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 2000,
      losses: 500,
      filingStatus: 'single',
      churchTaxRate: 0,
    });

    expect(result.taxableIncome).toBeLessThanOrEqual(1500);
  });

  it('calculates net payout correctly', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 2000,
      losses: 0,
      filingStatus: 'single',
      churchTaxRate: 0,
    });

    expect(result.netPayout).toBeGreaterThan(0);
    expect(result.netPayout).toBeLessThanOrEqual(2000);
  });

  it('calculates effective rate correctly', () => {
    const result = calculateKapitalertrag({
      capitalIncome: 2000,
      losses: 0,
      filingStatus: 'single',
      churchTaxRate: 0,
    });

    expect(result.effectiveRate).toBeGreaterThan(0);
    expect(result.effectiveRate).toBeLessThanOrEqual(100);
  });
});
