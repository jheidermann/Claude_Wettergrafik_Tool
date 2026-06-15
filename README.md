# Wettergrafik

Tool, um Wetterdaten als TV-taugliche Grafik im 16:9-Format zu erzeugen.
Eine einzelne HTML-Datei – kein Server, kein Framework, keine Internetverbindung nötig.
Doppelklick öffnet sie im Browser.

## Was es kann

- **Datenreihe** wählen (Temperatur, Niederschlag, Wind, Windstärke, Luftfeuchte,
  Bedeckung, Luftdruck, Sonnenschein, Schnee, UV-Index oder „Eigene …") –
  setzt Bezeichnung und Einheit automatisch.
- **Einheit** frei anpassbar (z. B. Niederschlag von mm auf l/m²).
- **Diagrammtyp:** Linie oder Balken.
- **Farbe** aus der AKT-Hausfarben-Palette (Sekundärfarben).
- **x-Achsen-Format:** Uhrzeit / Stunden / Wochentage / Datum / Eigene.
  Der Button „Zeitspalte nach Format füllen" füllt die Spalte ab dem ersten Feld.
- **Höchst-/Tiefstwert** optional hervorheben (mit Wertbeschriftung).
- **Werte manuell** in die Tabelle eingeben (Standard 24, bis ~30 sinnvoll – kein Import).
- **Export als PNG 1920 × 1080 (16:9)** in zwei Varianten:
  - **Vollbild**
  - **20 % frei rechts** – hält rechts Platz für Moderator*innen frei.

## Bedienung

1. Datenreihe + Einheit wählen.
2. x-Achsen-Format setzen, ggf. „Zeitspalte nach Format füllen".
3. Werte in die Tabelle eintragen.
4. Diagrammtyp und Farbe wählen.
5. „Vollbild" oder „20 % frei rechts" exportieren – die PNG landet im Download-Ordner.

## Farben (AKT-Hausfarben)

- **Hintergrund:** RGB 255 248 239 (`#FFF8EF`, Creme)
- **Beschriftung / Achsen:** RGB 35 92 122 (`#235C7A`, Petrol-Blau)
- **Datenreihen:** Sekundärfarben der AKT-Palette (Auswahl im Tool)
- `AKT_Farben_RGB.png` im Repo = Referenz-Farbschema.

## Technik

- Reines HTML + JavaScript, das Diagramm wird direkt auf ein `<canvas>` gezeichnet.
- Offline lauffähig, keine externen Bibliotheken, keine Browser-Speicherung.

## Offene Punkte / To-do

- **x-Achsenbeschriftung am rechten Ende:** Die Beschriftung läuft in fester
  Schrittweite. Fällt der letzte Datenpunkt nicht auf diese Schrittweite
  (z. B. 24 Stundenwerte bei 3-er-Schritt → letztes Label 21:00, Daten bis 23:00),
  bleibt das rechte Ende unbeschriftet und wirkt unausgewogen.
  → Label-Logik überdenken: Schrittweite passend zur Datenmenge wählen oder den
  letzten Punkt mit beschriften. Auch die Ausrichtung des letzten Labels prüfen
  (wird aktuell rechtsbündig gesetzt, obwohl es nicht am rechten Rand liegt).
- Zweite Achse (Temperatur + Niederschlag kombiniert) – geparkt.
- Wettersymbole auf der Zeitleiste – geparkt.
- AKT-Hausschrift einbetten – Idee für später.

## Arbeit mit Claude / GitHub

- Datei im Chat über **„Add from GitHub"** einbinden.
- **Wichtig:** Claude soll die bestehende `wettergrafik.html` **verwenden und nur
  gezielt ändern – nicht neu generieren.** Beim kompletten Neuschreiben können Fehler
  entstehen (z. B. falsche Anführungszeichen), die das Skript brechen.
- Nach Änderungen: Datei lokal überschreiben → GitHub Desktop commit + push.
