import { describe, expect, it } from 'vitest';
import { calculateGewerbesteuer } from './calculators';

describe('gewerbesteuer calculator tests', () => {
  it('applies freibetrag for individual legal form', () => {
    const individual = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'individual',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });
    const gmbh = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'gmbh',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });

    expect(individual.freibetrag).toBeGreaterThan(0);
    expect(gmbh.freibetrag).toBe(0);
    expect(individual.gewerbesteuer).toBeLessThan(gmbh.gewerbesteuer);
  });

  it('calculates hinzurechnungen correctly', () => {
    const withHinzurechnungen = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'individual',
      hebesatz: 400,
      interestExpenses: 200000,
      rentExpenses: 50000,
    });
    const withoutHinzurechnungen = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'individual',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });

    expect(withHinzurechnungen.hinzurechnungen).toBeGreaterThan(0);
    expect(withHinzurechnungen.gewerbesteuer).toBeGreaterThan(withoutHinzurechnungen.gewerbesteuer);
  });

  it('applies estAnrechnung for individual legal form', () => {
    const individual = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'individual',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });
    const gmbh = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'gmbh',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });

    expect(individual.estAnrechnung).toBeGreaterThan(0);
    expect(gmbh.estAnrechnung).toBe(0);
    expect(individual.effectiveBurden).toBeLessThan(individual.gewerbesteuer);
  });

  it('calculates effective rate correctly', () => {
    const result = calculateGewerbesteuer({
      profit: 80000,
      legalForm: 'individual',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });

    expect(result.effectiveRate).toBeGreaterThan(0);
    expect(result.effectiveRate).toBeLessThanOrEqual(100);
  });

  it('handles zero profit correctly', () => {
    const result = calculateGewerbesteuer({
      profit: 0,
      legalForm: 'individual',
      hebesatz: 400,
      interestExpenses: 0,
      rentExpenses: 0,
    });

    expect(result.gewerbesteuer).toBe(0);
    expect(result.effectiveBurden).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });
});
