/**
 * Draws the race track in landscape: sky, hills, grandstand, fence, six sand lanes, the grass in
 * front, distance markers, the finish line and the starting gates in the horses' own colours.
 *
 * The back layers never change, so they are painted once into offscreen canvases and afterwards
 * only blitted with a parallax offset — that keeps the per-frame path count inside the budget
 * from docs/02_ARCHITECTURE.md §8.
 *
 * The lanes are laid out with a little perspective: the back lane is thinner than the front one,
 * and horses are sized to match, which is what stops six parallel stripes looking like a chart.
 */

import { TRACK_LENGTH, RUNNER_COUNT } from '../config.js';

/** Vertical layout, as shares of the canvas height. */
const TRACK_TOP = 0.44;
const TRACK_BOTTOM = 0.9;

/** How strongly the lanes fan out towards the viewer. 1 would be flat. */
const PERSPECTIVE = 1.3;

/** Parallax factors of the layers behind and in front of the track. */
const HILL_PARALLAX = 0.15;
const STAND_PARALLAX = 0.45;
const GRASS_PARALLAX = 1.25;

/** A distance marker every this many track units. */
const MARKER_SPACING = 100;

const COLOURS = {
  skyTop: '#FFB88C',
  skyBottom: '#C9A7EB',
  hillFar: '#B79AD6',
  hillNear: '#8FBF6B',
  standRoof: '#8B5A2B',
  standWall: '#C98F5A',
  standShade: '#A6713F',
  fence: '#FFF7E6',
  sand: '#E8C88A',
  sandDark: '#D9B370',
  line: '#FFF7E6',
  grassLight: '#7ED957',
  grassDark: '#4CAF50',
  ink: '#2B1D2E',
  wood: '#8B5A2B',
};

/** Crowd colours, cycled so the stand looks populated rather than patterned. */
const CROWD = ['#EF4444', '#F59E0B', '#22C55E', '#06B6D4', '#8B5CF6', '#EC4899', '#FFF8EE'];

/**
 * Creates the track renderer.
 * @param {object} options
 * @param {object} options.camera
 * @param {object[]} options.horses entries from data/horses.js, in runner order
 * @returns {object}
 */
