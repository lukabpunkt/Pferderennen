/**
 * Statistics screen: sips per player, wins and losing streaks of the running session.
 *
 * Purely informational and deliberately without any "hot streak" reading — a horse that won
 * three times in a row is not more likely to win the fourth, and the UI must never suggest
 * otherwise (docs/01_GAME_DESIGN.md §5, item 14/15).
 */

import { el } from '../dom.js';
import { modal } from '../components/modal.js';
import { button } from '../components/button.js';
import { sipWord } from '../strings.js';
import { HORSES_BY_ID } from '../../data/horses.js';

/**
 * Builds the per-player table.
 * @param {any} state
 * @returns {HTMLElement}
 */
function table(state) {
  const unit = sipWord(state.settings, 2);
  const rows = state.players
    .map((player) => ({ player, stats: state.session.perPlayer[player.id] }))
    .filter((row) => row.stats)
    .sort((a, b) => b.stats.wins - a.stats.wins || a.stats.drank - b.stats.drank);

  if (rows.length === 0) {
    return el('p', { className: 'hint', text: 'Noch kein Rennen gelaufen.' });
  }

  return el('table', { className: 'stats-table' }, [
    el('thead', {}, [
      el('tr', {}, [
        el('th', { text: 'Spieler', attrs: { scope: 'col' } }),
        el('th', { text: 'Siege', attrs: { scope: 'col' } }),
        el('th', { text: `${unit} verteilt`, attrs: { scope: 'col' } }),
        el('th', { text: `${unit} getrunken`, attrs: { scope: 'col' } }),
        el('th', { text: 'Pechsträhne', attrs: { scope: 'col' } }),
      ]),
    ]),
    el(
      'tbody',
      {},
      rows.map(({ player, stats }) =>
        el('tr', {}, [
          el('th', { attrs: { scope: 'row' } }, [
            el('span', { text: player.avatar, attrs: { 'aria-hidden': 'true' } }),
            el('span', { text: ` ${player.name}` }),
          ]),
          el('td', { className: 'num', text: String(stats.wins) }),
          el('td', { className: 'num', text: String(stats.dealt) }),
          el('td', { className: 'num', text: String(stats.drank) }),
          el('td', { className: 'num', text: String(stats.maxLoseStreak) }),
        ]),
      ),
    ),
  ]);
}

/**
 * The last races as coloured dots — shows at a glance that every horse wins sometimes.
 * @param {any} state
 * @returns {HTMLElement|null}
 */
function history(state) {
  const entries = state.session.history.slice(-20);
  if (entries.length === 0) return null;

  return el('div', { className: 'history' }, [
    el('h3', { text: 'Die letzten Rennen' }),
    el(
      'ol',
      { className: 'history__dots' },
      entries.map((entry) => {
        const horse = HORSES_BY_ID[entry.winnerId];
        return el('li', {
          className: 'history__dot',
          vars: { '--horse-color': horse?.color ?? 'var(--ink-soft)' },
          attrs: { title: horse?.name ?? 'Unbekannt' },
        });
      }),
    ),
  ]);
}

/**
 * Opens the statistics overlay.
 * @param {{getState: Function, dispatch: Function}} store
 * @returns {{close: () => void}}
 */
export function openStats(store) {
  const content = el('div', { className: 'stats' });

  function render() {
    const state = store.getState();
    content.replaceChildren(
      el('p', {
        className: 'stats__summary num',
        text: `${state.session.racesPlayed} ${state.session.racesPlayed === 1 ? 'Rennen' : 'Rennen'} in dieser Session.`,
      }),
      table(state),
      history(state) ?? el('span'),
      button({
        label: 'Session zurücksetzen',
        variant: 'ghost',
        onClick: () => {
          store.dispatch({ type: 'session/reset' });
          render();
        },
      }),
    );
  }

  render();
  return modal({ title: 'Statistik', content });
}
