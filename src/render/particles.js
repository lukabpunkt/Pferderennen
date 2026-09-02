/**
 * Particle system with a fixed object pool.
 *
 * Everything lives in typed arrays allocated once, so a race never allocates a particle and the
 * garbage collector has nothing to do mid-race (docs/02_ARCHITECTURE.md §8). Dead particles are
 * swapped with the last live one, which keeps the live range contiguous.
 *
 * M3 only needs dust from the hooves. The remaining types — confetti, stars, sparkles, rainbow,
 * splashes and the rest — arrive with the events in M5.
 */

import { RENDER } from '../config.js';
import { quality } from './quality.js';

/** Particle kinds, as small integers so they fit in a typed array. */
export const DUST = 0;

/** Per-kind look. Extended in M5. */
const KINDS = [{ colour: '198, 160, 106', gravity: -14, drag: 2.6, fade: 1 }];

/**
 * @param {number} capacity how many particles may be alive at once
 * @returns {object}
 */
export function createParticles(capacity = RENDER.particlePoolSize) {
  const x = new Float32Array(capacity);
  const y = new Float32Array(capacity);
  const vx = new Float32Array(capacity);
  const vy = new Float32Array(capacity);
  const life = new Float32Array(capacity);
  const maxLife = new Float32Array(capacity);
  const size = new Float32Array(capacity);
  const kind = new Uint8Array(capacity);
  let count = 0;

  return {
    get count() {
      return count;
    },

    /** Drops every particle, for a fresh race. */
    clear() {
      count = 0;
    },

    /**
     * Adds one particle. Silently does nothing when the pool is full, which is the right
     * behaviour for decoration: a missing speck of dust is better than a dropped frame.
     */
    spawn(type, atX, atY, { speedX = 0, speedY = 0, radius = 4, seconds = 0.6 } = {}) {
      if (count >= capacity) return;
      const i = count;
      count += 1;
      x[i] = atX;
      y[i] = atY;
      vx[i] = speedX;
      vy[i] = speedY;
      life[i] = seconds;
      maxLife[i] = seconds;
      size[i] = radius;
      kind[i] = type;
    },

    /**
     * A puff of dust where a hoof struck the ground.
     * @param {number} atX
     * @param {number} atY
     * @param {number} scale how big the horse is, so distant lanes kick up less
     * @param {number} intensity 1 at a normal gallop, more when sprinting
     */
    hoofDust(atX, atY, scale, intensity = 1) {
      if (quality.level === 'low') {
        // One speck instead of two or three; the effect survives, the cost does not.
        this.spawn(DUST, atX, atY, {
          speedX: -26 * intensity * (scale / 60),
          speedY: -10 * (scale / 60),
          radius: scale * 0.07,
          seconds: 0.4,
        });
        return;
      }
      const puffs = intensity > 1.2 ? 3 : 2;
      for (let i = 0; i < puffs; i += 1) {
        this.spawn(DUST, atX + (Math.random() - 0.5) * scale * 0.2, atY, {
          speedX: -(18 + Math.random() * 34) * intensity * (scale / 60),
          speedY: -(6 + Math.random() * 16) * (scale / 60),
          radius: scale * (0.05 + Math.random() * 0.05),
          seconds: 0.35 + Math.random() * 0.3,
        });
      }
    },

    /**
     * Advances every live particle and retires the finished ones.
     * @param {number} dt
     */
    update(dt) {
      for (let i = 0; i < count; i += 1) {
        const behaviour = KINDS[kind[i]];
        life[i] -= dt;
        if (life[i] <= 0) {
          // Swap with the last live particle so the live range stays contiguous.
          count -= 1;
          x[i] = x[count];
          y[i] = y[count];
          vx[i] = vx[count];
          vy[i] = vy[count];
          life[i] = life[count];
          maxLife[i] = maxLife[count];
          size[i] = size[count];
          kind[i] = kind[count];
          i -= 1;
          continue;
        }
        const drag = 1 - behaviour.drag * dt;
        vx[i] *= drag;
        vy[i] = vy[i] * drag + behaviour.gravity * dt;
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
      }
    },

    /**
     * Draws every live particle.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      for (let i = 0; i < count; i += 1) {
        const behaviour = KINDS[kind[i]];
        const age = life[i] / maxLife[i];
        ctx.fillStyle = `rgba(${behaviour.colour}, ${age * 0.55 * behaviour.fade})`;
        ctx.beginPath();
        ctx.arc(x[i], y[i], size[i] * (1.5 - age * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    },
  };
}
