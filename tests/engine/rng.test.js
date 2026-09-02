/**
 * Tests for the seedable random number generator (src/engine/rng.js).
 * The cases come from docs/03_RACE_ENGINE.md §3 and are implemented in M2.
 */
import { describe, it } from 'vitest';

describe('createRng', () => {
  it.todo('produces the exact same sequence for the same seed');
  it.todo('distributes next() uniformly over [0, 1) (chi-square over 100 buckets)');
  it.todo('keeps both bounds inclusive in int(min, max)');
  it.todo('picks uniformly from an array with pick()');
  it.todo('weights weighted() proportionally to the given weights');
  it.todo('produces mean 0 and standard deviation 1 with gaussian()');
  it.todo('returns an independent stream from fork()');
});
