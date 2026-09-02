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
  /**
   * Phase profile P: waves of form along the track, with a variance ramp.
   *
   * The ramp is the single most important discovery of the M2 tuning loop. With a constant
   * spread the leader at half distance wins about half of all races and the runner in last
   * place at half distance essentially never wins — no matter how the other parameters are
   * turned, because a lead is banked distance that later variance cannot undo. Letting the
   * form differences open up as the race goes on fixes that, and it is also what real racing
   * looks like: the field runs together early and separates late.
   */
  phase: {
    /** Control points, evenly spaced from the start to the finish line. */
    nodes: 16,
    /** Spread of the control point at the start — the field runs almost as one. */
    sigmaStart: 0.002,
    /** Spread of the control point at the finish line. */
    sigmaEnd: 0.22,
    /** Exponent of the ramp between the two. Above 1 keeps the field together for longer. */
    ramp: 2.5,
  },

  /** Fast noise N: Ornstein-Uhlenbeck process, creates the micro lead changes. */
  noise: {
    /** Mean reversion rate theta in 1/s. Larger pulls the noise back to zero faster. */
    theta: 1.8,
    /** Diffusion sigma. Larger means a more jittery pace. */
    sigma: 0.05,
  },

  /** Sprints S: the visible "here we go" moments. */
  sprint: {
    /** Number of sprints per runner, bounds inclusive. */
    countMin: 1,
    countMax: 3,
    /** Window for the sprint start as a fraction of the target race duration. */
    windowStart: 0.35,
    windowEnd: 0.95,
    /** Sprint strength as a relative speed bonus. */
    strengthMin: 0.06,
    strengthMax: 0.15,
    /** Duration in seconds. */
    durationMin: 1.2,
    durationMax: 2.5,
    /** Fade in and out in seconds (smoothstep) so nothing jumps. */
    fade: 0.3,
  },

  /**
   * Finishing kick F: a small individual bonus over the last quarter. The phase ramp above now
   * does most of the work of keeping the finish open, so this is flavour rather than structure.
   */
  finish: {
    sigma: 0.02,
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
};

/**
 * Audio. Gains are deliberately low: this is a game people put on a table between them, and the
 * hoofbeat loop runs for the whole race under everything else.
 */
export const AUDIO = {
  /** Master gain when unmuted. */
  masterGain: 0.55,
  /** Seconds of fade when muting, so a running loop does not click. */
  muteFade: 0.12,
  /** Corner frequency of the master lowpass when nothing is ducking it. */
  lowpassOpen: 18000,
  /** Where it lands during a photo finish — muffled, as if the crowd held its breath. */
  lowpassPhotoFinish: 700,
  /** Seconds the lowpass takes to travel. */
  lowpassRamp: 0.35,
  /** Hoofbeats: steps per second at a runner's base speed, and how far tempo may swing. */
  hoofBaseRate: 7.2,
  hoofRateRange: 2.6,
  hoofGain: 0.22,
  /** Crowd bed: gain at the start of the race and at the line. */
  crowdGainStart: 0.05,
  crowdGainFinish: 0.17,
  /** Gain of a single one-shot cue. */
  cueGain: 0.3,
};

/** The commentator's pacing. */
export const COMMENTARY = {
  /** A filler line arrives somewhere between these two, in seconds (GDD asks for 2-4 s). */
  fillerMin: 2,
  fillerSpread: 2,
  /** Where the final stretch begins, as a share of the track. */
  finalStretchFrom: 0.67,
  /** How far behind the last runner has to be before it is worth mentioning. */
  trailingGap: 0.18,
};

/** Key and version of the persisted game state. */
export const STORAGE_KEY = 'pferderennen:v1';
export const STORAGE_VERSION = 1;
