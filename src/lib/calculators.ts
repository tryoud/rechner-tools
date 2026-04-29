import {
  ELTERNGELD_CONFIG_2026,
  GEWERBESTEUER_CONFIG,
  KAPITALERTRAG_CONFIG_2026,
  KRANKENGELD_CONFIG_2026,
  MIETPREISBREMSE_CONFIG,
  NEBENKOSTEN_CONFIG,
  RENTEN_CONFIG_2026,
  SOCIAL_CONFIG_2026,
  STUNDENSATZ_DEFAULTS,
} from './year-config';

export type TaxClass = '1' | '2' | '3' | '4' | '5' | '6';
export type FederalState =
  | 'bw'
  | 'by'
  | 'be'
  | 'bb'
  | 'hb'
  | 'hh'
  | 'he'
  | 'mv'
  | 'ni'
  | 'nw'
  | 'rp'
  | 'sl'
  | 'sn'
  | 'st'
  | 'sh'
  | 'th';

export interface StundensatzInputs {
  desiredNetMonthly: number;
  taxRatePercent: number;
  vatMode: 'small-business' | 'standard';
  healthInsuranceMode: 'statutory' | 'private';
  privateHealthMonthly: number;
  fixedCostsMonthly: number;
  pensionReserveMonthly: number;
  profitMarginPercent: number;
  utilizationPercent: number;
  billableHoursPerDay: number;
  vacationDays: number;
  sickDays: number;
  adminDaysPerMonth: number;
}

export interface BruttoNettoInputs {
  grossMonthly: number;
  taxClass: TaxClass;
  state: FederalState;
  churchTax: boolean;
  childrenUnder25: number;
  healthInsuranceMode: 'statutory' | 'private';
  additionalHealthRatePercent: number;
  privateHealthMonthly: number;
  companyCarMode: 'none' | 'regular' | 'electric';
  companyCarListPrice: number;
}

export interface ElterngeldInputs {
  monthlyNetBeforeBirth: number;
  monthlyNetAfterBirth: number;
  mode: 'basis' | 'plus';
  durationMonths: number;
  siblingBonus: boolean;
}

export interface GewerbesteuerInputs {
  profit: number;
  legalForm: 'individual' | 'gmbh';
  hebesatz: number;
  interestExpenses: number;
  rentExpenses: number;
}

export interface SonderzahlungInputs {
  grossMonthly: number;
  bonusAmount: number;
  taxClass: TaxClass;
  healthInsuranceMode: 'statutory' | 'private';
}

export type FilingStatus = 'single' | 'married';

export interface KapitalertragInputs {
  capitalIncome: number;
  losses: number;
  filingStatus: FilingStatus;
  churchTaxRate: 0 | 8 | 9;
}

export interface MietpreisbremseInputs {
  currentRentMonthly: number;
  comparableRentMonthly: number;
  apartmentSizeSqm: number;
  preExistingRent: number;
  modernizationCostPerSqm: number;
  isExempt: boolean;
}

export interface AbfindungInputs {
  grossMonthly: number;
  yearsOfService: number;
  severanceAmount: number;
  taxClass: TaxClass;
}

export interface RentenInputs {
  currentAge: number;
  retirementAge: number;
  currentGrossMonthly: number;
  earnedPointsSoFar: number;
  annualIncomeGrowthPercent: number;
}

export interface KrankengeldInputs {
  grossMonthly: number;
  netMonthly: number;
  healthInsuranceMode: 'statutory' | 'private';
  privateKrankentagegeldDaily: number;
}

