# 🐎 Pferderennen – das Trinkspiel

Sechs Cartoon-Pferde, eine Bahn voller Blödsinn und deine Freunde, die auf das falsche Pferd setzen.
Browser-Spiel für einen Abend am Küchentisch: ein Gerät, alle schauen zu.

> **Status:** In Entwicklung – aktuell abgeschlossen: **M0 (Projekt-Setup)**. Der komplette Projektplan liegt in [`CLAUDE.md`](./CLAUDE.md) und [`docs/`](./docs/). Fortschritt: [`PROGRESS.md`](./PROGRESS.md).

<!-- Screenshots folgen in M3 (Landscape) und M4 (Portrait), abgelegt in docs/screenshots/. -->

_(Screenshots: folgen, sobald das Rennen sichtbar ist – M3/M4.)_

## Regeln in 5 Zeilen

1. Jeder wählt eins der sechs Pferde und setzt 1–10 Schlücke.
2. Die Pferde rennen. Es passiert Unfug (Bananenschalen, Kotzpausen, Regenbogen-Fürze).
3. Wer aufs Siegerpferd gesetzt hat, **verteilt** seine Schlücke.
4. Alle anderen **trinken** ihren Einsatz.
5. Nächstes Rennen.

## Ist das fair?

Ja – und zwar bewiesen. Alle Pferde sind spielmechanisch identisch; Name, Farbe und Charakter sind reine Kosmetik. Ein automatischer Audit simuliert bei jedem Commit 100.000 Rennen und prüft statistisch, dass jedes Pferd (und jede Bahn) genau 1/6 der Rennen gewinnt – und dass der Führende zur Rennhälfte trotzdem regelmäßig noch eingeholt wird. Details: [`docs/03_RACE_ENGINE.md`](./docs/03_RACE_ENGINE.md).

## Die Pferde

|     | Pferd           | Farbe     |
| --- | --------------- | --------- |
| 1   | Sir Trabsalot   | Lila      |
| 2   | Prosecco Rakete | Pink      |
| 3   | Kater Morgana   | Rot       |
| 4   | Schnapsidee     | Grün      |
| 5   | Hopfen Hengst   | Bernstein |
| 6   | Wodka Wirbel    | Eisblau   |

## Lokal starten

```bash
npm install
npm run dev
```

Dann `http://localhost:5173` öffnen (im WLAN auch vom Handy über die IP des Rechners, die `npm run dev` mit ausgibt).

Weitere Befehle:

| Befehl                    | Wozu                                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| `npm run dev`             | Dev-Server mit Live-Reload (Vite, nur als Static Server)               |
| `npm run serve`           | Derselbe Ordner ohne jede Abhängigkeit – so läuft es später auf Pages  |
| `npm test`                | Unit-Tests (Vitest)                                                   |
| `npm run audit:fairness`  | 100.000 Rennen headless simulieren und statistisch prüfen (ab M2 echt) |
| `npm run lint`            | ESLint + Prettier prüfen                                              |
| `npm run format`          | Prettier schreiben                                                    |

## Tech

Vanilla JavaScript (ES Modules), HTML5 Canvas, kein Framework, kein Bundler, kein Build-Schritt. `index.html` lässt sich auf jedem Static-Host ablegen. Läuft auf GitHub Pages.

## Projektplan

| Dokument                                                | Inhalt                                          |
| ------------------------------------------------------- | ----------------------------------------------- |
| [`docs/01_GAME_DESIGN.md`](./docs/01_GAME_DESIGN.md)     | Regeln, Pferde, Ablauf, Event-Katalog           |
| [`docs/02_ARCHITECTURE.md`](./docs/02_ARCHITECTURE.md)   | Module, State Machine, Datenmodell              |
| [`docs/03_RACE_ENGINE.md`](./docs/03_RACE_ENGINE.md)     | Simulation, Zufall und der Fairness-Nachweis     |
| [`docs/04_DESIGN_SYSTEM.md`](./docs/04_DESIGN_SYSTEM.md) | Farben, Typografie, Animation, Screens          |
| [`docs/05_MILESTONES.md`](./docs/05_MILESTONES.md)       | Arbeitsplan M0–M9                               |
| [`docs/06_QA_AUDITS.md`](./docs/06_QA_AUDITS.md)         | Audit-Checklisten A0–A7                         |
| [`docs/07_DEPLOYMENT.md`](./docs/07_DEPLOYMENT.md)       | Git-Workflow, CI, GitHub Pages                  |

## Verantwortung

Trinkt verantwortungsvoll. Wasser ist auch ein Getränk. Wer fährt, spielt im Alkoholfrei-Modus um Punkte.

## Lizenz

MIT
