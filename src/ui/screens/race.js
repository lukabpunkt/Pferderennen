/**
 * Race screen: hosts the canvas and wires up engine, rendering and HUD.
 *
 * The engine advances on a fixed timestep; the drawing interpolates between the last two states
 * so the picture is smooth even when a frame does not line up with a step. Nothing here ever
 * writes back into the simulation.
 *
 * Landscape only for now — the portrait layout follows in M4, and the events get their props
 * in M5.
 */

import { el, listen } from '../dom.js';
import { HORSES, horseByIndex } from '../../data/horses.js';
import { createRace } from '../../engine/race.js';
import { randomSeed } from '../../engine/rng.js';
import { createLoop } from '../../render/loop.js';
import { createCamera } from '../../render/camera.js';
import { createTrack, orientationFor } from '../../render/track.js';
import { horseColours } from '../../render/horse.js';
import { createPose } from '../../render/horseAnimations.js';
import { drawField } from '../../render/field.js';
import { createParticles } from '../../render/particles.js';
import { createEventVisuals } from '../../render/eventVisuals.js';
import { createHud } from '../../render/hud.js';
import { createQualityMonitor, quality, resetQuality } from '../../render/quality.js';
import { RACE_DURATIONS, RENDER, RUNNER_COUNT, TIMESTEP } from '../../config.js';
import { createCountdown } from '../components/countdown.js';
import { createCommentary } from '../raceCommentary.js';
import { toResultPayload } from '../raceResult.js';
import { debugOptions } from '../debug.js';
import { countingContext, debugReadout } from '../raceDebug.js';

let cleanup = null;

/** How long the winner is celebrated before the game moves to the result screen. */
const CELEBRATION_MS = 2600;

/** How long the starting gates take to swing open. */
const GATE_OPEN_SECONDS = 0.5;

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function}} store
 */
