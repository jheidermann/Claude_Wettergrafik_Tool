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

## Design / Layout (Stand: 18.06.2026)
Optik fürs Fernsehen, behutsam modernisiert. Nur Design angefasst, keine Logik.

**PNG-Ausgabe** – Proportionen zentral in den Layout-Objekten `EXPORT_FULL`
und `EXPORT_RIGHT` (im `<script>`):
- Ränder TV-tauglich und ausbalanciert (u. a. rechter Rand 140 px, damit die
  Kurve nicht am Bildrand klebt). Mod-Grafik hält rechts ~24 % frei
  (`EXPORT_RIGHT.padR = 470`).
- Schrift fürs TV vergrößert: Titel 58, Achsenzahlen 40, Achsentitel 44 px.
- **Farbverlauf** unter der Linie (Datenfarbe `.32` oben → `.02` unten); die
  Deckkraft oben ist die eine Stellschraube, falls zu kräftig/zart.
- **Akzentbalken** unter dem Titel in der Datenfarbe.
- Bewusst behutsam belassen: Gitter als Volllinie mit kräftiger Nulllinie,
  x-Achse mit Tick-Strichen. (Moderne Alternativen – gepunktetes Gitter,
  Petrol-Grundlinie, keine Ticks – wurden getestet, aber nicht übernommen.)

**Editor-Oberfläche** – nur CSS: größere Eckenradien (10 px), mehr Luft,
weicher Fokus-Ring, Hover-Zustände. Neuer Ton `--accent-strong` (`#1D4E68`)
in `:root` für den Primär-Button-Hover.

## Bewusst NICHT umgesetzt / geparkt
- Kein CSV-Import – Daten bleiben manuell (~24–30 Zeilen). Nicht vorschlagen.
- Geparkt für später: zweite y-Achse, Wettersymbole, mehrere Datenreihen,
  animierter Export. Erst auf Nachfrage aufgreifen.

## Arbeitsweise
- Nach jeder Änderung im Browser öffnen und prüfen (Graph erscheint, Export
  läuft), bevor committet wird.
- Committen und pushen macht Jörg selbst (GitHub Desktop).
- Browser-Vorschau über `.claude/launch.json` + `.claude/preview-server.js`
  (kleiner Node-Static-Server, kein `python3`). Reines Dev-Tooling.
- Vorsicht Versionsverwechslung: bei Wechsel zwischen Chat und Claude Code
  sicherstellen, dass beide auf demselben Repo-Stand aufsetzen.
