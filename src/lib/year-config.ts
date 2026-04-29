export const SOCIAL_CONFIG_2026 = {
  tax: {
    basicAllowance: 12348,
    marriedBasicAllowance: 24696,
    childAllowance: 9756,
    thresholds: {
      progressionStart: 17800,
      progressionEnd: 69879,
      richTaxStart: 277826,
    },
  },
  socialSecurity: {
    healthCareCapMonthly: 5812.5,
    pensionCapMonthly: 8450,
    pensionEmployeeRate: 0.093,
    unemploymentEmployeeRate: 0.013,
    statutoryHealthBaseEmployeeRate: 0.073,
    averageAdditionalHealthEmployeeRate: 0.0145,
    care: {
      defaultEmployeeRate: 0.018,
      childlessEmployeeRate: 0.024,
      sachsenEmployeeRate: 0.023,
      sachsenChildlessEmployeeRate: 0.029,
      parentRatesByChildren: {
        1: 0.018,
        2: 0.0155,
        3: 0.013,
        4: 0.0105,
        5: 0.008,
      },
    },
  },
  carBenefit: {
    regularRate: 0.01,
    electricRate: 0.0025,
    electricListPriceCap: 100000,
  },
} as const;

export const ELTERNGELD_CONFIG_2026 = {
  baseMin: 300,
  baseMax: 1800,
  plusMin: 150,
  plusMax: 900,
  siblingBonusRate: 0.1,
  siblingBonusMinBase: 75,
  siblingBonusMinPlus: 37.5,
} as const;

export const NEBENKOSTEN_CONFIG = {
  heatingShareMin: 50,
  heatingShareMax: 70,
  benchmark: {
    year2021For70sqm: 740,
    year2024For70sqm: 1030,
  },
  heatPumpReductionRate: 0.18,
} as const;

export const STUNDENSATZ_DEFAULTS = {
  workingDaysPerYear: 252,
} as const;

export const RENTEN_CONFIG_2026 = {
  // Aktueller Rentenwert (West = Ost seit 2024), Stand Juli 2025
  rentenwert: 39.32,
  // Vorläufiges Durchschnittsentgelt 2025 (DRV-Richtwert)
  durchschnittsentgeltAnnual: 47070,
  standardRetirementAge: 67,
  // Abschlag pro Monat bei vorzeitigem Renteneintritt
  abschlagPerMonth: 0.003,
  // Zuschlag pro Monat bei spätem Renteneintritt
  bonusPerMonth: 0.006,
  // Rentenversicherungsbeitrag Arbeitnehmer
  employeeRate: 0.093,
} as const;

export const GEWERBESTEUER_CONFIG = {
  steuermesszahl: 0.035,
  freibetragEinzel: 24500, // Einzelunternehmen / Personengesellschaften
  hinzurechnungFreibetrag: 200000, // gemeinsamer Freibetrag für Hinzurechnungen
  hinzurechnungZinsenRate: 0.25,
  hinzurechnungMietenRate: 0.2,
  // 3,8-faches des Steuermessbetrags anrechenbar auf ESt (Einzelunternehmer)
  estAnrechnungsfaktor: 3.8,
} as const;

export const KAPITALERTRAG_CONFIG_2026 = {
  abgeltungsteuerRate: 0.25,
  soliRate: 0.055,
  sparerpauschbetragSingle: 1000,
  sparerpauschbetragMarried: 2000,
} as const;

export const MIETPREISBREMSE_CONFIG = {
  // max. 10 % über ortsübliche Vergleichsmiete
  maxSurchargeRate: 0.1,
  // 8 % der Modernisierungskosten p.a. als Zuschlag zulässig
  modernizationYearlyRate: 0.08,
  // Kappungsgrenze: max. 3 EUR/qm/Monat Modernisierungszuschlag
  modernizationCapPerSqm: 3.0,
} as const;

export const KRANKENGELD_CONFIG_2026 = {
  // GKV zahlt 70 % des Brutto
  krankengeldRate: 0.7,
  // Aber max. 90 % des Netto
  maxNetRate: 0.9,
  // Beitragsbemessungsgrenze KV (gleich wie in SOCIAL_CONFIG)
  healthCareCapMonthly: 5812.5,
  // Gesetzliche Tage pro Monat für die Tagessatz-Berechnung
  daysPerMonth: 30,
  // Entgeltfortzahlung durch Arbeitgeber (Wochen)
  entgeltfortzahlungWeeks: 6,
  // Maximale Krankengeld-Bezugsdauer (Wochen) ab Erkrankungsbeginn
  maxDurationWeeks: 78,
} as const;

export const ARBEITSLOSENGELD_CONFIG_2026 = {
  // ALG I berechnet sich aus dem maintienable income (beitragspflichtiges Entgelt)
  // Grundsatz: 60% des letzten Nettoentgelts (67% mit Kind)
  baseRate: 0.6,
  baseRateWithChild: 0.67,
  // Beitragsbemessungsgrenze (West = Ost seit 2024)
  assessmentCeilingMonthly: 8450,
  // Tage pro Monat für die Berechnung
  daysPerMonth: 30,
  // Mindestanspruchszeit: 12 Monate in den letzten 2 Jahren
  minEmploymentMonths: 12,
  // Maximale Bezugsdauer basierend auf Versicherungsdauer
  // in Monaten Versicherungszeit -> Wochen Bezugsdauer
  durationRates: {
    12: 26,  // 12 Monate -> 26 Wochen
    16: 39,  // 16 Monate -> 39 Wochen
    20: 52,  // 20 Monate -> 52 Wochen
  } as const,
  // Maximale Bezugsdauer (Monate)
  maxDurationMonths: 12,
  // Wartenzeit (Sperrzeit) in Wochen - standardmäßig 1 Woche
  waitingPeriodWeeks: 1,
} as const;
