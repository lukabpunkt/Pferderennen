/**
 * The 3 - 2 - 1 - LOS! overlay before a race.
 *
 * Each number is scaled down from three times its size with a bounce; "LOS!" is the cue the
 * gates open on (docs/04_DESIGN_SYSTEM.md §4.4). The screen flash that goes with it arrives
 * in M6.
 */

import { el } from '../dom.js';

/** What is shown, and for how long each step stays. */
const STEPS = ['3', '2', '1', 'LOS!'];
const STEP_MS = 750;

/**
 * Creates the overlay.
 * @returns {{node: HTMLElement, start: (onFinished: () => void) => void, stop: () => void}}
 */
export function createCountdown() {
  const node = el('div', { className: 'countdown', attrs: { 'aria-hidden': 'true' } });
  let timer = null;
  let step = 0;

  /** Shows the next step, or hands back when the last one is done. */
  function tick(onFinished) {
    if (step >= STEPS.length) {
      node.textContent = '';
      node.classList.remove('countdown--visible');
      onFinished();
      return;
    }
    node.textContent = STEPS[step];
    node.classList.remove('countdown--visible');
    // Force a reflow between the two class changes, otherwise the animation is not restarted.
    void node.offsetWidth;
    node.classList.add('countdown--visible');
    step += 1;
    timer = setTimeout(() => tick(onFinished), STEP_MS);
  }

  return {
    node,

    /**
     * Runs the countdown from the beginning.
     * @param {() => void} onFinished called after the last step
     */
    start(onFinished) {
      this.stop();
      step = 0;
      tick(onFinished);
    },

    stop() {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      node.textContent = '';
      node.classList.remove('countdown--visible');
    },
  };
}
