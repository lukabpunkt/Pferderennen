/**
 * Stake stepper: minus/plus, bounds, hold-to-repeat.
 *
 * Both buttons are at least 48 px so they stay comfortable with a thumb, and holding one down
 * repeats with an accelerating interval instead of forcing twelve separate taps.
 */

import { el } from '../dom.js';

/** Delay before a held button starts repeating, and the interval while it repeats. */
const HOLD_DELAY = 450;
const HOLD_INTERVAL = 120;
/** The repeat speeds up to this interval the longer a button is held. */
const HOLD_INTERVAL_MIN = 45;

/**
 * @param {object} options
 * @param {number} options.value
 * @param {number} options.min
 * @param {number} options.max
 * @param {string} options.label visible label above the value
 * @param {(value: number) => void} options.onChange
 * @param {(value: number) => string} [options.format] renders the value, e.g. "3 Schlücke"
 * @returns {{node: HTMLElement, setValue: (value: number) => void, destroy: () => void}}
 */
export function stepper({ value, min, max, label, onChange, format = String }) {
  let current = value;
  let holdTimer = null;
  let holdInterval = null;

  const output = el('output', { className: 'stepper__value num', text: format(current) });

  const stopHold = () => {
    if (holdTimer !== null) clearTimeout(holdTimer);
    if (holdInterval !== null) clearInterval(holdInterval);
    holdTimer = null;
    holdInterval = null;
  };

  /** Applies a step, clamps it and reports it upwards. */
  const step = (delta) => {
    const next = Math.min(max, Math.max(min, current + delta));
    if (next === current) {
      stopHold();
      return;
    }
    current = next;
    output.textContent = format(current);
    minus.disabled = current <= min;
    plus.disabled = current >= max;
    onChange(current);
  };

  /** Starts the accelerating repeat while a button stays pressed. */
  const startHold = (delta) => {
    stopHold();
    holdTimer = setTimeout(() => {
      let interval = HOLD_INTERVAL;
      const tick = () => {
        step(delta);
        if (interval > HOLD_INTERVAL_MIN && holdInterval !== null) {
          clearInterval(holdInterval);
          interval = Math.max(HOLD_INTERVAL_MIN, interval - 15);
          holdInterval = setInterval(tick, interval);
        }
      };
      holdInterval = setInterval(tick, interval);
    }, HOLD_DELAY);
  };

  /** Builds one of the two round buttons. */
  const makeButton = (delta, symbol, name) =>
    el('button', {
      className: 'stepper__btn',
      text: symbol,
      attrs: { type: 'button', 'aria-label': name },
      on: {
        click: () => step(delta),
        pointerdown: () => startHold(delta),
        pointerup: stopHold,
        pointerleave: stopHold,
        pointercancel: stopHold,
      },
    });

  const minus = makeButton(-1, '−', 'Einsatz verringern');
  const plus = makeButton(+1, '+', 'Einsatz erhöhen');
  minus.disabled = current <= min;
  plus.disabled = current >= max;

  const node = el('div', { className: 'stepper' }, [
    el('span', { className: 'stepper__label', text: label }),
    el('div', { className: 'stepper__row' }, [minus, output, plus]),
  ]);

  return {
    node,
    setValue(next) {
      current = Math.min(max, Math.max(min, next));
      output.textContent = format(current);
      minus.disabled = current <= min;
      plus.disabled = current >= max;
    },
    destroy: stopHold,
  };
}
