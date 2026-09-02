/**
 * Start screen: title, play / continue / rules / settings.
 *
 * When players are already stored the primary action becomes "Weiterspielen", so a second
 * evening starts without typing a single name again. The attract mode with idle horses on the
 * canvas follows in M6.
 */

import { el } from '../dom.js';
import { button } from '../components/button.js';
import { page, card } from '../components/layout.js';
import { openRules } from './rules.js';
import { openSettings } from './settings.js';
import { openStats } from './stats.js';

let cleanup = null;

/**
 * True when the player has asked for less motion, either in the settings or in the system.
 * @param {any} settings
 * @returns {boolean}
 */
function prefersCalm(settings) {
  if (settings.reducedMotion === 'on') return true;
  if (settings.reducedMotion === 'off') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function}} store
 */
export function mount(container, store) {
  const state = store.getState();
  const players = state.players;
  const hasPlayers = players.length > 0;

  const go = (screen) => store.dispatch({ type: 'screen/go', payload: screen });

  const title = el('div', { className: 'start__brand' }, [
    el('h1', { className: 'start__title', text: 'Pferderennen' }),
    el('p', { className: 'start__tagline', text: 'Sechs Pferde. Ein Gerät. Viel Blödsinn.' }),
  ]);

  const roster = hasPlayers
    ? card(
        [
          el('p', {
            className: 'start__roster-label',
            text: `Zuletzt gespielt mit ${players.length} ${players.length === 1 ? 'Spieler' : 'Spielern'}:`,
          }),
          el(
            'ul',
            { className: 'start__roster' },
            players.map((player) =>
              el('li', { className: 'start__roster-item', attrs: { title: player.name } }, [
                el('span', {
                  className: 'start__roster-avatar',
                  text: player.avatar,
                  attrs: { 'aria-hidden': 'true' },
                }),
                el('span', { className: 'start__roster-name', text: player.name }),
              ]),
            ),
          ),
        ],
        'card--roster',
      )
    : null;

  const primary = hasPlayers
    ? button({
        label: 'Weiterspielen',
        wide: true,
        onClick: () => {
          store.dispatch({ type: 'bets/reset' });
          store.dispatch({ type: 'race/clear' });
          go('betting');
        },
      })
    : button({ label: "Los geht's", wide: true, onClick: () => go('players') });

  const secondary = el('div', { className: 'start__actions' }, [
    hasPlayers
      ? button({ label: 'Spieler ändern', variant: 'secondary', onClick: () => go('players') })
      : null,
    button({ label: 'Regeln', variant: 'ghost', onClick: () => openRules(store) }),
    button({ label: 'Einstellungen', variant: 'ghost', onClick: () => openSettings(store) }),
    state.session.racesPlayed > 0
      ? button({ label: 'Statistik', variant: 'ghost', onClick: () => openStats(store) })
      : null,
  ]);

  // The attract mode: the six horses idling on the track behind the title. It is loaded on
  // demand for the same reason the race is — it *is* the race renderer, and pulling it in here
  // eagerly would undo the small first paint. Loading it here also warms it up for the race.
  const stage = el('canvas', { className: 'attract', attrs: { 'aria-hidden': 'true' } });
  let attract = null;
  let dropped = false;

  import('../../render/attract.js')
    .then(({ startAttract }) => {
      if (dropped) return;
      attract = startAttract(stage, { calm: prefersCalm(state.settings) });
      stage.classList.add('attract--ready');
    })
    .catch(() => {
      // No attract mode is a missing flourish, not a broken screen.
    });

  container.append(
    stage,
    page({
      body: [title, roster, secondary].filter(Boolean),
      footer: primary,
    }),
  );

  cleanup = () => {
    dropped = true;
    attract?.stop();
  };
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
