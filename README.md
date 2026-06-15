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
8. Export: **Vollbild** (1920×1080) oder **20 % frei rechts** (hält rechts Platz für die Moderation frei)

## Funktionen

- Datenreihen: Temperatur, Niederschlag, Wind, Windstärke, Luftfeuchte, Bedeckung, Luftdruck, Sonnenschein, Schnee, UV-Index, Eigene
- Linie und Balken; Höchst-/Tiefstwert hervorheben (optional)
- x-Achsen-Labels: index-basiert, gleichmäßige Abstände, zentriert unter Punkt/Balken
- y-Achse startet bei 0 wenn alle Werte ≥ 0, sonst am Datenwert (sinnvoll z. B. bei Minustemperaturen)
- Einheit steht über der y-Achse, nicht im Titel
- Export 16:9 PNG, beide Varianten skaliert für TV-Auflösung (Linienstärke, Schrift)
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
