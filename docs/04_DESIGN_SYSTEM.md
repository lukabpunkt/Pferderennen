# 04 – Design System, Visuals & Animation

Ziel: Das Spiel soll aussehen wie ein liebevoll gemachtes Indie-Cartoon-Game – **satt, warm, leicht überdreht**, nicht wie ein Formular mit Canvas. Jede Bewegung hat Easing, jede Aktion hat Feedback, nichts „poppt“ einfach hin.

## 1. Stilrichtung

- **Cartoon / Flat mit Tiefe:** Klare Formen, dicke weiche Outlines (2–3 px, dunkle Fellfarbe, nicht schwarz), sanfte Verläufe für Volumen, lange weiche Schatten.
- **Stimmung:** Sommerabend auf der Rennbahn. Warmer Himmel (Pfirsich → Flieder), sattes Grün, Holz- und Cremetöne bei der UI.
- **Referenzen (nur als Gefühl, nicht kopieren):** _Alto's Odyssey_ (Farbverläufe & Stimmung), _Fall Guys_ (Rundlichkeit, Slapstick), _Kingdom Rush_ (Cartoon-Outlines), Duolingo (UI-Buttons mit „Kante unten“).

## 2. Farb-Tokens (`src/styles/tokens.css`)

### 2.1 Pferdefarben (Signaturfarben)

| Pferd           | Base      | Light (Highlights, Glow) | Dark (Outline, Schatten) |
| --------------- | --------- | ------------------------ | ------------------------ |
| Sir Trabsalot   | `#8B5CF6` | `#C4B5FD`                | `#5B21B6`                |
| Prosecco Rakete | `#EC4899` | `#F9A8D4`                | `#9D174D`                |
| Kater Morgana   | `#EF4444` | `#FCA5A5`                | `#991B1B`                |
| Schnapsidee     | `#22C55E` | `#86EFAC`                | `#15803D`                |
| Hopfen Hengst   | `#F59E0B` | `#FCD34D`                | `#B45309`                |
| Wodka Wirbel    | `#06B6D4` | `#67E8F9`                | `#0E7490`                |

Alle sechs Farben sind gegeneinander auch bei Rot-Grün-Schwäche unterscheidbar, wenn Form/Fell hinzukommt (siehe Barrierefreiheit §9). Jedes Pferd nutzt seine Farbe für: Startbox, Sattel, Jockey-Trikot, Zaumzeug, Lane-Marker-Streifen, Wettkarte-Rahmen, Chips, Konfetti, Podium-Sockel, Leaderboard-Punkt.

### 2.2 UI-Palette

```
--bg-sky-top:     #FFB88C   (Pfirsich)
--bg-sky-bottom:  #C9A7EB   (Flieder)
--grass-light:    #7ED957
--grass-dark:     #4CAF50
--track-sand:     #E8C88A
--track-line:     #FFF7E6
--wood:           #8B5A2B
--cream:          #FFF8EE   (Karten, Panels)
--ink:            #2B1D2E   (Text, dunkles Lila-Schwarz statt reinem Schwarz)
--ink-soft:       #6B5B73
--accent:         #FF6B35   (Primär-Buttons: warmes Orange)
--accent-dark:    #C94C1C   (Button-Kante unten)
--success:        #22C55E
--danger:         #EF4444
--overlay:        rgba(43,29,46,0.55)
```

Dark Mode ist **nicht** vorgesehen (das Spiel hat seine eigene Stimmung), aber der Kontrast von Text auf Cream muss ≥ 4,5:1 sein (`--ink` auf `--cream` ≈ 13:1 ✔).

### 2.3 Weitere Tokens

```
--radius-sm: 8px; --radius-md: 14px; --radius-lg: 22px; --radius-pill: 999px;
--shadow-card: 0 6px 0 rgba(43,29,46,0.12), 0 12px 24px rgba(43,29,46,0.10);
--shadow-btn:  0 5px 0 var(--accent-dark);
--space-1: 4px … --space-8: 48px  (4er-Raster)
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--dur-fast: 120ms; --dur-base: 220ms; --dur-slow: 420ms;
```