export function createTrack({ camera, horses }) {
  let width = 0;
  let height = 0;
  let hills = null;
  let stand = null;

  /** Top edge of lane i, in pixels. Lane 0 is at the back. */
  function laneEdge(index) {
    const top = height * TRACK_TOP;
    const span = height * (TRACK_BOTTOM - TRACK_TOP);
    return top + span * (index / RUNNER_COUNT) ** PERSPECTIVE;
  }

  /** Builds the two cached backdrop strips. Called on resize only. */
  function buildCaches() {
    const bandHeight = Math.ceil(height * TRACK_TOP) + 2;
    const tile = Math.max(360, Math.ceil(width * 0.8));

    hills = new OffscreenCanvas(tile, bandHeight);
    const hillCtx = hills.getContext('2d');
    hillCtx.fillStyle = COLOURS.hillFar;
    for (let i = -1; i < 6; i += 1) {
      const cx = (i * tile) / 5 + tile / 10;
      hillCtx.beginPath();
      hillCtx.ellipse(cx, bandHeight * 0.73, tile / 4.5, height * 0.1, 0, Math.PI, 0);
      hillCtx.fill();
    }
    hillCtx.fillStyle = COLOURS.hillNear;
    for (let i = -1; i < 8; i += 1) {
      const cx = (i * tile) / 7 + tile / 14;
      hillCtx.beginPath();
      hillCtx.ellipse(cx, bandHeight * 0.75, tile / 6, height * 0.06, 0, Math.PI, 0);
      hillCtx.fill();
    }

    stand = new OffscreenCanvas(tile, bandHeight);
    const standCtx = stand.getContext('2d');
    drawGrandstand(standCtx, tile, bandHeight);
  }

  /**
   * The grandstand, sitting in the lower third of the sky band so it reads as distant. The
   * crowd is small dots at low contrast: it should suggest a full stand, not shout over the
   * horses, which are what the eye is meant to follow.
   */
  function drawGrandstand(ctx, tile, bandHeight) {
    const baseY = bandHeight - 1;
    const standTop = bandHeight * 0.76;
    const roofY = standTop - bandHeight * 0.075;

    // Wall.
    ctx.fillStyle = COLOURS.standWall;
    ctx.fillRect(0, standTop, tile, baseY - standTop);

    // Rows of spectators, offset every other row so they do not form a grid.
    const rows = 3;
    const rowHeight = (baseY - standTop - 4) / rows;
    const dot = Math.max(1.5, rowHeight * 0.24);
    ctx.globalAlpha = 0.85;
    for (let row = 0; row < rows; row += 1) {
      const y = standTop + 4 + row * rowHeight;
      const step = dot * 2.9;
      for (let x = (row % 2) * step * 0.5; x < tile; x += step) {
        ctx.fillStyle = CROWD[(row * 5 + Math.round(x / step)) % CROWD.length];
        ctx.beginPath();
        ctx.arc(x, y, dot, 0, Math.PI * 2);
        ctx.fill();
      }
      // A step of shade under each row, which is what makes it read as tiers.
      ctx.fillStyle = COLOURS.standShade;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, y + dot, tile, Math.max(1, rowHeight * 0.22));
      ctx.globalAlpha = 0.85;
    }
    ctx.globalAlpha = 1;

    // Roof on its supports.
    ctx.fillStyle = COLOURS.standRoof;
    ctx.fillRect(0, roofY, tile, Math.max(5, bandHeight * 0.028));
    ctx.globalAlpha = 0.55;
    for (let x = 0; x < tile; x += tile / 8) {
      ctx.fillRect(x, roofY, 4, standTop - roofY + 6);
    }
    ctx.globalAlpha = 1;

    // White rail between the stand and the track.
    ctx.fillStyle = COLOURS.fence;
    ctx.fillRect(0, baseY - 7, tile, 4);
    for (let x = 5; x < tile; x += 30) ctx.fillRect(x, baseY - 9, 3, 10);
  }

  /** Blits a cached strip across the view with a parallax offset. */
  function blit(ctx, canvas, parallax) {
    if (!canvas) return;
    const shift = -(camera.centre * camera.pixelsPerUnit * parallax) % canvas.width;
    for (let x = shift - canvas.width; x < width + canvas.width; x += canvas.width) {
      ctx.drawImage(canvas, Math.round(x), 0);
    }
  }

  const track = {
    /** Rebuilds everything that depends on the canvas size. */
    resize(pixelWidth, pixelHeight) {
      width = pixelWidth;
      height = pixelHeight;
      camera.setViewport(width);
      buildCaches();
    },

    /** Screen y of the centre of a lane. */
    laneY(index) {
      return (laneEdge(index) + laneEdge(index + 1)) / 2;
    },

    /** How tall a lane is, which also sets how big the horses in it are drawn. */
    laneHeight(index) {
      return laneEdge(index + 1) - laneEdge(index);
    },

    /** Body length in pixels for a horse in this lane. */
    horseSize(index) {
      return track.laneHeight(index) * 1.55;
    },

    /** Sky, hills and the grandstand. */
    drawBackdrop(ctx) {
      const sky = ctx.createLinearGradient(0, 0, 0, height * TRACK_TOP);
      sky.addColorStop(0, COLOURS.skyTop);
      sky.addColorStop(1, COLOURS.skyBottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height * TRACK_TOP + 1);

      blit(ctx, hills, HILL_PARALLAX);
      blit(ctx, stand, STAND_PARALLAX);
    },

    /** The six sand lanes with their dividing lines. */
    drawLanes(ctx) {
      const top = laneEdge(0);
      const bottom = laneEdge(RUNNER_COUNT);

      const sand = ctx.createLinearGradient(0, top, 0, bottom);
      sand.addColorStop(0, COLOURS.sandDark);
      sand.addColorStop(0.35, COLOURS.sand);
      sand.addColorStop(1, COLOURS.sand);
      ctx.fillStyle = sand;
      ctx.fillRect(0, top, width, bottom - top);

      ctx.strokeStyle = COLOURS.line;
      ctx.globalAlpha = 0.55;
      for (let i = 1; i < RUNNER_COUNT; i += 1) {
        const y = laneEdge(i);
        ctx.lineWidth = Math.max(1, track.laneHeight(i) * 0.045);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },

    /** Distance markers along the far rail, so the pace is readable. */
    drawMarkers(ctx) {
      const y = laneEdge(0);
      ctx.font = `${Math.max(9, height * 0.016)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      for (let unit = MARKER_SPACING; unit < TRACK_LENGTH; unit += MARKER_SPACING) {
        const x = camera.toScreenX(unit);
        if (x < -40 || x > width + 40) continue;
        const postHeight = height * 0.035;
        ctx.fillStyle = COLOURS.wood;
        ctx.fillRect(x - 1, y - postHeight, 2, postHeight);
        ctx.fillStyle = COLOURS.fence;
        ctx.beginPath();
        ctx.roundRect(x - 11, y - postHeight - 12, 22, 13, 3);
        ctx.fill();
        ctx.fillStyle = COLOURS.ink;
        ctx.fillText(String(unit), x, y - postHeight - 1);
      }
    },

    /**
     * The starting gates, one per lane in the colour of the horse that drew it.
     * @param {number} open 0 closed, 1 fully swung open
     * @param {number[]} laneOfRunner laneOfRunner[runner] = lane index
     */
    drawGates(ctx, open, laneOfRunner) {
      const x = camera.toScreenX(0);
      if (x < -260 || x > width + 120) return;

      for (let runner = 0; runner < RUNNER_COUNT; runner += 1) {
        const lane = laneOfRunner[runner];
        const top = laneEdge(lane);
        const laneHeight = track.laneHeight(lane);
        const horse = horses[runner];

        // Frame.
        ctx.fillStyle = COLOURS.wood;
        ctx.fillRect(x - 26, top, 5, laneHeight);
        ctx.fillRect(x + 22, top, 5, laneHeight);

        // The door swings away from the track as it opens.
        ctx.save();
        ctx.translate(x - 21, top + laneHeight * 0.5);
        ctx.rotate(-open * 1.15);
        ctx.fillStyle = horse.color;
        ctx.strokeStyle = horse.colorDark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(0, -laneHeight * 0.42, 44, laneHeight * 0.84, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.max(11, laneHeight * 0.42)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(horse.number), 22, 0);
        ctx.restore();
      }
    },

    /** The finish line: a chequered bar across the lanes and a banner over it. */
    drawFinish(ctx) {
      const x = camera.toScreenX(TRACK_LENGTH);
      if (x < -80 || x > width + 200) return;

      const top = laneEdge(0);
      const bottom = laneEdge(RUNNER_COUNT);
      // Two columns of squares, wide enough to stay readable behind a bunched-up field.
      const squares = 16;
      const size = (bottom - top) / squares;
      for (let i = 0; i < squares; i += 1) {
        for (let column = 0; column < 2; column += 1) {
          ctx.fillStyle = (i + column) % 2 === 0 ? COLOURS.ink : '#FFFFFF';
          ctx.fillRect(x - 11 + column * 11, top + i * size, 11, size);
        }
      }

      // Banner on two posts, above the track.
      const bannerY = top - height * 0.1;
      ctx.fillStyle = COLOURS.wood;
      ctx.fillRect(x - 62, bannerY, 6, top - bannerY);
      ctx.fillRect(x + 56, bannerY, 6, top - bannerY);
      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.roundRect(x - 66, bannerY - 6, 132, height * 0.055, 6);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 ${Math.max(12, height * 0.032)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ZIEL', x, bannerY - 6 + height * 0.0275);
    },

    /** The grass strip closest to the viewer, which slides past fastest. */
    drawForeground(ctx) {
      const top = laneEdge(RUNNER_COUNT);
      const grass = ctx.createLinearGradient(0, top, 0, height);
      grass.addColorStop(0, COLOURS.grassDark);
      grass.addColorStop(1, COLOURS.grassLight);
      ctx.fillStyle = grass;
      ctx.fillRect(0, top, width, height - top);

      // Tufts, spaced in world units so they slide past with the track.
      const shift = -(camera.centre * camera.pixelsPerUnit * GRASS_PARALLAX) % 46;
      ctx.strokeStyle = COLOURS.grassDark;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (let x = shift - 46; x < width + 46; x += 46) {
        const base = top + (height - top) * 0.45;
        ctx.beginPath();
        ctx.moveTo(x, base + 10);
        ctx.lineTo(x + 4, base);
        ctx.moveTo(x + 7, base + 10);
        ctx.lineTo(x + 6, base - 2);
        ctx.stroke();
      }
    },
  };

  return track;
}
