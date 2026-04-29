interface FaqItem {
  question: string;
  answer: string;
}

interface HowToStep {
  title: string;
  description: string;
}

export function createSoftwareApplicationSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'WebBrowser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    url,
  };
}

export function createFAQSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function createHowToSchema(name: string, steps: HowToStep[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export function createBreadcrumbSchema(toolName: string, toolUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'rechner.tools',
        item: 'https://rechner.tools',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: toolName,
        item: toolUrl,
      },
    ],
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'rechner.tools',
    url: 'https://rechner.tools',
    logo: 'https://rechner.tools/favicon.svg',
    description:
      'Kostenlose Finanzrechner für Deutschland — Brutto-Netto, Rente, Steuern, Elterngeld und mehr. Alle Berechnungen nach aktuellem deutschen Steuerrecht.',
    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
    },
    knowsAbout: [
      'Einkommensteuer',
      'Brutto-Netto-Berechnung',
      'Rentenberechnung',
      'Elterngeld',
      'Krankengeld',
      'Gewerbesteuer',
      'Kapitalertragsteuer',
    ],
    sameAs: ['https://rechner.tools'],
  };
}

export function createSpeakableSchema(cssSelectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}
