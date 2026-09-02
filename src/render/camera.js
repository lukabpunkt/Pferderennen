/**
 * Race camera: follows the field, zooms out when it spreads, and can be shaken.
 *
 * The camera works in track units and converts to pixels on demand. It always keeps the whole
 * field visible — a viewer must never lose sight of their own horse (audit A3) — but it leans
 * ahead of the field so you can see where the race is going.
 */

import { TRACK_LENGTH } from '../config.js';

/** How far ahead of the field centre the camera looks, as a share of the visible width. */
const LOOK_AHEAD = 0.06;

/** Lerp sharpness. Higher follows more tightly; this is a per-second rate, not a per-frame one. */
const FOLLOW_RATE = 6;

/**
 * Where the start line sits when the camera is all the way back, as a share of the view. The
 * camera has to see a little *before* the start, otherwise the starting gates and the horses
 * standing in them are cut off by the left edge.
 */
const START_MARGIN = 0.32;

/** Zoom bounds and how much of the view the field may fill before the camera pulls back. */
const ZOOM_MIN = 0.55;
const ZOOM_MAX = 1;
const FIELD_FILL = 0.7;

/** Shake decays with the square of trauma, so it fades softly rather than stopping dead. */
const TRAUMA_DECAY = 2.2;
const TRAUMA_MAX_OFFSET = 7;

/**
 * @param {object} options
 * @param {number} options.viewUnits how many track units fit across the view at zoom 1
 * @returns {object} the camera
 */
export function createCamera({ viewUnits = 340 } = {}) {
  let centre = viewUnits * START_MARGIN;
  let zoom = ZOOM_MAX;
  let trauma = 0;
  let shakeX = 0;
  let shakeY = 0;
  let width = 1;

  /** Deterministic-ish wobble; the camera is decoration, so Math.random is fine outside the engine. */
  function wobble() {
    return Math.random() * 2 - 1;
  }

  const camera = {
    /** Pixels per track unit at the current zoom. Set by the renderer on resize. */
    setViewport(pixelWidth) {
      width = pixelWidth;
    },

    /**
     * Moves the camera towards the field.
     * @param {Float64Array|number[]} positions runner positions in track units
     * @param {number} count
     * @param {number} dt seconds
     */
    update(positions, count, dt) {
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < count; i += 1) {
        if (positions[i] < min) min = positions[i];
        if (positions[i] > max) max = positions[i];
      }

      // Pull back until the spread of the field fits comfortably inside the view.
      const spread = Math.max(max - min, 1);
      const wanted = Math.min(ZOOM_MAX, (viewUnits * FIELD_FILL) / spread);
      const targetZoom = Math.max(ZOOM_MIN, wanted);
      const visible = viewUnits / targetZoom;

      let target = (min + max) / 2 + visible * LOOK_AHEAD;
      // Keep the gates in view at the start, and stop just past the finish so the winner is
      // framed rather than pinned against the right edge.
      target = Math.max(visible * START_MARGIN, Math.min(TRACK_LENGTH - visible * 0.08, target));

      // Frame-rate independent lerp: the same motion at 30 and at 144 frames per second.
      const blend = 1 - Math.exp(-FOLLOW_RATE * dt);
      centre += (target - centre) * blend;
      zoom += (targetZoom - zoom) * blend;

      if (trauma > 0) {
        trauma = Math.max(0, trauma - TRAUMA_DECAY * dt);
        const amount = trauma * trauma * TRAUMA_MAX_OFFSET;
        shakeX = wobble() * amount;
        shakeY = wobble() * amount;
      } else {
        shakeX = 0;
        shakeY = 0;
      }
    },

    /** Adds shake. 0 is nothing, 1 is a proper jolt. */
    shake(amount) {
      trauma = Math.min(1, trauma + amount);
    },

    /** Pixels per track unit right now. */
    get pixelsPerUnit() {
      return (width / viewUnits) * zoom;
    },

    get zoom() {
      return zoom;
    },

    get centre() {
      return centre;
    },

    get shakeOffsetY() {
      return shakeY;
    },

    /**
     * Track units to screen pixels.
     * @param {number} x
     * @returns {number}
     */
    toScreenX(x) {
      return (x - centre) * camera.pixelsPerUnit + width / 2 + shakeX;
    },

    /** How many track units are visible right now. */
    get visibleUnits() {
      return viewUnits / zoom;
    },

    /** Places the camera at the start line without any easing, for the countdown. */
    reset() {
      centre = camera.visibleUnits * START_MARGIN;
      zoom = ZOOM_MAX;
      trauma = 0;
      shakeX = 0;
      shakeY = 0;
    },
  };

  return camera;
}