## 3. Typografie

- **Display (Titel, Pferdenamen, Countdown):** „Fredoka“ oder „Baloo 2“ (rund, freundlich). Self-hosted als woff2 in `assets/fonts/` (OFL-Lizenz) – **kein** Google-Fonts-Request zur Laufzeit. Fallback: `system-ui, sans-serif`.
- **Body:** `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`.
- Skala: 14 / 16 / 18 / 22 / 28 / 36 / 56 px; Countdown 120 px+.
- Zahlen (Schlücke) immer **tabular-nums**.

## 4. Screens (Wireframe-Beschreibung)

### 4.1 Start

- Vollbild-Himmelsverlauf; unten Rasen und Bahn mit 6 Pferden im Idle-Loop (Kopfnicken, Schweifwedeln, gelegentliches Schnauben mit Partikeln). Das ist der „Attract Mode“.
- Logo/Titel „Pferderennen“ mit leichtem Wackeln (rotate ±1,5°, 3 s Loop).
- Primär-Button groß (min. 56 px hoch, volle Breite auf Mobile), Sekundär-Buttons als Ghost.
- „Weiterspielen“-Button mit Avatar-Reihe der gespeicherten Spieler.

### 4.2 Spieler

- Liste mit Avatar-Emoji (Tap = zufällig neu), Name-Input, Entfernen-X.
- „+ Spieler“-Button, Enter im Input fügt nächsten Spieler hinzu (Herumreichen-Flow).
- Sticky Footer: „Weiter zu den Wetten →“, disabled < 2 Spieler mit Hinweis.

### 4.3 Wetten

- Header: „**Luka** ist dran“ mit Avatar, Fortschritt „3 / 6“.
- Grid 2×3 (Mobile) bzw. 3×2 (Desktop) der Pferdekarten: Farbrahmen, Portrait (prozedural gezeichnet, Kopf mit Accessoire), Name, Charakter-Zeile, kleine Chips der Spieler, die schon darauf gesetzt haben.
- Nach Auswahl: Karte animiert nach oben, unten erscheint Stepper „Einsatz: [−] **3** [+] Schlücke“ (Buttons ≥ 48 px) + Wettart (wenn „Frei“) + Button „Setzen ✓“.
- Nach dem letzten Spieler: Übersichts-Tabelle + „🏁 Rennen starten“ (pulsierend).

### 4.4 Rennen (Canvas + DOM-HUD)

- Canvas füllt den Screen. Leaderboard oben rechts (Landscape) bzw. oben (Portrait) als Reihe von 6 Farbpunkten mit Position-Nummer, live sortiert mit FLIP-Animation.
- Fortschrittsbalken oben: Linie mit 6 Mini-Pferde-Icons, die entlang wandern.
- Kommentar-Zeile unten in Sprechblasen-Panel; Textwechsel mit Slide-Up.
- Event-Toasts (Trinkregel) als Pill über der Kommentar-Zeile, 3 s, mit 🍺.
- Countdown-Overlay: „3“ „2“ „1“ skaliert von 3× auf 1× mit Bounce, „LOS!“ mit Screen-Flash.
- **Startpistole:** Ein Starter steht an der vorderen Bande hinter der Startlinie – nicht vor der Tribüne, wo eine dunkle Figur im bunten Publikum untergeht. Er hebt den Arm über die drei gezählten Schritte, und zwar nach *hinten* herum: der kurze Weg würde die Pistole waagerecht über die Bahn auf die Pferde richten. Bei „LOS!“ Mündungsblitz, Rauch vom Lauf und der Knall. Die Kamera trägt ihn beim Anfahren von selbst aus dem Bild.
- **Zielband:** Auf Brusthöhe über die Ziellinie gespannt, leicht zu den Pferden hin durchhängend, mit dunkler Kante gegen das Schachbrett dahinter. Der Sieger reißt es an *seiner* Bahn; die beiden Hälften bleiben an ihren Pfosten, werden vom Pferd nach vorn mitgerissen und fallen dann flatternd. Rein visuell – ausgelöst von der gezeichneten, nicht der simulierten Position.
- **Renn-Effekte:** Dreckfetzen unter den Hufen (nur ab Tempo und nur gelegentlich), Speedlines hinter einem Pferd oberhalb der Schwelle, ab der die Engine auf `gallop_fast` schaltet, Blitzlichtgewitter in der Tribüne, das zum Ziel hin zunimmt, und ein sanfter Kamera-Push über das Schlussdrittel. Alles hängt an der Qualitätsstufe.

