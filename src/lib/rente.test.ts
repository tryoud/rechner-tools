import { describe, expect, it } from 'vitest';
import { calculateRente } from './calculators';

describe('rente calculator tests', () => {
  it('calculates years until retirement correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.yearsUntilRetirement).toBe(27);
  });

  it('calculates points per year now correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.pointsPerYearNow).toBeGreaterThan(0);
  });

  it('calculates future points correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.futurePoints).toBeGreaterThan(0);
  });

  it('calculates total points correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.totalPoints).toBeGreaterThan(30);
  });

  it('calculates zugangsfaktor correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.zugangsfaktor).toBeGreaterThan(0);
  });

  it('calculates monthly pension correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.monthlyPension).toBeGreaterThan(0);
  });

  it('calculates annual pension correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.annualPension).toBeGreaterThan(0);
    expect(result.annualPension).toBeCloseTo(result.monthlyPension * 12, 0.1);
  });

  it('calculates pension contribution monthly correctly', () => {
    const result = calculateRente({
      currentAge: 40,
      retirementAge: 67,
      currentGrossMonthly: 4000,
      earnedPointsSoFar: 30,
      annualIncomeGrowthPercent: 2,
    });

    expect(result.pensionContributionMonthly).toBeGreaterThan(0);
  });
});
