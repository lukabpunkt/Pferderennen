# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format nach
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach
[Semantic Versioning](https://semver.org/lang/de/).

## [1.0.0] – 2026-09-02

Die erste vollständige Version. Sechs Pferde, ein Gerät, und der Beweis, dass es fair ist.

### Spiel

- **Sechs Pferde, bewiesen gleich stark.** Keine Stats, kein Glücksfaktor, keine Bahn, die hilft –
  über 1.000.000 simulierte Rennen liegt die größte Abweichung 0,0006 vom idealen 1/6.
- **Rennsimulation** mit Catmull-Rom-Phasenprofil, Ornstein-Uhlenbeck-Rauschen und Sprints. Der
  Führende zur Rennhälfte gewinnt nur in 31 % der Fälle, im Schnitt gibt es 11,9 Führungswechsel.
- **23 Events** – Bananenschale, Kotzpause, Regenbogen-Furz, Taube, UFO und der Rest –, jedes mit
  Requisite, Animation, Partikeln und Kommentar. Sie treffen jedes Pferd gleich oft.
- **Vier Wettarten:** Sieg, Platz, Letzter, oder frei wählbar pro Spieler.
- **Trinkregeln:** Event-Regeln und die optionale Führungswechsel-Regel im Schlussdrittel.
- **Session-Statistik** mit Siegen, verteilten und getrunkenen Schlücken, Pechsträhne und der
  Rennhistorie als Farbpunkte.
- **Alkoholfrei-Modus:** aus jedem Schluck wird ein Punkt, überall.

### Darstellung

- Prozedural gezeichnete Pferde mit 17 Animationszuständen, kontinuierlich fortgeschriebener
  Gallopphase und Follow-Through in Mähne und Schweif.
- **Zwei Bahn-Orientierungen:** Querformat für Laptop und Fernseher, Hochformat fürs Handy, live
  umschaltbar mitten im Rennen.
- **Fotofinish** mit Zeitlupe, Kamerafahrt, Vignette und Blitzlicht – in rund 40 % der Rennen.
- Countdown mit Startglocke, Konfetti in der Siegerfarbe, Podium und Attract-Mode auf dem
  Startbildschirm.

### Ton

- Vollständig synthetisiert (Web Audio), **keine einzige Audiodatei**: Hufgetrappel, das dem Tempo
  des Feldes folgt, Menge, die zum Ziel hin anschwillt, Startglocke, Fanfare, Kamera-Klicks und ein
  eigener Cue je Event.
- **Live-Kommentator** mit 97 Zeilen: Priorität Event vor Führungswechsel vor Füller, und keine
  Zeile wiederholt sich innerhalb eines Rennens.

### Technik

- Kein Framework, kein Bundler, **kein Build-Schritt**. Was im Repo liegt, lädt der Browser.
- **PWA:** installierbar, offline vollständig spielbar. Die Icons werden aus dem Zeichencode des
  Spiels gerendert, die Precache-Liste des Service Workers wird generiert und in der CI geprüft.
- **Barrierefreiheit:** Lighthouse 100. Kompletter Tastatur-Flow, Fokus-Fallen in Overlays,
  `aria-live` für Start, Führungswechsel, Fotofinish und Sieger, `prefers-reduced-motion` mit
  manueller Überschreibung.
- **Performance:** Lighthouse Mobile 92, Total Blocking Time 0 ms, CLS 0, kein verworfener Frame
  während eines Rennens.
- 315 Unit-Tests, 8 End-to-End-Tests auf Chromium und WebKit im Handy-Viewport, und ein
  Fairness-Audit als Pflicht-Gate in der CI.

[1.0.0]: https://github.com/lukabpunkt/Pferderennen/releases/tag/v1.0.0
