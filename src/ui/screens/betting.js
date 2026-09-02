/**
 * Betting screen: each player in turn picks a horse and stakes sips, then an overview.
 *
 * One player at a time, so the phone can travel around the table. The header always names who
 * is up, and the primary action only unlocks once everyone has placed a bet (audit A1).
 */

import { el } from '../dom.js';
import { button } from '../components/button.js';
import { stepper } from '../components/stepper.js';
import { page, header, card, horseBadge, horsePortrait, playerChip } from '../components/layout.js';
import { HORSES, HORSES_BY_ID } from '../../data/horses.js';
import { BETTING } from '../../config.js';
import { sips, sipWord, BET_TYPE_LABELS, betTypeHint, ICON } from '../strings.js';

let cleanup = null;

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function, subscribe: Function}} store
 */
export function mount(container, store) {
  /** Draft of the bet the current player is composing. */
  let draft = null;
  let activeStepper = null;
  /** Whose turn we last rendered, so a new player starts at the top of the list. */
  let lastTurn = -1;

  const body = el('div', { className: 'betting' });
  const footer = el('div', { className: 'betting__footer' });
  const headerHost = el('div', { className: 'betting__header-host' });

  /** The player whose turn it is, or null when everyone has bet. */
  const currentPlayer = (state) => state.players[state.bettingTurn] ?? null;

  /** Builds one horse card. */
  function horseCard(horse, state, selected) {
    const backers = state.bets
      .filter((bet) => bet.horseId === horse.id)
      .map((bet) => state.players.find((player) => player.id === bet.playerId))
      .filter(Boolean);

    return el(
      'button',
      {
        className: `horse-card${selected ? ' horse-card--selected' : ''}`,
        vars: {
          '--horse-color': horse.color,
          '--horse-light': horse.colorLight,
          '--horse-dark': horse.colorDark,
        },
        attrs: { type: 'button', 'aria-pressed': selected ? 'true' : 'false' },
        on: {
          click: () => {
            draft = {
              horseId: horse.id,
              sips: draft?.sips ?? BETTING.defaultSips,
              type: draft?.type ?? 'win',
            };
            render();
          },
        },
      },
      [
        horsePortrait(horse, 68),
        el('span', { className: 'horse-card__name', text: horse.name }),
        el('span', { className: 'horse-card__character', text: horse.character }),
        backers.length > 0
          ? el(
              'span',
              { className: 'horse-card__backers' },
              backers.map((player) =>
                el('span', {
                  className: 'horse-card__backer',
                  text: player.avatar,
                  attrs: { title: player.name },
                }),
              ),
            )
          : null,
      ],
    );
  }

  /** The stake panel that appears once a horse is picked. */
  function stakePanel(state) {
    const horse = HORSES_BY_ID[draft.horseId];
    const settings = state.settings;

    activeStepper?.destroy();
    activeStepper = stepper({
      value: draft.sips,
      min: BETTING.minSips,
      max: BETTING.maxSips,
      label: 'Einsatz',
      format: (value) => sips(settings, value),
      onChange: (value) => {
        draft.sips = value;
      },
    });

    const typeChooser =
      settings.betType === 'free'
        ? el('div', { className: 'bet-types' }, [
            el('span', { className: 'bet-types__label', text: 'Wettart' }),
            el(
              'div',
              { className: 'bet-types__row' },
              Object.entries(BET_TYPE_LABELS).map(([value, label]) =>
                el('button', {
                  className: `chip${draft.type === value ? ' chip--active' : ''}`,
                  text: label,
                  attrs: {
                    type: 'button',
                    'aria-pressed': draft.type === value ? 'true' : 'false',
                  },
                  on: {
                    click: () => {
                      draft.type = value;
                      render();
                    },
                  },
                }),
              ),
            ),
            el('p', { className: 'hint', text: betTypeHint(draft.type) }),
          ])
        : el('p', { className: 'hint', text: betTypeHint(settings.betType) });

    return card(
      [
        el('p', { className: 'stake__horse' }, [
          el('span', { className: 'stake__horse-name', text: horse.name }),
          el('span', { className: 'stake__horse-dot', vars: { '--horse-color': horse.color } }),
        ]),
        activeStepper.node,
        typeChooser,
        button({
          label: 'Setzen ✓',
          wide: true,
          onClick: () => {
            const player = currentPlayer(store.getState());
            if (!player) return;
            store.dispatch({
              type: 'bets/place',
              payload: {
                playerId: player.id,
                horseId: draft.horseId,
                sips: draft.sips,
                type: draft.type,
              },
            });
            draft = null;
            store.dispatch({ type: 'betting/next' });
          },
        }),
      ],
      'card--stake',
    );
  }

  /** The summary table shown once everyone has placed a bet. */
  function overview(state) {
    return card(
      [
        el('h2', { className: 'overview__title', text: 'Alle haben gesetzt' }),
        el(
          'ul',
          { className: 'overview__list' },
          state.bets.map((bet) => {
            const player = state.players.find((entry) => entry.id === bet.playerId);
            const horse = HORSES_BY_ID[bet.horseId];
            return el('li', { className: 'overview__row' }, [
              playerChip(player),
              el('span', { className: 'overview__horse' }, [
                horseBadge(horse, 'sm'),
                el('span', { text: horse.name }),
              ]),
              el('span', { className: 'overview__sips num', text: sips(state.settings, bet.sips) }),
            ]);
          }),
        ),
        button({
          label: 'Wetten zurücksetzen',
          variant: 'ghost',
          onClick: () => {
            draft = null;
            store.dispatch({ type: 'bets/reset' });
          },
        }),
      ],
      'card--overview',
    );
  }

  /** Redraws everything for the current state. */
  function render() {
    const state = store.getState();
    const player = currentPlayer(state);

    // A fresh player must see the horses, not wherever the previous one had scrolled to.
    if (state.bettingTurn !== lastTurn) {
      lastTurn = state.bettingTurn;
      container.querySelector('.screen__body')?.scrollTo({ top: 0 });
    }

    headerHost.replaceChildren(
      header({
        title: player ? `${player.avatar} ${player.name} ist dran` : 'Bereit zum Rennen',
        subtitle: player
          ? `Wähl ein Pferd und setz deine ${sipWord(state.settings, 2)}.`
          : 'Gib das Gerät zurück in die Mitte.',
        aside: el('span', {
          className: 'progress-pill num',
          text: `${Math.min(state.bettingTurn + (player ? 1 : 0), state.players.length)} / ${state.players.length}`,
        }),
      }),
    );

    if (player) {
      body.replaceChildren(
        el(
          'div',
          { className: 'horse-grid' },
          HORSES.map((horse) => horseCard(horse, state, draft?.horseId === horse.id)),
        ),
        draft ? stakePanel(state) : el('p', { className: 'hint', text: 'Tipp auf ein Pferd.' }),
      );
    } else {
      body.replaceChildren(overview(state));
    }

    // The goal button stays visible the whole time; while it is disabled it says why.
    const missing = state.players.length - state.bets.length;
    const missingWord = missing === 1 ? 'Wette' : 'Wetten';
    footer.replaceChildren(
      button({
        label: `${ICON.start} Rennen starten`,
        wide: true,
        disabled: missing > 0,
        title: missing > 0 ? `Es fehlen noch ${missing} ${missingWord}.` : undefined,
        onClick: () => {
          store.dispatch({ type: 'race/clear' });
          store.dispatch({ type: 'screen/go', payload: 'race' });
        },
      }),
      missing > 0
        ? el('p', {
            className: 'hint betting__footer-hint',
            text: `Es ${missing === 1 ? 'fehlt' : 'fehlen'} noch ${missing} ${missingWord}.`,
          })
        : el('span'),
    );
  }

  container.append(page({ header: headerHost, body: [body], footer }));

  const unsubscribe = store.subscribe(render);
  render();
  cleanup = () => {
    unsubscribe();
    activeStepper?.destroy();
    activeStepper = null;
  };
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
