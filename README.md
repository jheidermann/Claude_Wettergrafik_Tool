# Wettergrafik-Tool

Einzelne HTML-Datei zur Visualisierung von Wetterdaten als Zeitreihen-Graph fürs Fernsehen. Offline, kein Server, keine Bibliotheken — Doppelklick öffnet die Datei im Browser.

## Bedienung

1. `wettergrafik.html` per Doppelklick im Browser öffnen
2. **Überschrift** eingeben (optional — bleibt leer, erscheint der Serienname als Fallback)
3. **Datenreihe** wählen (setzt Einheit automatisch)
4. **Diagrammtyp** wählen: Linie oder Balken
5. **Farbe** wählen
6. **x-Achse**: Format wählen (Uhrzeit / Stunden / Wochentage / Datum / Eigene), dann „Zeitspalte nach Format füllen"
7. Werte in die Tabelle eintragen
8. Optional **Höchst-/Tiefstwert hervorheben**; die Wert-Labels lassen sich per Drag & Drop frei verschieben (Doppelklick = zurück zur Mitte)
9. Layout & Export wählen: **Vollbild-Grafik** oder **Mod-Grafik** (16:9, 1920×1080; Mod hält rechts Platz für die Moderation frei) oder **App (1:1)** (1080×1080 für die MDR-App)

## Funktionen

- Datenreihen: Temperatur, Niederschlag, Wind, Windstärke, Luftfeuchte, Bedeckung, Luftdruck, Sonnenschein, Schnee, UV-Index, Eigene
- Linie und Balken; Höchst-/Tiefstwert hervorheben (optional), Wert-Labels per Drag & Drop frei platzierbar
- x-Achsen-Labels: index-basiert, gleichmäßige Abstände, zentriert unter Punkt/Balken
- y-Achse startet bei 0 wenn alle Werte ≥ 0, sonst am Datenwert (sinnvoll z. B. bei Minustemperaturen); Obergrenze dynamisch mit Kopffreiheit fürs Höchstwert-Label
- Einheit steht über der y-Achse, nicht im Titel
- Drei Export-Formate als PNG, skaliert für TV/App: Vollbild-Grafik & Mod-Grafik (16:9, 1920×1080), App-Grafik (1:1, 1080×1080)
- Offline lauffähig, keine externe Abhängigkeit

## Technisches

- Reines HTML/CSS/JS, Canvas-basiert, keine Bibliotheken
- Datenmenge manuell, bis ca. 30 Werte empfohlen; kein Daten-Import
- Farbschema: AKT-Hausfarben (Hintergrund #FFF8EF, Beschriftung #235C7A)
- Datenquellen: DWD oder kommerzielle Wetteranbieter

## Geplant / zurückgestellt

- Zweite Datenreihe / zweite Achse
- Wettersymbole
- Quellenangabe im Export
- AKT-Hausschrift einbetten
