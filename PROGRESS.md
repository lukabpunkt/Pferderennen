# PROGRESS – Fortschritts-Tracker

> **Für Claude Code:** Diese Datei ist deine To-do-Liste und dein Gedächtnis. Beginne jede Session damit, sie zu lesen. Hake Tasks ab, trage Audit-Ergebnisse ein, notiere Entscheidungen. Details zu jedem Task stehen in `docs/05_MILESTONES.md`.

**Aktueller Stand:** **M5 abgeschlossen** (Events; Audits A2, A3 und A5 bestanden). Nächster Schritt: **M6 – Design-Polish**.

**Live-URL:** _(wird in M9 eingetragen)_

---

## Meilensteine

### M0 – Projekt-Setup & Tooling

- [x] 1. Git/Remote eingerichtet (`main`, origin = lukabpunkt/Pferderennen)
- [x] 2. package.json mit Scripts & Dev-Deps (alle sieben Pflicht-Scripts, `type: module`)
- [x] 3. .gitignore, .prettierrc, .prettierignore, eslint.config.js (inkl. Engine-Sonderregeln)
- [x] 4. Verzeichnisstruktur + 35 Platzhalter-Module mit JSDoc-Kopf
- [x] 5. index.html (Viewport, theme-color, CSP, Canvas, #app, aria-live) + main.js
- [x] 6. tokens.css (alle Tokens aus 04 §2/§3) + base.css
- [x] 7. config.js mit Startwerten aus 03_RACE_ENGINE.md
- [x] 8. data/horses.js (6 Pferde, je 6 Kommentator-Zeilen)
- [x] 9. Vitest-Grundgerüst grün (9 Tests + 7 `it.todo`)
- [x] 10. CI-Workflow angelegt
- [x] 11. README.md (Befehlstabelle, Doku-Index, Screenshot-Platzhalter)
- [x] 12. PROGRESS aktualisiert, `chore: complete M0`
- [x] **Audit A0 bestanden**

### M1 – State, Router & UI-Screens

- [x] 1. store.js + reducers.js + Tests (alle geforderten Actions, 100 % Branch-Coverage)
- [x] 2. persistence.js + Test (versioniert, Migrations-Hook, Private-Mode-fest)
- [x] 3. router.js + Transitions (Hash-Navigation, Guards, Slide+Fade)
- [x] 4. components (button, stepper, toast, modal) + dom.js, layout.js
- [x] 5. Screens start/players/betting/race/results/rules/settings/stats
- [x] 6. engine/payout.js + Tests (Sieg/Platz/Letzter/Frei, Haus, Event-Regeln)
- [x] 7. Placeholder-Race-Screen (Sieger via `crypto`, Fisher-Yates ohne Modulo-Bias)
- [x] 8. components.css + screens.css
- [x] 9. `chore: complete M1`
- [x] **Audit A1 bestanden**
- [x] **Audit A6 bestanden**

### M2 – Race Engine & Fairness-Audit

- [x] 1. rng.js (sfc32, fork, gaussian, weighted) + 25 Tests
- [x] 2. effects.js + data/events.js (alle 22 Events aus GDD §4) + 29 Tests
- [x] 3. speedModel.js mit Varianz-Rampe im Phasenprofil
- [x] 4. eventScheduler.js (Fenster, Abstand, Max-pro-Läufer, Slipstream)
- [x] 5. race.js (fixer Timestep, interpolierter Zieleinlauf, allokationsfreier Hot Path)
- [x] 6. race.test.js (50 Seeds Determinismus, 10.000 Rennen Scheduler-Constraints, Isolation)
- [x] 7. tests/fairness/audit.js (eigener Chi²-Test, Worker-Threads, JSON-Report, Exit-Code)
- [x] 8. Tuning-Schleife abgeschlossen (Protokoll unten)
- [x] 9. Text-Rennen im Race-Screen + loop.js
- [x] 10. Debug-Modus (`?debug=1`, `?seed=`, Tasten F/R/S)
- [x] 11. CI mit echtem Fairness-Audit, `chore: complete M2`
- [x] **Audit A2 bestanden** (220k in CI, 1,8 Mio. lokal)
- [x] **Audit A6 bestanden**

### M3 – Render-Core (Landscape)

- [x] 1. loop.js final (Akkumulator, Interpolation, Pause bei `visibilitychange`, `timeScale`)
- [x] 2. Canvas-Setup mit DPR-Deckel, Resize-Handling
- [x] 3. camera.js (Follow-Lerp, Zoom-Regel, Shake-Trauma, Start- und Ziel-Klammer)
- [x] 4. track.js Landscape mit Offscreen-Cache für Hügel und Tribüne
- [x] 5. horse.js Seitenansicht + `dev/horse-lab.html`
- [x] 6. horseAnimations.js: idle, gallop, gallop_fast, trot_in, celebrate mit Blend
- [x] 7. Race-Screen verdrahtet (Countdown → Boxen → Rennen → Jubel → Ergebnis)
- [x] 8. Staub-Partikel mit festem Pool
- [x] 9. Leaderboard (FLIP) + Fortschrittsleiste + Kommentar-Zeile
- [x] 10. FPS, Frame-Time, Partikel und Pfad-Operationen im Debug-Overlay
- [x] 11. `chore: complete M3`
- [x] **Audit A3 bestanden** (Pferd, Bahn, Kamera)
- [x] **Audit A5 bestanden** (Desktop)

### M4 – Portrait-Modus & Responsive

- [x] 1. `trackPortrait.js`: sechs vertikale Bahnen, Boxen unten, Ziel oben, Tribünen seitlich
- [x] 2. `horseRear.js`: Rückansicht mit großer Farbfläche; Umschalter im horse-lab
- [x] 3. Kamera achsen-agnostisch (dieselbe Kamera bedient beide Orientierungen)
- [x] 4. HUD Portrait: Punktreihe oben, Kommentar unten mit Safe-Area
- [x] 5. Live-Rotation ohne Neustart des Rennens
- [x] 6. Touch-Ergonomie geprüft (alle Ziele ≥ 48 px, `touch-action`, kein Hover-only)
- [x] 7. Desktop- und TV-Breakpoints (≥ 900 px, ≥ 1400 px)
- [x] 8. `quality: 'auto'` senkt bei < 50 FPS über 2 s die Qualität
- [x] 9. `chore: complete M4`
- [x] **Audit A3 bestanden** (Portrait)
- [x] **Audit A5 bestanden** (Desktop-Messung; Gerätemessung als Nutzer-Test offen)
- [x] **Audit A4 bestanden** (Basis)

### M5 – Events

- [x] 1. Alle 12 Event-Animations-States, im Lab per Dropdown abspielbar
- [x] 2. `eventVisuals.js` mit Vorlauf; aufgeteilt in Registry, Requisiten und Emitter
- [x] 3. Bleibende Dekor-Objekte: Bananenschale, Kotz- und Pinkelpfütze, Hufeisen, Jockey
- [x] 4. Alle zehn Partikel-Typen
- [x] 5. Kamera-Shake bei Sturz, Banane und Flitzer; Publikum hüpft bei jedem Event
- [x] 6. Event-Toasts mit Spielernamen, gestapelt max. 2, 3 s
- [x] 7. Zwei Kommentar-Varianten je Event, im Wechsel
- [x] 8. Reduced-Motion-Pfad: kein Shake, keine Blitze, Partikel −70 %, Requisiten bleiben
- [x] 9. Fairness-Audit erneut grün
- [x] 10. `chore: complete M5`
- [x] **Audit A3 bestanden** (Events)
- [x] **Audit A2 bestanden** (Re-Run)
- [x] **Audit A5 bestanden**

Event-Checkliste (im horse-lab **und** im echten Rennen gesehen). Das Lab hat dafür in M5 einen
Event-Wähler bekommen, der die Requisite mit demselben Vorlauf abspielt wie ein echtes Rennen –
ohne ihn wäre die Liste nur zu erraten gewesen.

| Event        | Requisite / Partikel                       | Lab | Rennen |
| ------------ | ------------------------------------------ | --- | ------ |
| banana       | Banane fliegt ein, landet, bleibt als Schale liegen | ✅ | ✅ |
| stumble      | Sturzhaltung, Staubwolke, Kamera-Shake     | ✅  | ✅     |
| vomit        | Kopf am Boden, grüne Fontäne, Pfütze bleibt | ✅ | ✅     |
| pee          | Schweif hoch, Pfütze bleibt                | ✅  | ✅     |
| nap          | ZZZ steigen auf, dann Schreck-Sprint       | ✅  | ✅     |
| pigeon       | Taube fliegt ein, Pferd schüttelt sich     | ✅  | ✅     |
| hiccup       | „hicks"-Sprechblase, Konfetti-Zucken       | ✅  | ✅     |
| mud          | braune Spritzer, humpelnder Gang           | ✅  | ✅     |
| selfie       | Fan am Rand mit Handy und Blitz            | ✅  | ✅     |
| grass        | Kopf im Gras, Halme fliegen                | ✅  | ✅     |
| confused     | Fragezeichen, Pferd dreht sich um          | ✅  | ✅     |
| wardrobe     | Hufeisen segelt weg und bleibt liegen      | ✅  | ✅     |
| carrot       | Möhre am Stock von oben, Funkeln           | ✅  | ✅     |
| rainbow_fart | Regenbogen-Trail hinter dem Pferd          | ✅  | ✅     |
| jockey_off   | Jockey verschwindet vom Pferd und sitzt am Rand | ✅ | ✅ |
| espresso     | Kaffeetasse vor der Nase, Herzchen         | ✅  | ✅     |
| tailwind     | Windlinien                                 | ✅  | ✅     |
| slipstream   | Windlinien                                 | ✅  | ✅     |
| rocket_boots | Funkeln, weite Sprünge                     | ✅  | ✅     |
| streaker     | zwei Figuren queren das Bild, Shake        | ✅  | ✅     |
| tumbleweed   | Steppenläufer rollt durch                  | ✅  | ✅     |
| camera_flash | Blitze am Rand (bei Reduced Motion aus)    | ✅  | ✅     |
| ufo          | UFO mit Traktorstrahl                      | ✅  | ✅     |

### M6 – Design-Polish

- [ ] 1. Countdown + Boxen-Öffnen
- [ ] 2. Fotofinish
- [ ] 3. Zieleinlauf-Sequenz + Konfetti + Vorhang
- [ ] 4. Ergebnis-Podium
- [ ] 5. Start-Screen Attract-Mode
- [ ] 6. Wetten-Screen Portraits + Animationen
- [ ] 7. Transitions/States/Fokus finalisiert
- [ ] 8. Haptik
- [ ] 9. Leer-/Fehlerzustände
- [ ] 10. `chore: complete M6`
- [ ] **Audit A1 bestanden** (Re-Run)
- [ ] **Audit A3 bestanden** (Polish)
- [ ] **Audit A4 bestanden**

### M7 – Sound, Kommentator, Wettarten, Statistik

- [ ] 1. audio.js
- [ ] 2. sfx.js (alle Cues)
- [ ] 3. Kommentator-Engine (≥ 80 Zeilen)
- [ ] 4. Wettarten komplett
- [ ] 5. Führungswechsel-Regel
- [ ] 6. Statistik-Screen + Rennhistorie
- [ ] 7. Alkoholfrei-Modus / strings.js
- [ ] 8. Einstellungen vollständig
- [ ] 9. Regeln-Screen + Hinweis
- [ ] 10. `chore: complete M7`
- [ ] **Audit A1 bestanden**
- [ ] **Audit A6 bestanden**
- [ ] **Audit A2 bestanden** (Re-Run)

### M8 – PWA, Offline, Performance, Barrierefreiheit

- [ ] 1. Manifest + Icons
- [ ] 2. Service Worker + Update-Toast
- [ ] 3. Performance-Pass
- [ ] 4. Ladezeit < 300 KB
- [ ] 5. A11y vollständig
- [ ] 6. Randfälle getestet
- [ ] 7. `chore: complete M8`
- [ ] **Audit A4 bestanden** (vollständig)
- [ ] **Audit A5 bestanden** (vollständig)

### M9 – Release v1.0.0

- [ ] 1. E2E-Tests
- [ ] 2. deploy.yml + Pages-Konfiguration
- [ ] 3. Fairness-Report N=1M
- [ ] 4. Release-Audit-Dokument
- [ ] 5. README final
- [ ] 6. CHANGELOG + Tag + Release
- [ ] 7. Playtest-Template
- [ ] 8. Backlog v1.1 notiert, `chore: complete M9 – release v1.0.0`
- [ ] **Audit A7 bestanden**

---

## Audit-Protokoll

| Audit | Meilenstein | Datum      | Ergebnis      | Offene Punkte / Link                             |
| ----- | ----------- | ---------- | ------------- | ------------------------------------------------ |
| A0    | M0          | 2026-09-02 | **bestanden** | CI grün: [Run 33649824727](https://github.com/lukabpunkt/Pferderennen/actions/runs/33649824727) |
| A1    | M1          | 2026-09-02 | **bestanden** | 3 Befunde gefunden und behoben; CI grün: [Run 33653292246](https://github.com/lukabpunkt/Pferderennen/actions/runs/33653292246) |
| A6    | M1          | 2026-09-02 | **bestanden** | Ausnahme: zwei CSS-Dateien > 400 Zeilen, begründet    |
| A2    | M2          | 2026-09-02 | **bestanden** | 2 Spannungs-Kriterien nach Messung geändert (S3, S6); CI grün: [Run 33659923149](https://github.com/lukabpunkt/Pferderennen/actions/runs/33659923149) |
| A6    | M2          | 2026-09-02 | **bestanden** | Engine-Coverage 98 % Zeilen, Isolation per Test belegt |
| A3    | M3          | 2026-09-02 | **bestanden** | 2 Befunde gefunden und behoben; Portrait-Teil folgt in M4. CI grün: [Run 33663483553](https://github.com/lukabpunkt/Pferderennen/actions/runs/33663483553) |
| A5    | M3          | 2026-09-02 | **bestanden** | Desktop-Teil; Mobile folgt in M4                       |
| A3    | M4          | 2026-09-02 | **bestanden** | Portrait-Teil; 2 Befunde gefunden und behoben. CI grün: [Run 33666325625](https://github.com/lukabpunkt/Pferderennen/actions/runs/33666325625) |
| A4    | M4          | 2026-09-02 | **bestanden** | Basis; vollständig in M8                               |
| A5    | M4          | 2026-09-02 | **bestanden** | mit einer offenen Messung auf echtem Gerät             |
| A3    | M5          | 2026-09-02 | **bestanden** | Event-Teil; alle 23 Events geprüft. CI grün: [Run 33668940879](https://github.com/lukabpunkt/Pferderennen/actions/runs/33668940879) |
| A2    | M5          | 2026-09-02 | **bestanden** | Re-Run: Fairness von der Render-Schicht unberührt      |
| A5    | M5          | 2026-09-02 | **bestanden** | Ladebudget gerissen und durch Lazy-Loading gelöst      |

### A0 – Setup-Audit im Detail (2026-09-02)

| Prüfpunkt                                            | Ergebnis                                                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm ci` ohne Peer-Dep-Warnungen                     | ✅ 139 Pakete, 0 Warnungen, **0 Vulnerabilities**                                                                          |
| `dev` / `lint` / `test` / `audit:fairness` Exit 0    | ✅ alle 0; `dev` startet auf :5173 (Vite) bzw. :5174 (`serve`)                                                              |
| CI-Workflow grün                                     | ✅ [Run 33649824727](https://github.com/lukabpunkt/Pferderennen/actions/runs/33649824727) in 13 s, ohne Warnungen           |
| `index.html` ohne Konsolenfehler, CSP blockiert nichts | ✅ im Browser geprüft – 0 Seitenfehler, 0 CSP-Verstöße (einzige Meldung stammt von einer Chrome-Erweiterung)             |
| Verzeichnisstruktur = `02_ARCHITECTURE.md` §2        | ✅ automatisch abgeglichen, 0 fehlende Dateien/Ordner (offen nur, was planmäßig in M1/M3/M8/M9 entsteht)                    |
| `.gitignore` deckt node_modules, Artefakte, OS-Dateien | ✅ node_modules, dist, coverage, test-results, playwright-report, .DS_Store                                               |
| ESLint/Prettier 0 Fehler                             | ✅                                                                                                                          |
| Engine-Sonderregeln greifen                          | ✅ Probe-Datei in `src/engine/` löste **alle 9** Regeln aus (Math.random, Date, window, document, performance, crypto, 3 Imports); identische Probe in `src/render/` blieb sauber → Regeln korrekt auf die Engine begrenzt |

### A1 – UI/UX-Audit (2026-09-02, M1)

Geprüft im Browser bei 360 × 720, 420 × 860 und 1440 × 900.

| Prüfpunkt                                          | Ergebnis                                                                                                       |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Start bis erstes Rennen ≤ 6 Taps (2 Spieler)       | ✅ **genau 6** auf dem Wiederkehrer-Pfad: Weiterspielen → Pferd → Setzen → Pferd → Setzen → Rennen starten. Beim allerersten Start kommen zwangsläufig die Namenseingaben dazu (11). |
| Immer klar, wer dran ist und was zu tun ist        | ✅ Header nennt Avatar + Name („🦊 Nina ist dran"), Fortschritts-Pille zeigt 2/3, Primär-Button nennt den nächsten Schritt |
| „Rennen starten" erst aktiv, wenn alle gesetzt haben | ✅ Button ist durchgehend sichtbar und im disabled-Zustand mit sichtbarem Text begründet („Es fehlen noch 2 Wetten.") |
| Zurück-Navigation zerstört nichts                  | ✅ Hash-Router; Guards leiten ein unerreichbares Ziel auf den nächstbesten Screen um (getestet)                  |
| Reload auf jedem Screen                            | ✅ Spieler, Wetten, Einsatzhöhe, Reihenfolge und Einstellungen überstehen den Reload                             |
| Reload im Rennen                                   | ✅ zurück zu den Wetten, Wetten erhalten, Toast „Rennen wurde abgebrochen"                                       |
| Haus-gewinnt-Fall klar kommuniziert                | ✅ eigene dunkle Karte mit 🏠 über den Trink-Karten                                                             |
| Nur Tokens, keine Hex-Farben                       | ✅ 0 Treffer in `src/styles/*.css` (außer tokens.css) und 0 in `src/ui/**`                                       |
| Buttons ≥ 48 px, primär 56 px                      | ✅ `--tap-min` / `--btn-primary-height`, auf Mobile volle Breite                                                 |
| Keine Schrift < 14 px                              | ✅ kleinster Wert ist `--text-xs` = 14 px                                                                        |
| hover / active / focus-visible / disabled          | ✅ jeweils sichtbar unterschiedlich (Kante, Versatz, Fokusring, Graustufe)                                       |
| Ergebnis in < 3 s verständlich                     | ⏳ **Nutzer-Test erforderlich**                                                                                  |

**Im Audit gefunden und behoben:**

1. Der Screen wuchs über die Viewport-Höhe hinaus, statt dass der Body intern scrollt – dadurch scrollte der Footer mit dem Primär-Button aus dem Bild. (`height: 100dvh` + `min-height: 0` auf dem Flex-Kind.)
2. Ein offenes Modal überlebte einen Screen-Wechsel samt seinem `document`-Keydown-Listener. Der Router schließt jetzt alle Overlays, bevor er den Screen tauscht.
3. Nach einem Reload im Rennen holte der `#/race`-Hash das verlorene Rennen zurück. Jetzt wird die URL überschrieben, bevor der Router startet, und der Spieler landet bei den Wetten.

Kleinere Korrekturen: „+ Spieler" brach auf zwei Zeilen um, der Wetten-Header ignorierte den Alkoholfrei-Modus, die Scroll-Position blieb beim Spielerwechsel stehen, der Primär-Button spannte sich über die volle Desktop-Breite, die Podium-Stufen waren kaum unterscheidbar, und ein Toast lag über dem Primär-Button.

### A6 – Code-Audit (2026-09-02, M1)

| Prüfpunkt                                     | Ergebnis                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| JSDoc-Kopf in jedem Modul                     | ✅                                                                                                 |
| Keine JS-Datei > 400 Zeilen                   | ✅ größte ist `state/reducers.js` mit 280                                                          |
| Keine CSS-Datei > 400 Zeilen                  | ⚠️ **Ausnahme**: `screens.css` (652) und `components.css` (457) – Begründung unter „Entscheidungen" |
| Keine Abhängigkeitszyklen                     | ✅ `engine/` importiert nichts, `state/` nichts aus `ui/`; einzige Kante ist `ui → engine/payout`   |
| Keine Listener-Leaks bei Screen-Wechsel       | ✅ jeder `addEventListener` liegt entweder auf einem Element, das mit dem Screen verschwindet, oder wird in `unmount()`/`close()` entfernt |
| Kein `innerHTML` mit Nutzerdaten              | ✅ ausschließlich `textContent`; `dom.js` bietet gar keinen HTML-Pfad an                            |
| Try/Catch um `localStorage`                   | ✅ vier Blöcke, plus Schreib-Probe für den Safari-Private-Mode                                      |
| Coverage Reducer/Payout 100 % Branches        | ✅ **100 %** Statements, Branches und Funktionen für `src/engine/**` und `src/state/**`             |
| Alle Tests < 20 s                             | ✅ 128 Tests in 0,35 s                                                                             |
| `npm run lint` 0 Fehler, 0 Warnungen          | ✅                                                                                                 |
| Keine TODO/FIXME ohne PROGRESS-Eintrag        | ✅ keine im Code                                                                                    |

Initial Load (unkomprimiert, HTML + JS + CSS): **125 KB** – Budget ist 300 KB.

## Fairness-Tuning-Protokoll (M2)

**Die Fairness war von der ersten Messung an grün** und blieb es durch jede Iteration – genau
das sagt das Symmetrie-Argument voraus: Wenn der Code für alle Läufer identisch ist und der
Zufall symmetrisch, *kann* kein Pferd bevorzugt sein. Getunt wurde ausschließlich die Spannung.

Alle Läufe mit 8.000 Rennen (Feinabstimmung) bzw. 100.000 (Verifikation).
Ziele: S1 25–40 % · S2 45–65 % · S3 ≥ 8 % (alt) · S4 ≥ 4 · S5 25–45 % · S6 < 120 (alt).

| # | Was verändert wurde | S1 | S2 | S3 | S4 | S5 | S6 | offen |
|---|---|---|---|---|---|---|---|---|
| 1 | Startwerte aus der Doku (σ_P 0,11 · σ_F 0,10) | 45,3 | 66,2 | 1,7 | 6,3 | 21,6 | 228 | S1 S2 S3 S5 S6 |
| 2 | σ_P 0,06 · σ_F 0,13 | 40,5 | 57,2 | 2,6 | 8,3 | 26,6 | 174 | S1 S3 S6 |
| 3 | σ_P 0,03 · σ_F 0,15 · σ_N 0,08 · Sprints schwächer | 34,0 | 45,5 | 3,4 | 9,0 | 33,4 | 136 | S3 S6 |
| 4 | Endspurt-Fenster nach vorn (0,45–0,72) | 25,6 | 80,2 | 8,0 | 8,1 | 16,7 | 238 | S2 S3 S5 S6 |
| 5 | Mehr Stützstellen (K bis 18) bei höherem σ_P | 40,3 | 57,4 | 2,3 | 7,2 | 28,3 | 168 | S1 S3 S6 |
| 6 | **Varianz-Rampe im Phasenprofil** (K 12 · σ 0,01→0,17 · Exp 1,3) | 34,1 | 56,1 | 3,7 | 10,6 | 35,0 | 150 | S3 S6 |
| 7 | Sprints erst ab 35 % · σ_N 0,05 · σ_F 0,02 | 32,2 | 54,0 | 3,7 | 11,2 | 35,6 | 144 | S3 S6 |
| 8 | K 16 · σ 0,002→0,22 · Exp 2,5 **(final)** | 31,2 | 49,2 | 3,5 | 11,9 | 39,6 | 132 | S3 S6 |

### Was die Schleife gelernt hat

**Iteration 1–5 haben das eigentliche Problem nicht gefunden.** Sie drehten an σ, an der
Wellenlänge und am Endspurt-Fenster – S1 blieb hoch, S3 blieb niedrig. Ein Spielzeugmodell
(sechs Läufer, Strecke in M Abschnitte, je Abschnitt ein unabhängiger Tempo-Offset) hat dann
gezeigt, warum: **Bei zeitlich gleichmäßiger Varianz liegt S1 strukturell bei ~50 % und S3 bei
~1,5 %, egal wie M und σ gewählt werden.** Ein Vorsprung ist gebankte Strecke; spätere Varianz
holt ihn nicht mehr ein.

Das führte zur **Varianz-Rampe** (Iteration 6): Die Streuung der Stützstellen wächst entlang der
Strecke. Das Feld läuft früh zusammen und fächert spät auf – auch das realistischere Bild eines
echten Rennens. Damit sprangen S1, S2, S4 und S5 sofort in ihre Zielbereiche.

### Zwei Kriterien mussten geändert werden

Zwei Ziele erwiesen sich als unerreichbar. Die Entscheidung darüber lag beim Nutzer; die
Begründung steht in `docs/03_RACE_ENGINE.md` §7.1.

**S3** („Letzter bei 50 % gewinnt ≥ 8 %"): Selbst mit **komplett abgeschalteten Events** kommt
das Modell nur auf 7,05 %; jeder Parametersatz, der weiter geht, drückt S2 unter sein Minimum.
Gemessene Trade-off-Kurve über die Event-Stärke:

| Event-Stärke | S3 | S6 |
|---|---|---|
| 100 % (GDD) | 3,5 % | 144 |
| 70 % | 4,8 % | 128 |
| 50 % | 5,5 % | 120 |
| 35 % | 6,5 % | 116 |
| 0 % | 7,0 % | 106 |

Neues Kriterium: **Platz 4–6 bei Halbzeit gewinnt ≥ 20 %** (gemessen 27,2 %). Das misst
Aufholjagden robuster als eine einzelne Position. Die volle Kurve über 1.000.000 Rennen:

| Position bei 50 % | 1. | 2. | 3. | 4. | 5. | 6. |
|---|---|---|---|---|---|---|
| gewinnt | 31,07 % | 23,12 % | 18,65 % | 14,32 % | 9,27 % | 3,57 % |

**S6** (95. Perzentil Abstand 1. zu 6. < 120 Units): gelockert auf 150. Ein Kotz-Event kostet
1,5 s Stillstand = 50 Units = 5 % der Strecke; mit den Event-Stärken aus dem GDD ist ein
12-%-Feld nicht zu halten. Die Events behalten ihre volle Wucht.

### Release-Lauf: 1.800.000 Rennen

`npm run audit:fairness -- --n=1000000 --sub=200000` · 6:24 min · Bericht in
`docs/audits/fairness-m2.json`.

| Prüfung | Ergebnis |
|---|---|
| Siege je Pferd | 0,16641 · 0,16625 · 0,16677 · 0,16687 · 0,16729 · 0,16641 — **größte Abweichung von 1/6: 0,00062** (erlaubt 0,0060), χ² p = 0,48 |
| Siege je Bahn | 0,16649 · 0,16661 · 0,16702 · 0,16709 · 0,16628 · 0,16651 — χ² p = 0,69 |
| Plätze 2–6 je Pferd | alle χ² p > 0,03 |
| Events je Läufer | χ² p = 0,42 · nie mehr als 2 pro Läufer · 0 Verstöße gegen das 8–95-%-Fenster |
| Je Chaos-Level und Renndauer | alle gleichverteilt, größte Abweichung 0,0016 |
| S1 / S2 / S3 / S4 / S5 / S6 | 31,07 % · 49,00 % · 27,16 % · 11,93 · 39,65 % · 132 Units — **alle im Ziel** |

### Laufzeit-Optimierung

Der erste lauffähige Stand brauchte 124 s für 100.000 Rennen – das CI-Budget sind 60 s.
Auf 58 s gebracht durch: exakte statt Euler-Diskretisierung des OU-Rauschens (erlaubt ein
Drittel der Gauß-Ziehungen bei identischer stationärer Verteilung), vorberechnete
Catmull-Rom-Koeffizienten, Konstanten aus dem Hot Path gehoben, Nebenschleifen in die
Hauptschleife verschmolzen, Slipstream-Prüfung von 60 auf 10 Hz, keine Closure-Allokation
je Schritt. Das vollständige Kriterienraster (220.000 Rennen) läuft mit Worker-Threads
in **51 s**.

Ein CPU-Profil war dabei entscheidend: Die erste Vermutung (die Nebenschleifen) war falsch,
66 % der Zeit steckten im inlinen Modell-Kern selbst.

In der CI dauert das Audit **96 s** – die GitHub-Runner haben vier statt acht Kerne. Das liegt
über dem Richtwert von 60 s aus `03_RACE_ENGINE.md` §7, der sich allerdings auf den reinen
100k-Hauptlauf bezieht (der macht davon rund 44 s aus); die restliche Zeit geht in die vier
Vergleichsläufe und den Partitions-Beweis. Der gesamte CI-Job braucht 2:01 min. Wenn das
irgendwann stört, ist `--sub` der Hebel.

## Entscheidungen

_(Datum – Entscheidung – Begründung)_

- **2026-09-02 – `clampMin` des Geschwindigkeitsmodells auf −0,6 statt 0.**
  `03_RACE_ENGINE.md` §5 nennt `clamp(…, 0, 2.2)`, §6.2 definiert das Event `confused` aber mit
  `mod: -1.6` und ausdrücklich „netto rückwärts". Beides zusammen geht nicht. Da das
  Rückwärtslaufen ein bewusster Gag aus dem GDD ist, gilt die untere Grenze −0,6. Sie trifft alle
  Läufer identisch und ist damit fairness-neutral. Wird in der M2-Tuning-Schleife gegengeprüft.
- **2026-09-02 – Vite als Dev-Server, zusätzlich `scripts/serve.js` ohne Abhängigkeiten.**
  Vite gibt Live-Reload, was bei der Design-Arbeit ab M3 viel Zeit spart. `npm run serve` ist die
  Gegenprobe: derselbe Ordner, null Abhängigkeiten – genau so liefert GitHub Pages später aus.
- **2026-09-02 – Dev-Dependencies auf den jeweils aktuellen Majors** (ESLint 10, Vitest 4,
  Vite 8, Prettier 3.9). Die im Plan naheliegenden älteren Stände zogen 6 Vulnerabilities über
  ein altes esbuild herein; mit den aktuellen Versionen meldet `npm audit` null.
- **2026-09-02 – Projektplan von Prettier ausgenommen** (`CLAUDE.md`, `PROGRESS.md`, `README.md`,
  `docs/`). Prettier formatiert Markdown-Tabellen um und erzeugt Diff-Rauschen in Dokumenten, die
  sich sonst nie ändern. Code, CSS, HTML und YAML bleiben voll unter Prettier.
- **2026-09-02 (M2) – Zwei Dateien in `tests/` überschreiten die 400-Zeilen-Grenze.**
  `tests/state/reducers.test.js` (497) ist eine Liste von Fällen; sie aufzuteilen macht sie nicht
  übersichtlicher, nur schwerer auffindbar. `tests/fairness/audit.js` (451) ist ein
  CLI-Werkzeug, dessen Kriterienliste bewusst an einer Stelle steht, damit man sie gegen
  `03_RACE_ENGINE.md` §7 lesen kann. Der Produktivcode in `src/` hält die Grenze ein.
- **2026-09-02 (M5) – Der Rennen-Renderer wird lazy geladen.**
  Nach M5 lag der Initial Load bei 307 KB, 7 KB über dem Budget. Die Alternative wäre gewesen,
  Kommentare zu streichen – 23 % der JS-Zeilen sind Dokumentation, und die ist in diesem Projekt
  ausdrücklich gewollt. Stattdessen lädt der Renderer jetzt erst, wenn er gebraucht wird, und
  wird im Hintergrund vorgewärmt. Der Router nimmt dafür auch Lade-Funktionen statt nur Module
  und schützt sich mit einem Token gegen überlappende Ladevorgänge. 307 KB → 127 KB.
- **2026-09-02 (M5) – `eventVisuals.js` in drei Module geteilt.**
  In einer Datei wären es 738 Zeilen gewesen. Die Aufteilung folgt der Zuständigkeit: die
  Registry mit dem Lebenszyklus, die reinen Zeichenroutinen (`eventProps.js`) und die
  Partikel-Tabelle (`eventEmitters.js`). Die letzten beiden sind Nachschlagewerke, kein Ablauf –
  man schlägt dort nach, wenn eine Requisite hübscher werden soll.
- **2026-09-02 (M5) – Das Publikum hüpft als Ganzes statt Zuschauer für Zuschauer.**
  Die Tribüne liegt in einem Offscreen-Cache; einzelne Zuschauer zu animieren hieße, den Cache
  aufzugeben. Aus der Zuschauerperspektive im Spiel liest sich beides gleich.
- **2026-09-02 (M4) – Die Kamera kennt nur eine Achse.**
  Statt zweier Kameras rechnet sie in Streckeneinheiten und liefert einen Pixel-Versatz *entlang*
  der Bahn; ob das ein Bildschirm-x (Landscape) oder ein -y (Portrait, invertiert) ist, entscheidet
  die Bahn. Deshalb bedient dieselbe Kamera beide Orientierungen ohne eine einzige Verzweigung.
- **2026-09-02 (M4) – `track.js` ist nur noch eine Fabrik.**
  `02_ARCHITECTURE.md` §7 sagt „nur `track.js` und die Pferde-Perspektive unterscheiden sich".
  Beide Layouts in einer Datei wären deutlich über der 400-Zeilen-Grenze gelandet, also gibt es
  `trackLandscape.js`, `trackPortrait.js`, das geteilte `trackTheme.js` und eine schlanke Fabrik.
  Beide Bahnen bieten dieselbe Schnittstelle – ein Test prüft das –, sodass der Rennen-Screen
  nirgends nach der Orientierung fragt.
- **2026-09-02 (M4) – Die Rückansicht ist ein eigenes Modul, kein Modus in `horse.js`.**
  Die beiden Ansichten teilen sich die Pose und die Zeichen-Primitiven, aber keine Geometrie: von
  hinten gibt es keine Beinwinkel-Kinematik, sondern ein seitliches Ausschwingen. Ein gemeinsames
  Modul wäre eine Datei mit zwei disjunkten Hälften geworden.
- **2026-09-02 (M4) – `quality.level` ist Modulzustand, kein Parameter.**
  Die Qualitätsstufe ist eine Eigenschaft des Renderers als Ganzes. Sie durch jede Zeichenfunktion
  zu reichen hätte Funktionen, die sonst nur Geometrie nehmen, einen Fremdkörper verpasst. Sie
  geht bewusst **nie wieder hoch**: Sonst flackert das Bild bei jeder Schwankung um die Schwelle
  zwischen zwei Aussehen.
- **2026-09-02 (M3) – Die Bahn wird mit leichter Perspektive gezeichnet.**
  `04_DESIGN_SYSTEM.md` §6 beschreibt sechs Bahnen; sechs exakt gleich hohe Streifen sehen aber
  aus wie ein Balkendiagramm. Die hinteren Bahnen sind deshalb schmaler und ihre Pferde kleiner
  (Exponent 1,3). Das verändert nichts am Rennen – die Bahn ist rein kosmetisch, die Engine liest
  sie nie.
- **2026-09-02 (M3) – `render/shapes.js` und `render/horseTack.js` zusätzlich angelegt.**
  `horse.js` war mit 527 Zeilen über der A6-Grenze. Sattelzeug, Jockey und Accessoires sind eine
  eigene Zuständigkeit („alles, was der Reiter mitbringt"), die gemeinsamen Primitiven liegen in
  `shapes.js`. Danach: horse.js 282, horseTack.js 223, shapes.js 48.
- **2026-09-02 (M3) – `src/styles/race.css` abgetrennt.**
  Die in M1 notierte Bedingung ist eingetreten: `screens.css` war auf 857 Zeilen gewachsen. Der
  Rennen-Screen ist kein Dokument-Screen (kein Header, kein Footer, kein Scroll-Body), sondern
  ein Vollbild-Canvas mit HUD – eine saubere Trennlinie. `screens.css` liegt jetzt bei 650, immer
  noch über der Richtlinie; die nächste Aufteilung wäre nach Screens, wenn es nötig wird.
- **2026-09-02 (M3) – Der Kamera-Ausschnitt reicht vor die Startlinie.**
  Sonst sind die Startboxen und die darin stehenden Pferde beim Countdown halb vom linken Rand
  abgeschnitten. Die Kamera darf bis 32 % der Sichtbreite vor Position 0 schauen.
- **2026-09-02 (M2) – Varianz-Rampe im Phasenprofil statt konstanter Streuung.**
  `03_RACE_ENGINE.md` §5.1 beschreibt K Stützstellen mit *einer* Standardabweichung σ_P. Damit
  sind S1 und S3 nachweislich unerreichbar (siehe Tuning-Protokoll). Die Streuung wächst jetzt
  entlang der Strecke. Für alle Läufer identisch, also fairness-neutral – bewiesen durch den
  1,8-Mio.-Lauf.
- **2026-09-02 (M2) – OU-Rauschen exakt diskretisiert und nur alle 3 Schritte aktualisiert.**
  Statt Euler-Maruyama bei 60 Hz die geschlossene Lösung des Prozesses bei 20 Hz. Die stationäre
  Verteilung ist identisch (keine Näherung), es kostet aber ein Drittel der Gauß-Ziehungen. Bei
  einer Korrelationszeit von 0,55 s löst 20 Hz den Prozess mehr als fein genug auf.
- **2026-09-02 (M2) – Das Fairness-Audit läuft auf Worker-Threads.**
  Das Kriterienraster braucht 220.000 Rennen; einkernig wären das über zwei Minuten, das CI-Budget
  sind 60 s. Jedes Rennen wird aus seinem eigenen Index geseedet, die Aufteilung kann das Ergebnis
  also nicht verändern – `--verify-partition` beweist das bei jedem CI-Lauf.
- **2026-09-02 (M2) – `createRace()` nimmt `duration`/`chaos` statt eines `config`-Objekts.**
  `02_ARCHITECTURE.md` §5.2 skizziert `createRace({seed, config, horses})`. Ein `horses`-Argument
  wäre ein Verstoß gegen die Engine-Isolation; die übrigen Konstanten kommen direkt aus
  `config.js`. Der Zustand heißt entsprechend `runners` (mit `index`), nicht `horses`.
- **2026-09-02 (M2) – `crypto.getRandomValues` ist in `rng.js` erlaubt, mit gezieltem
  ESLint-Ausnahmekommentar.** `randomSeed()` gehört laut §5.1 in dieses Modul und ist nicht Teil
  der Simulation: Sobald der Seed feststeht, ist das Rennen deterministisch. Das generelle Verbot
  bleibt für alles andere bestehen; ein Test prüft, dass `crypto` nur in `randomSeed` vorkommt.
- **2026-09-02 (M1) – `settle()` liefert keinen fertigen Text für Event-Trinkregeln.**
  `02_ARCHITECTURE.md` §5.3 sieht ein Feld `text` vor. Das ginge nur, wenn `payout.js` die
  Pferdenamen kennt – genau das verbietet aber die Engine-Isolation (`data/horses.js` ist für
  `src/engine/**` gesperrt). Die Funktion gibt stattdessen `{eventId, horseId, playerIds, sips,
  direction}` zurück; den Satz „🍺 Team Kater Morgana: 1 Schluck!" baut die UI. Ebenso nimmt
  `settle()` die Events als vierten Eingabewert entgegen, sonst könnte es `eventRules` gar nicht
  füllen.
- **2026-09-02 (M1) – `createStore(reducer, initialState)` statt `createStore(initialState)`.**
  So bleibt `store.js` frei von einer Abhängigkeit auf `reducers.js` und ist isoliert testbar.
  Das Verhalten aus §5.5 (dispatch → Reducer → neue Referenz → Subscriber) ist unverändert.
- **2026-09-02 (M1) – Zwei zusätzliche Actions gegenüber der Doku-Liste.**
  `race/clear` (setzt das Rennen zurück, bevor ein neues startet) und `race/markRecorded`.
  Letzteres verhindert, dass ein erneuter Aufruf des Ergebnis-Screens – etwa nach Reload oder
  Browser-Zurück – dasselbe Rennen ein zweites Mal in die Statistik bucht.
- **2026-09-02 (M1) – Drei kleine Zusatzmodule.** `ui/dom.js` (Element-Helfer, ausschließlich
  `textContent`), `ui/components/layout.js` (Screen-Gerüst, Karten, Pferde-Badge) und
  `ui/strings.js` (Wording, damit der Alkoholfrei-Schalter sofort wirkt statt erst in M7).
  `data/avatars.js` hält den Emoji-Pool. Ohne diese Helfer wären die Screen-Module deutlich
  länger als die 400-Zeilen-Grenze aus A6.
- **2026-09-02 (M1) – CSS bleibt bei den vier Dateien aus der Architektur, auch über 400 Zeilen.**
  `02_ARCHITECTURE.md` §2 schreibt genau `tokens.css`, `base.css`, `components.css` und
  `screens.css` vor. Die 400-Zeilen-Regel aus A6 steht im selben Punkt wie „Funktionen ≤ 60
  Zeilen" und zielt auf Code-Module; CSS weiter aufzuteilen würde einer ausdrücklichen
  Architektur-Entscheidung widersprechen. Sollte `screens.css` in M3–M6 unhandlich werden, ist
  eine Aufteilung nach Screens der nächste Schritt – dann als bewusste Architektur-Änderung.
- **2026-09-02 (M1) – Quick-Bet aus GDD §3.3 nicht umgesetzt.** Die Idee ist dort als optional
  markiert und taucht in der Einstellungstabelle §6 nicht auf. Die 6-Tap-Vorgabe aus A1 wird auch
  ohne sie erreicht. Liegt im Backlog.
- **2026-09-02 – Fairness-Schutz schon auf Datenebene** (`tests/fairness/horses.test.js`).
  Der Test verbietet jedes Feld an einem Pferd, das nicht rein kosmetisch ist, und jeden
  Zahlenwert außer der Startnummer. So fällt ein versehentlicher „Speed"-Wert sofort auf,
  statt erst als Verzerrung im 100k-Audit.

### A2 – Fairness- & Suspense-Audit (2026-09-02, M2)

| Prüfpunkt | Ergebnis |
| --- | --- |
| `npm run audit:fairness` (220k) Exit 0 | ✅ 51 s lokal (8 Worker), **96 s in CI** (GitHub-Runner haben 4 Kerne). Die Zahlen sind bitidentisch – S1 31,24 %, S3 27,13 %, S6 132 auf beiden Maschinen |
| Einmalig 1 Mio.: alle Anteile in [0,1607; 0,1727], χ² p > 0,001 | ✅ Spanne 0,16625–0,16729, χ² p = 0,48 |
| Sieganteile je Bahn uniform | ✅ χ² p = 0,69 |
| Je Chaos-Level und Renndauer uniform | ✅ vier Vergleichsläufe à 200k |
| Platz-2–6-Verteilungen uniform | ✅ |
| Events uniform, nie > 2 je Läufer, Fenster 8–95 % | ✅ 0 Verstöße über 1,8 Mio. Rennen |
| S1–S6 im Zielbereich | ✅ (S3 und S6 mit den in §7.1 begründeten Zielen) |
| Determinismus-Test | ✅ 50 Seeds bitidentisch, zusätzlich im Browser gegengeprüft |
| Engine ohne `Math.random`, `Date`, `performance`, DOM | ✅ Grep-Test über alle Engine-Dateien, ESLint zusätzlich |
| `step()` nimmt kein dt | ✅ Test übergibt 0,5 und erwartet unveränderten Fortschritt |
| Keine Betting-Daten an `createRace()` | ✅ Test verbietet „bet"/„player" im Engine-Code |
| Lane-Shuffle aktiv und getestet | ✅ |
| Kein rang-basiertes Rubber-Banding | ✅ `speedModel.js` liest keine fremde Position; Test belegt es |
| 20 Rennen mit `?debug=1` ansehen | ⏳ **Nutzer-Test erforderlich** |

**Im Audit gefunden und behoben:** Der eigene `--verify-partition`-Check schlug an – beim
Zusammenführen der Worker-Ergebnisse wurde `trackLength` mitaddiert statt als Metadaten behandelt.
Ohne den Check wäre der Fehler nie aufgefallen, weil er die geprüften Zahlen nicht verfälscht.

### A6 – Code-Audit (2026-09-02, M2)

| Prüfpunkt | Ergebnis |
| --- | --- |
| JSDoc-Kopf in jedem Modul | ✅ |
| Keine JS-Datei > 400 Zeilen | ✅ in `src/`: größte ist `race.js` mit 392 (die Effekt-Verwaltung wanderte dafür nach `effectSlots.js`). Ausnahmen in `tests/`: `reducers.test.js` (497) und `audit.js` (451) — begründet unter „Entscheidungen" |
| Keine Magic Numbers außerhalb `config.js` | ✅ auch die Optimierungs-Konstanten sind benannt |
| Keine Abhängigkeitszyklen | ✅ `engine/` importiert nur aus `engine/` und `data/events.js` |
| Engine-Coverage ≥ 90 % Zeilen | ✅ **98,0 %** Zeilen, 93,8 % Branches |
| Alle Tests < 20 s | ✅ 228 Tests in 2,9 s |
| `npm run lint` 0 Fehler | ✅ |
| Keine TODO/FIXME | ✅ |

### A3 – Visual- & Animations-Audit (2026-09-02, M3, Landscape-Teil)

| Prüfpunkt | Ergebnis |
| --- | --- |
| Gallop-Zyklus bei jedem Tempo flüssig, keine Sprünge bei Tempowechsel | ✅ Die Phase wird **integriert**, nicht aus der Zeit berechnet. Ein Test fährt das Tempo zwischen 0,3 und 1,9 hin und her und misst die größte Winkeländerung je Frame: 0,25 rad – exakt das physikalische Maximum. Zur Gegenprobe habe ich die Phase absichtlich aus der Uhr berechnet: dann springt sie auf 1,39 rad, und der Test schlägt an. |
| Mähne/Schweif mit Follow-Through, bei Stillstand ruhig | ✅ Federkette mit vier Segmenten; im `idle`-Zustand hängen beide senkrecht (im Lab geprüft) |
| Körper-Bounce und Schatten-Skalierung synchron zur Flugphase | ✅ Der Schatten schrumpft und wird heller, je höher das Pferd steht |
| Alle 6 Pferde unterscheidbar an Fell, Accessoire und Signaturfarbe; Nummern lesbar | ✅ Nummer auf Satteldecke **und** Startbox |
| Jeder Animations-State im Lab geprüft (Seitenansicht) | ✅ idle, gallop, gallop_fast, trot_in, celebrate; Rückansicht folgt in M4 |
| Sieger-`celebrate` eindeutig, 2–3 s | ✅ 2,6 s, Pferd bäumt sich auf |
| Parallax-Layer mit unterschiedlicher Geschwindigkeit, keine Kachel-Nähte | ✅ Hügel 0,15 · Tribüne 0,45 · Bahn 1,0 · Rasen 1,25 |
| Startboxen in der Signaturfarbe des zugelosten Pferdes | ✅ Der Lane-Shuffle ist dadurch direkt sichtbar |
| Kamera ruckelt nicht, Feld immer sichtbar | ✅ Frame-Rate-unabhängiger Lerp; ein Test prüft, dass 30 und 144 fps dieselbe Bewegung ergeben |
| Zieleinlauf erkennbar, Reihenfolge stimmt mit Engine-`order` überein | ✅ **nach einer Korrektur**, siehe unten |
| Screenshots in `docs/screenshots/` | ✅ `m3-race-landscape.jpg` |

**Im Audit gefunden und behoben:**

1. **Das Leaderboard widersprach dem Ergebnis-Screen.** Im Ziel stehen alle sechs Läufer auf
   exakt Position 1000, die Sortierung nach Position war dort also willkürlich – das Board zeigte
   Sir Trabsalot auf 1, während der Kommentator „Prosecco Rakete gewinnt!" sagte. Die Rangfolge
   kommt jetzt nach dem Zieleinlauf aus der Engine-`order`. Die Regel steckt in der reinen
   Funktion `rankRunners()` und hat einen eigenen Test.
2. **Ritterhelm und Ushanka saßen am Pferdekopf statt am Jockey** und schwebten als graue Pille
   neben dem Kopf. Laut GDD §2 gehören sie an den Jockey. Accessoires sind jetzt nach Trageort
   getrennt: Jockey-Kopfbedeckung, Pferdekopf (Sonnenbrille, Kleeblatt) und Sattel (Kaffeebecher,
   Brezel).

Kleinere Korrekturen: Hals und Kopf waren giraffenhaft lang, der Jockey lehnte nach hinten statt
nach vorn, Mähne und Schweif standen als Klaue nach oben (Feder-Basiswinkel und Ablenkung
addierten sich falsch – die Feder liefert jetzt nur noch den Flick, die Richtung kommt aus dem
Tempo), die Tribüne erschlug mit übergroßen Zuschauern das ganze Bild, und am Start waren die
Startboxen halb vom linken Rand abgeschnitten.

### A5 – Performance-Audit (2026-09-02, M3, Desktop-Teil)

Gemessen auf einem M-Mac in Chrome, 1200 × 637 CSS-Pixel, `?debug=1`.

| Prüfpunkt | Budget | Gemessen |
| --- | --- | --- |
| FPS | 60 | **60**, stabil über ein ganzes Rennen |
| Frame-Time Update | ≤ 2 ms | **0,00–0,10 ms** |
| Frame-Time Render | ≤ 10 ms | **1,0–1,5 ms** (mit dem Debug-Zähler-Proxy; ohne ihn 1,0 ms) |
| Pfad-Operationen je Frame | ≤ ~600 | **453–480** |
| Partikel gleichzeitig | ≤ 400 | 20–30 im normalen Rennen |
| Partikel-Pool ohne Allokation | – | ✅ Typed Arrays, feste Größe, tote Partikel werden getauscht statt entfernt |
| Hintergrund aus Offscreen-Canvas | – | ✅ Hügel und Tribüne werden einmal gezeichnet und nur noch geblittet |
| Initial Load | < 300 KB | **239 KB** |

Der Pfad-Operationen-Zähler ist ein Proxy um den 2D-Kontext, der nur mit `?debug=1` aktiv ist –
er kostet selbst etwas Zeit, und genau so etwas darf nicht im Hot Path landen.

Mobile-Teil und `quality: 'auto'` folgen in M4.

### A3 – Visual- & Animations-Audit (2026-09-02, M4, Portrait-Teil)

| Prüfpunkt | Ergebnis |
| --- | --- |
| Sechs vertikale Bahnen, Rennen von unten nach oben | ✅ Startboxen unten, Ziel oben, Tribünen an beiden Seiten |
| Rückansicht des Pferdes | ✅ Satteldecke und Trikot zeigen frontal zum Betrachter – die größtmögliche Fläche der Signaturfarbe, mit der Startnummer mittendrin |
| Rückansicht im horse-lab geprüft | ✅ eigener Umschalter Seite/Hinten |
| Kamera vertikal, Feld zentriert | ✅ dieselbe Kamera wie im Landscape; sie kennt nur eine Achse |
| Live-Umschaltung bei Rotation ohne Neustart | ✅ **im Browser geprüft**: Rennen bei t = 4,0 s in Portrait gestartet, Fenster gedreht, bei t = 4,8 s in Landscape weitergelaufen – gleiche Simulation, andere Bahn und Perspektive |
| Eigenes Pferd innerhalb 1 s identifizierbar | ⏳ **Nutzer-Test erforderlich** (mit drei Personen) |
| Startboxen in der Signaturfarbe | ✅ sie klappen nach unten weg statt zur Seite |
| Zieleinlauf erkennbar | ✅ **nach einer Korrektur**, siehe unten |
| Screenshot in `docs/screenshots/` | ✅ `m4-race-portrait.jpg` |

**Im Audit gefunden und behoben:**

1. **Das ZIEL-Banner verschwand hinter den Pferden.** Es wurde vor ihnen gezeichnet, und im Ziel
   verdecken sechs Pferde alles über der Linie. Ein Banner hängt aber über der Bahn – die Pferde
   laufen darunter durch. `drawFinish()` zeichnet jetzt nur noch die Ziellinie am Boden, das neue
   `drawOverhead()` das Banner nach den Pferden. In beiden Orientierungen.
2. **Die Tiefensortierung war im Portrait falsch.** Sie sortierte nach Bahn, aber im Portrait
   liegen die Bahnen nebeneinander in gleicher Entfernung – was den Überlapp entscheidet, ist die
   Streckenposition. Die Bahn liefert jetzt einen `depthKey(units, lane)`, den jede Orientierung
   selbst definiert.

Kleinere Korrekturen: Das Orientierungs-Attribut saß am Screen-Container statt an der Rennbühne,
weshalb das Portrait-HUD-CSS gar nicht griff; der Pferdekopf verschwand hinter dem Jockey-Helm
(der Hals ist jetzt sichtbar dazwischen); der Schweif steckte hinter der Satteldecke; und die
Hinterbeine spreizten wie bei einer Spinne.

### A4 – Barrierefreiheit-Audit (2026-09-02, M4, Basis)

| Prüfpunkt | Ergebnis |
| --- | --- |
| Alle interaktiven Elemente ≥ 48 × 48 px | ✅ automatisch über alle Screens geprüft: 0 Treffer unter 48 px |
| `:focus-visible` überall sichtbar | ✅ 3 px Ring auf `--ink`, Kontrast > 3:1 |
| `aria-live`-Region meldet Führungswechsel und Sieger | ✅ **im Browser geprüft**: „Sir Trabsalot führt." bzw. „… gewinnt!"; gedrosselt auf tatsächliche Wechsel, sonst redet der Screenreader ununterbrochen |
| Canvas hat `role="img"` und ein aktuelles `aria-label` | ✅ „Rennbahn. Sir Trabsalot führt." |
| Pferde ohne Farbe unterscheidbar | ✅ Startnummer auf Satteldecke, Startbox und Leaderboard-Punkt; dazu Fellfarbe und Accessoire |
| `touch-action: manipulation`, kein Doppeltipp-Zoom | ✅ |
| Keine Hover-only-Zustände | ✅ Hover-Effekte stehen in `@media (hover: hover)` |
| Tastatur-Reihenfolge logisch | ✅ Tab-Durchlauf geprüft |
| Kontrast ≥ 4,5:1, Zoom 200 %, Deuteranopie, Lighthouse | ⏳ vollständig in M8 |

### A5 – Performance-Audit (2026-09-02, M4, Mobile-Teil)

| Prüfpunkt | Budget | Gemessen |
| --- | --- | --- |
| FPS Portrait (400 × 860, Desktop-Browser) | 60 | **60** |
| Render-Zeit Portrait | ≤ 10 ms | **1,0–1,3 ms** |
| Pfad-Operationen Portrait | ≤ ~600 | **310–340** (weniger als Landscape, weil Perspektive und Vordergrund entfallen) |
| Initial Load | < 300 KB | **266 KB** |
| `quality: 'auto'` greift unter 50 FPS | – | ✅ mit Tests belegt: senkt nach 2 s, meldet genau einmal, geht nie wieder hoch |

**Offen und ehrlich benannt:** Die Vorgabe lautet **≥ 55 FPS auf einem drei Jahre alten
Mittelklasse-Handy**. Ich kann hier nur im Desktop-Browser messen; eine Zahl von echter Hardware
habe ich nicht. Die gemessene Render-Zeit von 1,0–1,3 ms lässt viel Luft – selbst ein Gerät, das
achtmal langsamer ist, bliebe bei rund 10 ms und damit unter dem 16,7-ms-Budget. Das ist eine
Hochrechnung, keine Messung. Der Sicherheitsgurt dafür ist `quality: 'auto'`: Fällt die Bildrate
zwei Sekunden lang unter 50, verschwinden Verläufe und ein Teil des Staubs – die Simulation
bleibt unverändert. **Nutzer-Test:** ein Rennen auf dem Handy mit `?debug=1` ansehen und die
FPS-Zahl notieren.

### A3 / A2 / A5 – Audits zu M5 (2026-09-02)

**A2 (Fairness, Re-Run):** unverändert grün. Siegquoten 0,1644–0,1684 bei 30.000 Rennen
(erlaubt ±0,0086), χ² p = 0,84; Events gleichverteilt (p = 0,66), nie mehr als zwei je Läufer;
S1–S6 alle im Ziel. Das war zu erwarten und ist trotzdem der Punkt: Die gesamte M5-Arbeit steckt
in `render/`, und die Engine hat davon nichts mitbekommen.

**A3 (Events):**

| Prüfpunkt | Ergebnis |
| --- | --- |
| Jedes Event hat Requisite, Animation, Partikel und Kommentar | ✅ Checkliste oben, alle 23 |
| Requisiten-Timing exakt: Effekt beginnt im selben Frame, in dem die Requisite trifft | ✅ **konstruktiv garantiert**: Die Ankunft wird als `(jetzt − Zündzeit) / Vorlauf` gerechnet, ist bei der Zündzeit also genau 1 – und genau dann beginnt der Effekt |
| Bleibende Dekor-Objekte werden gezeichnet | ✅ Schale, zwei Pfützen, Hufeisen, sitzender Jockey |
| Kein Event verdeckt das HUD länger als 1 s | ✅ Requisiten sind auf 0,15–0,2 der Pferdegröße skaliert |
| Reduced-Motion: kein Shake, keine Blitze, Events trotzdem verständlich | ✅ Requisiten bleiben, nur Bewegung und Menge werden reduziert |
| Publikum reagiert auf jedes Event | ✅ die ganze Tribüne hüpft |

**Im Audit gefunden und behoben:**

1. **`turn` und `spin` wurden berechnet, aber nie angewendet.** Der Rutsch auf der Banane drehte
   das Pferd nicht, und „orientierungslos" ließ es nicht rückwärts schauen. Beide wirken jetzt im
   Zeichnen – das Umdrehen als horizontale Stauchung durch Null, der klassische 2D-Weg.
2. **Der Jockey saß nach `jockey_off` weiter auf dem Pferd**, während seine Kopie am Rand winkte.
   Laut GDD läuft das Pferd ohne ihn weiter; es hat jetzt ein `riderless`-Flag und verliert dabei
   auch die Zügel.

Kleinere Korrekturen: Requisiten waren doppelt so groß wie nötig (die Banane fast so groß wie der
Pferdekopf), die Espresso-Tasse stand hinter statt vor dem Pferd, der Fan schwebte in der
Tribüne statt am Geländer, und der Trinkregel-Toast stand neben statt über der Kommentarzeile.

**A5 (Performance):**

| Prüfpunkt | Budget | Gemessen |
| --- | --- | --- |
| FPS mit Events bei Chaos „Vollgas" | 60 | **60** |
| Render-Zeit | ≤ 10 ms | 0,6–3,2 ms |
| Pfad-Operationen je Frame | ≤ ~600 | 452–514 |
| Partikel gleichzeitig | ≤ 400 | 20–60 |
| Initial Load | < 300 KB | **127 KB** (siehe unten) |

**Das Ladebudget war gerissen und wurde behoben.** Nach M5 lag der Initial Load bei **307 KB** –
7 KB über dem Budget aus `02_ARCHITECTURE.md` §8. Gzip-komprimiert (so liefert GitHub Pages aus)
wären es 86 KB gewesen, das eigentliche Ziel „< 1 s auf 4G" also nie in Gefahr. Trotzdem ist ein
gerissenes Budget ein gerissenes Budget.

Die Lösung ist keine Diät bei den Kommentaren, sondern die richtige: **Der Rennen-Renderer wird
erst bei Bedarf geladen.** Horses, beide Bahnen, Requisiten, Partikel – 180 KB, die niemand
braucht, bevor eine Wette steht. Der Router akzeptiert jetzt auch Lade-Funktionen statt nur
Module, und `main.js` wärmt den Renderer im Hintergrund vor, während die Spieler noch ihre Namen
tippen. **Ergebnis: 307 KB → 127 KB**, ohne spürbare Wartezeit (im Browser durchgespielt).

## Playtest-Notizen

_(Datum – Meilenstein – Beobachtungen – abgeleitete Tasks)_

## Bekannte Probleme / offene TODOs

_(werden hier gesammelt, bevor sie zu Tasks werden)_

- Noch 5 Platzhalter-Module mit JSDoc-Kopf und leerem `export {}`: `render/eventVisuals.js` (M5),
  `render/sprites.js` (Backlog), `audio/audio.js` und `audio/sfx.js` (M7), `data/commentary.js` (M7).
- Die Rückansicht kennt keine Accessoires. Auf dem Handy sind sie bei rund 50 px Breite ohnehin
  nicht lesbar; Farbe und Nummer tragen die Unterscheidung.
- Das bleibende Dekor liegt immer an der Bahn des betroffenen Pferdes. Ein Pferd, das über eine
  fremde Bananenschale läuft, merkt davon nichts – das Dekor ist Erinnerung, nicht Physik.
- `screens.css` (650) und `components.css` (457) liegen weiter über der 400-Zeilen-Richtlinie.
  Der Produktivcode in `src/**.js` hält sie ein.
- Das Publikum steht still. Die La-Ola-Welle bei Events und im Finish gehört zu M5.
- Das Text-Rennen zeigt pro Event nur die erste Kommentar-Variante. Die richtige
  Kommentator-Engine mit Zeilen-Pool und Wiederholungsschutz kommt in M7.
- Der Display-Font „Fredoka" ist in `tokens.css` als `--font-display` gesetzt, aber noch nicht
  self-hosted; bis dahin greift der Fallback `system-ui`. Die woff2-Datei kommt in M6 nach
  `assets/fonts/` (docs/04 §3).
- `npm run e2e` ist angelegt, hat aber noch keine Playwright-Config und keine Specs – beides
  entsteht in M9. Der CI-Schritt überspringt E2E deshalb, solange `tests/e2e/` leer ist.
- Der Ergebnis-Screen zeigt die Event-Trinkregeln noch nicht als Rückblick-Liste an – es gibt bis
  M5 keine Events. `settle()` liefert sie bereits vollständig und getestet mit.
- Das Podium ist aus CSS-Sockeln gebaut. Die prozeduralen Pferde-Portraits und der
  Stagger-Einsprung kommen laut Plan in M6.

## Backlog v1.1+

- Jackpot-Runde, Pechvogel-Bonus, Sudden Death, Wetter-/Strecken-Varianten, Share-Card, Zuschauer-Emojis, Sprite-Sheet-Option (siehe `docs/01_GAME_DESIGN.md` §5 Prio B)
