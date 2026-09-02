/**
 * The attract mode: six horses idling on the track behind the start screen.
 *
 * Loaded on demand, exactly like the race renderer, and for the same reason — it is the same
 * code. That makes it two things at once: the first thing you see, and the moment the renderer
 * gets warmed up for the race that follows.
 *
 * Nothing here is interactive and nothing is simulated. The horses stand and breathe.
 */

import { HORSES } from '../data/horses.js';
import { drawHorse } from './horse.js';
import { horseColours } from './palette.js';
import { createPose, updatePose } from './horseAnimations.js';
import { RENDER } from '../config.js';

/**
 * Where the ground sits, and how big the horses are, as shares of the canvas. The ground sits
 * high enough that the grass below it carries the primary button, so nothing overlaps a horse.
 */
const GROUND = 0.84;
const HORSE_SIZE = 0.2;

const COLOURS = {
  grassLight: '#7ED957',
  grassDark: '#4CAF50',
  sand: '#E8C88A',
  sandDark: '#D9B370',
  fence: '#FFF7E6',
};

/**
 * Starts the attract loop on a canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {{calm: boolean}} options
 * @returns {{stop: () => void}}
 */
export function startAttract(canvas, { calm = false } = {}) {
  const ctx = canvas.getContext('2d');
  const palettes = HORSES.map(horseColours);
  const poses = HORSES.map((_, index) => createPose(index / HORSES.length));

  let width = 0;
  let height = 0;
  let frame = 0;
  let last = performance.now();
  let running = true;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, RENDER.maxPixelRatio);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(now) {
    if (!running) return;
    frame = requestAnimationFrame(draw);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (width === 0) resize();
    if (width === 0) return;

    ctx.clearRect(0, 0, width, height);

    const groundY = height * GROUND;

    // A strip of track with a rail, just enough to stand on.
    const sand = ctx.createLinearGradient(0, groundY - height * 0.14, 0, groundY);
    sand.addColorStop(0, COLOURS.sandDark);
    sand.addColorStop(1, COLOURS.sand);
    ctx.fillStyle = sand;
    ctx.fillRect(0, groundY - height * 0.14, width, height * 0.14);

    ctx.fillStyle = COLOURS.fence;
    ctx.fillRect(0, groundY - height * 0.15, width, 3);

    const grass = ctx.createLinearGradient(0, groundY, 0, height);
    grass.addColorStop(0, COLOURS.grassDark);
    grass.addColorStop(1, COLOURS.grassLight);
    ctx.fillStyle = grass;
    ctx.fillRect(0, groundY, width, height - groundY);

    const size = Math.max(38, Math.min(height * HORSE_SIZE, width * 0.11));
    const step = width / (HORSES.length + 1);

    for (let i = 0; i < HORSES.length; i += 1) {
      const pose = poses[i];
      updatePose(pose, calm ? 0 : dt, { anim: 'idle', speed: 0 });
      drawHorse(ctx, {
        horse: HORSES[i],
        colours: palettes[i],
        pose,
        x: step * (i + 1),
        y: groundY - 2,
        size,
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();
  frame = requestAnimationFrame(draw);

  return {
    stop() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    },
  };
}
