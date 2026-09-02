# PROGRESS – Fortschritts-Tracker

> **Für Claude Code:** Diese Datei ist deine To-do-Liste und dein Gedächtnis. Beginne jede Session damit, sie zu lesen. Hake Tasks ab, trage Audit-Ergebnisse ein, notiere Entscheidungen. Details zu jedem Task stehen in `docs/05_MILESTONES.md`.

**Aktueller Stand:** **M1 abgeschlossen** (State, Router & UI-Screens; Audits A1 und A6 bestanden). Nächster Schritt: **M2 – Race Engine & Fairness-Audit**.

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

- [ ] 1. rng.js + Tests
- [ ] 2. effects.js + data/events.js + Tests
- [ ] 3. speedModel.js
- [ ] 4. eventScheduler.js
- [ ] 5. race.js
- [ ] 6. race.test.js (Determinismus, Constraints, Tie-Break, Isolation)
- [ ] 7. tests/fairness/audit.js
- [ ] 8. Tuning-Schleife abgeschlossen (Protokoll unten)
- [ ] 9. Text-Rennen im Race-Screen + loop.js
- [ ] 10. Debug-Modus
- [ ] 11. CI mit echtem Fairness-Audit, `chore: complete M2`
- [ ] **Audit A2 bestanden** (N=100k in CI, N=1M lokal)
- [ ] **Audit A6 bestanden**

### M3 – Render-Core (Landscape)

- [ ] 1. loop.js final
- [ ] 2. Canvas-Setup/DPR/Resize/Layout-Modus
- [ ] 3. camera.js
- [ ] 4. track.js Landscape (Offscreen-Cache)
- [ ] 5. horse.js Seitenansicht + dev/horse-lab.html
- [ ] 6. horseAnimations.js Basis-States
- [ ] 7. Race-Screen verdrahtet (Countdown → Rennen → Zieleinlauf → Ergebnis)
- [ ] 8. Staub-Partikel + Pool
- [ ] 9. Leaderboard + Fortschrittsbalken
- [ ] 10. FPS/Frame-Time im Debug-Overlay
- [ ] 11. `chore: complete M3`
- [ ] **Audit A3 bestanden** (Pferd, Bahn, Kamera)
- [ ] **Audit A5 bestanden** (Desktop)

### M4 – Portrait-Modus & Responsive

- [ ] 1. track.js Portrait
- [ ] 2. horse.js Rückansicht
- [ ] 3. Kamera vertikal
- [ ] 4. HUD Portrait + Safe-Areas
- [ ] 5. Live-Rotation
- [ ] 6. Touch-Ergonomie
- [ ] 7. Desktop/TV-Breakpoints
- [ ] 8. Mobile-Performance + quality:auto
- [ ] 9. `chore: complete M4`
- [ ] **Audit A3 bestanden** (Portrait)
- [ ] **Audit A5 bestanden** (Mobile)
- [ ] **Audit A4 bestanden** (Basis)

### M5 – Events

- [ ] 1. Alle Event-Animations-States (beide Ansichten)
- [ ] 2. eventVisuals.js (alle Requisiten mit Vorlauf)
- [ ] 3. Bleibende Dekor-Objekte
- [ ] 4. Alle Partikel-Typen
- [ ] 5. Kamera-Shake + Publikum-Reaktion
- [ ] 6. Event-Toasts (Trinkregeln)
- [ ] 7. Kommentar-Zeilen je Event
- [ ] 8. Reduced-Motion-Pfad
- [ ] 9. Fairness-Audit Re-Run
- [ ] 10. `chore: complete M5`
- [ ] **Audit A3 bestanden** (Events)
- [ ] **Audit A2 bestanden** (Re-Run)
- [ ] **Audit A5 bestanden**

Event-Checkliste (im horse-lab **und** im echten Rennen gesehen):

| Event        | Lab Seite | Lab Rück | Rennen |
| ------------ | --------- | -------- | ------ |
| banana       | ☐         | ☐        | ☐      |
| stumble      | ☐         | ☐        | ☐      |
| vomit        | ☐         | ☐        | ☐      |
| pee          | ☐         | ☐        | ☐      |
| nap          | ☐         | ☐        | ☐      |
| pigeon       | ☐         | ☐        | ☐      |
| hiccup       | ☐         | ☐        | ☐      |
| mud          | ☐         | ☐        | ☐      |
| selfie       | ☐         | ☐        | ☐      |
| grass        | ☐         | ☐        | ☐      |
| confused     | ☐         | ☐        | ☐      |
| wardrobe     | ☐         | ☐        | ☐      |
| carrot       | ☐         | ☐        | ☐      |
| rainbow_fart | ☐         | ☐        | ☐      |
| jockey_off   | ☐         | ☐        | ☐      |
| espresso     | ☐         | ☐        | ☐      |
| tailwind     | ☐         | ☐        | ☐      |
| slipstream   | ☐         | ☐        | ☐      |
| rocket_boots | ☐         | ☐        | ☐      |
| streaker     | –         | –        | ☐      |
| tumbleweed   | –         | –        | ☐      |
| camera_flash | –         | –        | ☐      |
| ufo          | –         | –        | ☐      |

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
| A1    | M1          | 2026-09-02 | **bestanden** | 3 Befunde im Test gefunden und behoben (siehe unten)  |
| A6    | M1          | 2026-09-02 | **bestanden** | Ausnahme: zwei CSS-Dateien > 400 Zeilen, begründet    |

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

| Iteration | Parameter (σ_P, θ, σ_N, Sprints, σ_F) | Siege min/max | S1  | S2  | S3  | S4  | S5  | S6  | Ergebnis |
| --------- | ------------------------------------- | ------------- | --- | --- | --- | --- | --- | --- | -------- |
|           |                                       |               |     |     |     |     |     |     |          |

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

## Playtest-Notizen

_(Datum – Meilenstein – Beobachtungen – abgeleitete Tasks)_

## Bekannte Probleme / offene TODOs

_(werden hier gesammelt, bevor sie zu Tasks werden)_

- Noch 27 Platzhalter-Module mit JSDoc-Kopf und leerem `export {}` (M2–M7). In M1 gefüllt wurden
  `state/*`, `ui/router.js`, alle `ui/screens/*`, alle `ui/components/*` und `engine/payout.js`.
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
