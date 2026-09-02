/**
 * Entry point of the game.
 *
 * From M1 onwards main.js loads the persisted state, starts the store and hands over to the
 * router. In M0 it merely shows that the skeleton stands and the modules load correctly.
 */

import { HORSES } from './data/horses.js';
import { TRACK_LENGTH, RACE_DURATIONS, DEFAULT_SETTINGS } from './config.js';

/**
 * Renders the M0 placeholder page: a title plus the six horses in their signature colours.
 * @param {HTMLElement} root
 */
function renderPlaceholder(root) {
  const title = document.createElement('h1');
  title.textContent = 'Pferderennen – M0';

  const subtitle = document.createElement('p');
  subtitle.textContent = `Grundgerüst steht. Strecke ${TRACK_LENGTH} Units, Standard-Renndauer ${RACE_DURATIONS[DEFAULT_SETTINGS.raceLength]} Sekunden.`;

  const list = document.createElement('ul');
  list.className = 'horse-preview';

  for (const horse of HORSES) {
    const item = document.createElement('li');
    item.className = 'horse-preview__item';
    // The signature colour is data, not a design token, so it is set inline.
    item.style.setProperty('--horse-color', horse.color);

    const badge = document.createElement('span');
    badge.className = 'horse-preview__badge num';
    badge.textContent = String(horse.number);

    const name = document.createElement('strong');
    name.textContent = horse.name;

    const character = document.createElement('span');
    character.className = 'horse-preview__character';
    character.textContent = horse.character;

    const text = document.createElement('span');
    text.className = 'horse-preview__text';
    text.append(name, character);

    item.append(badge, text);
    list.append(item);
  }

  root.replaceChildren(title, subtitle, list);
}

const app = document.getElementById('app');
if (app) {
  renderPlaceholder(app);
}
