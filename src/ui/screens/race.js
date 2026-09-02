/**
 * Race screen: plays the simulation out as six progress bars.
 *
 * M2 stage. The engine is real from here on — this screen runs the actual race with the fixed
 * timestep and shows it as text and bars. The canvas rendering replaces the bars in M3; the
 * wiring between engine, loop and result stays exactly as it is here.
 */

import { el, listen } from '../dom.js';
import { button } from '../components/button.js';
import { page, header, card, horseBadge } from '../components/layout.js';
import { HORSES, horseByIndex } from '../../data/horses.js';
import { EVENTS_BY_ID } from '../../data/events.js';
import { createRace } from '../../engine/race.js';
import { randomSeed } from '../../engine/rng.js';
import { createLoop } from '../../render/loop.js';
import { RACE_DURATIONS, TRACK_LENGTH } from '../../config.js';
import { debugOptions } from '../debug.js';

let cleanup = null;

/** How long the result stays on screen before the game moves on. */
const RESULT_DELAY_MS = 2200;

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function}} store
 */
export function mount(container, store) {
  const settings = store.getState().settings;
  const debug = debugOptions();
  const duration = RACE_DURATIONS[settings.raceLength] ?? RACE_DURATIONS.normal;

  let seed = debug.seed ?? randomSeed();
  let race = null;
  let handedOver = false;

  const lanes = HORSES.map((horse) => {
    const fill = el('span', { className: 'lane__fill' });
    const place = el('span', { className: 'lane__place num' });
    return {
      horse,
      fill,
      place,
      node: el('li', { className: 'lane', vars: { '--horse-color': horse.color } }, [
        horseBadge(horse, 'sm'),
        el('span', { className: 'lane__name', text: horse.name }),
        el('span', { className: 'lane__track' }, [fill]),
        place,
      ]),
    };
  });

  const commentary = el('p', { className: 'race-commentary', attrs: { 'aria-live': 'polite' } });
  const clock = el('span', { className: 'race-clock num' });
  const seedLabel = el('span', { className: 'race-seed num' });
  const debugPanel = el('pre', { className: 'race-debug' });

  /** Puts the newest event into the commentary line. */
  let lastLogged = 0;
  function updateCommentary() {
    const log = race.eventLog;
    while (lastLogged < log.length) {
      const entry = log[lastLogged];
      lastLogged += 1;
      const definition = EVENTS_BY_ID[entry.id];
      if (!definition) continue;
      const line = definition.commentary[0];
      const horse = entry.runner >= 0 ? horseByIndex(entry.runner) : null;
      commentary.textContent = horse ? `${horse.name}: ${line}` : line;
    }
  }

  /** Draws the current state of the race. */
  function draw() {
    const runners = race.runners;
    const ranking = [...runners].sort((a, b) => b.x - a.x);

    for (const runner of runners) {
      const lane = lanes[runner.index];
      lane.fill.style.width = `${Math.min(100, (runner.x / TRACK_LENGTH) * 100)}%`;
      lane.place.textContent = String(ranking.indexOf(runner) + 1);
      lane.node.classList.toggle('lane--leading', ranking[0].index === runner.index);
    }

    clock.textContent = `${race.state.t.toFixed(1)} s`;
    updateCommentary();

    if (debug.enabled) {
      debugPanel.textContent = runners
        .map(
          (runner) =>
            `${horseByIndex(runner.index).name.padEnd(16)} x=${runner.x.toFixed(0).padStart(4)}  v=${runner.v.toFixed(1).padStart(5)}  ${runner.anim}`,
        )
        .join('\n');
    }
  }

  /** Ends the race and hands the result to the result screen. */
  function handOver() {
    if (handedOver) return;
    handedOver = true;
    loop.stop();
    draw();

    const order = race.order.map((index) => horseByIndex(index).id);
    const events = race.eventLog.map((entry) => ({
      id: entry.id,
      horseId: entry.runner >= 0 ? horseByIndex(entry.runner).id : null,
      t: entry.t,
      drinkRule: EVENTS_BY_ID[entry.id]?.drinkRule ?? null,
    }));

    const winner = horseByIndex(race.order[0]);
    commentary.textContent = `${winner.name} gewinnt!`;

    timer = setTimeout(
      () => {
        store.dispatch({ type: 'race/setResult', payload: { seed, order, events } });
        store.dispatch({ type: 'screen/go', payload: 'results' });
      },
      debug.enabled ? RESULT_DELAY_MS * 2 : RESULT_DELAY_MS,
    );
  }

  const loop = createLoop({
    update: () => {
      race.step();
      if (race.isFinished) handOver();
    },
    render: draw,
  });

  let timer = null;

  /** Starts a fresh race with the given seed. */
  function startRace(nextSeed) {
    if (timer !== null) clearTimeout(timer);
    loop.stop();
    seed = nextSeed;
    handedOver = false;
    lastLogged = 0;
    race = createRace({ seed, duration, chaos: settings.chaos });
    seedLabel.textContent = debug.enabled || settings.debugSeed ? `Seed ${seed}` : '';
    commentary.textContent = 'Und sie sind los!';
    if (debug.enabled) window.__race = race;
    draw();
    loop.start();
  }

  // Debug keys from docs/03_RACE_ENGINE.md §9: F fast-forwards, R rerolls, S replays this seed.
  const unlisten = listen([
    [
      window,
      'keydown',
      (event) => {
        if (!debug.enabled || event.metaKey || event.ctrlKey) return;
        const key = event.key.toLowerCase();
        if (key === 'f') {
          while (!race.isFinished) race.step();
          handOver();
        } else if (key === 'r') {
          startRace(randomSeed());
        } else if (key === 's') {
          startRace(seed);
        }
      },
    ],
  ]);

  container.append(
    page({
      header: header({
        title: 'Und los!',
        subtitle: `${duration} Sekunden, Chaos-Level ${settings.chaos}.`,
        aside: clock,
      }),
      body: [
        card(
          [
            el(
              'ul',
              { className: 'lanes' },
              lanes.map((lane) => lane.node),
            ),
          ],
          'card--race',
        ),
        commentary,
        seedLabel,
        debug.enabled ? debugPanel : null,
        debug.enabled
          ? el('p', {
              className: 'hint',
              text: 'Debug: F = vorspulen, R = neuer Seed, S = Seed wiederholen.',
            })
          : null,
      ].filter(Boolean),
      footer: settings.debugSkip
        ? button({
            label: 'Überspringen',
            variant: 'ghost',
            wide: true,
            onClick: () => {
              while (!race.isFinished) race.step();
              handOver();
            },
          })
        : el('span'),
    }),
  );

  startRace(seed);

  cleanup = () => {
    unlisten();
    loop.stop();
    if (timer !== null) clearTimeout(timer);
    delete window.__race;
  };
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
