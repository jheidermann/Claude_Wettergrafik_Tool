# CLAUDE.md – Wettergrafik-Tool

## Was das ist
Einzelne HTML-Datei zur Visualisierung von Wetterdaten fürs Fernsehen
(Zeitreihen als Linie oder Balken). Hauptdatei: `wettergrafik.html`.

## Verhalten
- **Autospeichern (kein Bug, beabsichtigt):** Der komplette Arbeitsstand
  (Werte, Überschrift, Reihe, Einheit, Farbe, Typ, x-Format,
  Achsenbeschriftung, Höchst-/Tiefstwert, Layout, gezogene Label-Positionen)
  wird automatisch im Browser gespeichert (`localStorage`, Key `wettergrafik:v1`)
  und beim Öffnen wiederhergestellt. Ohne gespeicherten Stand startet das Beispiel.

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

## Design / Layout (Stand: 20.06.2026)
Optik fürs Fernsehen, behutsam modernisiert. (Achsen- und Label-Logik separat im
nächsten Abschnitt.)

**PNG-Ausgabe** – Proportionen zentral in den Layout-Objekten `EXPORT_FULL`,
`EXPORT_RIGHT` und `EXPORT_SQUARE` (im `<script>`):
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

**App-Export (1:1)** – dritte Exportvariante **1080×1080 px** für den
MDR-App-Ausspielweg (Layout-Umschalter „App (1:1)"). Eigenes Layout-Objekt
`EXPORT_SQUARE` mit eigenen Proportionen (bewusst NICHT von `EXPORT_FULL`
abgeleitet): schmalere Ränder → relativ mehr vertikaler Raum für den Graphen;
Schrift bewusst groß für kleine Screens (Titel 52, Achsenzahlen 38,
Achsentitel 42 px). Sonst gleiches Design wie 16:9 (Farben, Farbverlauf,
Akzentbalken, Extremwert-Marken). Export-Suffix `_App-Grafik`. Vorschau bleibt
WYSIWYG: Canvas-Seitenverhältnis folgt dem Layout (`draw()` über `exportDims()`).
Die 16:9-Exporte (Vollbild + Mod-Grafik, 1920×1080) sind unverändert.

**Editor-Oberfläche** – nur CSS: größere Eckenradien (10 px), mehr Luft,
weicher Fokus-Ring, Hover-Zustände. Neuer Ton `--accent-strong` (`#1D4E68`)
in `:root` für den Primär-Button-Hover.

## Achsen & Extremwert-Labels (Logik, Stand: 20.06.2026)

**Y-Achsen-Obergrenze – dynamisch mit Label-Kopffreiheit.** In `renderChart`:
Die oberste *beschriftete* Gitterlinie ist die nächste glatte Stufe über dem
Höchstwert (`topGrid = ceil(rawMax/step)*step`); der Plotrand `vMax` liegt nur so
viel höher, dass die Pixelhöhe des Höchstwert-Labels exakt über den Punkt passt
(`headFrac = (markGap+mark+markR)/plotH`). Ergebnis: Label immer oben, minimale
Luft, glatte Achse. Bewusst **schalter-unabhängig** (nutzt nirgends `markMax`),
damit die Achse beim Ein-/Ausblenden der Marken nicht springt. Frühere Varianten
(„+voller step" bzw. „ceil, +step nur exakt") wurden ersetzt.

**Extremwert-Labels.** Höchstwert über, Tiefstwert unter dem Punkt, horizontal
mittig (kein Randversatz). Punkt-zu-Label-Abstand `markGap` = 14 px (Vollbild/Mod)
bzw. 12 px (App).

**Drag & Drop der Labels.** Höchst-/Tiefstwert-Label sind mit der Maus frei
verschiebbar (Pointer-Events auf dem Canvas; Hit-Test über die beim Zeichnen
gemerkten Bounding-Boxen `MARK_BOXES`). Position als Offset-**Bruchteil** von
Breite/Höhe in `state.markMaxPos` / `state.markMinPos` → layoutübergreifend, im
`localStorage` gesichert und beim PNG-Export 1:1 übernommen (gleicher
`renderChart`-Pfad). **Doppelklick** auf ein Label = zurück auf zentriert;
`null` = zentriert (Default). Der Auto-Flip (oben/unten je nach Platz) greift nur,
solange ein Label nicht manuell positioniert ist. Bewusst **kein** Bildrand-
Anschlag und **keine** Verbindungslinie zum Punkt (beides bei Bedarf nachrüstbar).

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
