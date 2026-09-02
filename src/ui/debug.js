/**
 * Debug switches read from the URL (docs/03_RACE_ENGINE.md §9).
 *
 *   ?debug=1    shows the seed, a live state dump and the F/R/S keys
 *   ?seed=123   forces a seed, so a render bug can be reproduced on the exact same race
 *
 * Nothing here is reachable without the query parameter, which audit A7 checks before release.
 */

/**
 * @returns {{enabled: boolean, seed: number|null}}
 */
export function debugOptions() {
  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return { enabled: false, seed: null };
  }

  const seedParam = params.get('seed');
  const seed = seedParam !== null && /^\d+$/.test(seedParam) ? Number(seedParam) >>> 0 : null;
  return { enabled: params.get('debug') === '1', seed };
}
