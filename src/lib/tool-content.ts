export interface ToolContent {
  summary: string;
  updatedAt: string;
  checkedAgainst: string;
  sources: { label: string; url: string }[];
  disclaimer: string;
  scenarios: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  howTo: { title: string; description: string }[];
}

const COMMON_DISCLAIMER =
  'Dieses Tool bietet eine fundierte rechnerische Orientierung, ersetzt jedoch keine verbindliche Fach-, Steuer- oder Rechtsberatung. Für rechtsverbindliche Dokumente oder Auskünfte sind allein zuständige Behörden, Arbeitgeber oder Steuerberater maßgeblich.';

export const TOOL_CONTENT: Record<string, ToolContent> = {
  qrcode: {
    summary:
      'Erstellt statische QR-Codes direkt im Browser. Inhalte und hochgeladene Logos bleiben lokal, die Ausgabe kann als PNG oder SVG gespeichert werden.',
    updatedAt: '2026-04-27',
    checkedAgainst:
      'Statische QR-Codes ohne Tracking, ohne Shortlink und ohne externen QR-API-Aufruf. Für Druck und Veröffentlichung sollte die Vorschau immer real gescannt werden.',
    sources: [],
    disclaimer:
      'Der Generator erstellt QR-Codes rechnerisch im Browser. Prüfe jeden QR-Code vor Druck, Veröffentlichung oder Massennutzung mit mehreren Geräten und Apps.',
    scenarios: [
      {
        title: 'Link teilen',
        text: 'Aus einer Website-Adresse wird ein scannbarer QR-Code für Flyer, Aushänge, Präsentationen oder Verpackungen.',
      },
      {
        title: 'WLAN zugänglich machen',
        text: 'Gäste können Netzwerkname und Passwort per Kamera übernehmen, ohne lange Zugangsdaten abzutippen.',
      },
      {
        title: 'Kontakt speichern',
        text: 'Eine vCard legt Name, Telefonnummer, E-Mail und Organisation direkt als Kontaktvorschlag an.',
      },
    ],
    faqs: [
      {
        question: 'Werden meine QR-Code-Inhalte übertragen?',
        answer:
          'Nein. Die QR-Codes werden lokal im Browser erzeugt. Es wird kein externer QR-Code-Dienst aufgerufen.',
      },
      {
        question: 'Was ist besser: PNG oder SVG?',
        answer:
          'PNG eignet sich für schnelle Nutzung in Dokumenten und Social Media. SVG bleibt verlustfrei skalierbar und ist besser für Druck, Layout und Weiterbearbeitung.',
      },
      {
        question: 'Warum braucht ein QR-Code Rand?',
        answer:
          'Der helle Rand, auch Ruhezone genannt, trennt den Code optisch von seiner Umgebung. Ohne Rand erkennen Scanner den Code deutlich schlechter.',
      },
      {
        question: 'Welche Fehlerkorrektur sollte ich wählen?',
        answer:
          'Normal reicht für digitale Nutzung. Robust oder Maximal ist sinnvoll, wenn der Code gedruckt, klein platziert oder farbig gestaltet wird.',
      },
    ],
    howTo: [
      {
        title: '1. Inhaltstyp wählen',
        description:
          'Entscheide, ob der QR-Code eine URL, Text, WLAN-Zugangsdaten oder eine vCard enthalten soll.',
      },
      {
        title: '2. QR-Code anpassen',
        description:
          'Wähle Farben, Rand und Fehlerkorrektur. Hoher Kontrast und ausreichender Rand verbessern die Scanbarkeit.',
      },
      {
        title: '3. Testen und herunterladen',
        description:
          'Scanne die Vorschau mit einem Smartphone und speichere den fertigen QR-Code als PNG oder SVG.',
      },
    ],
  },
  stundensatz: {
    summary:
      'Berechnet den unternehmerisch notwendigen Mindeststundensatz für Selbstständige auf Basis von Nettozielen, Fixkosten und der tatsächlichen Auslastung.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'Gängige betriebswirtschaftliche Kalkulationsmodelle für Freiberufler sowie offizielle Beitragsbemessungsgrenzen 2026 der GKV.',
    sources: [
      {
        label: 'BMG: Rechengrößen der Sozialversicherung 2026',
        url: 'https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung',
      },
      {
        label: 'Bundesregierung: Aktuelle Beitragsbemessungsgrenzen',
        url: 'https://www.bundesregierung.de/breg-de/suche/beitragsgemessungsgrenzen-2386514',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Mehr Auslastung',
        text: 'Bereits 10 Prozentpunkte mehr abrechenbare Zeit senken den benötigten Mindeststundensatz deutlich.',
      },
      {
        title: 'Höhere Fixkosten',
        text: 'Steigende Ausgaben für Software, Lizenzen oder PKV treiben den Umsatzbedarf direkt nach oben.',
      },
      {
        title: 'Kleinunternehmer vs. Regelbesteuerung',
        text: 'Der benötigte Netto-Stundensatz bleibt gleich, für Endkunden verändert sich bei 19% USt jedoch der Gesamtpreis.',
      },
    ],
    faqs: [
      {
        question: 'Warum liegt mein Mindeststundensatz über meinem Wunschgehalt?',
        answer:
          'Der Stundensatz refinanziert nicht nur die produktive Zeit, sondern auch Urlaub, Krankheit, Akquisezeit, Altersvorsorge sowie betriebliche Fixkosten und Krankenversicherung.',
      },
      {
        question: 'Muss ich die Umsatzsteuer in meinen Stundensatz einrechnen?',
        answer:
          'Für die Deckung Ihrer eigenen Kosten ist der Netto-Satz entscheidend. Auf Rechnungen muss die Umsatzsteuer (in der Regel 19%) ausgewiesen werden, es sei denn, Sie nutzen die Kleinunternehmerregelung.',
      },
      {
        question: 'Wie hoch sollte meine fakturierbare Auslastung geschätzt werden?',
        answer:
          'Eine realistische Auslastung für Selbstständige liegt meist bei maximal 60–70%, da administrative Aufgaben, Vertrieb und Weiterbildung viel nicht-abrechenbare Zeit beanspruchen.',
      },
    ],
    howTo: [
      {
        title: '1. Zielnetto definieren',
        description:
          'Setzen Sie fest, welcher Betrag nach allen Abzügen und Steuern für Sie privat monatlich übrig bleiben muss.',
      },
      {
        title: '2. Laufende Kosten prüfen',
        description:
          'Tragen Sie alle Fixkosten wie Software-Abos, Versicherungen und Rücklagen präzise ein.',
      },
      {
        title: '3. Abrechenbare Zeit testen',
        description:
          'Variieren Sie Admin- und Krankheitstage, um das Sicherheitsnetz Ihres Stundensatzes zu prüfen.',
      },
    ],
  },
  'brutto-netto': {
    summary:
      'Ermittelt das absehbare Nettoentgelt 2026 basierend auf dem Programmablaufplan des BMF, inklusive detaillierter Sozialabgaben und optionaler Firmenwagenlogik.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'Programmablaufplan (PAP) 2026 für die Lohnsteuer, Kinderfreibeträge sowie Beitragsätze der Sozial- und Pflegeversicherungen (BMF/BMG).',
    sources: [
      {
        label: 'BMF: Änderungen im Steuerrecht 2026',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html',
      },
      {
        label: 'BMF: Programmablaufplan (PAP) Lohnsteuer 2026',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026-anlage-1.pdf?__blob=publicationFile&v=2',
      },
      {
        label: 'BMG: Beiträge zur gesetzlichen Pflegeversicherung',
        url: 'https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Steuerklasse wechseln',
        text: 'Der Wechsel in Steuerklasse III oder V beeinflusst den monatlichen Lohnsteuerabzug maßgeblich.',
      },
      {
        title: 'Elektro-Firmenwagen (0,25%)',
        text: 'Berechtigte E-Fahrzeuge (bis 100.000 € Listenpreis) senken den geldwerten Vorteil extrem im Vergleich zum herkömmlichen 1%-Modell.',
      },
      {
        title: 'Sonderfall Pflegeversicherung',
        text: 'In Sachsen gelten abweichende Beitragssätze; mehrere Kinder unter 25 Jahren mindern den Arbeitnehmeranteil.',
      },
    ],
    faqs: [
      {
        question: 'Sind in dieser Schätzung die 2026er Grenzwerte hinterlegt?',
        answer:
          'Ja. Der Rechner nutzt für 2026 aktualisierte Grundfreibeträge, Kinderfreibeträge und Beitragsbemessungsgrenzen gemäß BMF und BMG.',
      },
      {
        question: 'Warum unterscheidet sich das Ergebnis von meiner echten Lohnabrechnung?',
        answer:
          'Individuelle Anpassungen wie kassenabhängige Zusatzbeiträge der GKV, zusätzliche betriebliche Freibeträge, Zuschläge oder abweichende PKV-Kosten können die Schlussrechnung minimal verändern.',
      },
      {
        question: 'Wie rechnet der Steuer-Rechner bei Steuerklasse VI?',
        answer:
          'In Klasse VI entfällt der Grundfreibetrag. Das Brutto wird in der Berechnung daher formell so modifiziert, dass die Steuerkurve sofort greift.',
      },
    ],
    howTo: [
      {
        title: '1. Brutto und Steuerklasse eingeben',
        description:
          'Hinterlegen Sie das steuerpflichtige Basis-Monatsgehalt ohne Sonderzahlungen sowie Ihre Klasse.',
      },
      {
        title: '2. Sozialangaben konkretisieren',
        description:
          'Korrigieren Sie den Status der Krankenversicherung, Bundesland (Sachsen) und Kinder für exakte Pflegebeträge.',
      },
      {
        title: '3. What-if für Firmenwagen testen',
        description:
          'Spielen Sie die steuerliche Netto-Auswirkung von regulärem vs. Elektro-Firmenwagen im Live-Ergebnis durch.',
      },
    ],
  },
  elterngeld: {
    summary:
      'Gliedert den offiziellen Rechtsrahmen in eine nachvollziehbare Vergleichsansicht aus Basiselterngeld und ElterngeldPlus samt Geschwisterbonus.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'Bundeselterngeld- und Elternzeitgesetz (BEEG), Richtwerte des Familienportals des Bundes (Stand: April 2026).',
    sources: [
      {
        label: 'BMFSFJ: Höhe des Elterngelds',
        url: 'https://familienportal.de/familienportal/familienleistungen/elterngeld/faq/wie-viel-elterngeld-kann-ich-bekommen--124616',
      },
      {
        label: 'BMFSFJ: Offizieller Geschwisterbonus',
        url: 'https://familienportal.de/familienportal/familienleistungen/elterngeld/familiensituation/geschwisterbonus-wie-viel-elterngeld-bekomme-ich-wenn-ich-weitere-kinder-habe--124684',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Basis-Rate vs. Plus-Rate wechseln',
        text: 'Ein direkter Vergleich zeigt, dass sich die monatliche Auszahlung beim Plus-Modell näherungsweise halbiert, die Zeit sich aber verdoppelt.',
      },
      {
        title: 'Teilzeiteinkommen prüfen',
        text: 'Der Simulator verdeutlicht, wie eine Erwerbstätigkeit nach Geburt das Basiselterngeld sofort reduziert.',
      },
      {
        title: 'Bonus bei kurzen Altersabständen',
        text: 'Erfüllen kleine Geschwister die Abstandsregeln, sichert der Bonus pauschal mindestes 10 % mehr Budget.',
      },
    ],
    faqs: [
      {
        question: 'Wie hoch ist das maximale Basiselterngeld?',
        answer:
          'Das Basiselterngeld ist gesetzlich gekappt und beträgt im Standardfall maximal 1.800 Euro und minimal 300 Euro.',
      },
      {
        question: 'Lohnt sich das ElterngeldPlus finanziell?',
        answer:
          'Das ElterngeldPlus eignet sich vor allem für eine längere Bezugsdauer (bis 36 Monate) oder falls parallel Einkommen (z. B. in Teilzeit) bezogen wird; die Summe bleibt meist ähnlich.',
      },
      {
        question: 'Werden Steuern auf Elterngeld fällig?',
        answer:
          'Elterngeld selbst ist steuerfrei, unterliegt aber dem Progressionsvorbehalt und kann den Steuersatz für das restliche Einkommen des Haushalts nachträglich erhöhen.',
      },
    ],
    howTo: [
      {
        title: '1. Nettoverlust bestimmen',
        description:
          'Tragen Sie Ihr gewohntes Netto vor Geburt sowie geplante Einkünfte nach Geburt ein.',
      },
      {
        title: '2. Variante auswählen',
        description:
          'Schalten Sie sofort zwischen Basis und Plus hin und her, um die Auswirkung auf die monatliche Liquidität zu sehen.',
      },
      {
        title: '3. Gesamtauszahlung checken',
        description:
          'Überprüfen Sie, ob längere Dauer oder ein höherer Monatsbetrag für Ihre Familie sicherer ist.',
      },
    ],
  },
  gewerbesteuer: {
    summary:
      'Berechnet die Gewerbesteuer aus Gewerbeertrag, Steuermesszahl (3,5 %) und kommunalem Hebesatz — mit Freibetrag, Hinzurechnungen und ESt-Anrechnung für Einzelunternehmer.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'GewStG § 11 (Steuermesszahl 3,5 %), § 8 (Hinzurechnungen), § 9 (Kürzungen), EStG § 35 (Anrechnung auf Einkommensteuer). Freibetrag 24.500 EUR für natürliche Personen.',
    sources: [
      {
        label: 'GewStG § 11: Steuermesszahl und Steuermessbetrag',
        url: 'https://www.gesetze-im-internet.de/gewstg/__11.html',
      },
      {
        label: 'GewStG § 8: Hinzurechnungen',
        url: 'https://www.gesetze-im-internet.de/gewstg/__8.html',
      },
      {
        label: 'EStG § 35: Steuerermäßigung bei Einkünften aus Gewerbebetrieb',
        url: 'https://www.gesetze-im-internet.de/estg/__35.html',
      },
    ],
    disclaimer:
      'Dieser Rechner ist eine vereinfachte Näherung. Kürzungen (z. B. Grundbesitzkürzung), Verlustvorträge und differenzierte Hinzurechnungen sind nicht vollständig abgebildet. Für verbindliche Auskünfte wende dich an einen Steuerberater.',
    scenarios: [
      {
        title: 'Hoher Hebesatz (München/Berlin)',
        text: 'München hat 490 %, Berlin 410 % — bereits 50 Hebesatz-Punkte mehr bedeuten bei 50.000 EUR Ertrag ~875 EUR mehr Gewerbesteuer.',
      },
      {
        title: 'GmbH vs. Einzelunternehmen',
        text: 'Für GmbHs gibt es keinen Freibetrag. Einzelunternehmer sparen durch den 24.500 EUR Freibetrag und die ESt-Anrechnung erheblich.',
      },
      {
        title: 'Hinzurechnungen vermeiden',
        text: 'Hohe Schuldzinsen und Mieten erhöhen den Gewerbeertrag — in manchen Fällen lohnt Eigentum statt Miete steuerlich.',
      },
    ],
    faqs: [
      {
        question: 'Wer zahlt Gewerbesteuer?',
        answer:
          'Alle Gewerbetreibenden (Einzelunternehmer, Personengesellschaften, GmbH, AG). Freiberufler nach § 18 EStG (Ärzte, Anwälte, Ingenieure, Künstler) sind ausgenommen.',
      },
      {
        question: 'Was ist der Hebesatz?',
        answer:
          'Den Hebesatz legt jede Gemeinde selbst fest. Er beträgt mindestens 200 %. Großstädte liegen oft zwischen 400 und 500 %. Den Satz deiner Gemeinde findest du beim zuständigen Finanzamt oder der Gemeindeverwaltung.',
      },
      {
        question: 'Kann Gewerbesteuer auf die Einkommensteuer angerechnet werden?',
        answer:
          'Ja, aber nur für Einzelunternehmer und Personengesellschafter: Das 3,8-fache des Steuermessbetrags kann auf die Einkommensteuer angerechnet werden. Für GmbHs gibt es keine solche Anrechnung.',
      },
    ],
    howTo: [
      {
        title: '1. Gewinn aus Steuerbescheid entnehmen',
        description:
          'Basis ist der steuerliche Gewinn aus dem Gewerbebetrieb — nicht der handelsrechtliche Jahresüberschuss.',
      },
      {
        title: '2. Hebesatz der Gemeinde recherchieren',
        description:
          'Den aktuellen Hebesatz findest du bei deiner Gemeindeverwaltung oder im Gewerbesteuerbescheid des Vorjahres.',
      },
      {
        title: '3. Rechtsform wählen',
        description:
          'GmbH vs. Einzelunternehmen hat erheblichen Einfluss — Freibetrag und ESt-Anrechnung gelten nur für Einzelunternehmer.',
      },
    ],
  },
  sonderzahlung: {
    summary:
      'Berechnet den Nettobetrag von Urlaubsgeld und Weihnachtsgeld nach der Hochrechnungsmethode für sonstige Bezüge — inklusive Lohnsteuer, Soli und Sozialversicherung.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'BMF-PAP 2026 (sonstige Bezüge / Hochrechnungsmethode), Sozialversicherungsbeiträge 2026, Beitragsbemessungsgrenzen GKV und RV.',
    sources: [
      {
        label: 'BMF: Programmablaufplan Lohnsteuer 2026 (sonstige Bezüge)',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026-anlage-1.pdf?__blob=publicationFile&v=2',
      },
      {
        label: 'Bundesregierung: Sozialversicherungsbeiträge 2026',
        url: 'https://www.bundesregierung.de/breg-de/suche/beitragsgemessungsgrenzen-2386514',
      },
    ],
    disclaimer:
      'Die Berechnung nutzt die vereinfachte Hochrechnungsmethode ohne individuelle Freibeträge. Der tatsächliche Lohnsteuerabzug des Arbeitgebers kann leicht abweichen.',
    scenarios: [
      {
        title: 'Hoher Grenzsteuersatz',
        text: 'Bei höherem Einkommen wird der Grenzsteuersatz immer höher — von Urlaubsgeld bleibt deutlich weniger übrig als bei niedrigerem Gehalt.',
      },
      {
        title: 'Beitragsbemessungsgrenze',
        text: 'Über der Beitragsbemessungsgrenze fallen keine weiteren Sozialversicherungsbeiträge an — das Urlaubsgeld landet zu einem größeren Teil als Netto.',
      },
      {
        title: 'PKV vs. GKV',
        text: 'Privatversicherte zahlen keine einkommensabhängigen GKV-Beiträge auf die Sonderzahlung — der Nettobetrag fällt höher aus.',
      },
    ],
    faqs: [
      {
        question: 'Wird Urlaubsgeld wie normales Gehalt versteuert?',
        answer:
          'Ja, Urlaubsgeld und Weihnachtsgeld sind regulär lohnsteuer- und sozialversicherungspflichtig. Der Arbeitgeber berechnet die Steuer nach der Hochrechnungsmethode für sonstige Bezüge.',
      },
      {
        question: 'Gibt es einen Freibetrag für Weihnachtsgeld?',
        answer:
          'Nein. Weihnachtsgeld ist in voller Höhe steuerpflichtig — anders als bestimmte steuerfreie Sachleistungen (z. B. Jobticket, Essenszuschüsse bis zur Freigrenze).',
      },
      {
        question: 'Profitieren Steuerklasse-III-Empfänger besonders?',
        answer:
          'Ja. Steuerklasse III hat den niedrigsten Lohnsteuerabzug — Sonderzahlungen in dieser Klasse werden am wenigsten durch Lohnsteuer belastet.',
      },
    ],
    howTo: [
      {
        title: '1. Monatsbrutto eintragen',
        description:
          'Das regelmäßige Monatsgehalt ist die Basis für die Hochrechnung der Jahressteuer.',
      },
      {
        title: '2. Höhe der Sonderzahlung eingeben',
        description: 'Trag den Bruttobetrag des Urlaubsgelds oder Weihnachtsgelds ein.',
      },
      {
        title: '3. Steuerklasse und KV prüfen',
        description:
          'Steuerklasse und Krankenversicherungsart beeinflussen die Abzüge erheblich — besonders bei höheren Bezügen.',
      },
    ],
  },
  kapitalertrag: {
    summary:
      'Berechnet Abgeltungsteuer, Solidaritätszuschlag und optionale Kirchensteuer auf Kapitalerträge nach Abzug von Verlusten und Sparerpauschbetrag.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'EStG § 43a (Abgeltungsteuer 25 %), Sparerpauschbetrag 2024 (1.000 / 2.000 EUR), Soli-Satz 5,5 %.',
    sources: [
      {
        label: 'BMF: Abgeltungsteuer auf Kapitalerträge',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Steuerarten/Kapitalertragsteuer/kapitalertragsteuer.html',
      },
      {
        label: 'EStG § 43a: Bemessung der Kapitalertragsteuer',
        url: 'https://www.gesetze-im-internet.de/estg/__43a.html',
      },
    ],
    disclaimer:
      'Der Rechner ist eine vereinfachte Näherung. Verlustverrechnungstöpfe, Günstigerprüfung und individuelle Besonderheiten (z. B. ausländische Quellensteuer) sind nicht berücksichtigt.',
    scenarios: [
      {
        title: 'Freistellungsauftrag ausschöpfen',
        text: 'Bis 1.000 EUR (ledig) bzw. 2.000 EUR (verheiratet) fallen gar keine Steuern an — Sparerpauschbetrag bei der Bank eintragen.',
      },
      {
        title: 'Günstigerprüfung',
        text: 'Bei niedrigem Gesamteinkommen kann die individuelle Einkommensteuer günstiger sein als die 25 % Abgeltungsteuer — Finanzamt auf Antrag prüfen lassen.',
      },
      {
        title: 'Kirchensteuer-Effekt',
        text: 'Wer Kirchensteuer zahlt, bekommt die Abgeltungsteuer leicht reduziert (Divisormethode), zahlt aber insgesamt mehr als ohne Kirchensteuer.',
      },
    ],
    faqs: [
      {
        question: 'Was ist der Sparerpauschbetrag?',
        answer:
          'Seit 2023 beträgt er 1.000 EUR pro Person (2.000 EUR für Verheiratete). Bis zu diesem Betrag bleiben Kapitalerträge steuerfrei — vorausgesetzt, ein Freistellungsauftrag wurde bei der Bank gestellt.',
      },
      {
        question: 'Gilt die Abgeltungsteuer für alle Kapitalerträge?',
        answer:
          'Ja: Dividenden, Zinsen, Kursgewinne und Ausschüttungen sind gleichermaßen betroffen. Ausnahmen gelten u. a. für Veräußerungsgewinne aus vor 2009 gekauften Wertpapieren (Altbestand).',
      },
      {
        question: 'Wie verrechne ich Verluste?',
        answer:
          'Verluste aus Kapitalanlagen können nur mit Gewinnen derselben Kategorie verrechnet werden (kein Ausgleich mit anderen Einkunftsarten). Banken führen automatisch Verlustverrechnungstöpfe.',
      },
    ],
    howTo: [
      {
        title: '1. Erträge zusammenfassen',
        description:
          'Addiere Dividenden, Zinsen und realisierte Kursgewinne aus allen Depots zu einem Gesamtbetrag.',
      },
      {
        title: '2. Verluste und Pauschbetrag abziehen',
        description:
          'Trag verrechenbare Verluste und den genutzten Sparerpauschbetrag ein — das ergibt die steuerliche Bemessungsgrundlage.',
      },
      {
        title: '3. Kirchensteuer-Option wählen',
        description:
          'Wer kirchensteuerpflichtig ist, wählt den passenden Satz — der Rechner berücksichtigt die Divisormethode automatisch.',
      },
    ],
  },
  mietpreisbremse: {
    summary:
      'Prüft, ob deine Miete die gesetzliche Obergrenze der Mietpreisbremse (ortsübliche Vergleichsmiete + 10 %) einhält, inklusive Modernisierungszuschlag und Vormiete.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'BGB §§ 556d–556g (Mietpreisbremse), Kappungsgrenze Modernisierungszuschlag 3 EUR/qm/Monat (§ 559e BGB), Ausnahmen für Neubauten und Vollmodernisierungen.',
    sources: [
      {
        label: 'BGB § 556d: Zulässige Miethöhe bei Mietbeginn',
        url: 'https://www.gesetze-im-internet.de/bgb/__556d.html',
      },
      {
        label: 'BMJ: Mietpreisbremse erklärt',
        url: 'https://www.bmj.de/DE/themen/mietrecht/mietpreisbremse/mietpreisbremse_node.html',
      },
    ],
    disclaimer:
      'Die Mietpreisbremse gilt nur in Gebieten mit angespanntem Wohnungsmarkt (Landesverordnung). Ob deine Gemeinde darunter fällt, muss individuell geprüft werden. Dieser Rechner ersetzt keine Rechtsberatung.',
    scenarios: [
      {
        title: 'Neubauwohnung',
        text: 'Wohnungen, die nach dem 1. Oktober 2014 erstmals vermietet wurden, sind vollständig von der Mietpreisbremse ausgenommen.',
      },
      {
        title: 'Vormiete als Schutzschild',
        text: 'War die Vormiete bereits höher als der zulässige Wert, darf der neue Vermieter diese Miete weiterverlangen — ein "Bestandsschutz" für die Höhe.',
      },
      {
        title: 'Modernisierungszuschlag',
        text: 'Nach einer umfassenden Modernisierung kann ein Zuschlag von bis zu 8 % der Kosten jährlich aufgeschlagen werden — gedeckelt auf 3 EUR/qm/Monat.',
      },
    ],
    faqs: [
      {
        question: 'Was ist die ortsübliche Vergleichsmiete?',
        answer:
          'Sie ergibt sich aus dem qualifizierten Mietspiegel der jeweiligen Gemeinde. Ohne solchen Mietspiegel können Gutachten oder Vergleichswohnungen herangezogen werden.',
      },
      {
        question: 'Was kann ich tun, wenn die Miete zu hoch ist?',
        answer:
          'Du kannst innerhalb von 30 Monaten nach Mietbeginn rügen — ab Zugang der Rüge muss der Vermieter die Miete auf das zulässige Maß senken. Vergangene Überzahlungen werden nur unter bestimmten Bedingungen zurückerstattet.',
      },
      {
        question: 'Gilt die Mietpreisbremse überall in Deutschland?',
        answer:
          'Nein. Jedes Bundesland muss per Verordnung festlegen, welche Gebiete als angespannt gelten. Viele Großstädte (Berlin, München, Hamburg) sind erfasst, ländliche Regionen oft nicht.',
      },
    ],
    howTo: [
      {
        title: '1. Mietspiegel recherchieren',
        description:
          'Suche den qualifizierten Mietspiegel deiner Stadt — er gibt die ortsübliche Vergleichsmiete für deine Wohnung an.',
      },
      {
        title: '2. Aktuelle Miete eingeben',
        description: 'Trag die vereinbarte Kaltmiete (ohne Nebenkosten) sowie die Wohnfläche ein.',
      },
      {
        title: '3. Ausnahmen prüfen',
        description:
          'Handelt es sich um einen Neubau oder eine Vollmodernisierung? Dann gilt die Bremse nicht.',
      },
    ],
  },
  abfindung: {
    summary:
      'Berechnet die Steuerbelastung einer Abfindung nach der Fünftelregel (§ 34 EStG) im Vergleich zur normalen Besteuerung und zeigt die Ersparnis.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'EStG § 34 (Fünftelregelung für außerordentliche Einkünfte), Lohnsteuertabelle 2026 nach BMF-PAP.',
    sources: [
      {
        label: 'EStG § 34: Außerordentliche Einkünfte (Fünftelregel)',
        url: 'https://www.gesetze-im-internet.de/estg/__34.html',
      },
      {
        label: 'BMF: Programmablaufplan Lohnsteuer 2026',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026-anlage-1.pdf?__blob=publicationFile&v=2',
      },
    ],
    disclaimer:
      'Die Berechnung basiert auf einer vereinfachten Einkommensteuer-Formel ohne individuelle Freibeträge oder Sozialabgaben auf die Abfindung. Für eine verbindliche Steuerauskunft wende dich an einen Steuerberater.',
    scenarios: [
      {
        title: 'Fünftelregel lohnt sich besonders',
        text: 'Je höher die Abfindung im Verhältnis zum regulären Jahreseinkommen, desto größer die Steuerersparnis durch die Fünftelregel.',
      },
      {
        title: 'Abfindung im Niedrig-Einkommensjahr',
        text: 'Wer im Jahr der Abfindung z. B. nur halbjährig gearbeitet hat, profitiert doppelt — niedrigere Steuerbasis und Fünftelregel.',
      },
      {
        title: 'Faustformel verhandeln',
        text: 'Gesetzlich gibt es keinen Anspruch auf Abfindung. Die Faustformel (0,5 × Monatslohn × Dienstjahre) ist ein Verhandlungsrichtwert, kein Recht.',
      },
    ],
    faqs: [
      {
        question: 'Was ist die Fünftelregel?',
        answer:
          'Die Fünftelregel nach § 34 EStG ist eine Steuervergünstigung für Einmalzahlungen wie Abfindungen. Statt der Gesamtsumme wird nur ein Fünftel zum regulären Einkommen addiert — die Mehrsteuern werden dann mit fünf multipliziert. Das spart im Progressionsbereich erheblich Steuern.',
      },
      {
        question: 'Zahle ich Sozialabgaben auf die Abfindung?',
        answer:
          'Nein. Abfindungen sind grundsätzlich sozialversicherungsfrei, sofern sie echte Entschädigungen für den Jobverlust sind und nicht als Anerkennung für geleistete Arbeit gezahlt werden.',
      },
      {
        question: 'Wann gilt die Fünftelregel nicht?',
        answer:
          'Wenn die Abfindung in Raten ausgezahlt wird (kein Zuflussprinzip als Einmalzahlung) oder wenn das Finanzamt die Außerordentlichkeit verneint, kann die Vergünstigung versagt werden.',
      },
    ],
    howTo: [
      {
        title: '1. Abfindungsbetrag klären',
        description:
          'Nutze die Faustformel als Ausgangspunkt für die Verhandlung, trag dann den tatsächlich vereinbarten Betrag ein.',
      },
      {
        title: '2. Steuerklasse wählen',
        description:
          'Die Steuerklasse im Jahr der Abfindung ist entscheidend — wer z. B. im Jahr der Kündigung heiratet, kann ggf. Klasse III nutzen.',
      },
      {
        title: '3. Ersparnis ablesen',
        description:
          'Der Rechner zeigt direkt, wie viel du durch die Fünftelregel gegenüber normaler Besteuerung sparst.',
      },
    ],
  },
  rente: {
    summary:
      'Schätzt die gesetzliche Rente auf Basis von Entgeltpunkten, erwartetem Einkommen und Renteneintrittsalter — ohne Verbindung zur DRV, aber mit nachvollziehbarer Formel.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'Rentenformel der Deutschen Rentenversicherung (DRV), Rentenwert West Stand Juli 2025 (39,32 EUR), vorläufiges Durchschnittsentgelt 2025 (47.070 EUR).',
    sources: [
      {
        label: 'DRV: Rentenformel und Entgeltpunkte',
        url: 'https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Allgemeine-Informationen/Rentenberechnung/rentenberechnung_node.html',
      },
      {
        label: 'DRV: Aktueller Rentenwert',
        url: 'https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Allgemeine-Informationen/Rentenberechnung/rentenberechnung_node.html',
      },
      {
        label: 'Bundesregierung: Rentenpaket II',
        url: 'https://www.bundesregierung.de/breg-de/themen/rente',
      },
    ],
    disclaimer:
      'Dieser Rechner liefert eine rechnerische Näherung auf Basis der gesetzlichen Rentenformel. Maßgeblich ist allein die individuelle Renteninformation der Deutschen Rentenversicherung. Rentenwert und Durchschnittsentgelt werden jährlich angepasst.',
    scenarios: [
      {
        title: 'Frühzeitig in Rente',
        text: 'Jeder Monat vor 67 kostet 0,3 % Abschlag dauerhaft — bei 4 Jahren früher sind das 14,4 % weniger Rente lebenslang.',
      },
      {
        title: 'Später eintreten',
        text: 'Pro Monat nach dem 67. Geburtstag gibt es 0,6 % Zuschlag. Wer bis 70 arbeitet, bekommt dauerhaft 21,6 % mehr Rente.',
      },
      {
        title: 'Einkommenssteigerung',
        text: 'Höheres Einkommen erzeugt mehr Entgeltpunkte — bereits 2 % Lohnwachstum pro Jahr machen über 25 Jahre einen spürbaren Unterschied.',
      },
    ],
    faqs: [
      {
        question: 'Was sind Entgeltpunkte?',
        answer:
          'Entgeltpunkte messen, wie viel du im Verhältnis zum deutschen Durchschnittsverdienst verdient hast. Ein Punkt entspricht dem Jahresverdienst eines Durchschnittsverdieners. Den Gesamtstand findest du auf deiner jährlichen Renteninformation.',
      },
      {
        question: 'Wie genau ist die Schätzung?',
        answer:
          'Der Rechner nutzt die offizielle Rentenformel (Entgeltpunkte × Zugangsfaktor × Rentenwert), vereinfacht aber künftige Rentenwert-Anpassungen und Dynamik. Für verbindliche Aussagen ist die DRV-Renteninformation maßgeblich.',
      },
      {
        question: 'Was ist der Unterschied zwischen brutto und netto Rente?',
        answer:
          'Auf die gesetzliche Rente werden Kranken- und Pflegeversicherung sowie anteilig Einkommensteuer fällig. Der tatsächliche Auszahlungsbetrag liegt je nach Rentenhöhe und Steuerpflicht 15–25 % unter dem Brutto.',
      },
    ],
    howTo: [
      {
        title: '1. Renteninformation lesen',
        description:
          'Den aktuellen Stand deiner Entgeltpunkte findest du auf der jährlichen Renteninformation der DRV — trag diesen Wert direkt ein.',
      },
      {
        title: '2. Renteneintrittsalter variieren',
        description:
          'Vergleiche sofort, wie sich ein früherer oder späterer Eintritt auf den monatlichen Betrag auswirkt.',
      },
      {
        title: '3. Rentenlücke ableiten',
        description:
          'Halte dem geschätzten Rentenbetrag dein angestrebtes Netto im Alter gegenüber — die Differenz zeigt den Bedarf an privater Vorsorge.',
      },
    ],
  },
  krankengeld: {
    summary:
      'Berechnet das GKV-Krankengeld nach der gesetzlichen Formel (70 % des Brutto, max. 90 % des Netto) und zeigt Einkommensverlust und maximale Bezugsdauer.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'SGB V §§ 47–49 (Krankengeld), Beitragsbemessungsgrenze der GKV 2026 (5.812,50 EUR/Monat), Entgeltfortzahlungsgesetz (EFZG) § 3.',
    sources: [
      {
        label: 'SGB V § 47: Höhe und Berechnung des Krankengeldes',
        url: 'https://www.gesetze-im-internet.de/sgb_5/__47.html',
      },
      {
        label: 'Bundesgesundheitsministerium: Krankengeld',
        url: 'https://www.bundesgesundheitsministerium.de/themen/krankenversicherung/leistungen/krankengeld.html',
      },
    ],
    disclaimer:
      'Der Rechner gibt eine gesetzliche Näherung nach SGB V § 47. Für die tatsächliche Auszahlung ist deine Krankenkasse maßgeblich — abweichende Regelungen (z. B. tarifliche Aufstockung durch den Arbeitgeber) sind nicht berücksichtigt.',
    scenarios: [
      {
        title: 'Hohes Gehalt, hoher Verlust',
        text: 'Ab der Beitragsbemessungsgrenze (5.812 EUR/Monat) steigt das Krankengeld nicht weiter — der Einkommensverlust wächst mit höherem Gehalt stark.',
      },
      {
        title: 'PKV ohne Krankentagegeld',
        text: 'Privatversicherte erhalten kein GKV-Krankengeld. Ohne Krankentagegeld-Baustein fällt nach 6 Wochen das Einkommen vollständig weg.',
      },
      {
        title: 'Bezugsdauer ausschöpfen',
        text: 'GKV zahlt für dieselbe Erkrankung bis zu 72 Wochen Krankengeld. Danach greift — sofern berechtig — das Bürgergeld.',
      },
    ],
    faqs: [
      {
        question: 'Ab wann zahlt die Krankenkasse Krankengeld?',
        answer:
          'Nach der 6-wöchigen Lohnfortzahlung durch den Arbeitgeber springt die gesetzliche Krankenkasse ein. Die 6 Wochen gelten pro Erkrankung — bei einer neuen Krankheit beginnt die Frist neu.',
      },
      {
        question: 'Wie lange kann ich Krankengeld beziehen?',
        answer:
          'Für dieselbe Erkrankung zahlt die GKV maximal 78 Wochen innerhalb von 3 Jahren — abzüglich der 6 Wochen Entgeltfortzahlung also bis zu 72 Wochen.',
      },
      {
        question: 'Was gilt für Privatversicherte?',
        answer:
          'PKV-Versicherte haben keinen gesetzlichen Anspruch auf Krankengeld. Absicherung besteht nur, wenn ein Krankentagegeld-Baustein in der Police vereinbart wurde.',
      },
    ],
    howTo: [
      {
        title: '1. Brutto und Netto eingeben',
        description:
          'Trag dein aktuelles Monatsbrutto und -netto ein. Das Netto brauchst du, weil das Krankengeld auf max. 90 % des Tagesnetto gekappt ist.',
      },
      {
        title: '2. Versicherungsart wählen',
        description:
          'Bei GKV berechnet der Rechner das gesetzliche Krankengeld. Bei PKV kannst du dein vertraglich vereinbartes Krankentagegeld eingeben.',
      },
      {
        title: '3. Einkommensverlust einplanen',
        description:
          'Die Differenz zwischen Brutto und Krankengeld zeigt, wie groß deine monatliche Lücke ist — und wie viel Rücklage du benötigst.',
      },
    ],
  },
  nebenkosten: {
    summary:
      'Setzt die gesetzlichen Verteilschlüssel der Heizkostenverordnung um, um die Heizkosten-Last aus Gebäudeanteil und Eigenverbrauch zu simulieren.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'Vorgaben der Heizkostenverordnung (HeizkostenV) § 7 zur zwingenden Verteilung von zentralen Heizkosten.',
    sources: [
      {
        label: 'BMJ: Heizkostenverordnung (HeizkostenV) § 7',
        url: 'https://www.gesetze-im-internet.de/heizkostenv/__7.html',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Änderung des Verteilschlüssels',
        text: 'Bereits eine Verschiebung von 50/50 auf 70/30 (Verbrauch/Fläche) kann individuelles Heizverhalten massiv im Preis spürbar machen.',
      },
      {
        title: 'Starker Eigennutzer-Faktor',
        text: 'Bei einem verbrauchsorientierten Split zahlt ein starker Heizer deutlich mehr, selbst wenn die Wohnfläche klein bleibt.',
      },
      {
        title: 'Wärmepumpen-Effizienz',
        text: 'Eine hypothetische Umstellung auf Wärmepumpentechnik berechnet hier simulativ einen Effektivwerts-Faktor ein.',
      },
    ],
    faqs: [
      {
        question: 'Darf der Vermieter 100% nach Fläche abrechnen?',
        answer:
          'Nein. Laut Heizkostenverordnung müssen bei zentralen Heizanlagen mindestens 50 % und maximal 70 % über den tatsächlichen Verbrauch umgelegt werden.',
      },
      {
        question: 'Für wen ist dieser Rechner gedacht?',
        answer:
          'Mieter können grob plausibilisieren, ob ihre Verbrauchs- und Grundkostenanteile der Verordnung entsprechen und rechnerisch plausibel verknüpft wurden.',
      },
      {
        question: 'Sind Warmwasserkosten enthalten?',
        answer:
          'Nein, dieses Tool beschränkt sich streng auf die reine Heizungsverbrauchs-Allokation. Warmwasser muss auf der echten Nebenkostenabrechnung getrennt erfasst werden.',
      },
    ],
    howTo: [
      {
        title: '1. Haus-Gesamtkosten eintragen',
        description:
          'Starten Sie mit den aggregierten Heizkosten für das komplette Gebäude aus der Nebenkostenabrechnung.',
      },
      {
        title: '2. Verbrauch und Fläche verknüpfen',
        description:
          'Geben Sie Ihre relative Wohnfläche und Ihre persönlichen Verbrauchseinheiten ins Verhältnis zum Gesamtgebäude ein.',
      },
      {
        title: '3. Verteilschlüssel prüfen',
        description:
          'Plausibilisieren Sie den Rechnungsbetrag, indem Sie den zulässigen Verbrauchsanteil zwischen 50% und 70% justieren.',
      },
    ],
  },
  steuer: {
    summary:
      'Berechnet die voraussichtliche Einkommensteuer, den Solidaritätszuschlag und die Kirchensteuer auf Basis des zu versteuernden Einkommens nach individuellen Abzügen — auf Grundlage des aktuellen BMF-Programmablaufplans 2026.',
    updatedAt: '2026-04-23',
    checkedAgainst:
      'BMF Programmablaufplan (PAP) Lohnsteuer 2026, Grundfreibetrag 12.084 EUR, Kinderfreibetrag 6.672 EUR, Sonderausgaben-Pauschbetrag 36/72 EUR, Arbeitnehmer-Pauschbetrag 1.230 EUR.',
    sources: [
      {
        label: 'BMF: Programmablaufplan Lohnsteuer 2026',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026-anlage-1.pdf?__blob=publicationFile&v=2',
      },
      {
        label: 'BMF: Einkommensteuergesetz (EStG)',
        url: 'https://www.gesetze-im-internet.de/estg/',
      },
      {
        label: 'BMF: Grundfreibetrag und Kinderfreibetrag 2026',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/das-aendert-sich-2026.html',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Werbungskosten über Pauschale',
        text: 'Wer mehr als 1.230 EUR Werbungskosten nachweisen kann (z. B. Homeoffice, Fahrtkosten), mindert das zu versteuernde Einkommen direkt und spart sofort Steuern.',
      },
      {
        title: 'Ehegattensplitting',
        text: 'Verheiratete Paare profitieren vom Splittingtarif: Das gemeinsame Einkommen wird halbiert, versteuert und das Ergebnis verdoppelt — das senkt die Progression deutlich.',
      },
      {
        title: 'Grenzsteuersatz vs. Effektivrate',
        text: 'Der Grenzsteuersatz zeigt, was vom nächsten verdienten Euro nach Steuer bleibt. Er liegt immer über der Effektivrate, die alle Steuern zum Gesamteinkommen ins Verhältnis setzt.',
      },
    ],
    faqs: [
      {
        question: 'Was ist das zu versteuernde Einkommen (ZVE)?',
        answer:
          'Das ZVE ist das Einkommen, auf das Steuern berechnet werden — nach Abzug von Werbungskosten, Sonderausgaben und Vorsorgeaufwendungen vom Bruttoeinkommen. Je niedriger das ZVE, desto weniger Steuern fallen an.',
      },
      {
        question: 'Ab wann fällt kein Solidaritätszuschlag an?',
        answer:
          'Seit 2021 entfällt der Soli für die allermeisten Steuerzahler. Er greift erst wieder ab einer Einkommensteuer von etwa 18.130 EUR pro Jahr (2026). Oberhalb dieser Grenze gibt es eine Gleitzone, bevor der volle Satz von 5,5 % gilt.',
      },
      {
        question: 'Wie berechnet sich die Kirchensteuer?',
        answer:
          'Die Kirchensteuer beträgt in Bayern und Baden-Württemberg 8 % der Einkommensteuer, in allen anderen Bundesländern 9 %. Basis ist die festzusetzende Einkommensteuer nach Abzug des Kinderfreibetrags.',
      },
    ],
    howTo: [
      {
        title: '1. Jahreseinkommen eintragen',
        description: 'Gib dein Bruttojahreseinkommen (Lohn, Gehalt, Freelancer-Einnahmen) ein.',
      },
      {
        title: '2. Abzüge konkretisieren',
        description:
          'Passe Werbungskosten, Vorsorgeaufwendungen und Sonderausgaben an deine reale Situation an — die Pauschbeträge sind bereits vorbelegt.',
      },
      {
        title: '3. Steuerstatus und Kirchensteuer wählen',
        description:
          'Wähle Ledig oder Verheiratet und ob Kirchensteuer anfällt. Das Bundesland bestimmt den Kirchensteuersatz.',
      },
    ],
  },
  spar: {
    summary:
      'Berechnet den Vermögensaufbau durch Zinseszinseffekt und regelmäßige Einzahlungen — mit jahresgenauer Aufschlüsselung des Endbetrags in eigene Einzahlungen und erzielte Zinsen.',
    updatedAt: '2026-04-23',
    checkedAgainst:
      'Standard-Zinseszinsformel mit monatlicher Verzinsung (12 Perioden pro Jahr), üblich bei deutschen Spar- und Tagesgeldprodukten.',
    sources: [
      {
        label: 'Bundesbank: Zinssätze aktuell',
        url: 'https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/zinssaetze-und-renditen',
      },
      {
        label: 'Verbraucherzentrale: Sparformen im Überblick',
        url: 'https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/sparformen-im-ueberblick-was-lohnt-sich-13481',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Früher anfangen zahlt sich aus',
        text: 'Wer 10 Jahre früher mit demselben Betrag beginnt, kann bei gleichem Zinssatz oft doppelt so viel Vermögen aufbauen — der Zinseszinseffekt braucht Zeit.',
      },
      {
        title: 'Zinssatz verdoppeln vs. Einzahlung verdoppeln',
        text: 'Bei kurzen Laufzeiten hat eine höhere monatliche Rate mehr Einfluss als ein besserer Zins. Bei langen Laufzeiten dreht sich dieses Verhältnis um.',
      },
      {
        title: 'Kaufkraftverlust durch Inflation',
        text: 'Ein nominaler Endbetrag ist in 20 Jahren weniger wert als heute. Ziehe von deinem Zinssatz grob 2–3 % Inflationsrate ab, um den realen Kaufkraftgewinn abzuschätzen.',
      },
    ],
    faqs: [
      {
        question: 'Was ist der Zinseszinseffekt?',
        answer:
          'Zinseszins bedeutet, dass bereits gutgeschriebene Zinsen im nächsten Zeitraum selbst wieder verzinst werden. Je länger die Laufzeit, desto stärker wächst das Kapital exponentiell — Albert Einstein soll ihn das "achte Weltwunder" genannt haben.',
      },
      {
        question: 'Wie oft werden die Zinsen gutgeschrieben?',
        answer:
          'Dieser Rechner verwendet monatliche Verzinsung, wie sie bei Tagesgeldkonten und vielen Sparplänen üblich ist. Bei jährlicher Gutschrift wäre der Endbetrag minimal geringer.',
      },
      {
        question: 'Fallen auf Sparzinsen Steuern an?',
        answer:
          'Ja. Kapitalerträge — also Zinsen über dem Sparerpauschbetrag (1.000 EUR für Singles, 2.000 EUR für Paare) — unterliegen der Abgeltungsteuer von 25 % zzgl. Soli. Dieser Rechner zeigt Bruttozinsen vor Steuer.',
      },
    ],
    howTo: [
      {
        title: '1. Startbetrag und Einzahlung festlegen',
        description:
          'Gib dein vorhandenes Startkapital und die monatliche Sparrate ein, die du dir realistisch leisten kannst.',
      },
      {
        title: '2. Zinssatz recherchieren',
        description:
          'Trage den aktuellen Zinssatz deines Sparkontos oder ETF-Renditeannahme ein. Vergleiche verschiedene Szenarien.',
      },
      {
        title: '3. Laufzeit optimieren',
        description:
          'Verschiebe den Zeitraum-Slider und sieh, wie dramatisch frühere Starts oder längere Laufzeiten den Endbetrag verändern.',
      },
    ],
  },
  kredit: {
    summary:
      'Berechnet die monatliche Annuitätenrate, die Gesamtzinslast und den Tilgungsverlauf für Darlehen – inklusive optionaler Sondertilgung zur Laufzeitverkürzung.',
    updatedAt: '2026-04-23',
    checkedAgainst:
      'Annuitätenformel nach Standard-Bankpraxis (§ 489 ff. BGB), Effektivzinsberechnung gemäß PAngV (Preisangabenverordnung).',
    sources: [
      {
        label: 'BGB §§ 488–490: Darlehensvertrag',
        url: 'https://www.gesetze-im-internet.de/bgb/__488.html',
      },
      {
        label: 'PAngV: Preisangabenverordnung (Effektivzins)',
        url: 'https://www.gesetze-im-internet.de/pangv/',
      },
      {
        label: 'Verbraucherzentrale: Kreditrechner erklärt',
        url: 'https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/kredit-was-sie-wissen-muessen-11993',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Sondertilgung verdoppeln',
        text: 'Bereits 100 EUR Sondertilgung pro Monat bei einem 20.000 EUR Kredit können die Laufzeit um mehrere Monate verkürzen und hunderte Euro Zinsen sparen.',
      },
      {
        title: 'Zinssatz 1% höher',
        text: 'Ein um einen Prozentpunkt höherer Zinssatz erhöht die Gesamtzinslast bei langen Laufzeiten erheblich – der Effekt verstärkt sich mit der Laufzeit.',
      },
      {
        title: 'Kürzere Laufzeit, höhere Rate',
        text: 'Eine Halbierung der Laufzeit senkt die Gesamtzinsen drastisch, erhöht aber die monatliche Belastung deutlich – nur sinnvoll, wenn die Rate sicher tragbar bleibt.',
      },
    ],
    faqs: [
      {
        question: 'Was ist eine Annuitätenrate?',
        answer:
          'Eine Annuitätenrate ist eine gleichbleibende monatliche Zahlung, die sich aus einem Tilgungs- und einem Zinsanteil zusammensetzt. Der Zinsanteil sinkt mit der Zeit, weil die Restschuld abnimmt – der Tilgungsanteil steigt entsprechend.',
      },
      {
        question: 'Lohnt sich eine Sondertilgung?',
        answer:
          'Ja, fast immer. Jede Sondertilgung reduziert die Restschuld sofort, wodurch in den Folgeperioden weniger Zinsen anfallen. Prüfe vorab, ob dein Kreditvertrag Sondertilgungen erlaubt oder begrenzt.',
      },
      {
        question: 'Was ist der Unterschied zwischen Soll- und Effektivzins?',
        answer:
          'Der Sollzins (Nominalzins) beschreibt den reinen Zinssatz auf das Darlehen. Der Effektivzins nach PAngV schließt zusätzliche Kosten wie Bearbeitungsgebühren ein und ist der gesetzlich vorgeschriebene Vergleichswert.',
      },
    ],
    howTo: [
      {
        title: '1. Kreditsumme und Zinssatz eingeben',
        description:
          'Trage die gewünschte Darlehenssumme und den Sollzinssatz aus deinem Kreditangebot ein.',
      },
      {
        title: '2. Laufzeit wählen',
        description:
          'Teste verschiedene Laufzeiten und sieh sofort, wie sich die monatliche Rate und die Gesamtkosten verändern.',
      },
      {
        title: '3. Sondertilgung prüfen',
        description:
          'Trage eine monatliche Zusatztilgung ein und beobachte, wie stark sich die Laufzeit verkürzt und die Zinskosten sinken.',
      },
    ],
  },
  stundenrechner: {
    summary:
      'Berechnet Arbeitszeit aus Start, Ende und Pause, zeigt Dezimalstunden bzw. Industriestunden und erstellt optional einen kompakten Stundenzettel.',
    updatedAt: '2026-04-22',
    checkedAgainst:
      'Umrechnung von Stunden und Minuten in Dezimalstunden sowie Grundregeln zu Ruhepausen nach Arbeitszeitgesetz (ArbZG § 4).',
    sources: [
      {
        label: 'Arbeitszeitgesetz (ArbZG) § 4 Ruhepausen',
        url: 'https://www.gesetze-im-internet.de/arbzg/__4.html',
      },
    ],
    disclaimer:
      'Dieses Tool dient der rechnerischen Arbeitszeiterfassung. Es ersetzt keine verbindliche Prüfung von Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung oder Arbeitszeitgesetz.',
    scenarios: [
      {
        title: 'Arbeitszeit mit Pause',
        text: 'Startzeit, Endzeit und Pause reichen aus, um die Nettoarbeitszeit in Stunden und Minuten zu berechnen.',
      },
      {
        title: 'Dezimalstunden',
        text: '7 Stunden 30 Minuten werden als 7,5 h angezeigt. Das ist praktisch für Lohnabrechnung und Rechnungen.',
      },
      {
        title: 'Stundenzettel',
        text: 'Mehrere Tage lassen sich erfassen und anschließend als kompakter Arbeitszeitnachweis drucken oder als PDF sichern.',
      },
    ],
    faqs: [
      {
        question: 'Wie berechne ich Arbeitszeit mit Pause?',
        answer:
          'Gib die Startzeit, die Endzeit und die Pause in Minuten ein. Der Stundenrechner zieht die Pause von der Anwesenheitszeit ab und zeigt die Nettoarbeitszeit an.',
      },
      {
        question: 'Was sind Dezimalstunden oder Industriestunden?',
        answer:
          'Dezimalstunden stellen Minuten als Anteil einer Stunde dar. 7 Stunden und 30 Minuten entsprechen 7,5 h; 45 Minuten entsprechen 0,75 h. Das erleichtert Lohnberechnung und Rechnungen.',
      },
      {
        question: 'Wie werden Pausen nach Arbeitszeitgesetz berücksichtigt?',
        answer:
          'Der Rechner zieht nur die Pause ab, die du eingibst. Nach ArbZG sind bei mehr als 6 bis 9 Stunden Arbeit mindestens 30 Minuten Pause vorgesehen, bei mehr als 9 Stunden mindestens 45 Minuten.',
      },
      {
        question: 'Kann der Rechner Nachtschichten berechnen?',
        answer:
          'Ja. Wenn die Endzeit vor der Startzeit liegt, behandelt der Rechner das Ende als Folgetag. So lassen sich Schichten wie 22:00 bis 06:00 Uhr berechnen.',
      },
    ],
    howTo: [
      {
        title: '1. Von und bis eingeben',
        description:
          'Trage Startzeit und Endzeit deiner Arbeitszeit ein. Bei Nachtschichten darf die Endzeit am nächsten Tag liegen.',
      },
      {
        title: '2. Pause abziehen',
        description:
          'Gib die Pause in Minuten ein. Sie wird automatisch von der Anwesenheitszeit abgezogen.',
      },
      {
        title: '3. Ergebnis sichern',
        description:
          'Lies Arbeitszeit, Dezimalstunden und optional den Lohn ab. Den Stundenzettel kannst du drucken oder als PDF speichern.',
      },
    ],
  },
  arbeitslosengeld: {
    summary:
      'Berechnet das Arbeitslosengeld I nach SGB III: 60 % / 67 % mit Kind des letzten beitragspflichtigen Entgelts, inklusive Bezugsdauer und Einkommensverlust.',
    updatedAt: '2026-04-29',
    checkedAgainst:
      'SGB III § 149 (Leistungssatz), § 147 (Anwartschaftszeit), Beitragsbemessungsgrenze West 2026 (8.450 EUR).',
    sources: [
      {
        label: 'Bundesagentur für Arbeit: Arbeitslosengeld I 2026',
        url: 'https://www.arbeitsagentur.de/bildung/weiterbildung/foerdermoeglichkeiten/arbeitslosengeld-i',
      },
      {
        label: 'SGB III - Drittes Buch Sozialgesetzbuch',
        url: 'https://www.gesetze-im-internet.de/sgb_3/',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Mit Kind',
        text: 'Mit Kind(ern) im Haushalt erhöht sich der Leistungssatz von 60 % auf 67 % des letzten Nettolohns.',
      },
      {
        title: 'Lange Versicherungsdauer',
        text: 'Bei 24 Monaten Beitragszahlung in den letzten 2 Jahren verlängert sich die Bezugsdauer auf bis zu 12 Monate.',
      },
      {
        title: 'Beitragsbemessungsgrenze',
        text: 'Bei einem Brutto über 8.450 EUR / Monat (West) wird das Arbeitslosengeld nach der Bemessungsgrenze berechnet.',
      },
    ],
    faqs: [
      {
        question: 'Wer hat Anspruch auf Arbeitslosengeld I?',
        answer:
          'Arbeitnehmer, die in den letzten 2 Jahren vor der Arbeitslosigkeit mindestens 12 Monate in die Arbeitslosenversicherung eingezahlt haben und arbeitslos sind.',
      },
      {
        question: 'Wie hoch ist das Arbeitslosengeld I?',
        answer:
          '60 % des letzten beitragspflichtigen Nettoentgelts. Bei Arbeitnehmern mit mindestens einem Kind im Haushalt sind es 67 %.',
      },
      {
        question: 'Wie lange wird Arbeitslosengeld I gezahlt?',
        answer:
          'Die Bezugsdauer richtet sich nach der Dauer der Beitragszahlung: bei 12 Monaten Einzahlung: 6 Monate, bei 16 Monaten: 9 Monate, bei 20 Monaten: 10,5 Monate, bei 24+ Monaten: bis zu 12 Monate.',
      },
      {
        question: 'Wann beginnt die Zahlung?',
        answer:
          'Arbeitslosengeld I wird ab dem ersten Tag der Arbeitslosigkeit gezahlt, sofern der Anspruchemit dem Arbeitgeber frühzeitig gemeldet wurde.',
      },
    ],
    howTo: [
      {
        title: '1. Bruttolohn eingeben',
        description:
          'Trage dein monatliches Bruttogehalt aus dem letzten Beschäftigungsverhältnis ein.',
      },
      {
        title: '2. Nettolohn eingeben',
        description:
          'Trage dein monatliches Nettoeinkommen aus dem letzten Gehaltsabrechnung ein.',
      },
      {
        title: '3. Angaben zur Situation',
        description: 'Gib an, ob du Kinder hast und wie lange du in die Arbeitslosenversicherung eingezahlt hast.',
      },
      {
        title: '4. Ergebnis ablesen',
        description:
          'Der Rechner zeigt dein voraussichtliches Arbeitslosengeld I, die Bezugsdauer und den Einkommensverlust im Vergleich zu deinem vorherigen Lohn.',
      },
    ],
  },
  minijob: {
    summary:
      'Berechnet Minijob-Verdienst bis 538 €/Monat: Arbeitgebekosten mit Pauschalsteuer (15%), Arbeitnehmernetto mit optionaler Rentenversicherung (0%, 5% oder 15%).',
    updatedAt: '2026-04-29',
    checkedAgainst:
      'Minijob-Grenze 2026 (538 €/Monat), Pauschalbesteuerung § 40a EStG, RV-Pflicht nach SGB VI.',
    sources: [
      {
        label: 'Bundesregierung: Minijob-Grenze 2026',
        url: 'https://www.bundesregierung.de/breg-de/themen/arbeitnehmerrechte/minijob-538-euro',
      },
      {
        label: 'Minijob-Zentrale: Informationen für Arbeitgeber',
        url: 'https://www.minijob-zentrale.de',
      },
    ],
    disclaimer: COMMON_DISCLAIMER,
    scenarios: [
      {
        title: 'Bei 538 € Verdienst',
        text: 'Der Maximallohn für Minijobs. Arbeitgeber zahlt 15% Pauschalsteuer + 15% Sozialabgaben = 30% Aufschlag.',
      },
      {
        title: 'Mit Rentenversicherung',
        text: 'Arbeitnehmer kann freiwillig in die Rentenversicherung einzahlen – dann 15% (oder 5%) Abzug vom Brutto.',
      },
      {
        title: 'Vergleich zum Normaljob',
        text: 'Bei 538 € Minijob bleiben ~430 € netto (ohne RV). Ein Normaljob mit 538 € hätte durch Sozialabgaben deutlich weniger netto.',
      },
    ],
    faqs: [
      {
        question: 'Was ist ein Minijob?',
        answer:
          'Ein Minijob (geringfügige Beschäftigung) ist eine Arbeitsverhältnis mit maximal 538 € monatlichem Verdienst (2026). Er ist sozialversicherungsfrei (außer optional Rentenversicherung).',
      },
      {
        question: 'Muss ich als Minijobber Steuern zahlen?',
        answer:
          'Nein. Der Arbeitgeber zahlt eine Pauschalsteuer von 15% direkt an das Finanzamt. Für dich als Arbeitnehmer fällt keine Lohnsteuer an.',
      },
      {
        question: 'Kann ich als Minijobber in die Rentenversicherung einzahlen?',
        answer:
          'Ja, freiwillig. Du kannst zwischen 0% (beitragsfrei), 5% (ermäßigt) oder 15% (voll) wählen. Der Arbeitgeber zahlt keinen Anteil.',
      },
      {
        question: 'Wie hoch sind die Kosten für den Arbeitgeber?',
        answer:
          'Der Arbeitgeber zahlt dein Gehalt + 15% Pauschalsteuer + 15% Pauschalsozialabgaben = insgesamt 30% Aufschlag auf dein Bruttogehalt.',
      },
    ],
    howTo: [
      {
        title: '1. Monatsverdienst eingeben',
        description: 'Trage dein monatliches Gehalt aus dem Minijob ein (max. 538 €).',
      },
      {
        title: '2. Rentenversicherung wählen',
        description: 'Entscheide, ob du in die Rentenversicherung einzahlen möchtest (0%, 5% oder 15%).',
      },
      {
        title: '3. Ergebnis ablesen',
        description: 'Der Rechner zeigt dein Nettogehalt, die Arbeitgeberkosten und den Vergleich zu einem Normaljob.',
      },
    ],
  },
};
