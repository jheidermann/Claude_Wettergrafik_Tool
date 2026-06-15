# Wettergrafik-Übersicht

Einzelne HTML-Datei, die Wetterdaten als Zeitreihen-Graph (Linie oder Balken) fürs Fernsehen darstellt. Offline, kein Server, Doppelklick öffnet sie im Browser.

## 1 Ablage
- Repo: https://github.com/jheidermann/Claude_Wettergrafik_Tool → `wettergrafik.html`
- Lokal: `Desktop/Claude_Wettergrafik_Tool`

## 2 Bedienung
1. `wettergrafik.html` per Doppelklick im Browser öffnen
2. Datenreihe wählen (Temperatur, Niederschlag …) oder „Beispiel laden"
3. Werte in die Tabelle eintragen; x-Achsen-Format setzen und „Zeitspalte nach Format füllen"
4. Export 16:9: „Vollbild" oder „20 % frei rechts" (hält rechts Platz für die Moderation frei)

## 3 Festlegungen
- x-Achsen-Labels: index-basiert, jeder k-te Punkt (bei 24 Werten = jeder 3.); zentriert unter Punkt/Balken; letzter Punkt wird nicht erzwungen
- kleiner Inset links/rechts, damit die Daten nicht an den Achsen kleben
- Farben: AKT-Hausfarben (Creme RGB 255 248 239, Petrol #235C7A)
- Datenmenge manuell, bis ~30 Werte; kein Import-Feld (bewusste Entscheidung)
- Datenquelle: DWD oder kommerzielle Wetteranbieter
- Geparkt für später: zweite Achse, Wettersymbole, Quellenangabe, AKT-Hausschrift, mehrere Datenreihen

## 4 Verwandt
[[GitHub-Workflow]] · [[Browser-HTML-Tools-als-Arbeitsformat]] · [[DWD-Datenabfrage]] · [[Live-Artefakte]] · [[Wetterkarten-Übersicht]] · [[Ortsmarken-Übersicht]]
