export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  volume: string;
  available: boolean;
  new?: boolean;
  phase?: 'live' | 'next';
  related?: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'stundenrechner',
    title: 'Stundenrechner (Arbeitszeit)',
    description:
      'Einfacher Stundenzettel: Arbeitszeiten eingeben, Pausen abziehen und automatisch Industriestunden und Lohn berechnen.',
    category: 'Arbeit',
    slug: '/stundenrechner',
    volume: '~180k/Monat',
    available: true,
    new: true,
    phase: 'live',
    related: ['brutto-netto', 'stundensatz', 'abfindung'],
  },
  {
    id: 'qrcode',
    title: 'QR-Code-Generator',
    description:
      'Kostenlos QR-Code für URL, Text, WLAN oder Kontakt erstellen und als PNG oder SVG herunterladen.',
    category: 'Tools',
    slug: '/qrcode',
    volume: '~90k/Monat',
    available: true,
    new: true,
    phase: 'live',
    related: ['stundenrechner', 'stundensatz', 'sparrechner'],
  },
  {
    id: 'stundensatz',
    title: 'Stundensatz-Rechner',
    description:
      'Freelancer-Satz aus Zielnetto, Fixkosten, Auslastung, Krankheit und Gewinnmarge sauber herleiten.',
    category: 'Selbstständigkeit',
    slug: '/stundensatz',
    volume: '~10k/Monat',
    available: true,
    phase: 'live',
    related: ['gewerbesteuer', 'steuerrechner', 'stundenrechner'],
  },
  {
    id: 'brutto-netto',
    title: 'Brutto-Netto-Rechner',
    description:
      'Netto für 2026 aus Brutto, Steuerklasse, Kirchensteuer, Sozialabgaben und Firmenwagen abschätzen.',
    category: 'Gehalt',
    slug: '/brutto-netto',
    volume: '~200k/Monat',
    available: true,
    phase: 'live',
    related: ['steuerrechner', 'sonderzahlung', 'krankengeld'],
  },
  {
    id: 'nebenkosten',
    title: 'Nebenkosten-Rechner',
    description:
      'Heizkosten nach Verbrauch und Fläche verteilen, Benchmarks prüfen und What-if-Szenarien testen.',
    category: 'Wohnen',
    slug: '/nebenkosten',
    volume: '~30k/Monat',
    available: true,
    phase: 'live',
    related: ['mietpreisbremse', 'kreditrechner', 'sparrechner'],
  },
  {
    id: 'elterngeld',
    title: 'Elterngeld-Rechner',
    description:
      'Basiselterngeld und ElterngeldPlus mit Sockel, Deckel und Geschwisterbonus strukturiert vergleichen.',
    category: 'Familie',
    slug: '/elterngeld',
    volume: '~50k/Monat',
    available: true,
    phase: 'live',
    related: ['brutto-netto', 'krankengeld', 'steuerrechner'],
  },
  {
    id: 'gewerbesteuer',
    title: 'Gewerbesteuer-Rechner',
    description:
      'Gewerbesteuer aus Ertrag, Steuermesszahl und Hebesatz berechnen — mit Freibetrag, Hinzurechnungen und ESt-Anrechnung.',
    category: 'Selbstständigkeit',
    slug: '/gewerbesteuer',
    volume: '~12k/Monat',
    available: true,
    phase: 'live',
    related: ['stundensatz', 'steuerrechner', 'kapitalertrag'],
  },
  {
    id: 'sonderzahlung',
    title: 'Urlaubsgeld-Rechner',
    description:
      'Nettobetrag von Urlaubsgeld und Weihnachtsgeld berechnen — nach Lohnsteuer, Soli und Sozialversicherung.',
    category: 'Gehalt',
    slug: '/sonderzahlung',
    volume: '~8k/Monat',
    available: true,
    phase: 'live',
    related: ['brutto-netto', 'steuerrechner', 'abfindung'],
  },
  {
    id: 'kapitalertrag',
    title: 'Kapitalertrag-Rechner',
    description:
      'Abgeltungsteuer, Soli und Kirchensteuer auf Kapitalerträge berechnen — nach Sparerpauschbetrag und Verlusten.',
    category: 'Finanzen',
    slug: '/kapitalertrag',
    volume: '~35k/Monat',
    available: true,
    phase: 'live',
    related: ['sparrechner', 'steuerrechner', 'gewerbesteuer'],
  },
  {
    id: 'mietpreisbremse',
    title: 'Mietpreisbremse-Rechner',
    description:
      'Prüfe, ob deine Miete die gesetzliche Obergrenze einhält — inklusive Modernisierungszuschlag und Vormiete.',
    category: 'Wohnen',
    slug: '/mietpreisbremse',
    volume: '~25k/Monat',
    available: true,
    phase: 'live',
    related: ['nebenkosten', 'kreditrechner', 'sparrechner'],
  },
  {
    id: 'abfindung',
    title: 'Abfindungs-Rechner',
    description:
      'Abfindung nach Fünftelregel (§ 34 EStG) berechnen und Steuerersparnis gegenüber normaler Besteuerung ablesen.',
    category: 'Arbeit',
    slug: '/abfindung',
    volume: '~15k/Monat',
    available: true,
    phase: 'live',
    related: ['brutto-netto', 'steuerrechner', 'rente'],
  },
  {
    id: 'arbeitslosengeld',
    title: 'Arbeitslosengeld-Rechner',
    description:
      'Arbeitslosengeld I nach SGB III berechnen: 60 % / 67 % mit Kind des letzten Nettolohns, Bezugsdauer und Einkommensverlust.',
    category: 'Arbeit',
    slug: '/arbeitslosengeld',
    volume: 'New',
    available: true,
    new: true,
    phase: 'live',
    related: ['brutto-netto', 'abfindung', 'krankengeld'],
  },
  {
    id: 'rente',
    title: 'Renten-Rechner',
    description:
      'Gesetzliche Rente aus Entgeltpunkten, Einkommen und Renteneintrittsalter schätzen — mit Ab- und Zuschlägen.',
    category: 'Altersvorsorge',
    slug: '/rente',
    volume: '~150k/Monat',
    available: true,
    phase: 'live',
    related: ['brutto-netto', 'sparrechner', 'kapitalertrag'],
  },
  {
    id: 'krankengeld',
    title: 'Krankengeld-Rechner',
    description:
      'GKV-Krankengeld nach SGB V § 47 berechnen: 70 % des Brutto, max. 90 % des Netto, Bezugsdauer und Einkommensverlust.',
    category: 'Soziales',
    slug: '/krankengeld',
    volume: '~80k/Monat',
    available: true,
    phase: 'live',
    related: ['brutto-netto', 'elterngeld', 'steuerrechner'],
  },
  {
    id: 'kreditrechner',
    title: 'Kreditrechner',
    description:
      'Berechne monatliche Raten, Zinsen und Tilgungspläne für Kredite.',
    category: 'Finanzen',
    slug: '/kreditrechner',
    volume: '~50k/Monat',
    available: true,
    phase: 'live',
    related: ['sparrechner', 'nebenkosten', 'mietpreisbremse'],
  },
  {
    id: 'steuerrechner',
    title: 'Steuerrechner',
    description:
      'Einkommensteuer, Solidaritätszuschlag und Kirchensteuer nach Abzügen und Steuerstatus berechnen — mit Effektiv- und Grenzsteuersatz.',
    category: 'Finanzen',
    slug: '/steuerrechner',
    volume: '~120k/Monat',
    available: true,
    phase: 'live',
    related: ['brutto-netto', 'kapitalertrag', 'gewerbesteuer'],
  },
  {
    id: 'sparrechner',
    title: 'Sparrechner',
    description:
      'Endguthaben und Zinseszinseffekt für Sparpläne berechnen — mit Startkapital, Sparrate, Zinssatz und jahresgenauem Vermögenscart.',
    category: 'Finanzen',
    slug: '/sparrechner',
    volume: '~60k/Monat',
    available: true,
    phase: 'live',
    related: ['kapitalertrag', 'kreditrechner', 'rente'],
  },
];