export interface NebenkostenInputs {
  annualHeatingCost: number;
  consumptionSharePercent: number;
  apartmentSizeSqm: number;
  buildingSizeSqm: number;
  ownConsumptionUnits: number;
  totalConsumptionUnits: number;
  heatingSystem: 'gas' | 'district' | 'heat-pump';
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function floorEuro(value: number) {
  return Math.floor(Math.max(value, 0));
}

function getChurchTaxRate(state: FederalState) {
  return state === 'by' || state === 'bw' ? 0.08 : 0.09;
}

function incomeTax2026Basic(zve: number) {
  const x = floorEuro(zve);
  const { basicAllowance, thresholds } = SOCIAL_CONFIG_2026.tax;

  if (x <= basicAllowance) {
    return 0;
  }

  if (x < thresholds.progressionStart) {
    const y = (x - basicAllowance) / 10000;
    return floorEuro((914.51 * y + 1400) * y);
  }

  if (x < thresholds.progressionEnd) {
    const y = (x - thresholds.progressionStart) / 10000;
    return floorEuro((173.1 * y + 2397) * y + 1034.87);
  }

  if (x < thresholds.richTaxStart) {
    return floorEuro(x * 0.42 - 11135.63);
  }

  return floorEuro(x * 0.45 - 19470.38);
}

function incomeTax2026ForClass(zve: number, taxClass: TaxClass) {
  switch (taxClass) {
    case '2':
      return incomeTax2026Basic(Math.max(zve - 4260, 0));
    case '3':
      return incomeTax2026Basic(zve / 2) * 2;
    case '5':
      return Math.max(0, 2 * (incomeTax2026Basic(zve * 1.25) - incomeTax2026Basic(zve * 0.75)));
    case '6':
      return incomeTax2026Basic(zve + SOCIAL_CONFIG_2026.tax.basicAllowance);
    default:
      return incomeTax2026Basic(zve);
  }
}

function solidaritySurcharge(incomeTax: number, taxClass: TaxClass) {
  const threshold = taxClass === '3' ? 20350 * 2 : 20350;

  if (incomeTax <= threshold) {
    return 0;
  }

  return Math.max(0, Math.min(incomeTax * 0.055, (incomeTax - threshold) * 0.119));
}

function getCareEmployeeRate(childrenUnder25: number, state: FederalState) {
  const care = SOCIAL_CONFIG_2026.socialSecurity.care;

  if (childrenUnder25 <= 0) {
    return state === 'sn' ? care.sachsenChildlessEmployeeRate : care.childlessEmployeeRate;
  }

  const clampedChildren = clamp(childrenUnder25, 1, 5);
  const standardRate = care.parentRatesByChildren[clampedChildren as 1 | 2 | 3 | 4 | 5];

  if (state === 'sn') {
    return standardRate + (care.sachsenEmployeeRate - care.defaultEmployeeRate);
  }

  return standardRate;
}

function getCompanyCarBenefitMonthly(input: BruttoNettoInputs) {
  if (input.companyCarMode === 'none' || input.companyCarListPrice <= 0) {
    return 0;
  }

  if (input.companyCarMode === 'electric') {
    if (input.companyCarListPrice <= SOCIAL_CONFIG_2026.carBenefit.electricListPriceCap) {
      return input.companyCarListPrice * SOCIAL_CONFIG_2026.carBenefit.electricRate;
    }
    return input.companyCarListPrice * 0.005;
  }

  return input.companyCarListPrice * SOCIAL_CONFIG_2026.carBenefit.regularRate;
}

export function calculateStundensatz(input: StundensatzInputs) {
  const netAnnual = input.desiredNetMonthly * 12;
  const grossNeedBeforeTax = netAnnual / (1 - input.taxRatePercent / 100);
  const healthAnnual =
    input.healthInsuranceMode === 'statutory'
      ? grossNeedBeforeTax * 0.188
      : input.privateHealthMonthly * 12;
  const fixedAnnual = input.fixedCostsMonthly * 12;
  const pensionAnnual = input.pensionReserveMonthly * 12;
  const adminDaysAnnual = input.adminDaysPerMonth * 12;
  const workingDays =
    STUNDENSATZ_DEFAULTS.workingDaysPerYear - input.vacationDays - input.sickDays - adminDaysAnnual;
  const billableDays = Math.max(workingDays * (input.utilizationPercent / 100), 0);
  const billableHours = Math.max(billableDays * input.billableHoursPerDay, 0);
  const revenueTargetBeforeMargin = grossNeedBeforeTax + healthAnnual + fixedAnnual + pensionAnnual;
  const revenueTarget = revenueTargetBeforeMargin / (1 - input.profitMarginPercent / 100);
  const netRate = billableHours > 0 ? revenueTarget / billableHours : 0;
  const grossRate = input.vatMode === 'standard' ? netRate * 1.19 : netRate;

  return {
    netAnnual,
    grossNeedBeforeTax,
    healthAnnual,
    fixedAnnual,
    pensionAnnual,
    adminDaysAnnual,
    workingDays,
    billableDays,
    billableHours,
    revenueTarget,
    netRate: roundCurrency(netRate),
    grossRate: roundCurrency(grossRate),
    dayRate: roundCurrency(netRate * input.billableHoursPerDay),
  };
}

export function calculateBruttoNetto(input: BruttoNettoInputs) {
  const taxableCarBenefitMonthly = getCompanyCarBenefitMonthly(input);
  const taxableMonthlyGross = input.grossMonthly + taxableCarBenefitMonthly;

  const cappedPensionBase = Math.min(
    taxableMonthlyGross,
    SOCIAL_CONFIG_2026.socialSecurity.pensionCapMonthly
  );
  const cappedHealthBase = Math.min(
    taxableMonthlyGross,
    SOCIAL_CONFIG_2026.socialSecurity.healthCareCapMonthly
  );

  const pensionMonthly = cappedPensionBase * SOCIAL_CONFIG_2026.socialSecurity.pensionEmployeeRate;
  const unemploymentMonthly =
    cappedPensionBase * SOCIAL_CONFIG_2026.socialSecurity.unemploymentEmployeeRate;
  const healthMonthly =
    input.healthInsuranceMode === 'statutory'
      ? cappedHealthBase *
        (SOCIAL_CONFIG_2026.socialSecurity.statutoryHealthBaseEmployeeRate +
          input.additionalHealthRatePercent / 200)
      : input.privateHealthMonthly;
  const careMonthly =
    input.healthInsuranceMode === 'statutory'
      ? cappedHealthBase * getCareEmployeeRate(input.childrenUnder25, input.state)
      : 0;

  const employeeSocialMonthly = pensionMonthly + unemploymentMonthly + healthMonthly + careMonthly;
  const employeeTaxDeductibleMonthly = pensionMonthly + healthMonthly + careMonthly;
  const annualTaxableIncome = Math.max(
    (taxableMonthlyGross - employeeTaxDeductibleMonthly) * 12,
    0
  );
  const incomeTaxAnnual = incomeTax2026ForClass(annualTaxableIncome, input.taxClass);

  let childAllowanceMultiplier = input.childrenUnder25;
  if (['1', '4', '5', '6'].includes(input.taxClass)) {
    childAllowanceMultiplier = input.childrenUnder25 / 2;
  }
  const childAllowanceDeduction = childAllowanceMultiplier * SOCIAL_CONFIG_2026.tax.childAllowance;
  const zveForSoliKiSt = Math.max(0, annualTaxableIncome - childAllowanceDeduction);
  const taxForSoliKiSt = incomeTax2026ForClass(zveForSoliKiSt, input.taxClass);

  const solidarityAnnual = solidaritySurcharge(taxForSoliKiSt, input.taxClass);
  const churchAnnual = input.churchTax ? taxForSoliKiSt * getChurchTaxRate(input.state) : 0;

  const netMonthly =
    input.grossMonthly -
    employeeSocialMonthly -
    (incomeTaxAnnual + solidarityAnnual + churchAnnual) / 12;

  return {
    taxableCarBenefitMonthly: roundCurrency(taxableCarBenefitMonthly),
    taxableMonthlyGross: roundCurrency(taxableMonthlyGross),
    pensionMonthly: roundCurrency(pensionMonthly),
    unemploymentMonthly: roundCurrency(unemploymentMonthly),
    healthMonthly: roundCurrency(healthMonthly),
    careMonthly: roundCurrency(careMonthly),
    employeeSocialMonthly: roundCurrency(employeeSocialMonthly),
    incomeTaxAnnual: roundCurrency(incomeTaxAnnual),
    solidarityAnnual: roundCurrency(solidarityAnnual),
    churchAnnual: roundCurrency(churchAnnual),
    netMonthly: roundCurrency(netMonthly),
    netAnnual: roundCurrency(netMonthly * 12),
  };
}

function getElterngeldRate(monthlyNetBeforeBirth: number) {
  if (monthlyNetBeforeBirth >= 1240) {
    return 0.65;
  }

  if (monthlyNetBeforeBirth >= 1200) {
    return 0.65 + (1240 - monthlyNetBeforeBirth) * 0.0005;
  }

  if (monthlyNetBeforeBirth >= 1000) {
    return 0.67;
  }

  return clamp(0.67 + (1000 - monthlyNetBeforeBirth) * 0.0005, 0.67, 1);
}

export function calculateElterngeld(input: ElterngeldInputs) {
  const replacementRate = getElterngeldRate(input.monthlyNetBeforeBirth);
  const incomeLoss = Math.max(input.monthlyNetBeforeBirth - input.monthlyNetAfterBirth, 0);
  const baseAmount = clamp(
    incomeLoss * replacementRate,
    ELTERNGELD_CONFIG_2026.baseMin,
    ELTERNGELD_CONFIG_2026.baseMax
  );
  const plusAmount = clamp(
    baseAmount / 2,
    ELTERNGELD_CONFIG_2026.plusMin,
    ELTERNGELD_CONFIG_2026.plusMax
  );
  const selectedAmount = input.mode === 'basis' ? baseAmount : plusAmount;
  const siblingMinimum =
    input.mode === 'basis'
      ? ELTERNGELD_CONFIG_2026.siblingBonusMinBase
      : ELTERNGELD_CONFIG_2026.siblingBonusMinPlus;
  const siblingBonus = input.siblingBonus
    ? Math.max(selectedAmount * ELTERNGELD_CONFIG_2026.siblingBonusRate, siblingMinimum)
    : 0;
  const finalMonthly = selectedAmount + siblingBonus;
  const recommendedDuration = input.mode === 'basis' ? 12 : 24;

  return {
    replacementRate,
    incomeLoss,
    baseAmount: roundCurrency(baseAmount),
    plusAmount: roundCurrency(plusAmount),
    siblingBonus: roundCurrency(siblingBonus),
    finalMonthly: roundCurrency(finalMonthly),
    durationMonths: input.durationMonths,
    totalPayout: roundCurrency(finalMonthly * input.durationMonths),
    recommendedDuration,
  };
}

export function calculateGewerbesteuer(input: GewerbesteuerInputs) {
  const cfg = GEWERBESTEUER_CONFIG;
  const freibetrag = input.legalForm === 'individual' ? cfg.freibetragEinzel : 0;

  const hinzurechnungBase = input.interestExpenses + input.rentExpenses;
  const hinzurechnungUeberschuss = Math.max(hinzurechnungBase - cfg.hinzurechnungFreibetrag, 0);
  const zinsenAnteil =
    hinzurechnungUeberschuss > 0
      ? Math.min(input.interestExpenses, hinzurechnungUeberschuss) * cfg.hinzurechnungZinsenRate
      : 0;
  const mietenAnteil =
    hinzurechnungUeberschuss > 0
      ? Math.min(
          input.rentExpenses,
          Math.max(hinzurechnungUeberschuss - input.interestExpenses, 0)
        ) * cfg.hinzurechnungMietenRate
      : 0;
  const hinzurechnungen = zinsenAnteil + mietenAnteil;

  const gewerbeertrag = input.profit + hinzurechnungen;
  const steuerpflichtigerErtrag = Math.max(Math.floor((gewerbeertrag - freibetrag) / 100) * 100, 0);
  const steuermessbetrag = steuerpflichtigerErtrag * cfg.steuermesszahl;
  const gewerbesteuer = steuermessbetrag * (input.hebesatz / 100);

  // Anrechnung auf ESt für Einzelunternehmer (§ 35 EStG)
  const estAnrechnung =
    input.legalForm === 'individual'
      ? Math.min(gewerbesteuer, steuermessbetrag * cfg.estAnrechnungsfaktor)
      : 0;
  const effectiveBurden = Math.max(gewerbesteuer - estAnrechnung, 0);
  const effectiveRate = input.profit > 0 ? gewerbesteuer / input.profit : 0;

  return {
    hinzurechnungen: roundCurrency(hinzurechnungen),
    gewerbeertrag: roundCurrency(gewerbeertrag),
    freibetrag,
    steuerpflichtigerErtrag,
    steuermessbetrag: roundCurrency(steuermessbetrag),
    gewerbesteuer: roundCurrency(gewerbesteuer),
    estAnrechnung: roundCurrency(estAnrechnung),
    effectiveBurden: roundCurrency(effectiveBurden),
    effectiveRate: roundCurrency(effectiveRate * 100),
  };
}

export function calculateSonderzahlung(input: SonderzahlungInputs) {
  const annualGross = input.grossMonthly * 12;

  // Einkommensteuer ohne Bonus
  const t1 = incomeTax2026ForClass(annualGross, input.taxClass);
  // Einkommensteuer mit Bonus (Hochrechnungsmethode für sonstige Bezüge)
  const t2 = incomeTax2026ForClass(annualGross + input.bonusAmount, input.taxClass);
  const incomeTaxOnBonus = Math.max(t2 - t1, 0);

  const soli1 = solidaritySurcharge(t1, input.taxClass);
  const soli2 = solidaritySurcharge(t2, input.taxClass);
  const soliOnBonus = Math.max(soli2 - soli1, 0);

  // Sozialversicherung auf Bonus (bis BBG-Rest)
  const cappedBonus = Math.min(
    input.bonusAmount,
    Math.max(SOCIAL_CONFIG_2026.socialSecurity.pensionCapMonthly - input.grossMonthly, 0)
  );
  const pensionOnBonus =
    input.healthInsuranceMode === 'statutory'
      ? cappedBonus * SOCIAL_CONFIG_2026.socialSecurity.pensionEmployeeRate
      : 0;
  const unemploymentOnBonus =
    input.healthInsuranceMode === 'statutory'
      ? cappedBonus * SOCIAL_CONFIG_2026.socialSecurity.unemploymentEmployeeRate
      : 0;
  const healthCappedBonus = Math.min(
    input.bonusAmount,
    Math.max(SOCIAL_CONFIG_2026.socialSecurity.healthCareCapMonthly - input.grossMonthly, 0)
  );
  const healthOnBonus =
    input.healthInsuranceMode === 'statutory'
      ? healthCappedBonus *
        (SOCIAL_CONFIG_2026.socialSecurity.statutoryHealthBaseEmployeeRate +
          SOCIAL_CONFIG_2026.socialSecurity.averageAdditionalHealthEmployeeRate)
      : 0;
  const careOnBonus =
    input.healthInsuranceMode === 'statutory'
      ? healthCappedBonus * SOCIAL_CONFIG_2026.socialSecurity.care.childlessEmployeeRate
      : 0;

  const socialOnBonus = pensionOnBonus + unemploymentOnBonus + healthOnBonus + careOnBonus;
  const totalDeductions = incomeTaxOnBonus + soliOnBonus + socialOnBonus;
  const netBonus = Math.max(input.bonusAmount - totalDeductions, 0);
  const effectiveNetRate = input.bonusAmount > 0 ? netBonus / input.bonusAmount : 0;

  return {
    incomeTaxOnBonus: roundCurrency(incomeTaxOnBonus),
    soliOnBonus: roundCurrency(soliOnBonus),
    socialOnBonus: roundCurrency(socialOnBonus),
    pensionOnBonus: roundCurrency(pensionOnBonus),
    unemploymentOnBonus: roundCurrency(unemploymentOnBonus),
    healthOnBonus: roundCurrency(healthOnBonus),
    careOnBonus: roundCurrency(careOnBonus),
    totalDeductions: roundCurrency(totalDeductions),
    netBonus: roundCurrency(netBonus),
    effectiveNetRate: roundCurrency(effectiveNetRate * 100),
  };
}

export function calculateKapitalertrag(input: KapitalertragInputs) {
  const cfg = KAPITALERTRAG_CONFIG_2026;
  const pauschbetrag =
    input.filingStatus === 'married' ? cfg.sparerpauschbetragMarried : cfg.sparerpauschbetragSingle;
  const netLosses = Math.max(input.losses, 0);
  const taxableIncome = Math.max(input.capitalIncome - netLosses - pauschbetrag, 0);

  let abgeltungsteuer: number;
  let kirchensteuer: number;

  if (input.churchTaxRate > 0) {
    const kRate = input.churchTaxRate / 100;
    abgeltungsteuer =
      (taxableIncome * cfg.abgeltungsteuerRate) / (1 + cfg.abgeltungsteuerRate * kRate);
    kirchensteuer = abgeltungsteuer * kRate;
  } else {
    abgeltungsteuer = taxableIncome * cfg.abgeltungsteuerRate;
    kirchensteuer = 0;
  }

  const soli = abgeltungsteuer * cfg.soliRate;
  const totalTax = abgeltungsteuer + soli + kirchensteuer;
  const netPayout = Math.max(input.capitalIncome - netLosses - totalTax, 0);
  const effectiveRate =
    taxableIncome > 0 ? totalTax / Math.max(input.capitalIncome - netLosses, 1) : 0;

  return {
    pauschbetrag,
    taxableIncome: roundCurrency(taxableIncome),
    abgeltungsteuer: roundCurrency(abgeltungsteuer),
    soli: roundCurrency(soli),
    kirchensteuer: roundCurrency(kirchensteuer),
    totalTax: roundCurrency(totalTax),
    netPayout: roundCurrency(netPayout),
    effectiveRate: roundCurrency(effectiveRate * 100),
  };
}

export function calculateMietpreisbremse(input: MietpreisbremseInputs) {
  const cfg = MIETPREISBREMSE_CONFIG;

  const baseMax = input.comparableRentMonthly * (1 + cfg.maxSurchargeRate);

  const modernizationSurchargeRaw =
    input.modernizationCostPerSqm > 0
      ? (input.modernizationCostPerSqm * cfg.modernizationYearlyRate) / 12
      : 0;
  const modernizationSurcharge = Math.min(modernizationSurchargeRaw, cfg.modernizationCapPerSqm);
  const modernizationSurchargeTotal = modernizationSurcharge * input.apartmentSizeSqm;

  const preExistingCap = input.preExistingRent > baseMax ? input.preExistingRent : 0;
  const maxAllowedRent = Math.max(baseMax, preExistingCap) + modernizationSurchargeTotal;

  const overchargeMonthly = input.isExempt
    ? 0
    : Math.max(input.currentRentMonthly - maxAllowedRent, 0);
  const overchargeAnnual = overchargeMonthly * 12;
  const rentPerSqm =
    input.apartmentSizeSqm > 0 ? input.currentRentMonthly / input.apartmentSizeSqm : 0;
  const maxRentPerSqm = input.apartmentSizeSqm > 0 ? maxAllowedRent / input.apartmentSizeSqm : 0;
  const isCompliant = overchargeMonthly === 0;

  return {
    baseMax: roundCurrency(baseMax),
    modernizationSurchargeTotal: roundCurrency(modernizationSurchargeTotal),
    maxAllowedRent: roundCurrency(maxAllowedRent),
    overchargeMonthly: roundCurrency(overchargeMonthly),
    overchargeAnnual: roundCurrency(overchargeAnnual),
    rentPerSqm: roundCurrency(rentPerSqm),
    maxRentPerSqm: roundCurrency(maxRentPerSqm),
    isCompliant,
    isExempt: input.isExempt,
  };
}

export function calculateAbfindung(input: AbfindungInputs) {
  const annualGross = input.grossMonthly * 12;

  // Basis: Einkommensteuer auf reguläres Jahresgehalt
  const t1 = incomeTax2026ForClass(annualGross, input.taxClass);

  // Fünftelregel: T2 = Steuer auf Jahresgehalt + 1/5 der Abfindung
  const t2 = incomeTax2026ForClass(annualGross + input.severanceAmount / 5, input.taxClass);
  const taxFuenftelregel = 5 * (t2 - t1);
  const soliOnFuenftel =
    solidaritySurcharge(taxFuenftelregel + t1, input.taxClass) -
    solidaritySurcharge(t1, input.taxClass);
  const totalTaxFuenftel = taxFuenftelregel + soliOnFuenftel;

  // Vergleich: normale Besteuerung (Abfindung on top)
  const taxNormal = incomeTax2026ForClass(annualGross + input.severanceAmount, input.taxClass);
  const taxNormalOnSeverance = taxNormal - t1;
  const soliNormal =
    solidaritySurcharge(taxNormal, input.taxClass) - solidaritySurcharge(t1, input.taxClass);
  const totalTaxNormal = taxNormalOnSeverance + soliNormal;

  const saving = Math.max(totalTaxNormal - totalTaxFuenftel, 0);
  const netFuenftel = input.severanceAmount - totalTaxFuenftel;
  const netNormal = input.severanceAmount - totalTaxNormal;
  const formulaAmount = input.grossMonthly * input.yearsOfService * 0.5;
  const effectiveRateFuenftel =
    input.severanceAmount > 0 ? totalTaxFuenftel / input.severanceAmount : 0;

  return {
    formulaAmount: roundCurrency(formulaAmount),
    taxFuenftelregel: roundCurrency(taxFuenftelregel),
    soliOnFuenftel: roundCurrency(soliOnFuenftel),
    totalTaxFuenftel: roundCurrency(totalTaxFuenftel),
    totalTaxNormal: roundCurrency(totalTaxNormal),
    saving: roundCurrency(saving),
    netFuenftel: roundCurrency(netFuenftel),
    netNormal: roundCurrency(netNormal),
    effectiveRateFuenftel: roundCurrency(effectiveRateFuenftel * 100),
  };
}

export function calculateRente(input: RentenInputs) {
  const cfg = RENTEN_CONFIG_2026;
  const durchschnittMonthly = cfg.durchschnittsentgeltAnnual / 12;
  const cappedGross = Math.min(
    input.currentGrossMonthly,
    SOCIAL_CONFIG_2026.socialSecurity.pensionCapMonthly
  );
  const pointsPerYearNow = (cappedGross * 12) / cfg.durchschnittsentgeltAnnual;

  const yearsUntilRetirement = Math.max(input.retirementAge - input.currentAge, 0);
  const growthFactor = 1 + input.annualIncomeGrowthPercent / 100;

  let futurePoints = 0;
  let annualGross = input.currentGrossMonthly * 12;
  for (let y = 0; y < yearsUntilRetirement; y++) {
    const cappedAnnual = Math.min(
      annualGross,
      SOCIAL_CONFIG_2026.socialSecurity.pensionCapMonthly * 12
    );
    futurePoints += cappedAnnual / cfg.durchschnittsentgeltAnnual;
    annualGross *= growthFactor;
  }

  const totalPoints = input.earnedPointsSoFar + futurePoints;

  const monthsVsStandard = (input.retirementAge - cfg.standardRetirementAge) * 12;
  let zugangsfaktor: number;
  if (monthsVsStandard < 0) {
    zugangsfaktor = Math.max(1 + monthsVsStandard * cfg.abschlagPerMonth, 0.856);
  } else {
    zugangsfaktor = 1 + monthsVsStandard * cfg.bonusPerMonth;
  }

  const monthlyPension = totalPoints * cfg.rentenwert * zugangsfaktor;
  const pensionContributionMonthly =
    Math.min(input.currentGrossMonthly, SOCIAL_CONFIG_2026.socialSecurity.pensionCapMonthly) *
    cfg.employeeRate;

  return {
    yearsUntilRetirement,
    pointsPerYearNow: roundCurrency(pointsPerYearNow),
    futurePoints: roundCurrency(futurePoints),
    totalPoints: roundCurrency(totalPoints),
    zugangsfaktor: roundCurrency(zugangsfaktor),
    monthlyPension: roundCurrency(monthlyPension),
    annualPension: roundCurrency(monthlyPension * 12),
    pensionContributionMonthly: roundCurrency(pensionContributionMonthly),
    rentenwert: cfg.rentenwert,
    durchschnittMonthly: roundCurrency(durchschnittMonthly),
  };
}

export function calculateKrankengeld(input: KrankengeldInputs) {
  const cfg = KRANKENGELD_CONFIG_2026;

  const dailyGross = input.grossMonthly / cfg.daysPerMonth;
  const cappedDailyGross = Math.min(dailyGross, cfg.healthCareCapMonthly / cfg.daysPerMonth);
  const dailyNet = input.netMonthly / cfg.daysPerMonth;

  const gkvDailyRaw = cappedDailyGross * cfg.krankengeldRate;
  const gkvDailyCapped = Math.min(gkvDailyRaw, dailyNet * cfg.maxNetRate);
  const gkvDaily = Math.max(gkvDailyCapped, 0);
  const gkvMonthly = gkvDaily * cfg.daysPerMonth;

  const privateDailyKgt =
    input.healthInsuranceMode === 'private' ? input.privateKrankentagegeldDaily : 0;
  const privateMonthly = privateDailyKgt * cfg.daysPerMonth;

  const effectiveMonthly = input.healthInsuranceMode === 'statutory' ? gkvMonthly : privateMonthly;
  const incomeLossMonthly = Math.max(input.grossMonthly - effectiveMonthly, 0);

  const gkvDurationDays = cfg.maxDurationWeeks * 7 - cfg.entgeltfortzahlungWeeks * 7;
  const maxGkvPayout = gkvDaily * gkvDurationDays;

  return {
    gkvDaily: roundCurrency(gkvDaily),
    gkvMonthly: roundCurrency(gkvMonthly),
    privateMonthly: roundCurrency(privateMonthly),
    effectiveMonthly: roundCurrency(effectiveMonthly),
    incomeLossMonthly: roundCurrency(incomeLossMonthly),
    gkvDurationWeeks: cfg.maxDurationWeeks - cfg.entgeltfortzahlungWeeks,
    maxGkvPayout: roundCurrency(maxGkvPayout),
    entgeltfortzahlungWeeks: cfg.entgeltfortzahlungWeeks,
  };
}

export function calculateNebenkosten(input: NebenkostenInputs) {
  const consumptionShare = clamp(
    input.consumptionSharePercent,
    NEBENKOSTEN_CONFIG.heatingShareMin,
    NEBENKOSTEN_CONFIG.heatingShareMax
  );
  const areaShare = Math.min(input.apartmentSizeSqm / Math.max(input.buildingSizeSqm, 1), 1);
  const usageShare = Math.min(
    input.ownConsumptionUnits / Math.max(input.totalConsumptionUnits, 1),
    1
  );
  const basePart = input.annualHeatingCost * ((100 - consumptionShare) / 100) * areaShare;
  const usagePart = input.annualHeatingCost * (consumptionShare / 100) * usageShare;
  const currentEstimate = basePart + usagePart;
  const benchmark2021 =
    (NEBENKOSTEN_CONFIG.benchmark.year2021For70sqm / 70) * input.apartmentSizeSqm;
  const benchmark2024 =
    (NEBENKOSTEN_CONFIG.benchmark.year2024For70sqm / 70) * input.apartmentSizeSqm;
  const heatPumpEstimate =
    input.heatingSystem === 'heat-pump'
      ? currentEstimate
      : currentEstimate * (1 - NEBENKOSTEN_CONFIG.heatPumpReductionRate);

  return {
    consumptionShare,
    areaShare: roundCurrency(areaShare * 100),
    usageShare: roundCurrency(usageShare * 100),
    basePart: roundCurrency(basePart),
    usagePart: roundCurrency(usagePart),
    currentEstimate: roundCurrency(currentEstimate),
    benchmark2021: roundCurrency(benchmark2021),
    benchmark2024: roundCurrency(benchmark2024),
    heatPumpEstimate: roundCurrency(heatPumpEstimate),
  };
}

export interface KreditrechnerInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  extraPaymentMonthly: number;
}

