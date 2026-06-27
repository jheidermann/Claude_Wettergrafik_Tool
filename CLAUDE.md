# CLAUDE.md – Wettergrafik-Tool

## Was das ist
Einzelne HTML-Datei zur Visualisierung von Wetterdaten fürs Fernsehen
(Zeitreihen als Linie oder Balken). Hauptdatei: `wettergrafik.html`.

## Verhalten
- **Autospeichern (kein Bug, beabsichtigt):** Der komplette Arbeitsstand
  (Werte, Überschrift, Reihe, Einheit, Farbe, Typ, x-Format,
  Achsenbeschriftung, Höchst-/Tiefstwert, „Werte ausblenden", Layout, gezogene
  Label-Positionen) wird automatisch im Browser gespeichert (`localStorage`, Key
  `wettergrafik:v1`) und beim Öffnen wiederhergestellt. Ohne gespeicherten Stand
  startet das Beispiel.
- **Speichern entkoppelt von `draw()` (Stand: 28.06.2026):** `draw()` ruft nicht
  mehr direkt `saveState()`, sondern `scheduleSave()` – ein 400-ms-Debounce, damit
  schnelle Aktionen (Label-Ziehen, Fenster-Resize) nicht bei jedem Frame in den
  `localStorage` schreiben. Drag-Ende (`endMarkDrag`) sichert sofort; ein
  `beforeunload`-Listener flusht den ausstehenden Stand beim Schließen. Von außen
  identisches Verhalten, nur ohne Schreibflut.
- **Datenverlust-Schutz (Stand: 28.06.2026):** „Beispiel laden" und „CSV laden"
  fragen vor dem Überschreiben nach (`confirm`), **aber nur wenn bereits Werte
  eingegeben sind** (`state.data.some(d=>d.value!=null)`). Leerer/frischer Stand →
  keine Rückfrage. „Leeren" fragt wie bisher.

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

## Design / Layout (Stand: 23.06.2026)
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
- Aufräumung (28.06.2026): ungenutzte Keys `dot` und `tickGap` aus den
  Layout-Objekten entfernt (wurden nirgends gelesen). Beim Nachjustieren der
  Proportionen also keine Wirkung mehr erwarten/suchen.

