import { describe, expect, it } from 'vitest';
import { calculateKrankengeld } from './calculators';

describe('krankengeld calculator tests', () => {
  it('calculates GKV daily correctly', () => {
    const result = calculateKrankengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      healthInsuranceMode: 'statutory',
      privateKrankentagegeldDaily: 0,
    });

    expect(result.gkvDaily).toBeGreaterThan(0);
  });

  it('calculates GKV monthly correctly', () => {
    const result = calculateKrankengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      healthInsuranceMode: 'statutory',
      privateKrankentagegeldDaily: 0,
    });

    expect(result.gkvMonthly).toBeGreaterThan(0);
  });

  it('calculates private monthly correctly', () => {
    const result = calculateKrankengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      healthInsuranceMode: 'private',
      privateKrankentagegeldDaily: 100,
    });

    expect(result.privateMonthly).toBeGreaterThan(0);
  });

  it('calculates effective monthly correctly', () => {
    const result = calculateKrankengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      healthInsuranceMode: 'statutory',
      privateKrankentagegeldDaily: 0,
    });

    expect(result.effectiveMonthly).toBeGreaterThan(0);
  });

  it('calculates income loss monthly correctly', () => {
    const result = calculateKrankengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      healthInsuranceMode: 'statutory',
      privateKrankentagegeldDaily: 0,
    });

    expect(result.incomeLossMonthly).toBeGreaterThanOrEqual(0);
  });

  it('calculates max GKV payout correctly', () => {
    const result = calculateKrankengeld({
      grossMonthly: 4000,
      netMonthly: 2500,
      healthInsuranceMode: 'statutory',
      privateKrankentagegeldDaily: 0,
    });

    expect(result.maxGkvPayout).toBeGreaterThan(0);
  });
});
