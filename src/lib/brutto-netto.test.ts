import { describe, expect, it } from 'vitest';
import { calculateBruttoNetto } from './calculators';

const baseInputs = {
  grossMonthly: 4500,
  taxClass: '1' as const,
  state: 'nw' as const,
  churchTax: false,
  childrenUnder25: 0,
  healthInsuranceMode: 'statutory' as const,
  additionalHealthRatePercent: 2.9,
  privateHealthMonthly: 520,
  companyCarMode: 'none' as const,
  companyCarListPrice: 0,
};

describe('brutto-netto calculator tests', () => {
  it('stays close to BMF 2026 sample values for class I annual tax', () => {
    const low = calculateBruttoNetto({ ...baseInputs, grossMonthly: 2500 });
    const mid = calculateBruttoNetto({ ...baseInputs, grossMonthly: 5000 });
    const high = calculateBruttoNetto({ ...baseInputs, grossMonthly: 7500 });

    expect(low.incomeTaxAnnual).toBeGreaterThan(2300);
    expect(low.incomeTaxAnnual).toBeLessThan(2560);
    expect(mid.incomeTaxAnnual).toBeGreaterThan(9300);
    expect(mid.incomeTaxAnnual).toBeLessThan(10050);
    expect(high.incomeTaxAnnual).toBeGreaterThan(19000);
    expect(high.incomeTaxAnnual).toBeLessThan(20350);
  });

  it('calculates tax correctly for Class V and VI', () => {
    const class1 = calculateBruttoNetto({ ...baseInputs, grossMonthly: 4500, taxClass: '1' });
    const class5 = calculateBruttoNetto({ ...baseInputs, grossMonthly: 4500, taxClass: '5' });
    const class6 = calculateBruttoNetto({ ...baseInputs, grossMonthly: 4500, taxClass: '6' });

    // Class 5 and 6 should have significantly higher tax than Class 1
    expect(class5.incomeTaxAnnual).toBeGreaterThan(class1.incomeTaxAnnual);
    expect(class6.incomeTaxAnnual).toBeGreaterThan(class1.incomeTaxAnnual);
  });

  it('reduces the employee care rate when children under 25 are counted', () => {
    const childless = calculateBruttoNetto({ ...baseInputs, childrenUnder25: 0 });
    const withThreeChildren = calculateBruttoNetto({ ...baseInputs, childrenUnder25: 3 });

    expect(withThreeChildren.careMonthly).toBeLessThan(childless.careMonthly);
    expect(withThreeChildren.netMonthly).toBeGreaterThan(childless.netMonthly);
  });

  it('correctly models Sachsen special case for care insurance', () => {
    const normal = calculateBruttoNetto({ ...baseInputs, childrenUnder25: 0, state: 'nw' });
    const sachsen = calculateBruttoNetto({ ...baseInputs, childrenUnder25: 0, state: 'sn' });

    expect(sachsen.careMonthly).toBeGreaterThan(normal.careMonthly);
  });

  it('separates GKV and PKV logic accurately', () => {
    const gkv = calculateBruttoNetto({ ...baseInputs, healthInsuranceMode: 'statutory' });
    const pkv = calculateBruttoNetto({
      ...baseInputs,
      healthInsuranceMode: 'private',
      privateHealthMonthly: 500,
    });

    expect(gkv.careMonthly).toBeGreaterThan(0);
    expect(pkv.careMonthly).toBe(0); // Care is included in PKV input
    expect(pkv.healthMonthly).toBe(500);
  });

  it('handles child allowances robustly in church tax and soli base', () => {
    // Soli threshold is high, let's use high income to trigger it
    const withoutChild = calculateBruttoNetto({
      ...baseInputs,
      grossMonthly: 8000,
      childrenUnder25: 0,
      churchTax: true,
    });
    const withChild = calculateBruttoNetto({
      ...baseInputs,
      grossMonthly: 8000,
      childrenUnder25: 2,
      churchTax: true,
    });

    // Soli and Church tax should be strictly lower because of Kinderfreibeträge
    expect(withChild.solidarityAnnual).toBeLessThan(withoutChild.solidarityAnnual);
    expect(withChild.churchAnnual).toBeLessThan(withoutChild.churchAnnual);
  });

  it('applies the reduced 0.25 percent rule for eligible electric cars and test fallback', () => {
    const regular = calculateBruttoNetto({
      ...baseInputs,
      companyCarMode: 'regular',
      companyCarListPrice: 80000,
    });
    const electric = calculateBruttoNetto({
      ...baseInputs,
      companyCarMode: 'electric',
      companyCarListPrice: 80000,
    });
    const electricOverCap = calculateBruttoNetto({
      ...baseInputs,
      companyCarMode: 'electric',
      companyCarListPrice: 120000,
    });

    expect(regular.taxableCarBenefitMonthly).toBe(800);
    expect(electric.taxableCarBenefitMonthly).toBe(200);

    // Over cap falls back to 0.5%
    expect(electricOverCap.taxableCarBenefitMonthly).toBe(120000 * 0.005);
  });
});
