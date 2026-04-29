import { describe, expect, it } from 'vitest';
import { calculateStundensatz } from './calculators';

const baseInputs = {
  desiredNetMonthly: 4200,
  taxRatePercent: 30,
  vatMode: 'standard' as const,
  healthInsuranceMode: 'statutory' as const,
  privateHealthMonthly: 650,
  fixedCostsMonthly: 650,
  pensionReserveMonthly: 400,
  profitMarginPercent: 18,
  utilizationPercent: 68,
  billableHoursPerDay: 6,
  vacationDays: 25,
  sickDays: 8,
  adminDaysPerMonth: 1,
};

describe('stundensatz calculator tests', () => {
  it('raises the required freelancer rate when admin time increases', () => {
    const lean = calculateStundensatz(baseInputs);
    const adminHeavy = calculateStundensatz({
      ...baseInputs,
      adminDaysPerMonth: 4,
    });

    expect(adminHeavy.netRate).toBeGreaterThan(lean.netRate);
  });

  it('raises rate if utilization drops', () => {
    const highUtil = calculateStundensatz({ ...baseInputs, utilizationPercent: 80 });
    const lowUtil = calculateStundensatz({ ...baseInputs, utilizationPercent: 40 });

    expect(lowUtil.netRate).toBeGreaterThan(highUtil.netRate);
  });

  it('handles gross rate based on vat options correctly', () => {
    const withVat = calculateStundensatz({ ...baseInputs, vatMode: 'standard' });
    const withoutVat = calculateStundensatz({ ...baseInputs, vatMode: 'small-business' });

    // If small business, grossRate should equal netRate
    expect(withoutVat.grossRate).toBe(withoutVat.netRate);

    // With standard vat, gross should be structurally ~19% higher
    expect(withVat.grossRate).toBeGreaterThan(withVat.netRate);
  });

  it('prevents billable days from going negative if too much time off', () => {
    const extremeTimeOff = calculateStundensatz({
      ...baseInputs,
      vacationDays: 200,
      sickDays: 200,
    });
    expect(extremeTimeOff.workingDays).toBeLessThan(0);
    expect(extremeTimeOff.billableDays).toBe(0);
    expect(extremeTimeOff.netRate).toBe(0); // Safe handling of division by zero
  });
});
