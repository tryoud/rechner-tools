import { describe, expect, it } from 'vitest';
import { calculateNebenkosten } from './calculators';

describe('nebenkosten calculator tests', () => {
  it('clamps heizkosten distribution to HeizkostenV bounds', () => {
    const belowBounds = calculateNebenkosten({
      annualHeatingCost: 12000,
      consumptionSharePercent: 30, // Should clamp to 50
      apartmentSizeSqm: 70,
      buildingSizeSqm: 700,
      ownConsumptionUnits: 800,
      totalConsumptionUnits: 10000,
      heatingSystem: 'gas',
    });

    const aboveBounds = calculateNebenkosten({
      annualHeatingCost: 12000,
      consumptionSharePercent: 80, // Should clamp to 70
      apartmentSizeSqm: 70,
      buildingSizeSqm: 700,
      ownConsumptionUnits: 800,
      totalConsumptionUnits: 10000,
      heatingSystem: 'gas',
    });

    expect(belowBounds.consumptionShare).toBe(50);
    expect(aboveBounds.consumptionShare).toBe(70);
  });

  it('correctly calculates high personal consumption vs low', () => {
    const lowConsumer = calculateNebenkosten({
      annualHeatingCost: 10000,
      consumptionSharePercent: 70,
      apartmentSizeSqm: 100,
      buildingSizeSqm: 1000,
      ownConsumptionUnits: 50,
      totalConsumptionUnits: 1000,
      heatingSystem: 'gas',
    });
    const highConsumer = calculateNebenkosten({
      annualHeatingCost: 10000,
      consumptionSharePercent: 70,
      apartmentSizeSqm: 100,
      buildingSizeSqm: 1000,
      ownConsumptionUnits: 200, // 20% of consumption units despite 10% area
      totalConsumptionUnits: 1000,
      heatingSystem: 'gas',
    });

    expect(highConsumer.usagePart).toBeGreaterThan(lowConsumer.usagePart);
    expect(highConsumer.basePart).toBe(lowConsumer.basePart);
  });

  it('applies heat pump reduction', () => {
    const gas = calculateNebenkosten({
      annualHeatingCost: 10000,
      consumptionSharePercent: 70,
      apartmentSizeSqm: 100,
      buildingSizeSqm: 1000,
      ownConsumptionUnits: 100,
      totalConsumptionUnits: 1000,
      heatingSystem: 'gas',
    });
    const heatPump = calculateNebenkosten({
      annualHeatingCost: 10000,
      consumptionSharePercent: 70,
      apartmentSizeSqm: 100,
      buildingSizeSqm: 1000,
      ownConsumptionUnits: 100,
      totalConsumptionUnits: 1000,
      heatingSystem: 'heat-pump',
    });

    expect(gas.heatPumpEstimate).toBeLessThan(gas.currentEstimate);
    // For heat-pump system itself, currentEstimate should equal heatPumpEstimate
    expect(heatPump.currentEstimate).toBe(heatPump.heatPumpEstimate);
  });
});