### 4.5 Ergebnis

- **Siegerehrung** als Canvas-Szene: 3 Sockel in Pferdefarben, Höhe 3/2/1. Die drei Erstplatzierten traben nacheinander ein (Stagger 250 ms, Dritter zuerst) und halten *hinter* ihrem Sockel, sodass der Sockel die Beine verdeckt. Die Jockeys steigen ab – dasselbe `riderless`-Flag wie im Rennen, damit niemand doppelt gezeichnet wird – und stellen sich aufs Treppchen, der Sieger mit beiden Armen hoch. Konfetti-Kanonen in Siegerfarbe. Die Szene hält sich selbst an, sobald alles steht.
- Unter der Szene stehen die drei Namen als echter Text. Sie sind das, was ein Screenreader vorliest; die Szene ist die Feier, nicht die Information.
- Karten: „🥇 **Luka** verteilt **3 Schlücke**“ (grün) / „🍺 **Nina** trinkt **2 Schlücke**“ (rot). Bei Haus-Sieg: Sonderkarte mit 🏠.
- Event-Trinkregeln aus dem Rennen als Rückblick-Liste (falls aktiv).
- Buttons: „Nächstes Rennen“ (primär), „Spieler ändern“, „Statistik“.

### 4.6 Regeln / Einstellungen / Statistik

- Als Bottom-Sheet-Modal (Mobile) bzw. zentriertes Modal (Desktop). Schließen per X, Backdrop-Tap, `Esc`.

## 5. Das Pferd (prozedurales Rendering, `render/horse.js`)

### 5.1 Aufbau (Landscape, Seitenansicht)

Teile (alle relativ zu einer Basisgröße `S`, Default 64 px Körperlänge):

1. **Schatten:** Ellipse unter dem Pferd, skaliert mit Sprunghöhe (kleiner, wenn Pferd in der Luft).
2. **Hinterbeine** (2), **Vorderbeine** (2): je Oberschenkel + Unterschenkel + Huf (Kapsel-Formen), Gelenkwinkel aus Gallop-Zyklus.
3. **Körper:** abgerundete Kapsel mit leichter Neigung; Fellfarbe mit Highlight-Verlauf.
4. **Hals + Kopf:** Kurve nach vorne-oben, Kopf leicht nickend im Zyklus; Ohr, Auge (Blinzeln alle 3–6 s), Nüster.
5. **Mähne und Schweif:** 3–4 Segmente mit Verzögerung (Follow-Through), reagieren auf Geschwindigkeit.
6. **Sattel** (Signaturfarbe), **Zaumzeug** (Signaturfarbe), **Jockey**: Kugelkopf mit Helm/Accessoire, Trikot in Signaturfarbe, Arme halten Zügel, Körper wippt gegenphasig zum Körper.
7. **Pferd-spezifische Accessoires** aus `data/horses.js`: Sonnenbrille, Kaffeebecher, Kleeblatt, Brezel, Ushanka, Ritterhelm.

### 5.2 Gallop-Zyklus

