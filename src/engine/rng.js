/**
 * Seedable pseudo random number generator (sfc32) — the only source of randomness in the game.
 * Provides independent sub-streams via fork() so lane shuffling, the speed model and event
 * scheduling cannot influence each other. Fully deterministic for a given seed.
 *
 * Implementation follows in M2 (see docs/05_MILESTONES.md).
 */

export {};
