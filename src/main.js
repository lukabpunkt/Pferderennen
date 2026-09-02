/**
 * Entry point of the game.
 *
 * Loads the persisted state, creates the store, starts persisting and hands over to the router.
 * Everything that follows is driven by state changes — no screen ever calls another directly.
 */

import { createStore } from './state/store.js';
import { rootReducer, createInitialState } from './state/reducers.js';
import { loadState, persist, isPersistenceAvailable } from './state/persistence.js';
import { createRouter } from './ui/router.js';
import { toast } from './ui/components/toast.js';
import * as start from './ui/screens/start.js';
import * as players from './ui/screens/players.js';
import * as betting from './ui/screens/betting.js';
import * as race from './ui/screens/race.js';
import * as results from './ui/screens/results.js';

const screens = { start, players, betting, race, results };

const restored = loadState();
const store = createStore(rootReducer, restored?.state ?? createInitialState());

persist(store);

// A reload during a race loses the race; the bets survive (docs/02_ARCHITECTURE.md §9).
// The URL still says #/race, so rewrite it before the router can act on it.
if (restored?.raceWasAborted) {
  history.replaceState(null, '', `#/${store.getState().screen}`);
}

const app = document.getElementById('app');
if (app) {
  createRouter({ store, container: app, screens }).start();
}

if (restored?.raceWasAborted) {
  toast('Rennen wurde abgebrochen – startet es einfach nochmal.', {
    icon: '🏁',
    variant: 'warning',
  });
}

if (!isPersistenceAvailable()) {
  toast('Ohne Speicher: Namen und Einstellungen sind nach dem Neuladen weg.', {
    variant: 'warning',
  });
}
