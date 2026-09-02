/**
 * Tests for the router guards (src/ui/router.js).
 *
 * The guards are what makes a hand-typed hash harmless: #/race without bets must not drop the
 * player into a dead screen (audit A1, "Reload auf jedem Screen").
 */
import { describe, it, expect } from 'vitest';
import { resolveScreen } from '../../src/ui/router.js';
import { createInitialState, rootReducer } from '../../src/state/reducers.js';

/** Builds a state with players, optionally with everyone's bets placed and a race result. */
function stateWith({ players = 0, bets = false, result = false } = {}) {
  let state = createInitialState();
  for (let i = 0; i < players; i += 1) {
    state = rootReducer(state, { type: 'players/add', payload: { name: `Spieler ${i}` } });
  }
  if (bets) {
    for (const player of state.players) {
      state = rootReducer(state, {
        type: 'bets/place',
        payload: { playerId: player.id, horseId: 'hopfen', sips: 3 },
      });
    }
  }
  if (result) {
    state = rootReducer(state, { type: 'race/setResult', payload: { seed: 1, order: ['hopfen'] } });
  }
  return state;
}

describe('resolveScreen', () => {
  it('always allows the start and player screens', () => {
    const empty = stateWith();
    expect(resolveScreen('start', empty)).toBe('start');
    expect(resolveScreen('players', empty)).toBe('players');
  });

  it('falls back to start for an unknown screen', () => {
    expect(resolveScreen('nonsense', stateWith({ players: 3 }))).toBe('start');
  });

  it('sends you to the player screen while there are too few players', () => {
    const lonely = stateWith({ players: 1 });
    expect(resolveScreen('betting', lonely)).toBe('players');
    expect(resolveScreen('race', lonely)).toBe('players');
    expect(resolveScreen('results', lonely)).toBe('players');
  });

  it('allows betting once enough players are in', () => {
    expect(resolveScreen('betting', stateWith({ players: 2 }))).toBe('betting');
  });

  it('refuses the race until everyone has placed a bet', () => {
    expect(resolveScreen('race', stateWith({ players: 3 }))).toBe('betting');
    expect(resolveScreen('race', stateWith({ players: 3, bets: true }))).toBe('race');
  });

  it('refuses the results until a race has actually finished', () => {
    expect(resolveScreen('results', stateWith({ players: 3, bets: true }))).toBe('betting');
    expect(resolveScreen('results', stateWith({ players: 3, bets: true, result: true }))).toBe(
      'results',
    );
  });
});