- Zyklusdauer `T = 0.55 s / speedFactor` (schneller = kürzere Schritte), Phase `φ ∈ [0, 1)`.
- 4-Beat-Gallop vereinfacht: Hinterbeine schwingen bei `φ ≈ 0.0–0.4`, Vorderbeine bei `φ ≈ 0.4–0.8`, Flugphase bei `φ ≈ 0.8–1.0` (Körper +6 px hoch, Schatten kleiner).
- Körper-Bounce: `y = -4·|sin(2π φ)|`, Körper-Rotation `±4°` gegenphasig.
- Kopf-Nick `±6°`, Mähne/Schweif mit Lag `0.08 s` pro Segment.
- Staubwölkchen bei jedem Hufaufsatz (2–3 Partikel), bei Sprint mehr und mit Speedlines.

### 5.3 Animations-States (`horseAnimations.js`)

`idle`, `gallop`, `gallop_fast` (Speedlines, flacherer Körper), `stumble`, `limp`, `vomit`, `pee`, `sleep`, `wake`, `hiccup`, `confused` (rückwärts), `slip` (360°-Spin), `pose`, `graze`, `fly` (Feder-Hufe), `celebrate` (Aufbäumen + Jockey jubelt), `trot_in` (müde Zieleinlauf). Übergänge über 120–200 ms Blend (Gelenkwinkel lerpen).

### 5.4 Portrait-Modus (Rückansicht, schräg von hinten oben)

- Sichtbar: rundes Hinterteil, Schweif (wedelt), Rücken mit Sattel (groß, Signaturfarbe), Jockey von hinten (Trikot, Helm), Kopf/Ohren vorne kleiner (Perspektive), Beine seitlich abwechselnd sichtbar.
- Gallop-Zyklus: Körper wippt auf/ab und rollt leicht links/rechts; Beine erscheinen abwechselnd seitlich.
- Die Farbfläche (Sattel + Trikot) ist bewusst groß, damit man das eigene Pferd auf dem Handy sofort erkennt.

## 6. Bahn & Umgebung (`render/track.js`)

- **Landscape:** Himmelsverlauf → ferne Hügel (Parallax 0,2) → Tribüne mit Publikum (Parallax 0,5; Publikum = Reihen bunter Kreise, die bei Events und im Finish „La-Ola“-wippen) → Zaun (weiß) → 6 Bahnen aus Sand mit hellen Trennlinien → Rasenstreifen vorne (Parallax 1,3, mit Grasbüscheln).
- **Startboxen:** 6 Boxen aus Holz, Tor in Signaturfarbe mit Nummer, klappen beim Start mit Bounce auf; Kamera zeigt beim Countdown alle Boxen.
- **Ziellinie:** Schachbrett-Balken quer über alle Bahnen, „ZIEL“-Banner auf Pfosten, Fotografen (Blitze) daneben.
- **Streckenmarker** alle 100 Units (kleine Schilder), damit Tempo spürbar ist.
- **Dekor, das liegen bleibt:** Bananenschale nach dem Event, Kotzpfütze, Pinkelpfütze, verlorenes Hufeisen, abgeworfener Jockey (sitzt am Rand und winkt).
- Hintergrund-Layer werden in ein **Offscreen-Canvas** gecacht und nur per `drawImage` verschoben.

## 7. Kamera (`render/camera.js`)

- Ziel: Schwerpunkt des Feldes, leicht nach vorne versetzt (+15 % Sichtbreite), damit man sieht, wohin es geht. Lerp mit `1 − e^(−6·dt)`.
- Zoom: Start 1,0; wenn das Feld breiter als 70 % der Sicht wird, leicht rauszoomen (min 0,75).
- **Fotofinish:** Zeitlupe (Render-Interpolation mit `timeScale = 0.25`, Engine läuft mit weniger Steps pro Frame), Zoom 1,4 auf die Ziellinie, Vignette, Blitzlichter, Sound-Filter (Lowpass).
- **Shake:** bei `stumble`, `banana`, `streaker` 200–350 ms, Amplitude 3–6 px, Trauma-Decay. Deaktiviert bei Reduced Motion.

