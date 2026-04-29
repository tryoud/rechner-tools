# Stundenrechner - Dokumentation

## Übersicht

Der Stundenrechner ist ein Tool zur Berechnung von Arbeitszeiten, Pausen und Lohn. Er ermöglicht es Benutzern, ihre Arbeitszeiten einzugeben, Pausen abzuziehen und automatisch die Industriestunden und den Lohn zu berechnen.

## Funktionen

### 1. Stundensatz

- **Beschreibung**: Der Benutzer kann seinen Stundensatz (brutto) eingeben, der mit den berechneten Industriestunden multipliziert wird, um den Gesamtlohn zu berechnen.
- **Eingabe**: Numerischer Wert in EUR/h
- **Bereich**: 0 bis 1000 EUR/h

### 2. Arbeitszeiten

- **Beschreibung**: Der Benutzer kann mehrere Arbeitstage hinzufügen und für jeden Tag die Startzeit, Endzeit und Pausen eingeben.
- **Eingaben**:
  - **Datum**: Datum des Arbeitstages
  - **Startzeit**: Startzeit der Arbeit (HH:MM)
  - **Endzeit**: Endzeit der Arbeit (HH:MM)
  - **Pause**: Pausenzeit in Minuten

### 3. Validierung

- **Endzeit vor Startzeit**: Der Stundenrechner warnt den Benutzer, wenn die Endzeit vor der Startzeit liegt.
- **Ungültige Eingaben**: Der Stundenrechner ignoriert ungültige Eingaben und zeigt eine Fehlermeldung an.

## Berechnungen

### 1. Arbeitszeitberechnung

- **Dauer**: Die Dauer wird als Differenz zwischen Endzeit und Startzeit berechnet.
- **Nachtarbeit**: Wenn die Endzeit vor der Startzeit liegt, wird angenommen, dass es sich um eine Nachtschicht handelt, und die Dauer wird entsprechend angepasst.
- **Netto-Arbeitszeit**: Die Pausenzeit wird von der Dauer abgezogen, um die Netto-Arbeitszeit zu berechnen.

### 2. Industriestunden

- **Gesamtminuten**: Die Netto-Arbeitszeiten aller Tage werden in Minuten summiert.
- **Industriestunden**: Die Gesamtminuten werden in Stunden umgerechnet (Gesamtminuten / 60).

### 3. Lohnberechnung

- **Gesamtlohn**: Der Gesamtlohn wird als Produkt aus Industriestunden und Stundensatz berechnet.

## Ergebnisdarstellung

### 1. Gesamtlohn

- **Wert**: Der berechnete Gesamtlohn in EUR.
- **Einheit**: EUR
- **Sekundärinformation**: Basierend auf dem eingegebenen Stundensatz.

### 2. Zusammenfassung

- **Gesamte Industriestunden**: Die summierten Industriestunden aller Tage.
- **Gesamte Arbeitszeit**: Die summierte Arbeitszeit im Format "hh:mm".
- **Erfasste Tage**: Die Anzahl der erfassten Arbeitstage.

## Beispiel

### Eingabe

- **Stundensatz**: 50 EUR/h
- **Arbeitstage**:
  - **Tag 1**: 08:00 - 16:30, Pause: 30 Minuten
  - **Tag 2**: 09:00 - 17:00, Pause: 30 Minuten

### Berechnung

- **Tag 1**:
  - Dauer: 8 Stunden 30 Minuten (510 Minuten)
  - Pause: 30 Minuten
  - Netto-Arbeitszeit: 8 Stunden (480 Minuten)
- **Tag 2**:
  - Dauer: 8 Stunden (480 Minuten)
  - Pause: 30 Minuten
  - Netto-Arbeitszeit: 7 Stunden 30 Minuten (450 Minuten)
- **Gesamtminuten**: 480 + 450 = 930 Minuten
- **Industriestunden**: 930 / 60 = 15.5 Stunden
- **Gesamtlohn**: 15.5 \* 50 = 775 EUR

### Ergebnis

- **Gesamtlohn**: 775 EUR
- **Gesamte Industriestunden**: 15.5 h
- **Gesamte Arbeitszeit**: 15h 30m
- **Erfasste Tage**: 2 Tage

## Technische Details

### Komponenten

- **StundenRechner**: Die Hauptkomponente, die den Stundenrechner implementiert.
- **NumberInput**: Eine wiederverwendbare Komponente für numerische Eingaben.
- **ResultCard**: Eine wiederverwendbare Komponente zur Darstellung der Ergebnisse.
- **BreakdownRow**: Eine wiederverwendbare Komponente zur Darstellung von Zusammenfassungszeilen.
- **Tooltip**: Eine wiederverwendbare Komponente zur Anzeige von Tooltips.

### Funktionen

- **calculateStundenrechner**: Die Hauptfunktion zur Berechnung der Arbeitszeiten und des Lohns.
- **usePersistentState**: Ein Hook zur Verwaltung des Zustands mit lokaler Speicherung.

### Performance-Optimierungen

- **useMemo**: Verwenden von `useMemo`, um unnötige Neu-Berechnungen zu vermeiden.
- **useCallback**: Verwenden von `useCallback`, um unnötige Neu-Renderings zu vermeiden.

## Lizenz

Dieses Projekt ist lizenziert unter den Bedingungen der MIT-Lizenz. Weitere Informationen finden Sie in der LICENSE-Datei.
