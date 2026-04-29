import { describe, expect, it } from 'vitest';
import { calculateElterngeld } from './calculators';
import { ELTERNGELD_CONFIG_2026 } from './year-config';

describe('elterngeld calculator tests', () => {
  it('keeps elterngeld inside official min/max bands', () => {
    const lowBase = calculateElterngeld({
      monthlyNetBeforeBirth: 200,
      monthlyNetAfterBirth: 0,
      mode: 'basis',
      durationMonths: 12,
      siblingBonus: false,
    });
    const highBase = calculateElterngeld({
      monthlyNetBeforeBirth: 4000,
      monthlyNetAfterBirth: 0,
      mode: 'basis',
      durationMonths: 12,
      siblingBonus: false,
    });

    const lowPlus = calculateElterngeld({
      monthlyNetBeforeBirth: 200,
      monthlyNetAfterBirth: 0,
      mode: 'plus',
      durationMonths: 24,
      siblingBonus: false,
    });
    const highPlus = calculateElterngeld({
      monthlyNetBeforeBirth: 4000,
      monthlyNetAfterBirth: 0,
      mode: 'plus',
      durationMonths: 24,
      siblingBonus: true,
    });

    // Min/Max behavior clamp test
    expect(lowBase.baseAmount).toBe(ELTERNGELD_CONFIG_2026.baseMin);
    expect(highBase.baseAmount).toBe(ELTERNGELD_CONFIG_2026.baseMax);

    expect(lowPlus.plusAmount).toBe(ELTERNGELD_CONFIG_2026.plusMin);
    expect(highPlus.plusAmount).toBe(ELTERNGELD_CONFIG_2026.plusMax);
  });

  it('correctly calculates partial income impact', () => {
    const fullLoss = calculateElterngeld({
      monthlyNetBeforeBirth: 2000,
      monthlyNetAfterBirth: 0,
      mode: 'basis',
      durationMonths: 12,
      siblingBonus: false,
    });
    const partialLoss = calculateElterngeld({
      monthlyNetBeforeBirth: 2000,
      monthlyNetAfterBirth: 1000,
      mode: 'basis',
      durationMonths: 12,
      siblingBonus: false,
    });

    expect(partialLoss.incomeLoss).toBe(1000);
    expect(partialLoss.baseAmount).toBeLessThan(fullLoss.baseAmount);
  });

  it('adds sibling bonus correctly', () => {
    const standard = calculateElterngeld({
      monthlyNetBeforeBirth: 2000,
      monthlyNetAfterBirth: 0,
      mode: 'basis',
      durationMonths: 12,
      siblingBonus: false,
    });
    const withBonus = calculateElterngeld({
      monthlyNetBeforeBirth: 2000,
      monthlyNetAfterBirth: 0,
      mode: 'basis',
      durationMonths: 12,
      siblingBonus: true,
    });

    expect(withBonus.siblingBonus).toBeGreaterThan(0);
    expect(withBonus.finalMonthly).toBe(standard.finalMonthly + withBonus.siblingBonus);
  });
});
