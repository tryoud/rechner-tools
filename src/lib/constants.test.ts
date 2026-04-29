import { describe, expect, it } from 'vitest';
import { ELTERNGELD_CONFIG_2026, SOCIAL_CONFIG_2026 } from './year-config';

describe('verified 2026 constants tests', () => {
  it('matches official 2026 tax and social ceilings', () => {
    expect(SOCIAL_CONFIG_2026.tax.basicAllowance).toBe(12348);
    expect(SOCIAL_CONFIG_2026.tax.childAllowance).toBe(9756);
    expect(SOCIAL_CONFIG_2026.socialSecurity.healthCareCapMonthly).toBe(5812.5);
    expect(SOCIAL_CONFIG_2026.socialSecurity.pensionCapMonthly).toBe(8450);
    expect(SOCIAL_CONFIG_2026.carBenefit.electricListPriceCap).toBe(100000);
  });

  it('matches official 2026 elterngeld limits', () => {
    expect(ELTERNGELD_CONFIG_2026.baseMin).toBe(300);
    expect(ELTERNGELD_CONFIG_2026.baseMax).toBe(1800);
    expect(ELTERNGELD_CONFIG_2026.plusMin).toBe(150);
    expect(ELTERNGELD_CONFIG_2026.plusMax).toBe(900);
  });
});
