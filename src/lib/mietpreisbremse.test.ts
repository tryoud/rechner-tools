import { describe, expect, it } from 'vitest';
import { calculateMietpreisbremse } from './calculators';

describe('mietpreisbremse calculator tests', () => {
  it('calculates base max correctly', () => {
    const result = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: false,
    });

    expect(result.baseMax).toBeGreaterThan(0);
    expect(result.baseMax).toBeLessThanOrEqual(800 * 1.1);
  });

  it('calculates modernization surcharge correctly', () => {
    const result = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 100,
      isExempt: false,
    });

    expect(result.modernizationSurchargeTotal).toBeGreaterThan(0);
  });

  it('calculates max allowed rent correctly', () => {
    const result = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: false,
    });

    expect(result.maxAllowedRent).toBeGreaterThan(0);
  });

  it('calculates overcharge correctly', () => {
    const result = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: false,
    });

    expect(result.overchargeMonthly).toBeGreaterThanOrEqual(0);
    expect(result.overchargeAnnual).toBeGreaterThanOrEqual(0);
  });

  it('handles exempt status correctly', () => {
    const result = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: true,
    });

    expect(result.overchargeMonthly).toBe(0);
    expect(result.overchargeAnnual).toBe(0);
    expect(result.isExempt).toBe(true);
  });

  it('calculates rent per sqm correctly', () => {
    const result = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: false,
    });

    expect(result.rentPerSqm).toBeGreaterThan(0);
    expect(result.maxRentPerSqm).toBeGreaterThan(0);
  });

  it('determines compliance correctly', () => {
    const compliant = calculateMietpreisbremse({
      currentRentMonthly: 800,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: false,
    });

    const nonCompliant = calculateMietpreisbremse({
      currentRentMonthly: 1000,
      comparableRentMonthly: 800,
      apartmentSizeSqm: 70,
      preExistingRent: 0,
      modernizationCostPerSqm: 0,
      isExempt: false,
    });

    expect(compliant.isCompliant).toBe(true);
    expect(nonCompliant.isCompliant).toBe(false);
  });
});
