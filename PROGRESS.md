# PROGRESS – Fortschritts-Tracker

> **Für Claude Code:** Diese Datei ist deine To-do-Liste und dein Gedächtnis. Beginne jede Session damit, sie zu lesen. Hake Tasks ab, trage Audit-Ergebnisse ein, notiere Entscheidungen. Details zu jedem Task stehen in `docs/05_MILESTONES.md`.

**Aktueller Stand:** **M0 abgeschlossen** (Projekt-Setup & Tooling, Audit A0 bestanden). Nächster Schritt: **M1 – State, Router & UI-Screens**.

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

- [ ] 1. store.js + reducers.js + Tests
- [ ] 2. persistence.js + Test
- [ ] 3. router.js + Transitions
- [ ] 4. components (button, stepper, toast, modal)
- [ ] 5. Screens start/players/betting/results/rules/settings/stats
- [ ] 6. engine/payout.js + Tests
- [ ] 7. Placeholder-Race-Screen
- [ ] 8. components.css + screens.css
- [ ] 9. `chore: complete M1`
- [ ] **Audit A1 bestanden**
- [ ] **Audit A6 bestanden**

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
| A0    | M0          | 2026-09-02 | **bestanden** | CI-Lauf auf GitHub: siehe Actions-Tab nach Push. |

### A0 – Setup-Audit im Detail (2026-09-02)

| Prüfpunkt                                            | Ergebnis                                                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm ci` ohne Peer-Dep-Warnungen                     | ✅ 139 Pakete, 0 Warnungen, **0 Vulnerabilities**                                                                          |
| `dev` / `lint` / `test` / `audit:fairness` Exit 0    | ✅ alle 0; `dev` startet auf :5173 (Vite) bzw. :5174 (`serve`)                                                              |
| CI-Workflow grün                                     | ⏳ Workflow angelegt; grün, sobald der erste Push durch ist                                                                 |
| `index.html` ohne Konsolenfehler, CSP blockiert nichts | ✅ im Browser geprüft – 0 Seitenfehler, 0 CSP-Verstöße (einzige Meldung stammt von einer Chrome-Erweiterung)             |
| Verzeichnisstruktur = `02_ARCHITECTURE.md` §2        | ✅ automatisch abgeglichen, 0 fehlende Dateien/Ordner (offen nur, was planmäßig in M1/M3/M8/M9 entsteht)                    |
| `.gitignore` deckt node_modules, Artefakte, OS-Dateien | ✅ node_modules, dist, coverage, test-results, playwright-report, .DS_Store                                               |
| ESLint/Prettier 0 Fehler                             | ✅                                                                                                                          |
| Engine-Sonderregeln greifen                          | ✅ Probe-Datei in `src/engine/` löste **alle 9** Regeln aus (Math.random, Date, window, document, performance, crypto, 3 Imports); identische Probe in `src/render/` blieb sauber → Regeln korrekt auf die Engine begrenzt |

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
- **2026-09-02 – Fairness-Schutz schon auf Datenebene** (`tests/fairness/horses.test.js`).
  Der Test verbietet jedes Feld an einem Pferd, das nicht rein kosmetisch ist, und jeden
  Zahlenwert außer der Startnummer. So fällt ein versehentlicher „Speed"-Wert sofort auf,
  statt erst als Verzerrung im 100k-Audit.

## Playtest-Notizen

_(Datum – Meilenstein – Beobachtungen – abgeleitete Tasks)_

## Bekannte Probleme / offene TODOs

_(werden hier gesammelt, bevor sie zu Tasks werden)_

- Die 35 Platzhalter-Module tragen bisher nur ihren JSDoc-Kopf und ein leeres `export {}`. Jedes
  ist im Kopf dem Meilenstein zugeordnet, der es füllt (M1–M7). Kein Modul bleibt leer zurück.
- Der Display-Font „Fredoka" ist in `tokens.css` als `--font-display` gesetzt, aber noch nicht
  self-hosted; bis dahin greift der Fallback `system-ui`. Die woff2-Datei kommt in M6 nach
  `assets/fonts/` (docs/04 §3).
- `npm run e2e` ist angelegt, hat aber noch keine Playwright-Config und keine Specs – beides
  entsteht in M9. Der CI-Schritt überspringt E2E deshalb, solange `tests/e2e/` leer ist.

## Backlog v1.1+

- Jackpot-Runde, Pechvogel-Bonus, Sudden Death, Wetter-/Strecken-Varianten, Share-Card, Zuschauer-Emojis, Sprite-Sheet-Option (siehe `docs/01_GAME_DESIGN.md` §5 Prio B)