export interface AmortizationYear {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateKredit(input: KreditrechnerInputs) {
  const monthlyInterestRate = input.interestRate / 100 / 12;
  const loanTermMonths = input.loanTerm * 12;

  let monthlyPayment: number;
  if (monthlyInterestRate === 0) {
    monthlyPayment = input.loanAmount / loanTermMonths;
  } else {
    monthlyPayment =
      (input.loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
  }

  let balance = input.loanAmount;
  let totalPaid = 0;
  let totalInterest = 0;
  let actualMonths = 0;

  const yearlyData: AmortizationYear[] = [];
  let yearPrincipal = 0;
  let yearInterest = 0;
  let currentYear = 1;

  for (let m = 1; m <= loanTermMonths && balance > 0.005; m++) {
    const interestPayment = balance * monthlyInterestRate;
    const basePrincipal = Math.max(monthlyPayment - interestPayment, 0);
    const totalPrincipal = Math.min(basePrincipal + input.extraPaymentMonthly, balance);

    totalInterest += interestPayment;
    totalPaid += interestPayment + totalPrincipal;
    yearInterest += interestPayment;
    yearPrincipal += totalPrincipal;
    balance -= totalPrincipal;
    actualMonths = m;

    if (balance < 0.005) balance = 0;

    const isYearEnd = m % 12 === 0;
    const isLoanDone = balance === 0;

    if (isYearEnd || isLoanDone) {
      yearlyData.push({
        year: currentYear,
        principal: roundCurrency(yearPrincipal),
        interest: roundCurrency(yearInterest),
        balance: roundCurrency(balance),
      });
      currentYear++;
      yearPrincipal = 0;
      yearInterest = 0;
      if (isLoanDone && !isYearEnd) break;
    }
  }

  return {
    monthlyPayment: roundCurrency(monthlyPayment),
    totalPayment: roundCurrency(totalPaid),
    totalInterest: roundCurrency(totalInterest),
    actualMonths,
    yearlyData,
  };
}

export type FilingStatus2 = 'single' | 'married';

export interface SteuerrechnerInputs {
  annualIncome: number;
  werbungskosten: number;
  sonderausgaben: number;
  vorsorgeaufwendungen: number;
  aussergewoehnlicheBelastungen: number;
  childrenUnder25: number;
  filingStatus: FilingStatus2;
  churchTax: boolean;
  state: FederalState;
}

export function calculateSteuer(input: SteuerrechnerInputs) {
  const taxClass: TaxClass = input.filingStatus === 'married' ? '3' : '1';
  const sonderausgabenMin = input.filingStatus === 'married' ? 72 : 36;

  const werbungskostenEffektiv = Math.max(input.werbungskosten, 1230);
  const sonderausgabenEffektiv = Math.max(input.sonderausgaben, sonderausgabenMin);

  const zve = Math.max(
    input.annualIncome -
      werbungskostenEffektiv -
      sonderausgabenEffektiv -
      input.vorsorgeaufwendungen -
      input.aussergewoehnlicheBelastungen,
    0
  );

  const einkommensteuer = incomeTax2026ForClass(zve, taxClass);

  // Soli and church tax use a ZVE reduced by Kinderfreibetrag
  const clampedChildren = Math.max(0, input.childrenUnder25);
  let childAllowance = clampedChildren * SOCIAL_CONFIG_2026.tax.childAllowance;
  if (['1', '4', '5', '6'].includes(taxClass)) {
    childAllowance = (clampedChildren / 2) * SOCIAL_CONFIG_2026.tax.childAllowance;
  }
  const zveForSoliKiSt = Math.max(0, zve - childAllowance);
  const taxForSoliKiSt = incomeTax2026ForClass(zveForSoliKiSt, taxClass);

  const soli = solidaritySurcharge(taxForSoliKiSt, taxClass);
  const kirchensteuer = input.churchTax ? taxForSoliKiSt * getChurchTaxRate(input.state) : 0;

  const totalTax = einkommensteuer + soli + kirchensteuer;
  const netIncome = Math.max(input.annualIncome - totalTax, 0);
  const effectiveRate = input.annualIncome > 0 ? totalTax / input.annualIncome : 0;

  // Marginal rate approximation at current ZVE
  const delta = 1000;
  const taxHigher = incomeTax2026ForClass(zve + delta, taxClass);
  const marginalRate = delta > 0 ? (taxHigher - einkommensteuer) / delta : 0;

  return {
    zve: roundCurrency(zve),
    einkommensteuer: roundCurrency(einkommensteuer),
    soli: roundCurrency(soli),
    kirchensteuer: roundCurrency(kirchensteuer),
    totalTax: roundCurrency(totalTax),
    netIncome: roundCurrency(netIncome),
    effectiveRate: roundCurrency(effectiveRate * 100),
    marginalRate: roundCurrency(Math.min(marginalRate * 100, 100)),
  };
}

export interface SparrechnerInputs {
  initialAmount: number;
  monthlyContribution: number;
  annualInterestRate: number;
  durationYears: number;
}

export interface SavingsYear {
  year: number;
  balance: number;
  totalContributed: number;
  totalInterest: number;
}

export function calculateSpar(input: SparrechnerInputs) {
  const monthlyRate = input.annualInterestRate / 100 / 12;
  const totalMonths = input.durationYears * 12;

  let balance = input.initialAmount;
  let totalContributed = input.initialAmount;
  const yearlyData: SavingsYear[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate) + input.monthlyContribution;
    totalContributed += input.monthlyContribution;

    if (m % 12 === 0) {
      yearlyData.push({
        year: m / 12,
        balance: roundCurrency(balance),
        totalContributed: roundCurrency(totalContributed),
        totalInterest: roundCurrency(balance - totalContributed),
      });
    }
  }