**App-Export (1:1)** – dritte Exportvariante **1080×1080 px** für den
MDR-App-Ausspielweg (Layout-Umschalter „App (1:1)"). Eigenes Layout-Objekt
`EXPORT_SQUARE` mit eigenen Proportionen (bewusst NICHT von `EXPORT_FULL`
abgeleitet): schmalere Ränder → relativ mehr vertikaler Raum für den Graphen;
Schrift bewusst groß für kleine Screens (Titel 52, Achsenzahlen 38,
Achsentitel 42 px). Sonst gleiches Design wie 16:9 (Farben, Farbverlauf,
Akzentbalken, Extremwert-Marken). Export-Suffix `_App-Grafik`. Vorschau bleibt
WYSIWYG: Canvas-Seitenverhältnis folgt dem Layout (`draw()` über `exportDims()`).
Die 16:9-Exporte (Vollbild + Mod-Grafik, 1920×1080) sind unverändert.

**Mod-Grafik – Trennlinie oben (Stand: 23.06.2026)** – Dünne Petrol-Trennlinie
(`#235C7A` aus `:root`) am oberen Rand, **nur in der Mod-Variante** (Flag
`topRule:true` in `EXPORT_RIGHT`). Grund: Auf Sendung sitzt direkt über der Grafik
die helle Chyron-Überschrift (z. B. „Sommertag und Co", kommt vom Chyron-System,
nicht aus dem Tool) – ohne Linie liefe die helle Grafik randlos in die helle
Überschrift. **2D-Verlauf:** oben voll → nach unten transparent UND links voll →
rechts knapp vor der Moderationsfläche ausgelaufen. Umsetzung als Erstes in
`renderChart` über ein **Offscreen-Canvas** (vertikaler Verlauf zeichnen, dann
horizontaler Verlauf per `destination-in` als Maske – bewusst Offscreen, sonst
würde die Maske den ganzen Haupt-Canvas mitlöschen). **Zwei Stellschrauben** im
Layout-Objekt `EXPORT_RIGHT`: `topRuleH` (Bandhöhe, 11 px) und `topRuleA`
(Deckkraft oben, 0,5 = dezent). Die horizontale Auslauf-Position steckt in den
Gradient-Stops in `renderChart` (~0,72–0,78 der Breite, knapp vor `padR`).
**Vollbild und App 1:1 bewusst ohne Linie** (kein Flag) – bei Bedarf später per
`topRule` nachrüstbar.

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
Am Canvas ist `touch-action:none` gesetzt, damit das Ziehen auf Touchgeräten nicht
mit dem Scrollen kollidiert.

**„Werte ausblenden" – leerer Rahmen (Stand: 28.06.2026).** Schalter im Bedienfeld
(`#hideValues`, `state.hideValues`). Ist er aktiv, zeichnet `renderChart` **nur den
Rahmen** (Achsen, Gitter, x-/y-Beschriftung, Einheit, Titel + Akzentbalken, ggf.
Mod-Trennlinie), aber **keine** Kurve/Balken und **keine** Extremwert-Marken
(beide Blöcke per `if(!state.hideValues)` übersprungen). **Kernpunkt:** Die
y-Skala und die x-Labels werden weiter aus den **eingegebenen Werten** berechnet
(die Werte bleiben im `state`, nur die Darstellung entfällt) – dadurch sind leerer
und gefüllter Export **deckungsgleich**, beim Einblenden auf Sendung springt nichts.
Die schalter-unabhängige Kopffreiheit (`headFrac`, s. o.) sorgt zusätzlich dafür,
dass die Obergrenze nicht wandert. **Anwendung:** Werte eintragen → Häkchen an →
leeren Rahmen exportieren → Häkchen aus → gefüllte Grafik exportieren. Der Schalter
wird mitgespeichert. Export-Button bleibt aktiv, solange Werte vorhanden sind
(leerer Rahmen ganz ohne Daten ist nicht vorgesehen – ohne Daten keine Skala).
Geparkt: ein Button „beide PNGs auf einmal".

## x-Achsen-Auto-Befüllung (Logik, Stand: 25.06.2026)

**Prinzip.** Die Zeitspalte (x-Achse) füllt sich aus dem **Inhalt des ersten
Feldes** – nicht aus einem festen Startwert. Zentrale Funktion `fillTimesData()`
schreibt die Felder **2…n**; `fillFrom(fmt,first)` liefert die Sequenzfunktion
`i=>Label` **oder `null`**. Erstes Feld leer/ungültig → `null` → **gar nicht
befüllen** (kein hartes 00:00 / Mo / heute). **Feld 1 bleibt beim Tippen/Blur
immer unangetastet** – da bist nur du die Quelle. Schrittweite immer +1 Einheit.

**Auslöser.** `focusout`/Enter des **ersten** Zeit-Felds (bewusst **nicht**
`oninput`). Erneutes Ändern von Feld 1 überschreibt 2…n komplett neu – auch
manuell korrigierte.

**Fortsetzung je Format.**
- **Uhrzeit:** +1 h, modulo 24 (`23:00`→`00:00`), Anzeige zweistellig `HH:00`.
- **Wochentage:** zyklisch So→Mo, in der **eingegebenen Schreibweise** – kurz
  (`Mo`) oder lang (`Montag`) erkannt, Groß-/Kleinschreibung des ersten Feldes
  gespiegelt (`caseStyler`, `WD`/`WD_LONG`).
- **Datum:** +1 Tag mit echter Kalenderlogik (Monatslängen, Schaltjahr) per
  **reiner Zahlen-Arithmetik** (`addDays`/`daysInMonth`/`isLeap`) – bewusst
  **kein** `Date.setDate`/UTC (vermeidet Zeitzonen-Verschiebung). Eingabeformat
  gespiegelt: mit/ohne Jahr, 2- oder 4-stellig (`parseDateParts`/`fmtDateParts`).
- **Jahre:** +1 Jahr, **vierstellig** (`2024`→`2025`). Erstes Feld muss genau
  vier Ziffern sein, sonst keine Befüllung (`fillFrom`-Zweig). **x-Achse
  beschriftet nur jedes 10. Jahr ab dem Startjahr** – fester `stepK=10` in
  `renderChart` statt der sonstigen Auto-Ausdünnung (z. B. 1975, 1985, … 2025);
  Tick-Striche an denselben Stellen. (Kantenfall: unter 11 Jahren nur das
  Startjahr-Label – bewusst, „jedes 10. ab Start".)
- **Eigene:** keine Automatik.

**Formatwechsel.** Wechsel im Dropdown setzt das **erste Feld auf „heute/jetzt"**
im neuen Format (`defaultFirst`: aktuelle Stunde / heutiger Wochentag / heutiges
Datum / aktuelles Jahr), dann Spalte neu befüllen. Grund: der alte Wert im alten Format wäre
sinnlos (sonst bliebe z. B. `06:00` bei Wechsel auf Wochentag stehen). Das ist
**bewusst anderes** Verhalten als beim Tippen/Blur (dort bleibt Feld 1 stehen) –
zwei Auslöser, zwei gewollte Verhalten.

**Feldanzahl ändern.** `+ Zeile`/Löschen/Enter ergänzen bzw. kürzen am Ende und
setzen die Sequenz über **dieselbe** `fillTimesData()` fort.

**Button „Zeitspalte nach Format füllen"** = manuelles „neu füllen" (gleiche
Funktion, respektiert ebenfalls leeres/ungültiges Feld 1 → keine Befüllung).

**Beim Laden wird NICHT automatisch gefüllt** – sonst würden manuell korrigierte
Labels bei jedem Öffnen überschrieben. Ein (alt)inkonsistenter `localStorage`-Stand
(Format X, Spalte aber im alten Format) korrigiert sich erst beim nächsten
Formatwechsel oder Feld-1-Blur. Kein Bug.

**Format „Stunden" entfernt** (aus dem Dropdown). Alte gespeicherte Stände mit
`xformat:"stunden"` migrieren beim Laden zu `"eigene"` (Labels bleiben erhalten).

**Kein Re-Render-Loop.** Die Auto-Befüllung zieht nur die DOM-Werte der Zeitspalte
nach (`syncTimeInputs`, setzt `input.value` → feuert **keine** Events) und ruft
`draw()`; ein `rebuilding`-Guard fängt das durch `renderRows()` (via
`innerHTML=""`) ausgelöste `focusout` ab, sodass die Befüllung sich nicht selbst
neu triggert.

## CSV-Import (Logik, Stand: 25.06.2026)

**Button „CSV laden"** (neben „Beispiel laden"). Liest eine **zweispaltige CSV
lokal im Browser** (`<input type=file>` + `FileReader` – kein Upload, kein Server,
offline). Funktionen `parseCSV` (lesen) und `applyCSV` (anwenden). Anlass: 50er-
Zeitreihen (z. B. Hitzetage je Jahr) tippt man nicht von Hand – die frühere
„kein CSV-Import"-Park-Regel ist damit überholt.

**Format.** Spalte 1 = x-Label, Spalte 2 = Wert (Reihenfolge zählt, nicht der
Spaltenname). **Trenner automatisch** aus der ersten Zeile (Komma/Semikolon/Tab).
**Kopfzeile** wird erkannt, wenn ihre zweite Zelle keine Zahl ist – ihr Text wird
**Reihenname** (`state.name`). Werte mit Komma- **oder** Punkt-Dezimal; leere
Zelle → `null` (Lücke). **Sind alle Labels vierstellige Jahre → Format
automatisch „Jahre"** (`xformat`/`xlabel`).

**Beim Import gesetzt:** Daten, Reihenname, ggf. „Jahre"-Format,
`markMaxPos`/`markMinPos` zurück auf zentriert. **Einheit wird geleert** (eine
CSV kennt keine Einheit – du trägst „Tage" o. ä. selbst ein). Diagrammtyp,
Farbe, Layout bleiben unangetastet.

**Leer-Warnungen (Stand: 28.06.2026):** Datei mit echten Werten vorhanden →
Rückfrage vor dem Überschreiben (s. Datenverlust-Schutz oben). Werden zwar Zeilen,
aber **keine** numerischen Werte erkannt (Spalte 2 leer/nicht-numerisch, oder
Dezimal-Komma kollidiert mit Komma-Trenner), kommt jetzt ein **expliziter
Hinweis** (`applyCSV` prüft `rows.some(r=>r.value!=null)`) inkl. Tipp auf
Semikolon-Trennung – statt stummer Leeransicht.

**Station aus dem Dateinamen** (`stationFromName`): Endung weg, `_`/`-` →
Leerzeichen, ein **führendes Wort, das dem Reihennamen entspricht** (z. B.
`hitzetage`) fällt weg, Wortanfänge groß → `hitzetage_magdeburg.csv` →
**„Magdeburg"**. Wird **als Überschrift vorbefüllt** (`state.chartTitle`,
editierbar) **und** in `state.station` gemerkt.

**Export-Dateiname-Fallback.** `basis = chartTitle || station || name`. Leerst du
die Überschrift (z. B. weil die Chyron-Überschrift auf Sendung kommt), trägt die
PNG-Datei trotzdem die Station (`DDMMYYYY_Magdeburg_…`). `state.station` wird im
`localStorage` mitgesichert; `applyStateToUI` zeigt sie als Platzhalter, wenn das
Feld leer ist. **„Beispiel laden"** setzt Überschrift **und** Station zurück
(kein hängender Titel über Beispieldaten).

**Bewusst (noch) nicht:** Dezimalwerte mit Komma-Trenner kollidieren mit dem
Dezimal-Komma → dann CSV mit **Semikolon** trennen (für ganzzahlige Reihen wie
Hitzetage irrelevant; „im Auge behalten"). Kein Spalten-Zuordnungs-UI, kein
Mehrreihen-Import.

## Bewusst NICHT umgesetzt / geparkt
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
