/**
 * Central tuning constants of the game.
 *
 * Every number that shapes how the game feels lives here and nowhere else in the code. The speed
 * model values are the starting points from docs/03_RACE_ENGINE.md §5; M2 calibrates them through
 * the tuning loop of the fairness audit (§7) until the suspense targets S1-S6 are met.
 */

/** Track length in abstract track units. Rendering scales this to pixels. */
export const TRACK_LENGTH = 1000;

/** Number of runners. The engine only ever knows them as indices 0..5. */
export const RUNNER_COUNT = 6;

/**
 * Fixed simulation timestep in seconds (60 Hz).
 * race.step() deliberately takes no dt argument so the frame rate cannot influence the
 * outcome (fairness requirement F5).
 */
export const TIMESTEP = 1 / 60;

/** Target race duration in seconds per setting. Defines the base speed v0 = L / D. */
export const RACE_DURATIONS = {
  short: 20,
  normal: 30,
  long: 45,
};

/** Speed model: v_i(t) = v0 * clamp(1 + P + N + S + F + E, MIN, MAX). */
export const SPEED_MODEL = {
  /** Phase profile P: slow waves of form along the track. */
  phase: {
    /** Control points at x = 0, 0.2, 0.4, 0.6, 0.8, 1.0. */
    nodes: 6,
    /** Standard deviation per control point. Larger means stronger swings in form. */
    sigma: 0.11,
  },

  /** Fast noise N: Ornstein-Uhlenbeck process, creates micro lead changes. */
  noise: {
    /** Mean reversion rate theta in 1/s. Larger pulls the noise back to zero faster. */
    theta: 1.8,
    /** Diffusion sigma. Larger means a more jittery pace. */
    sigma: 0.18,
  },

  /** Sprints S: the visible "here we go" moments. */
  sprint: {
    /** Number of sprints per runner, bounds inclusive. */
    countMin: 1,
    countMax: 3,
    /** Window for the sprint start as a fraction of the target race duration. */
    windowStart: 0.1,
    windowEnd: 0.95,
    /** Sprint strength as a relative speed bonus. */
    strengthMin: 0.15,
    strengthMax: 0.35,
    /** Duration in seconds. */
    durationMin: 1.2,
    durationMax: 2.5,
    /** Fade in and out in seconds (smoothstep) so nothing jumps. */
    fade: 0.3,
  },

  /** Finishing kick F: an individual bonus from 75 % of the track — keeps the finish open. */
  finish: {
    sigma: 0.1,
    /** Smoothstep window as a fraction of the track. */
    from: 0.75,
    to: 0.9,
  },

  /** Hard bounds of the speed multiplier. Zero is a standstill, negative means backwards. */
  clampMin: -0.6,
  clampMax: 2.2,
};

/** Rules of the event scheduler (docs/03_RACE_ENGINE.md §6). */
export const EVENT_RULES = {
  /** No event before 8 % and after 95 % of the target race duration. */
  windowStart: 0.08,
  windowEnd: 0.95,
  /** Minimum gap between two events in seconds. */
  minGapSeconds: 2,
  /** At most this many events per runner so no horse looks bullied. */
  maxPerRunner: 2,
  /** Attempts before an event is dropped. */
  maxPlacementTries: 20,
  maxRunnerTries: 10,
  /** Number of events per chaos level, bounds inclusive. */
  countByChaos: {
    calm: [1, 3],
    normal: [3, 6],
    wild: [6, 10],
  },
  /** Slipstream is checked at runtime rather than scheduled ahead. */
  slipstream: {
    /** Distance to the runner ahead, in track units, where a slipstream is possible. */
    minDistance: 0.5,
    maxDistance: 3,
    /** Trigger probability per second. */
    chancePerSecond: 0.25,
  },
};

/** Photo finish: slow motion when the ending gets tight (docs/01_GAME_DESIGN.md §3.4). */
export const PHOTO_FINISH = {
  /** Only applies in the final stretch. */
  fromProgress: 0.97,
  /** Maximum gap between first and second place in track units. */
  maxGap: 10,
  /** Slow motion factor and duration in seconds. */
  timeScale: 0.25,
  duration: 1.5,
};

/** How many seconds after the winner the race is cut off at the latest. */
export const FINISH_GRACE_SECONDS = 3;

/** Rules around the stakes. */
export const BETTING = {
  minSips: 1,
  maxSips: 10,
  defaultSips: 3,
  minPlayers: 2,
  maxPlayers: 12,
  maxNameLength: 14,
};

/** Render budget. Quality 'auto' steps down when the frame rate stays low. */
export const RENDER = {
  /** From this aspect ratio upwards the race renders in landscape mode. */
  landscapeAspect: 1.2,
  /** The device pixel ratio is capped so retina phones do not collapse. */
  maxPixelRatio: 2,
  /** Size of the particle pool. Never exceeded, no allocation during a race. */
  particlePoolSize: 400,
  /** Below this frame rate over quality.windowSeconds the quality is reduced. */
  quality: {
    mode: 'auto',
    fpsThreshold: 50,
    windowSeconds: 2,
  },
};

/** Default settings of the game (docs/01_GAME_DESIGN.md §6). */
export const DEFAULT_SETTINGS = {
  raceLength: 'normal',
  chaos: 'normal',
  eventDrinkRules: true,
  leadChangeRule: false,
  betType: 'win',
  sound: true,
  vibration: true,
  sober: false,
  reducedMotion: 'auto',
  debugSkip: false,
  debugSeed: false,
};

/** Key and version of the persisted game state. */
export const STORAGE_KEY = 'pferderennen:v1';
export const STORAGE_VERSION = 1;