export function mount(container, store) {
  const settings = store.getState().settings;
  const debug = debugOptions();
  const duration = RACE_DURATIONS[settings.raceLength] ?? RACE_DURATIONS.normal;

  const canvas = el('canvas', {
    className: 'race-canvas',
    attrs: { role: 'img', 'aria-label': 'Die Rennbahn mit sechs Pferden' },
  });
  const rawCtx = canvas.getContext('2d');
  /** With ?debug=1 the context counts its own path operations, for the budget in audit A5. */
  const counter = { ops: 0, perFrame: 0 };
  const ctx = debug.enabled ? countingContext(rawCtx, counter) : rawCtx;

  const camera = createCamera({});
  /** Rebuilt when the device rotates; the race itself keeps running (audit A3). */
  let orientation = null;
  let track = null;
  const particles = createParticles();

  /**
   * Reduced motion drops the shakes and the flashes and thins the particles, but every prop
   * stays: a banana is information, not decoration (docs/04_DESIGN_SYSTEM.md §9).
   */
  const calm =
    settings.reducedMotion === 'on' ||
    (settings.reducedMotion === 'auto' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true);
  particles.setDensity(calm ? 0.3 : 1);

  const visuals = createEventVisuals({
    particles,
    shake: (amount) => camera.shake(amount),
    reducedMotion: () => calm,
    cheer: () => track?.cheer(),
  });
  const hud = createHud(HORSES);
  const commentary = createCommentary({ hud, getState: () => store.getState() });
  const palettes = HORSES.map(horseColours);
  const poses = HORSES.map((_, index) => createPose(index / RUNNER_COUNT));

  /** Puts every horse back together for a new race. */
  function resetPoses() {
    for (const pose of poses) pose.riderless = false;
  }

  const countdown = createCountdown();
  const debugPanel = el('pre', { className: 'race-debug' });
  /** The stage carries the orientation, because the HUD styles hang off it. */
  const stage = el('div', { className: 'race-stage' });

  let race = null;
  let seed = debug.seed ?? randomSeed();
  let phase = 'countdown';
  let gateOpen = 0;
  let handedOver = false;
  let timers = [];
  let width = 0;
  let height = 0;

  /** Positions of the previous simulation step, for interpolation. */
  const previous = new Float64Array(RUNNER_COUNT);
  const current = new Float64Array(RUNNER_COUNT);
  const drawn = new Float64Array(RUNNER_COUNT);

  /** Frame timing, shown with ?debug=1. The frame rate itself comes from the quality monitor. */
  let debugWindow = 0;
  let updateMs = 0;
  let renderMs = 0;
  let lastLeader = -1;

  resetQuality();
  const monitor = createQualityMonitor((level) => {
    console.info(`Grafikqualität auf "${level}" gesenkt, um die Bildrate zu halten.`);
  });

  /**
   * Sizes the canvas and picks the layout for the current viewport.
   *
   * Rotating the device swaps the whole track and the horse view, but not the simulation: the
   * engine works in track units and has never heard of the screen, so a race survives a rotation
   * untouched (docs/02_ARCHITECTURE.md §9).
   */
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, RENDER.maxPixelRatio);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    rawCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const wanted = orientationFor(width, height);
    if (wanted !== orientation) {
      orientation = wanted;
      track = createTrack({ camera, horses: HORSES, orientation });
      stage.dataset.orientation = orientation;
    }
    track.resize(width, height);
  }

  /** One simulation step, plus the bookkeeping the drawing needs. */
  function update() {
    if (phase === 'countdown') return;

    const started = performance.now();
    for (let i = 0; i < RUNNER_COUNT; i += 1) previous[i] = current[i];

    if (!race.isFinished) {
      race.step();
      const runners = race.runners;
      for (const runner of runners) current[runner.index] = runner.x;
      commentary.read(race);
      if (race.isFinished) finish();
    }
    updateMs = performance.now() - started;
  }

  /** Draws one frame. `alpha` sits between the last two simulation steps. */
  function render(alpha) {
    const started = performance.now();
    const dt = TIMESTEP;
    counter.ops = 0;

    for (let i = 0; i < RUNNER_COUNT; i += 1) {
      drawn[i] = previous[i] + (current[i] - previous[i]) * alpha;
    }

    if (phase !== 'countdown') {
      camera.update(drawn, RUNNER_COUNT, dt);
      gateOpen = Math.min(1, gateOpen + dt / GATE_OPEN_SECONDS);
    }

    track.tick(dt);
    ctx.clearRect(0, 0, width, height);
    track.drawBackdrop(ctx);
    track.drawTrack(ctx);

    const runners = race.runners;
    const laneOfRunner = race.metrics.lanes;
    track.drawGates(ctx, gateOpen, laneOfRunner);
    track.drawFinish(ctx);

    // Where a runner is on screen right now, for the props that hang off a horse.
    const locate = (runner) => {
      const place = track.positionOf(drawn[runner], laneOfRunner[runner]);
      return { ...place, size: track.horseSize(laneOfRunner[runner]), units: drawn[runner] };
    };
    const frame = { locate, width, height };

    // A horse whose jockey came off keeps going without him for the rest of the race.
    for (const entry of race.eventLog) {
      if (entry.id === 'jockey_off' && entry.runner >= 0) poses[entry.runner].riderless = true;
    }

    visuals.sync(race, race.state.t);
    visuals.update(race.state.t, locate);
    visuals.drawDecor(ctx, (units, runner) => ({
      ...track.positionOf(units, laneOfRunner[runner]),
      size: track.horseSize(laneOfRunner[runner]),
    }));
    visuals.draw(ctx, 'behind', race.state.t, frame);
    particles.draw(ctx);

    drawField(ctx, {
      runners,
      lanes: laneOfRunner,
      positions: drawn,
      poses,
      palettes,
      track,
      particles,
      dt,
      duration,
      animationFor,
      running: phase === 'running',
      view: { width, height },
    });

    visuals.draw(ctx, 'front', race.state.t, frame);
    particles.update(dt);
    track.drawOverhead(ctx);
    track.drawForeground(ctx);
    hud.update(runners, race.isFinished ? race.order : null);

    counter.perFrame = counter.ops;
    debugWindow += dt;
    monitor.sample(dt);
    announce(runners);
    renderMs = performance.now() - started;
    if (debugWindow >= 0.5) {
      debugWindow = 0;
      if (debug.enabled) {
        debugPanel.textContent = debugReadout({
          seed,
          fps: monitor.fps(),
          updateMs,
          renderMs,
          particles: particles.count,
          pathOps: counter.perFrame,
          orientation,
          zoom: camera.zoom,
          quality: quality.level,
          time: race.state.t,
        });
      }
    }
  }

  /**
   * Keeps the canvas label and the live region current, so someone who cannot see the race can
   * still follow it. Only speaks when the lead actually changes, otherwise a screen reader would
   * never stop talking (audit A4).
   * @param {{index: number, x: number}[]} runners
   */
  function announce(runners) {
    if (phase !== 'running') return;
    let leader = runners[0];
    for (const runner of runners) if (runner.x > leader.x) leader = runner;
    if (leader.index === lastLeader) return;
    lastLeader = leader.index;

    const name = horseByIndex(leader.index).name;
    canvas.setAttribute('aria-label', `Rennbahn. ${name} führt.`);
    const region = document.getElementById('live-region');
    if (region) region.textContent = `${name} führt.`;
  }

  /** Which animation a runner should be playing right now. */
  function animationFor(runner) {
    if (phase === 'finished') {
      return race.order[0] === runner.index ? 'celebrate' : 'trot_in';
    }
    if (phase === 'countdown') return 'idle';
    // The engine already names the animation an active effect asks for; anything else gallops.
    return runner.anim;
  }

  /** The race is over: celebrate, then hand the result to the result screen. */
  function finish() {
    if (handedOver) return;
    handedOver = true;
    phase = 'finished';

    const winner = horseByIndex(race.order[0]);
    hud.say(`${winner.name} gewinnt!`);
    canvas.setAttribute('aria-label', `Rennen beendet. ${winner.name} gewinnt.`);
    const region = document.getElementById('live-region');
    if (region) region.textContent = `${winner.name} gewinnt!`;

    const payload = toResultPayload(race, seed);
    timers.push(
      setTimeout(() => {
        store.dispatch({ type: 'race/setResult', payload });
        store.dispatch({ type: 'screen/go', payload: 'results' });
      }, CELEBRATION_MS),
    );
  }

  /** Runs the 3-2-1 overlay, then releases the gates. */
  function startCountdown() {
    phase = 'countdown';
    countdown.start(() => {
      phase = 'running';
      hud.say('Und sie sind los!');
    });
  }

  /** Builds a fresh race and restarts everything that belongs to it. */
  function startRace(nextSeed) {
    for (const timer of timers) clearTimeout(timer);
    timers = [];
    countdown.stop();
    seed = nextSeed;
    handedOver = false;
    gateOpen = 0;
    race = createRace({ seed, duration, chaos: settings.chaos });
    lastLeader = -1;
    resetPoses();
    particles.clear();
    visuals.reset();
    commentary.reset();
    hud.clearToasts();
    camera.reset();
    previous.fill(0);
    current.fill(0);
    drawn.fill(0);
    if (debug.enabled) window.__race = race;
    startCountdown();
  }

  const loop = createLoop({ update, render });

  /** Jumps to the end of the race, for the debug key and the skip button. */
  function fastForward() {
    while (!race.isFinished) race.step();
    for (const runner of race.runners) current[runner.index] = runner.x;
    previous.set(current);
    finish();
  }

  // Debug keys from docs/03_RACE_ENGINE.md §9: F fast-forwards, R rerolls, S replays this seed.
  const unlisten = listen([
    [window, 'resize', resize],
    // Some phones fire orientationchange before the viewport has actually resized.
    [window, 'orientationchange', () => requestAnimationFrame(resize)],
    [
      window,
      'keydown',
      (event) => {
        if (!debug.enabled || event.metaKey || event.ctrlKey) return;
        const key = event.key.toLowerCase();
        if (key === 'f') fastForward();
        else if (key === 'r') startRace(randomSeed());
        else if (key === 's') startRace(seed);
      },
    ],
  ]);

  stage.append(canvas, hud.root, countdown.node);
  if (debug.enabled) stage.append(debugPanel);
  if (settings.debugSkip) {
    stage.append(
      el('button', {
        className: 'race-skip',
        text: 'Überspringen',
        attrs: { type: 'button' },
        on: { click: fastForward },
      }),
    );
  }
  container.append(stage);

  startRace(seed);
  // The canvas has no size until it is in the document, so measure on the next frame.
  requestAnimationFrame(() => {
    resize();
    loop.start();
  });

  cleanup = () => {
    unlisten();
    loop.stop();
    countdown.stop();
    for (const timer of timers) clearTimeout(timer);
    timers = [];
    delete window.__race;
  };
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
