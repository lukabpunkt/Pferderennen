/**
 * Result screen: podium, who deals, who drinks, house win, event recap.
 *
 * The one question this screen must answer in under three seconds is "who drinks how much"
 * (audit A1), so the payout cards come before everything else that is merely nice to look at.
 */

import { el } from '../dom.js';
import { button } from '../components/button.js';
import { page, header, card, horsePortrait, playerChip } from '../components/layout.js';
import { HORSES_BY_ID } from '../../data/horses.js';
import { settle } from '../../engine/payout.js';
import { sips, ICON } from '../strings.js';
import { openStats } from './stats.js';

let cleanup = null;

/** Podium heights in the order first, second, third. */
const PODIUM_ORDER = [1, 0, 2];

/**
 * Builds the podium for the top three horses.
 * @param {string[]} order
 * @returns {HTMLElement}
 */
function podium(order) {
  return el(
    'ol',
    { className: 'podium', attrs: { 'aria-label': 'Podium' } },
    PODIUM_ORDER.map((place) => {
      const horse = HORSES_BY_ID[order[place]];
      if (!horse) return null;
      return el(
        'li',
        {
          className: `podium__slot podium__slot--${place + 1}`,
          vars: { '--horse-color': horse.color, '--horse-dark': horse.colorDark },
        },
        [
          horsePortrait(horse, 76),
          el('span', { className: 'podium__name', text: horse.name }),
          el('span', { className: 'podium__place num', text: `${place + 1}.` }),
        ],
      );
    }).filter(Boolean),
  );
}

/**
 * One payout card.
 * @param {object} options
 * @param {{avatar: string, name: string}} options.player
 * @param {string} options.text
 * @param {'deal'|'drink'} options.kind
 * @param {string} options.horseName
 * @returns {HTMLElement}
 */
function payoutCard({ player, text, kind, horseName }) {
  return el('li', { className: `payout payout--${kind}` }, [
    el('span', {
      className: 'payout__icon',
      text: kind === 'deal' ? ICON.winner : ICON.drink,
      attrs: { 'aria-hidden': 'true' },
    }),
    el('span', { className: 'payout__body' }, [
      playerChip(player),
      el('span', { className: 'payout__text', text }),
    ]),
    el('span', { className: 'payout__horse', text: horseName }),
  ]);
}

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function}} store
 */
export function mount(container, store) {
  const state = store.getState();
  const order = state.race.result?.order ?? [];
  const settlement = settle({
    bets: state.bets,
    order,
    settings: state.settings,
    events: state.race.result?.events ?? [],
  });

  const winnerHorse = HORSES_BY_ID[order[0]];
  const playerById = (id) => state.players.find((player) => player.id === id);
  const horseName = (id) => HORSES_BY_ID[id]?.name ?? '—';

  const cards = el('ul', { className: 'payouts' }, [
    ...settlement.winners.map((winner) =>
      payoutCard({
        player: playerById(winner.playerId),
        text: `verteilt ${sips(state.settings, winner.sipsToDeal)}`,
        kind: 'deal',
        horseName: horseName(winner.horseId),
      }),
    ),
    ...settlement.losers.map((loser) =>
      payoutCard({
        player: playerById(loser.playerId),
        text: `trinkt ${sips(state.settings, loser.sipsToDrink)}`,
        kind: 'drink',
        horseName: horseName(loser.horseId),
      }),
    ),
  ]);

  const houseCard = settlement.houseWins
    ? card(
        [
          el('span', {
            className: 'house__icon',
            text: ICON.house,
            attrs: { 'aria-hidden': 'true' },
          }),
          el('p', {
            className: 'house__text',
            text: 'Das Haus gewinnt – niemand hatte das Siegerpferd. Alle trinken ihren Einsatz!',
          }),
        ],
        'card--house',
      )
    : null;

  container.append(
    page({
      header: header({
        title: winnerHorse ? `${winnerHorse.name} gewinnt!` : 'Ergebnis',
        subtitle: winnerHorse ? 'Und jetzt wird abgerechnet.' : undefined,
      }),
      body: [podium(order), houseCard, cards].filter(Boolean),
      footer: el('div', { className: 'results__actions' }, [
        button({
          label: 'Nächstes Rennen',
          wide: true,
          onClick: () => {
            store.dispatch({ type: 'bets/reset' });
            store.dispatch({ type: 'race/clear' });
            store.dispatch({ type: 'screen/go', payload: 'betting' });
          },
        }),
        el('div', { className: 'results__secondary' }, [
          button({
            label: 'Spieler ändern',
            variant: 'ghost',
            onClick: () => store.dispatch({ type: 'screen/go', payload: 'players' }),
          }),
          button({ label: 'Statistik', variant: 'ghost', onClick: () => openStats(store) }),
        ]),
      ]),
    }),
  );

  // Record the race exactly once. Coming back to this screen must not book it again.
  if (order.length > 0 && !state.race.recorded) {
    store.dispatch({
      type: 'session/record',
      payload: {
        settlement,
        winnerHorseId: order[0],
        seed: state.race.seed,
        timestamp: Date.now(),
      },
    });
    store.dispatch({ type: 'race/markRecorded' });
  }

  cleanup = () => {};
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
