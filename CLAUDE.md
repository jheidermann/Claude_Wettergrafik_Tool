# CLAUDE.md – Wettergrafik-Tool

## Was das ist
Einzelne HTML-Datei zur Visualisierung von Wetterdaten fürs Fernsehen
(Zeitreihen als Linie oder Balken). Hauptdatei: `wettergrafik.html`.

## Verhalten
- **Autospeichern (kein Bug, beabsichtigt):** Der komplette Arbeitsstand
  (Werte, Überschrift, Reihe, Einheit, Farbe, Typ, x-Format,
  Achsenbeschriftung, Höchst-/Tiefstwert, Layout) wird automatisch im Browser
  gespeichert (`localStorage`, Key `wettergrafik:v1`) und beim Öffnen
  wiederhergestellt. Ohne gespeicherten Stand startet das Beispiel.

## Harte Regeln (nicht verletzen)
- **Eine HTML-Datei, Canvas pur.** Muss offline laufen: keine Bibliothek,
  kein CDN, kein Framework, kein Build. Doppelklick öffnet sie im Browser.
- **Bestehende Datei bearbeiten, nicht neu bauen.** Vor Änderungen den
  aktuellen Stand lesen.
- **Werteingabe per Komma:** Wert-Felder `type="text" inputmode="decimal"`,
  Anzeige in Komma-Schreibweise. NICHT auf `type="number"` umstellen.
- **Export-Dateiname beginnt mit DDMMYYYY** (Tag des Exports). Bewusst
  nicht-sortierbar wegen sender-interner Speicherlogik – nicht zu YYYYMMDD
  „korrigieren".
- **Daten stammen immer vom DWD oder kommerziellen Wetteranbietern.**

## Farben (AKT-Hausfarben)
- Hintergrund Creme: `#FFF8EF` (RGB 255 248 239)
- Beschriftung/Linien Petrol-Blau: `#235C7A` (RGB 35 92 122)
- Farben zentral in `:root`; Canvas liest sie per `getComputedStyle`.
  Werte nur dort ändern, nicht im JS hartkodieren.

## Bewusst NICHT umgesetzt / geparkt
- Kein CSV-Import – Daten bleiben manuell (~24–30 Zeilen). Nicht vorschlagen.
- Geparkt für später: zweite y-Achse, Wettersymbole, mehrere Datenreihen,
  animierter Export. Erst auf Nachfrage aufgreifen.

## Arbeitsweise
- Nach jeder Änderung im Browser öffnen und prüfen (Graph erscheint, Export
  läuft), bevor committet wird.
- Committen und pushen macht Jörg selbst (GitHub Desktop).
- Vorsicht Versionsverwechslung: bei Wechsel zwischen Chat und Claude Code
  sicherstellen, dass beide auf demselben Repo-Stand aufsetzen.
