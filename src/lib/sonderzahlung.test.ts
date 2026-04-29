import { describe, expect, it } from 'vitest';
import { calculateSonderzahlung } from './calculators';

describe('sonderzahlung calculator tests', () => {
  it('calculates income tax on bonus correctly', () => {
    const result = calculateSonderzahlung({
      grossMonthly: 4000,
      bonusAmount: 2000,
      taxClass: '1',
      healthInsuranceMode: 'statutory',
    });

    expect(result.incomeTaxOnBonus).toBeGreaterThan(0);
  });

  it('calculates social security on bonus correctly', () => {
    const result = calculateSonderzahlung({
      grossMonthly: 4000,
      bonusAmount: 2000,
      taxClass: '1',
      healthInsuranceMode: 'statutory',
    });

    expect(result.socialOnBonus).toBeGreaterThan(0);
    expect(result.pensionOnBonus).toBeGreaterThan(0);
    expect(result.unemploymentOnBonus).toBeGreaterThan(0);
    expect(result.healthOnBonus).toBeGreaterThan(0);
    expect(result.careOnBonus).toBeGreaterThan(0);
  });

  it('calculates net bonus correctly', () => {
    const result = calculateSonderzahlung({
      grossMonthly: 4000,
      bonusAmount: 2000,
      taxClass: '1',
      healthInsuranceMode: 'statutory',
    });

    expect(result.netBonus).toBeGreaterThan(0);
    expect(result.netBonus).toBeLessThan(2000);
  });

  it('handles zero bonus correctly', () => {
    const result = calculateSonderzahlung({
      grossMonthly: 4000,
      bonusAmount: 0,
      taxClass: '1',
      healthInsuranceMode: 'statutory',
    });

    expect(result.netBonus).toBe(0);
    expect(result.effectiveNetRate).toBe(0);
  });

  it('calculates effective net rate correctly', () => {
    const result = calculateSonderzahlung({
      grossMonthly: 4000,
      bonusAmount: 2000,
      taxClass: '1',
      healthInsuranceMode: 'statutory',
    });

    expect(result.effectiveNetRate).toBeGreaterThan(0);
    expect(result.effectiveNetRate).toBeLessThanOrEqual(100);
  });
});