## 8. Partikel & Effekte (`render/particles.js`)

Object-Pool mit 400 Partikeln, Typen: `dust` (braun, fade), `confetti` (Rechtecke, Rotation, Signaturfarbe + Weiß/Gold), `star` (Sternchen bei Rutsch/Stolpern), `sparkle` (Prosecco-Glitzer), `rainbow` (Streifen-Trail), `splash` (Schlamm/Kotze), `zzz`, `heart`, `question`, `speedline`. Jeder Typ hat `spawn(x,y,opts)` und ein `update/draw`. Additive Blending für Glow-Effekte sparsam (`globalCompositeOperation = 'lighter'`).

## 9. Barrierefreiheit & Ergonomie

- Alle interaktiven Elemente ≥ 48 × 48 px; Primär-Buttons 56 px hoch.
- Pferde zusätzlich zur Farbe durch **Form** unterscheidbar (Fellfarbe, Accessoire, Nummer 1–6 auf Startbox und Sattel-Decke).
- Fokus-Ringe sichtbar (`:focus-visible`), Tab-Reihenfolge logisch; Rennen ist mit `Enter` startbar.
- Canvas hat `role="img"` und `aria-live="polite"`-Region im DOM, die Führungswechsel und Ergebnis als Text ausgibt.
- `prefers-reduced-motion`: keine Screen-Shakes, keine Blitze, Partikel −70 %, Titel-Wackeln aus.
- Textkontrast ≥ 4,5:1, Toast-Texte ≥ 18 px.
- Kein Inhalt hängt von Sound ab.

## 10. Sound-Design (Web Audio, synthetisiert, `audio/sfx.js`)

| Cue                                                                                                                        | Charakter                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Hufgetrappel                                                                                                               | Loop aus gefilterten Noise-Bursts, Rate gekoppelt an mittlere Feldgeschwindigkeit, Stereo-Panning nach Kamera |
| Startpistole                                                                                                               | Knall aus drei Schichten: breitbandiger Rausch-Burst, tiefer Square-Sweep als Körper, kurzer Nachhall         |
| Menge                                                                                                                      | Brown-Noise-Pad, Lautstärke steigt zum Finish, „Ooooh“ bei Events (gefilterter Sawtooth-Sweep)                |
| Banane                                                                                                                     | Slide-Whistle abwärts                                                                                         |
| Kotzen                                                                                                                     | Blubbern (LFO auf Lowpass)                                                                                    |
| Furz                                                                                                                       | Kurzer tiefer Sawtooth mit Vibrato (klassisch)                                                                |
| Taube                                                                                                                      | Zwei kurze Chirps                                                                                             |
| Fotofinish                                                                                                                 | Kamera-Klicks + Tiefpass auf Master                                                                           |
| Fanfare                                                                                                                    | 3-Ton-Arpeggio, Major                                                                                         |
| UI-Tap                                                                                                                     | Kurzer Klick (Noise 20 ms)                                                                                    |
| AudioContext wird erst nach der ersten Nutzerinteraktion erzeugt (Autoplay-Policy). Master-Gain mit sanftem Fade bei Mute. |

## 11. Micro-Interactions (DOM)

- Buttons: `translateY(2px)` + Schatten kleiner bei `:active`; Hover hebt 1 px.
- Karten-Auswahl: Rahmen leuchtet in Pferdefarbe, leichtes Scale 1,03 mit `--ease-bounce`.
- Screen-Wechsel: Slide + Fade 220 ms; Rennen-Start: Vorhang zu (Signaturfarben-Streifen) / auf.
- Zahlen im Stepper: Ziffer rollt (translateY) beim Ändern.
- Haptik (Mobile, `navigator.vibrate`): 10 ms bei Tap, 30 ms bei Event, 3×60 ms bei Sieg.
