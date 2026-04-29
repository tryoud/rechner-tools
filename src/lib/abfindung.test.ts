import { describe, expect, it } from 'vitest';
import { calculateAbfindung } from './calculators';

describe('abfindung calculator tests', () => {
  it('calculates formula amount correctly', () => {
    const result = calculateAbfindung({
      grossMonthly: 4000,
      yearsOfService: 10,
      severanceAmount: 50000,
      taxClass: '1',
    });

    expect(result.formulaAmount).toBeGreaterThan(0);
    expect(result.formulaAmount).toBe(4000 * 10 * 0.5);
  });

  it('calculates tax with Fünftelregel correctly', () => {
    const result = calculateAbfindung({
      grossMonthly: 4000,
      yearsOfService: 10,
      severanceAmount: 50000,
      taxClass: '1',
    });

    expect(result.taxFuenftelregel).toBeGreaterThan(0);
    expect(result.soliOnFuenftel).toBeGreaterThanOrEqual(0);
    expect(result.totalTaxFuenftel).toBeGreaterThan(0);
  });

  it('calculates tax with normal method correctly', () => {
    const result = calculateAbfindung({
      grossMonthly: 4000,
      yearsOfService: 10,
      severanceAmount: 50000,
      taxClass: '1',
    });

    expect(result.totalTaxNormal).toBeGreaterThan(0);
  });

  it('calculates saving correctly', () => {
    const result = calculateAbfindung({
      grossMonthly: 4000,
      yearsOfService: 10,
      severanceAmount: 50000,
      taxClass: '1',
    });

    expect(result.saving).toBeGreaterThanOrEqual(0);
  });

  it('calculates net amounts correctly', () => {
    const result = calculateAbfindung({
      grossMonthly: 4000,
      yearsOfService: 10,
      severanceAmount: 50000,
      taxClass: '1',
    });

    expect(result.netFuenftel).toBeGreaterThan(0);
    expect(result.netNormal).toBeGreaterThan(0);
  });

  it('calculates effective rate correctly', () => {
    const result = calculateAbfindung({
      grossMonthly: 4000,
      yearsOfService: 10,
      severanceAmount: 50000,
      taxClass: '1',
    });

    expect(result.effectiveRateFuenftel).toBeGreaterThan(0);
    expect(result.effectiveRateFuenftel).toBeLessThanOrEqual(100);
  });
});
