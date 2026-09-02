/**
 * Turns the engine's event log into something a table full of people can follow: the commentary
 * line, and the drinking-rule toast naming who is affected.
 *
 * This is the boundary the engine deliberately cannot cross. It deals in runner indices and has
 * never heard of a bet; mapping "runner 3 slipped" to "Nina drinks two" happens here, where the
 * players and their bets live (docs/03_RACE_ENGINE.md §10).
 */

import { EVENTS_BY_ID } from '../data/events.js';
import { horseByIndex } from '../data/horses.js';
import { sips } from './strings.js';

/**
 * Creates the reader for one race.
 * @param {object} options
 * @param {object} options.hud
 * @param {() => any} options.getState
 * @returns {{read: (race: object) => void, reset: () => void}}
 */
export function createCommentary({ hud, getState }) {
  /** How many entries of the log have been spoken already. */
  let consumed = 0;

  /**
   * Names the players a drinking rule hits and puts it on screen.
   * @param {object} definition event definition from data/events.js
   * @param {object|null} horse
   * @param {any} state
   */
  function announceDrinkRule(definition, horse, state) {
    const rule = definition.drinkRule;
    const affected =
      rule.scope === 'everyone'
        ? state.players
        : state.players.filter((player) =>
            state.bets.some((bet) => bet.playerId === player.id && bet.horseId === horse?.id),
          );
    if (affected.length === 0) return;

    const amount = sips(state.settings, rule.sips);
    const who = affected.map((player) => player.name).join(' und ');
    const many = affected.length > 1;
    const verb =
      rule.direction === 'deal' ? (many ? 'verteilen' : 'verteilt') : many ? 'trinken' : 'trinkt';

    hud.toast(
      rule.scope === 'everyone'
        ? `Alle ${rule.direction === 'deal' ? 'verteilen' : 'trinken'} ${amount}!`
        : `${who} ${verb} ${amount}!`,
      horse ? horse.color : null,
    );
  }

  return {
    /**
     * Speaks whatever is new in the log.
     * @param {object} race
     */
    read(race) {
      const log = race.eventLog;
      if (consumed >= log.length) return;
      const state = getState();

      while (consumed < log.length) {
        const entry = log[consumed];
        consumed += 1;
        const definition = EVENTS_BY_ID[entry.id];
        if (!definition) continue;

        const horse = entry.runner >= 0 ? horseByIndex(entry.runner) : null;
        // Rotate through the variants so the same event does not read identically twice.
        const line = definition.commentary[consumed % definition.commentary.length];
        hud.say(horse ? `${horse.name}: ${line}` : line);

        if (definition.drinkRule && state.settings.eventDrinkRules) {
          announceDrinkRule(definition, horse, state);
        }
      }
    },

    /** Starts over for a new race. */
    reset() {
      consumed = 0;
    },
  };
}
