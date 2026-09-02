/**
 * Versioned load and save of the game state in localStorage (debounced, fault tolerant).
 *
 * Private browsing modes and locked-down browsers make localStorage throw on access, so every
 * call is wrapped. If storage is unavailable the game simply runs without persistence — that is
 * a downgrade, never an error (docs/02_ARCHITECTURE.md §9).
 *
 * A running race is deliberately never restored: on reload the race counts as abandoned and the
 * player returns to the betting screen with their bets intact.
 */

import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_SETTINGS } from '../config.js';
import { createInitialState } from './reducers.js';

/** Delay in ms before a state change is written; keeps rapid typing from hammering storage. */
const WRITE_DELAY = 200;

/**
 * Returns localStorage, or null when it is unavailable or throws on access.
 * @returns {Storage|null}
 */
function safeStorage() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return null;
    // Safari in private mode only throws on write, so probe with a real round trip.
    const probe = `${STORAGE_KEY}:probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

/**
 * Migrates a persisted state to the current version.
 * There is only version 1 so far; older or unknown versions are discarded rather than guessed at.
 * @param {any} saved
 * @returns {any|null} migrated state, or null when it cannot be used
 */
function migrate(saved) {
  if (!saved || typeof saved !== 'object') return null;
  if (saved.version !== STORAGE_VERSION) return null;
  return saved;
}

/**
 * Merges a persisted state onto a fresh one so missing or damaged fields cannot break the game.
 * @param {any} saved
 * @returns {any}
 */
function reconcile(saved) {
  const base = createInitialState();
  const players = Array.isArray(saved.players) ? saved.players : base.players;
  const bets = Array.isArray(saved.bets) ? saved.bets : base.bets;
  const session = saved.session ?? base.session;

  return {
    ...base,
    settings: { ...DEFAULT_SETTINGS, ...(saved.settings ?? {}) },
    players,
    // Bets of players that no longer exist would leave the betting screen unfinishable.
    bets: bets.filter((bet) => players.some((player) => player.id === bet.playerId)),
    bettingTurn: Math.min(Number(saved.bettingTurn) || 0, players.length),
    session: {
      racesPlayed: Number(session.racesPlayed) || 0,
      perPlayer: session.perPlayer ?? {},
      history: Array.isArray(session.history) ? session.history.slice(-50) : [],
    },
    // A race in progress is lost on reload. The bets survive, so the player goes back to the
    // betting screen and simply starts the race again (docs/02_ARCHITECTURE.md §9).
    screen: saved.screen === 'race' ? 'betting' : (saved.screen ?? 'start'),
  };
}

/**
 * Loads the saved state, or null when there is nothing usable.
 * @returns {{state: any, raceWasAborted: boolean}|null}
 */
export function loadState() {
  const storage = safeStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const migrated = migrate(JSON.parse(raw));
    if (!migrated) return null;
    return { state: reconcile(migrated), raceWasAborted: migrated.screen === 'race' };
  } catch {
    return null;
  }
}

/**
 * Writes the state immediately. Returns false when storage is unavailable.
 * @param {any} state
 * @returns {boolean}
 */
export function saveState(state) {
  const storage = safeStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Removes the saved state, for example when the player resets everything. */
export function clearState() {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do — without storage there is nothing to clear.
  }
}

/**
 * Subscribes to the store and writes every change debounced.
 * @param {{getState: () => any, subscribe: (listener: () => void) => () => void}} store
 * @param {number} delay
 * @returns {() => void} stops persisting and flushes any pending write
 */
export function persist(store, delay = WRITE_DELAY) {
  let timer = null;

  const unsubscribe = store.subscribe(() => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      saveState(store.getState());
    }, delay);
  });

  return () => {
    unsubscribe();
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
      saveState(store.getState());
    }
  };
}

/** True when the browser lets us persist at all — used for the private mode hint. */
export function isPersistenceAvailable() {
  return safeStorage() !== null;
}