  const totalInterest = balance - totalContributed;

  return {
    finalBalance: roundCurrency(balance),
    totalContributed: roundCurrency(totalContributed),
    totalInterest: roundCurrency(totalInterest),
    yearlyData,
  };
}

export interface TimeEntry {
  id: string;
  date: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  breakMinutes: number;
}

export interface StundenrechnerInputs {
  hourlyRate: number;
  entries: TimeEntry[];
}

export function calculateStundenrechner(input: StundenrechnerInputs) {
  let totalMinutes = 0;
  let validEntryCount = 0;

  for (const entry of input.entries) {
    if (!entry.startTime || !entry.endTime) continue;

    const [startH, startM] = entry.startTime.split(':').map(Number);
    const [endH, endM] = entry.endTime.split(':').map(Number);

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) continue;

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    let duration = endTotal - startTotal;
    if (duration < 0) {
      // Overnight shift
      duration += 24 * 60;
    }

    const breakMin = isNaN(entry.breakMinutes) ? 0 : Math.max(0, entry.breakMinutes);
    const netDuration = Math.max(0, duration - breakMin);

    totalMinutes += netDuration;
    validEntryCount++;
  }

  const decimalHours = totalMinutes / 60;
  const grossPay = decimalHours * input.hourlyRate;

  const formatHours = Math.floor(totalMinutes / 60);
  const formatMinutes = totalMinutes % 60;
  const formattedTime = `${formatHours}h ${formatMinutes.toString().padStart(2, '0')}m`;

  return {
    totalMinutes,
    decimalHours: roundCurrency(decimalHours),
    formattedTime,
    grossPay: roundCurrency(grossPay),
    entryCount: validEntryCount,
  };
}
