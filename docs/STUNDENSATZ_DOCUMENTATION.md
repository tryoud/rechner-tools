# Stundensatz-Rechner - Dokumentation

## Übersicht

Der Stundensatz-Rechner ist ein Tool zur Berechnung des Stundensatzes für Freelancer. Er ermöglicht es Benutzern, ihren gewünschten Nettoverdienst, Fixkosten, Auslastung, Krankheitstage und Gewinnmarge einzugeben, um den erforderlichen Stundensatz zu berechnen.

## Funktionen

### 1. Zielnetto

- **Beschreibung**: Der gewünschte monatliche Nettoverdienst.
- **Eingabe**: Numerischer Wert in EUR
- **Bereich**: 0 bis unbegrenzt

### 2. Steuerrate

- **Beschreibung**: Die geschätzte Steuerrate in Prozent.
- **Eingabe**: Numerischer Wert in %
- **Bereich**: 0 bis 100 %

### 3. Umsatzsteuer

- **Beschreibung**: Die Umsatzsteueroption (Kleinunternehmerregelung oder Standard).
- **Eingabe**: Auswahl zwischen "Kleinunternehmer" und "Standard"

### 4. Krankenversicherung

- **Beschreibung**: Die Krankenversicherungsoption (gesetzlich oder privat).
- **Eingabe**: Auswahl zwischen "gesetzlich" und "privat"

### 5. Private Krankenversicherung

- **Beschreibung**: Die monatlichen Kosten für die private Krankenversicherung.
- **Eingabe**: Numerischer Wert in EUR
- **Bereich**: 0 bis unbegrenzt

### 6. Fixkosten

- **Beschreibung**: Die monatlichen Fixkosten.
- **Eingabe**: Numerischer Wert in EUR
- **Bereich**: 0 bis unbegrenzt

### 7. Altersvorsorge

- **Beschreibung**: Die monatlichen Rücklagen für die Altersvorsorge.
- **Eingabe**: Numerischer Wert in EUR
- **Bereich**: 0 bis unbegrenzt

### 8. Gewinnmarge

- **Beschreibung**: Die gewünschte Gewinnmarge in Prozent.
- **Eingabe**: Numerischer Wert in %
- **Bereich**: 0 bis 100 %

### 9. Auslastung

- **Beschreibung**: Die geschätzte Auslastung in Prozent.
- **Eingabe**: Numerischer Wert in %
- **Bereich**: 0 bis 100 %

### 10. Arbeitszeit

- **Beschreibung**: Die tägliche Arbeitszeit in Stunden.
- **Eingabe**: Numerischer Wert in Stunden
- **Bereich**: 0 bis 24 Stunden

### 11. Urlaubstage

- **Beschreibung**: Die Anzahl der Urlaubstage pro Jahr.
- **Eingabe**: Numerischer Wert in Tagen
- **Bereich**: 0 bis 365 Tage

### 12. Krankheitstage

- **Beschreibung**: Die geschätzte Anzahl der Krankheitstage pro Jahr.
- **Eingabe**: Numerischer Wert in Tagen
- **Bereich**: 0 bis 365 Tage

### 13. Verwaltungstage

- **Beschreibung**: Die Anzahl der Verwaltungstage pro Monat.
- **Eingabe**: Numerischer Wert in Tagen
- **Bereich**: 0 bis 31 Tage

## Berechnungen

### 1. Arbeitszeitberechnung

- **Arbeitstage pro Jahr**: Die Anzahl der Arbeitstage pro Jahr wird basierend auf der täglichen Arbeitszeit, Urlaubstagen, Krankheitstagen und Verwaltungstagen berechnet.
- **Abrechnungsstunden pro Jahr**: Die Anzahl der abrechnungsfähigen Stunden pro Jahr wird basierend auf den Arbeitstagen und der täglichen Arbeitszeit berechnet.

### 2. Kostenberechnung

- **Jährliche Fixkosten**: Die jährlichen Fixkosten werden basierend auf den monatlichen Fixkosten berechnet.
- **Jährliche Altersvorsorge**: Die jährlichen Rücklagen für die Altersvorsorge werden basierend auf den monatlichen Rücklagen berechnet.
- **Jährliche Krankenversicherung**: Die jährlichen Kosten für die private Krankenversicherung werden basierend auf den monatlichen Kosten berechnet.

