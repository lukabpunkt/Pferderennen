/**
 * Fairness and suspense audit (docs/03_RACE_ENGINE.md §7).
 *
 * Simulates a great many races headlessly and proves statistically that every horse and every
 * lane wins exactly 1/6 of them (F1-F4) and that the racing stays exciting (S1-S6). Exits with
 * code 1 as soon as a criterion is violated — this audit is a mandatory gate in CI.
 *
 * The evaluation itself is built in M2 once the engine exists. Until then the script reports
 * cleanly that there is nothing to check yet and exits with 0.
 *
 * Usage: node tests/fairness/audit.js [--n=100000] [--chaos=normal] [--duration=normal] [--seed=1]
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENGINE_ENTRY = resolve(HERE, '../../src/engine/race.js');

/** True when the script was run directly via node rather than imported from a test. */
const IS_CLI = process.argv[1] === fileURLToPath(import.meta.url);

/** Default values of the CLI flags. */
const DEFAULTS = {
  n: 100000,
  chaos: 'normal',
  duration: 'normal',
  seed: 1,
};

/**
 * Reads flags of the form --key=value from process.argv.
 * @param {string[]} argv
 * @returns {{n: number, chaos: string, duration: string, seed: number}}
 */
export function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (const arg of argv) {
    const match = /^--([a-z]+)=(.+)$/.exec(arg);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!(key in options)) continue;
    const value = rawValue.replaceAll('_', '');
    options[key] = typeof DEFAULTS[key] === 'number' ? Number(value) : value;
  }
  return options;
}

/**
 * Checks whether the engine is actually implemented and not just a placeholder module.
 * @returns {boolean}
 */
function engineIsReady() {
  if (!existsSync(ENGINE_ENTRY)) return false;
  return readFileSync(ENGINE_ENTRY, 'utf8').includes('export function createRace');
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!engineIsReady()) {
    console.log('Fairness audit skipped: the race engine is built in M2.');
    console.log(
      `Planned run: n=${options.n}, chaos=${options.chaos}, duration=${options.duration}, seed=${options.seed}`,
    );
    console.log('Criteria: docs/03_RACE_ENGINE.md §7 (F1-F4, S1-S6).');
    process.exit(0);
  }

  console.error('The engine exists but the audit evaluation is still missing (M2, task 7).');
  process.exit(1);
}

if (IS_CLI) {
  main();
}
