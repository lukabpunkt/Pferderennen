/**
 * Race screen: hosts the canvas and wires up engine, rendering and HUD.
 *
 * M1 placeholder. There is no simulation yet, so this screen draws the finish order from
 * crypto.getRandomValues — fair by construction, but with no race to watch. M2 replaces this
 * with the real engine playing out as text bars, M3 with the canvas rendering.
 */

import { el } from '../dom.js';
import { button } from '../components/button.js';
import { page, header, card, horseBadge } from '../components/layout.js';
import { HORSES } from '../../data/horses.js';

let cleanup = null;

/**
 * A uniformly random permutation using Fisher-Yates with cryptographic randomness.
 * @param {string[]} ids
 * @returns {string[]}
 */
export function shuffle(ids) {
  const result = [...ids];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomBelow(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * A uniform integer in [0, bound). Rejection sampling avoids the modulo bias that would
 * quietly favour the first horses.
 * @param {number} bound
 * @returns {number}
 */
function randomBelow(bound) {
  const limit = Math.floor(0x100000000 / bound) * bound;
  const buffer = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % bound;
}

/** A random uint32, standing in for the engine seed until M2. */
function randomSeed() {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0];
}

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function}} store
 */
export function mount(container, store) {
  const finish = button({
    label: 'Ergebnis (Platzhalter)',
    wide: true,
    onClick: () => {
      const order = shuffle(HORSES.map((horse) => horse.id));
      store.dispatch({
        type: 'race/setResult',
        payload: { seed: randomSeed(), order, events: [] },
      });
      store.dispatch({ type: 'screen/go', payload: 'results' });
    },
  });

  const lineup = el(
    'ul',
    { className: 'race-placeholder__lineup' },
    HORSES.map((horse) =>
      el('li', { className: 'race-placeholder__lane', vars: { '--horse-color': horse.color } }, [
        horseBadge(horse, 'sm'),
        el('span', { className: 'race-placeholder__name', text: horse.name }),
        el('span', { className: 'race-placeholder__bar' }),
      ]),
    ),
  );

  container.append(
    page({
      header: header({
        title: 'Rennen läuft …',
        subtitle: 'Die Simulation kommt in M2, die Animation in M3.',
      }),
      body: [
        card([lineup], 'card--race'),
        el('p', {
          className: 'hint',
          text: 'Der Sieger wird hier noch per Zufall gezogen – gleichverteilt über alle sechs Pferde.',
        }),
      ],
      footer: finish,
    }),
  );

  cleanup = () => {};
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