### 3. Stundensatzberechnung

- **Netto-Stundensatz**: Der Netto-Stundensatz wird basierend auf dem gewünschten Nettoverdienst, den Fixkosten, der Altersvorsorge, der Krankenversicherung, der Gewinnmarge und der Auslastung berechnet.
- **Brutto-Stundensatz**: Der Brutto-Stundensatz wird basierend auf dem Netto-Stundensatz und der Umsatzsteueroption berechnet.

## Ergebnisdarstellung

### 1. Stundensatz

- **Netto-Stundensatz**: Der berechnete Netto-Stundensatz in EUR.
- **Brutto-Stundensatz**: Der berechnete Brutto-Stundensatz in EUR.

### 2. Zusammenfassung

- **Jährliche Fixkosten**: Die berechneten jährlichen Fixkosten in EUR.
- **Jährliche Altersvorsorge**: Die berechneten jährlichen Rücklagen für die Altersvorsorge in EUR.
- **Jährliche Krankenversicherung**: Die berechneten jährlichen Kosten für die private Krankenversicherung in EUR.
- **Abrechnungsstunden pro Jahr**: Die berechnete Anzahl der abrechnungsfähigen Stunden pro Jahr.
- **Auslastung**: Die eingegebene Auslastung in Prozent.

## Beispiel

### Eingabe

- **Zielnetto**: 4200 EUR
- **Steuerrate**: 30 %
- **Umsatzsteuer**: Standard
- **Krankenversicherung**: Privat
- **Private Krankenversicherung**: 650 EUR
- **Fixkosten**: 650 EUR
- **Altersvorsorge**: 400 EUR
- **Gewinnmarge**: 18 %
- **Auslastung**: 68 %
- **Arbeitszeit**: 6 Stunden/Tag
- **Urlaubstage**: 25 Tage
- **Krankheitstage**: 8 Tage
- **Verwaltungstage**: 1 Tag/Monat

### Berechnung

- **Arbeitstage pro Jahr**: 252 Tage - 25 Urlaubstage - 8 Krankheitstage - 12 Verwaltungstage = 207 Tage
- **Abrechnungsstunden pro Jahr**: 207 Tage \* 6 Stunden/Tag = 1242 Stunden
- **Jährliche Fixkosten**: 650 EUR \* 12 = 7800 EUR
- **Jährliche Altersvorsorge**: 400 EUR \* 12 = 4800 EUR
- **Jährliche Krankenversicherung**: 650 EUR \* 12 = 7800 EUR
- **Netto-Stundensatz**: (4200 EUR _ 12 + 7800 EUR + 4800 EUR + 7800 EUR) / (1242 Stunden _ 0.68) \* 1.18 ≈ 100 EUR
- **Brutto-Stundensatz**: 100 EUR \* 1.19 ≈ 119 EUR

### Ergebnis

- **Netto-Stundensatz**: 100 EUR
- **Brutto-Stundensatz**: 119 EUR

## Technische Details

### Komponenten

- **StundensatzRechner**: Die Hauptkomponente, die den Stundensatz-Rechner implementiert.
- **NumberInput**: Eine wiederverwendbare Komponente für numerische Eingaben.
- **ResultCard**: Eine wiederverwendbare Komponente zur Darstellung der Ergebnisse.
- **BreakdownRow**: Eine wiederverwendbare Komponente zur Darstellung von Zusammenfassungszeilen.
- **Tooltip**: Eine wiederverwendbare Komponente zur Anzeige von Tooltips.

### Funktionen

- **calculateStundensatz**: Die Hauptfunktion zur Berechnung des Stundensatzes.
- **usePersistentState**: Ein Hook zur Verwaltung des Zustands mit lokaler Speicherung.

### Performance-Optimierungen

- **useMemo**: Verwenden von `useMemo`, um unnötige Neu-Berechnungen zu vermeiden.
- **useCallback**: Verwenden von `useCallback`, um unnötige Neu-Renderings zu vermeiden.

## Lizenz

Dieses Projekt ist lizenziert unter den Bedingungen der MIT-Lizenz. Weitere Informationen finden Sie in der LICENSE-Datei.
