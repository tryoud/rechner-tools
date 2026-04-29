import { describe, expect, it } from 'vitest';
import { calculateArbeitslosengeld } from './calculators';

describe('arbeitslosengeld calculator tests', () => {
  it('calculates daily ALG correctly for standard case', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    expect(result.dailyALG).toBeGreaterThan(0);
  });

  it('calculates monthly ALG correctly for standard case', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    expect(result.monthlyALG).toBeGreaterThan(0);
  });

  it('calculates higher rate with children', () => {
    const resultWithChildren = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: true,
      employmentMonths: 24,
      isEastGermany: false,
    });

    const resultWithoutChildren = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    expect(resultWithChildren.effectiveRate).toBe(67);
    expect(resultWithoutChildren.effectiveRate).toBe(60);
    expect(resultWithChildren.monthlyALG).toBeGreaterThan(resultWithoutChildren.monthlyALG);
  });

  it('calculates correct duration for 12+ months employment', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 12,
      isEastGermany: false,
    });

    expect(result.hasClaim).toBe(true);
    expect(result.durationWeeks).toBe(26);
  });

  it('calculates correct duration for 16+ months employment', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 16,
      isEastGermany: false,
    });

    expect(result.hasClaim).toBe(true);
    expect(result.durationWeeks).toBe(39);
  });

  it('calculates correct duration for 20+ months employment', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 20,
      isEastGermany: false,
    });

    expect(result.hasClaim).toBe(true);
    expect(result.durationWeeks).toBe(52);
  });

  it('calculates no claim for less than 12 months employment', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 11,
      isEastGermany: false,
    });

    expect(result.hasClaim).toBe(false);
    expect(result.durationWeeks).toBe(0);
    expect(result.monthlyALG).toBe(0);
  });

  it('caps calculation at assessment ceiling', () => {
    const resultCapped = calculateArbeitslosengeld({
      grossMonthly: 10000,
      netMonthly: 6000,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    const resultNormal = calculateArbeitslosengeld({
      grossMonthly: 8450,
      netMonthly: 4500,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    // Both should yield the same since 8450 is the assessment ceiling
    expect(resultCapped.dailyALG).toBe(resultNormal.dailyALG);
  });

  it('calculates weekly ALG correctly', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    expect(result.weeklyALG).toBeGreaterThan(0);
    expect(result.weeklyALG).toBe(Math.round(result.dailyALG * 7 * 100) / 100);
  });

  it('calculates max payout correctly', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 12,
      isEastGermany: false,
    });

    expect(result.maxPayout).toBeGreaterThan(0);
    expect(result.maxPayout).toBe(Math.round(result.weeklyALG * result.durationWeeks * 100) / 100);
  });

  it('calculates income loss correctly', () => {
    const result = calculateArbeitslosengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      hasChildren: false,
      employmentMonths: 24,
      isEastGermany: false,
    });

    expect(result.incomeLossMonthly).toBeGreaterThanOrEqual(0);
    expect(result.netReplacementRate).toBeGreaterThan(0);
    expect(result.netReplacementRate).toBeLessThanOrEqual(100);
  });
});
