import { describe, expect, it } from 'vitest';
import { calculateMinijob } from './calculators';

describe('minijob calculator tests', () => {
  it('identifies minijob status correctly for 538 EUR', () => {
    const result = calculateMinijob({
      monthlyEarnings: 538,
      isPensionInsured: false,
      pensionRate: 0,
    });

    expect(result.isMinijob).toBe(true);
  });

  it('identifies non-minijob status for 539 EUR', () => {
    const result = calculateMinijob({
      monthlyEarnings: 539,
      isPensionInsured: false,
      pensionRate: 0,
    });

    expect(result.isMinijob).toBe(false);
  });

  it('calculates correct net without pension insurance', () => {
    const result = calculateMinijob({
      monthlyEarnings: 500,
      isPensionInsured: false,
      pensionRate: 0,
    });

    expect(result.employeeNet).toBe(500);
    expect(result.employeePensionDeduction).toBe(0);
  });

  it('calculates correct net with 15% pension insurance', () => {
    const result = calculateMinijob({
      monthlyEarnings: 500,
      isPensionInsured: true,
      pensionRate: 0.15,
    });

    expect(result.employeeNet).toBe(425); // 500 - (500 * 0.15) = 425
    expect(result.employeePensionDeduction).toBe(75);
    expect(result.pensionRatePercent).toBe(15);
  });

  it('calculates correct net with 5% pension insurance', () => {
    const result = calculateMinijob({
      monthlyEarnings: 400,
      isPensionInsured: true,
      pensionRate: 0.05,
    });

    expect(result.employeeNet).toBe(380); // 400 - (400 * 0.05) = 380
    expect(result.employeePensionDeduction).toBe(20);
    expect(result.pensionRatePercent).toBe(5);
  });

  it('calculates employer costs correctly', () => {
    const result = calculateMinijob({
      monthlyEarnings: 500,
      isPensionInsured: false,
      pensionRate: 0,
    });

    // Employer pays: 500 + (500 * 0.15) + (500 * 0.15) = 500 + 75 + 75 = 650
    expect(result.employerTotalCost).toBe(650);
    expect(result.employerPauschalTax).toBe(75);
    expect(result.employerSocial).toBe(75);
  });

  it('returns earnings limit of 538 EUR', () => {
    const result = calculateMinijob({
      monthlyEarnings: 500,
      isPensionInsured: false,
      pensionRate: 0,
    });

    expect(result.earningsLimit).toBe(538);
  });

  it('calculates net gain compared to normal job', () => {
    const result = calculateMinijob({
      monthlyEarnings: 500,
      isPensionInsured: false,
      pensionRate: 0,
    });

    // Normal job estimated: 500 * 0.8 = 400
    // Minijob: 500 (no deductions)
    // Gain: 500 - 400 = 100
    expect(result.netGain).toBe(100);
  });

  it('handles edge case of 0 earnings', () => {
    const result = calculateMinijob({
      monthlyEarnings: 0,
      isPensionInsured: false,
      pensionRate: 0,
    });

    expect(result.isMinijob).toBe(true);
    expect(result.employeeNet).toBe(0);
    expect(result.employerTotalCost).toBe(0);
  });

  it('calculates for max minijob earnings with full pension', () => {
    const result = calculateMinijob({
      monthlyEarnings: 538,
      isPensionInsured: true,
      pensionRate: 0.15,
    });

    expect(result.isMinijob).toBe(true);
    // 538 - (538 * 0.15) = 457.30
    expect(result.employeeNet).toBe(457.3);
    // 538 + (538 * 0.15) + (538 * 0.15) = 538 + 80.70 + 80.70 = 699.40
    expect(result.employerTotalCost).toBe(699.4);
  });
});
