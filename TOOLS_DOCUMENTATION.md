# Zentrale Dokumentation für Tools

Dieses Dokument bietet eine Übersicht über alle verfügbaren Tools in diesem Projekt. Jedes Tool ist mit einer kurzen Beschreibung und den wichtigsten Merkmalen dokumentiert.

## Übersicht der Tools

### 1. Stundenrechner (Arbeitszeit)

- **ID**: `stundenrechner`
- **Kategorie**: Arbeit
- **Beschreibung**: Einfacher Stundenzettel: Arbeitszeiten eingeben, Pausen abziehen und automatisch Industriestunden und Lohn berechnen.
- **Verfügbarkeit**: Verfügbar
- **Neu**: Ja
- **Phase**: Live
- **Verkehr**: ~180k/Monat

### 2. Stundensatz-Rechner

- **ID**: `stundensatz`
- **Kategorie**: Selbstständigkeit
- **Beschreibung**: Freelancer-Satz aus Zielnetto, Fixkosten, Auslastung, Krankheit und Gewinnmarge sauber herleiten.
- **Verfügbarkeit**: Verfügbar
- **Neu**: Ja
- **Phase**: Live
- **Verkehr**: ~10k/Monat

### 3. Brutto-Netto-Rechner

- **ID**: `brutto-netto`
- **Kategorie**: Gehalt
- **Beschreibung**: Netto für 2026 aus Brutto, Steuerklasse, Kirchensteuer, Sozialabgaben und Firmenwagen abschätzen.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~200k/Monat

### 4. Nebenkosten-Rechner

- **ID**: `nebenkosten`
- **Kategorie**: Wohnen
- **Beschreibung**: Heizkosten nach Verbrauch und Fläche verteilen, Benchmarks prüfen und What-if-Szenarien testen.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~30k/Monat

### 5. Elterngeld-Rechner

- **ID**: `elterngeld`
- **Kategorie**: Familie
- **Beschreibung**: Basiselterngeld und ElterngeldPlus mit Sockel, Deckel und Geschwisterbonus strukturiert vergleichen.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~50k/Monat

### 6. Gewerbesteuer-Rechner

- **ID**: `gewerbesteuer`
- **Kategorie**: Selbstständigkeit
- **Beschreibung**: Gewerbesteuer aus Ertrag, Steuermesszahl und Hebesatz berechnen — mit Freibetrag, Hinzurechnungen und ESt-Anrechnung.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~12k/Monat

### 7. Urlaubsgeld-Rechner

- **ID**: `sonderzahlung`
- **Kategorie**: Gehalt
- **Beschreibung**: Nettobetrag von Urlaubsgeld und Weihnachtsgeld berechnen — nach Lohnsteuer, Soli und Sozialversicherung.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~8k/Monat

### 8. Kapitalertrag-Rechner

- **ID**: `kapitalertrag`
- **Kategorie**: Finanzen
- **Beschreibung**: Abgeltungsteuer, Soli und Kirchensteuer auf Kapitalerträge berechnen — nach Sparerpauschbetrag und Verlusten.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~35k/Monat

### 9. Mietpreisbremse-Rechner

- **ID**: `mietpreisbremse`
- **Kategorie**: Wohnen
- **Beschreibung**: Prüfe, ob deine Miete die gesetzliche Obergrenze einhält — inklusive Modernisierungszuschlag und Vormiete.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~25k/Monat

### 10. Abfindungs-Rechner

- **ID**: `abfindung`
- **Kategorie**: Arbeit
- **Beschreibung**: Abfindung nach Fünftelregel (§ 34 EStG) berechnen und Steuerersparnis gegenüber normaler Besteuerung ablesen.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~15k/Monat

### 11. Renten-Rechner

- **ID**: `rente`
- **Kategorie**: Altersvorsorge
- **Beschreibung**: Gesetzliche Rente aus Entgeltpunkten, Einkommen und Renteneintrittsalter schätzen — mit Ab- und Zuschlägen.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~150k/Monat

### 12. Krankengeld-Rechner

- **ID**: `krankengeld`
- **Kategorie**: Soziales
- **Beschreibung**: GKV-Krankengeld nach SGB V § 47 berechnen: 70 % des Brutto, max. 90 % des Netto, Bezugsdauer und Einkommensverlust.
- **Verfügbarkeit**: Verfügbar
- **Phase**: Live
- **Verkehr**: ~80k/Monat

## Verwendung der Tools

Jedes Tool ist als separate Komponente implementiert und kann in den entsprechenden Astro-Seiten eingebunden werden. Die Tools sind in der Datei `src/lib/tools.ts` definiert und können über ihre `id` oder `slug` referenziert werden.

## Beispiel

Um ein Tool in einer Astro-Seite zu verwenden, können Sie die entsprechende Komponente importieren und einbinden:

```astro
---
import Stundenrechner from '../components/tools/Stundenrechner.tsx';
---

<Stundenrechner />
```

## Weitere Informationen

Für detaillierte Informationen zu jedem Tool, einschließlich der Implementierungsdetails und der verfügbaren Props, lesen Sie bitte die entsprechende Dokumentation in den jeweiligen Komponenten-Dateien.

## Lizenz

Dieses Projekt ist lizenziert unter den Bedingungen der MIT-Lizenz. Weitere Informationen finden Sie in der LICENSE-Datei.
