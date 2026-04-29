# Kreditrechner - Dokumentation

## Übersicht

Der Kreditrechner ist ein Tool zur Berechnung von monatlichen Raten, Zinsen und Tilgungsplänen für Kredite. Er ermöglicht es Benutzern, die Höhe des Kredits, den Zinssatz und die Laufzeit einzugeben, um die monatlichen Raten und die Gesamtkosten des Kredits zu berechnen.

## Funktionen

### 1. Kreditsumme
- **Beschreibung**: Die Höhe des Kredits, den du aufnehmen möchtest.
- **Eingabe**: Numerischer Wert in EUR
- **Bereich**: 1000 bis 1.000.000 EUR

### 2. Zinssatz
- **Beschreibung**: Der jährliche Zinssatz für den Kredit.
- **Eingabe**: Numerischer Wert in %
- **Bereich**: 0.1 bis 20 %

### 3. Laufzeit
- **Beschreibung**: Die Laufzeit des Kredits in Jahren.
- **Eingabe**: Numerischer Wert in Jahren
- **Bereich**: 1 bis 30 Jahre

## Berechnungen

### 1. Monatliche Rate
- **Formel**: Die monatliche Rate wird mit der folgenden Formel berechnet:
  ```
  Monatliche Rate = (Kreditsumme * monatlicher Zinssatz) / (1 - (1 + monatlicher Zinssatz) ^ -Laufzeit in Monaten)
  ```
- **Monatlicher Zinssatz**: Der jährliche Zinssatz geteilt durch 12.
- **Laufzeit in Monaten**: Die Laufzeit in Jahren multipliziert mit 12.

### 2. Gesamtzahlung
- **Formel**: Die Gesamtzahlung ist die monatliche Rate multipliziert mit der Laufzeit in Monaten.

### 3. Gesamtzinsen
- **Formel**: Die Gesamtzinsen sind die Gesamtzahlung minus die Kreditsumme.

## Ergebnisdarstellung

### 1. Monatliche Rate
- **Wert**: Die berechnete monatliche Rate in EUR.
- **Einheit**: EUR
- **Sekundärinformation**: Basierend auf der eingegebenen Kreditsumme.

### 2. Zusammenfassung
- **Gesamtzahlung**: Die berechnete Gesamtzahlung in EUR.
- **Gesamtzinsen**: Die berechneten Gesamtzinsen in EUR.
- **Zinssatz**: Der eingegebene Zinssatz in %.

## Beispiel

### Eingabe
- **Kreditsumme**: 10.000 EUR
- **Zinssatz**: 3.5 %
- **Laufzeit**: 5 Jahre

### Berechnung
- **Monatlicher Zinssatz**: 3.5 / 100 / 12 = 0.0029167
- **Laufzeit in Monaten**: 5 * 12 = 60
- **Monatliche Rate**: (10000 * 0.0029167) / (1 - (1 + 0.0029167) ^ -60) ≈ 181.82 EUR
- **Gesamtzahlung**: 181.82 * 60 ≈ 10.909,20 EUR
- **Gesamtzinsen**: 10.909,20 - 10.000 ≈ 909,20 EUR

### Ergebnis
- **Monatliche Rate**: 181,82 EUR
- **Gesamtzahlung**: 10.909,20 EUR
- **Gesamtzinsen**: 909,20 EUR
- **Zinssatz**: 3,5 %

## Technische Details

### Komponenten
- **Kreditrechner**: Die Hauptkomponente, die den Kreditrechner implementiert.
- **NumberInput**: Eine wiederverwendbare Komponente für numerische Eingaben.
- **ResultCard**: Eine wiederverwendbare Komponente zur Darstellung der Ergebnisse.
- **BreakdownRow**: Eine wiederverwendbare Komponente zur Darstellung von Zusammenfassungszeilen.

### Funktionen
- **useMemo**: Verwenden von `useMemo`, um unnötige Neu-Berechnungen zu vermeiden.

### Performance-Optimierungen
- **useMemo**: Verwenden von `useMemo`, um unnötige Neu-Berechnungen zu vermeiden.

## Lizenz

Dieses Projekt ist lizenziert unter den Bedingungen der MIT-Lizenz. Weitere Informationen finden Sie in der LICENSE-Datei.