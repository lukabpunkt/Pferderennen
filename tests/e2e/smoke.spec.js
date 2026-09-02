/**
 * End-to-end smoke tests.
 *
 * Two things are checked here that no unit test can reach: that the whole path from an empty
 * start screen to a settled result actually works in a real browser, and that the settings
 * survive a reload. Everything in between — fairness, payouts, the commentator — is proven far
 * more thoroughly by the unit tests and the fairness audit; this is about the wiring.
 *
 * The race runs with a fixed seed and the skip button, so a test never sits through thirty
 * seconds of horses.
 */

import { test, expect } from '@playwright/test';

/** A race that always produces the same result, and can be fast-forwarded. */
const FIXED_RACE = '/?seed=42&debugSkip=1';

/**
 * Adds players on the player screen.
 * @param {import('@playwright/test').Page} page
 * @param {string[]} names
 */
async function addPlayers(page, names) {
  const input = page.getByPlaceholder('Name eintippen …');
  for (const [index, name] of names.entries()) {
    await input.fill(name);
    await page.getByRole('button', { name: '+ Spieler' }).click();
    // The field empties itself for the next player, which is also the signal that it took.
    await expect(input).toHaveValue('');
    await expect(page.locator('.player-row')).toHaveCount(index + 1);
  }
}

/**
 * Places one bet for the player whose turn it is.
 * @param {import('@playwright/test').Page} page
 * @param {number} horseIndex
 */
async function placeBet(page, horseIndex) {
  await page.locator('.horse-card').nth(horseIndex).click();
  await page.getByRole('button', { name: /Setzen/ }).click();
}

// Nothing clears localStorage here on purpose: Playwright gives every test its own browser
// context, so each one starts at an empty table anyway — and an init script would also wipe the
// storage on the reload that the persistence test is about.

test('from an empty start screen to a settled result and on to the next race', async ({ page }) => {
  await page.goto(FIXED_RACE);

  await expect(page.getByRole('heading', { name: 'Pferderennen' })).toBeVisible();
  await page.getByRole('button', { name: "Los geht's" }).click();

  await expect(page.getByRole('heading', { name: 'Wer spielt mit?' })).toBeVisible();
  await addPlayers(page, ['Ada', 'Bo', 'Cem']);
  await page.getByRole('button', { name: /Weiter zu den Wetten/ }).click();

  // Three players, three turns. Everyone backs a different horse.
  for (let turn = 0; turn < 3; turn += 1) {
    await expect(page.getByText(/ist dran/)).toBeVisible();
    await placeBet(page, turn);
  }

  await expect(page.getByRole('heading', { name: 'Bereit zum Rennen' })).toBeVisible();
  await expect(page.getByText('Alle haben gesetzt')).toBeVisible();

  const start = page.getByRole('button', { name: /Rennen starten/ });
  await expect(start).toBeEnabled();
  await start.click();

  // The race is running: the canvas describes itself, and the skip button is there.
  await expect(page.locator('canvas.race-canvas')).toBeVisible();
  const skip = page.getByRole('button', { name: 'Überspringen' });
  await expect(skip).toBeVisible();
  await skip.click();

  // The result names a winner, and the winner is one of the six.
  const heading = page.locator('.screen[data-screen="results"] h1');
  await expect(heading).toContainText(/gewinnt!$/, { timeout: 30_000 });

  // Everybody either deals out or drinks — nobody is left without a line.
  await expect(page.locator('.payout')).toHaveCount(3);

  // And the game goes on.
  await page.getByRole('button', { name: 'Nächstes Rennen' }).click();
  await expect(page.getByText(/ist dran/)).toBeVisible();
});

test('the same seed produces the same winner', async ({ browser }) => {
  /**
   * Plays one race with the fixed seed in its own browser context and returns the winner's
   * headline. Two independent sessions rather than two runs in one, because the point is that
   * the seed decides the race and nothing else does.
   * @returns {Promise<string|null>}
   */
  const winnerOf = async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(FIXED_RACE);
      await page.getByRole('button', { name: "Los geht's" }).click();
      await addPlayers(page, ['Ada', 'Bo']);
      await page.getByRole('button', { name: /Weiter zu den Wetten/ }).click();
      await placeBet(page, 0);
      await placeBet(page, 1);
      await page.getByRole('button', { name: /Rennen starten/ }).click();
      await page.getByRole('button', { name: 'Überspringen' }).click();
      const heading = page.locator('.screen[data-screen="results"] h1');
      await expect(heading).toContainText(/gewinnt!$/, { timeout: 30_000 });
      return await heading.textContent();
    } finally {
      await context.close();
    }
  };

  const first = await winnerOf();
  expect(first).toMatch(/gewinnt!$/);
  expect(await winnerOf()).toBe(first);
});

test('settings survive a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Einstellungen' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  // The chips are radios in a radiogroup, so this also checks the accessible state, not a class.
  for (const option of ['Kurz', 'Vollgas', 'Letzter']) {
    await dialog.getByRole('radio', { name: option }).click();
    await expect(dialog.getByRole('radio', { name: option })).toBeChecked();
  }

  // Escape closes the overlay and hands the focus back.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.reload();
  await page.getByRole('button', { name: 'Einstellungen' }).click();

  const reopened = page.getByRole('dialog');
  for (const option of ['Kurz', 'Vollgas', 'Letzter']) {
    await expect(reopened.getByRole('radio', { name: option })).toBeChecked();
  }
});

test('a hand-typed race URL cannot land on a dead screen', async ({ page }) => {
  // Nobody has bet, so #/race must not be reachable. The guard sends the player to the first
  // screen that is actually usable — with no players at all, that is the player list (audit A1).
  await page.goto('/#/race');
  await expect(page.locator('canvas.race-canvas')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Wer spielt mit?' })).toBeVisible();
});
