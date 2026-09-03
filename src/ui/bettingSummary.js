/**
 * The list views of a betting round: the summary of who is on what, and the card that offers the
 * last race's bets back.
 *
 * Split out of the betting screen because they are a different job from the horse grid — that one
 * is about choosing, these are about seeing what has been chosen. They are pure: state in,
 * elements out, with the two things a line can do handed in as callbacks.
 */

import { el } from './dom.js';
import { button } from './components/button.js';
import { card, horseBadge, playerChip } from './components/layout.js';
import { HORSES_BY_ID } from '../data/horses.js';
import { BET_TYPE_LABELS, sips } from './strings.js';

/** The bet a player currently holds, if any. */
const betOf = (state, playerId) => state.bets.find((bet) => bet.playerId === playerId) ?? null;

/** Bets from the last race that still belong to somebody at the table. */
export const restorableBets = (state) =>
  state.lastBets.filter((bet) => state.players.some((player) => player.id === bet.playerId));

/**
 * One line of the table: who, on what, for how much.
 *
 * Shared by the summary and the "run it back" card so the two cannot drift apart. In the
 * summary the line is a button — that is how a player says "I want to change mine".
 *
 * @param {any} state
 * @param {object} player
 * @param {{onEdit?: (player: object) => void}} [options]
 * @returns {HTMLElement}
 */
function betRow(state, player, { onEdit } = {}) {
  const bet = betOf(state, player.id);
  const horse = bet ? HORSES_BY_ID[bet.horseId] : null;

  const detail = horse
    ? el('span', { className: 'overview__horse' }, [
        horseBadge(horse, 'sm'),
        el('span', { text: horse.name }),
        // Only worth showing when the players could actually choose differently.
        state.settings.betType === 'free'
          ? el('span', {
              className: 'overview__type',
              text: BET_TYPE_LABELS[bet.type ?? 'win'],
            })
          : null,
      ])
    : el('span', { className: 'overview__horse overview__horse--open', text: 'noch offen' });

  const amount = el('span', {
    className: 'overview__sips num',
    text: bet ? sips(state.settings, bet.sips) : '–',
  });

  if (!onEdit) {
    return el('li', { className: 'overview__row' }, [playerChip(player), detail, amount]);
  }

  const label = bet
    ? `Wette von ${player.name} ändern: ${horse.name}, ${sips(state.settings, bet.sips)}`
    : `Wette für ${player.name} setzen`;

  return el('li', {}, [
    el(
      'button',
      {
        className: `overview__row overview__row--action${bet ? '' : ' overview__row--open'}`,
        attrs: { type: 'button', 'aria-label': label },
        on: { click: () => onEdit(player) },
      },
      [
        playerChip(player),
        detail,
        amount,
        el('span', {
          className: 'overview__edit',
          text: 'ändern',
          attrs: { 'aria-hidden': 'true' },
        }),
      ],
    ),
  ]);
}

/**
 * The card offered at the start of a round: the same bets as last time, or start over.
 * @param {any} state
 * @param {{onRepeat: () => void, onFresh: () => void}} actions
 * @returns {HTMLElement}
 */
export function carrySummary(state, { onRepeat, onFresh }) {
  const players = restorableBets(state)
    .map((bet) => state.players.find((player) => player.id === bet.playerId))
    .filter(Boolean);

  return card(
    [
      el('h2', { className: 'overview__title', text: 'Beim letzten Rennen habt ihr so gesetzt' }),
      el(
        'ul',
        { className: 'overview__list' },
        players.map((player) => betRow(lastRoundState(state), player)),
      ),
      button({ label: 'Wetten übernehmen', wide: true, onClick: onRepeat }),
      button({ label: 'Alle neu setzen', variant: 'ghost', onClick: onFresh }),
    ],
    'card--carry',
  );
}

/**
 * The state as the card wants to read it: the remembered bets standing in for the current ones,
 * so `betRow` can be used unchanged.
 * @param {any} state
 * @returns {any}
 */
const lastRoundState = (state) => ({ ...state, bets: state.lastBets });

/**
 * The table of who is on what. Every line is a way into that player's bet — that is how somebody
 * changes their mind without the whole table setting again.
 * @param {any} state
 * @param {{onEdit: (player: object) => void, onReset: () => void}} actions
 * @returns {HTMLElement}
 */
export function betSummary(state, { onEdit, onReset }) {
  return card(
    [
      el('h2', {
        className: 'overview__title',
        text:
          state.bets.length === state.players.length ? 'Alle haben gesetzt' : 'Wer setzt worauf',
      }),
      el(
        'ul',
        { className: 'overview__list' },
        // Every player, not only those with a bet: somebody who joined since the last race
        // belongs here too, and tapping their line is how they place one.
        state.players.map((player) => betRow(state, player, { onEdit })),
      ),
      button({ label: 'Wetten zurücksetzen', variant: 'ghost', onClick: onReset }),
    ],
    'card--overview',
  );
}
