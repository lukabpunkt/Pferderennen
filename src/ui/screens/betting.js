/**
 * Betting screen: each player in turn picks a horse and stakes sips, then an overview.
 *
 * One player at a time, so the phone can travel around the table. The header always names who
 * is up, and the primary action only unlocks once everyone has placed a bet (audit A1).
 */

import { el } from '../dom.js';
import { button } from '../components/button.js';
import { stepper } from '../components/stepper.js';
import { page, header, card, horsePortrait } from '../components/layout.js';
import { HORSES, HORSES_BY_ID } from '../../data/horses.js';
import { betSummary, carrySummary, restorableBets } from '../bettingSummary.js';
import { BETTING } from '../../config.js';
import { sips, sipWord, BET_TYPE_LABELS, betTypeHint, ICON } from '../strings.js';

let cleanup = null;

/** The hint under the start button; the button points at it rather than repeating it. */
const HINT_ID = 'betting-start-hint';

/**
 * @param {HTMLElement} container
 * @param {{getState: Function, dispatch: Function, subscribe: Function}} store
 */
export function mount(container, store) {
  /** Draft of the bet the current player is composing. */
  let draft = null;
  let activeStepper = null;
  /** Where we last rendered, so a new player starts at the top of the list. */
  let lastTurn = '';
  /**
   * The player whose bet is being changed out of order, or null. Deliberately local: it is a
   * detour within one visit to this screen, not something the rest of the game needs to know.
   */
  let editing = null;
  /**
   * Whether the "run it back" card has been answered this visit. Without it the card would come
   * straight back after "Alle neu setzen" — that answer leaves exactly the state the card asks
   * about — and there would be no way out of the loop.
   */
  let carryDismissed = false;

  const body = el('div', { className: 'betting' });
  const footer = el('div', { className: 'betting__footer' });
  const headerHost = el('div', { className: 'betting__header-host' });

  /** The player whose turn it is, or null when everyone has bet. */
  const currentPlayer = (state) => state.players[state.bettingTurn] ?? null;

  /** Whoever is placing a bet right now: the one who asked to change, else whose turn it is. */
  const bettingPlayer = (state) =>
    editing
      ? (state.players.find((player) => player.id === editing) ?? null)
      : currentPlayer(state);

  /** The bet a player currently holds, if any. */
  const betOf = (state, playerId) => state.bets.find((bet) => bet.playerId === playerId) ?? null;

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
        attrs: {
          type: 'button',
          'aria-pressed': selected ? 'true' : 'false',
          // The stable handle a redraw uses to give the keyboard its place back.
          'data-horse': horse.id,
        },
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
            const player = bettingPlayer(store.getState());
            if (!player) return;
            const wasEditing = editing !== null;
            const bet = {
              playerId: player.id,
              horseId: draft.horseId,
              sips: draft.sips,
              type: draft.type,
            };
            // Both flags are cleared *before* dispatching: each dispatch re-renders, and a stale
            // draft would build the panel one more time for nothing.
            draft = null;
            editing = null;
            store.dispatch({ type: 'bets/place', payload: bet });
            // Somebody changing their mind is not the next player's turn.
            if (!wasEditing) store.dispatch({ type: 'betting/next' });
          },
        }),
      ],
      'card--stake',
    );
  }

  /** Opens the horse grid for one player, whether or not they already have a bet. */
  function startEditing(player) {
    const bet = betOf(store.getState(), player.id);
    editing = player.id;
    draft = bet ? { horseId: bet.horseId, sips: bet.sips, type: bet.type ?? 'win' } : null;
    render();
  }

  /** The card offered at the start of a round: the same bets as last time, or start over. */
  const carryCard = (state) =>
    carrySummary(state, {
      onRepeat: () => {
        carryDismissed = true;
        store.dispatch({ type: 'bets/repeat' });
      },
      onFresh: () => {
        carryDismissed = true;
        render();
      },
    });

  /** The summary table, with every line a way into that player's bet. */
  const overview = (state) =>
    betSummary(state, {
      onEdit: startEditing,
      onReset: () => {
        draft = null;
        carryDismissed = true;
        store.dispatch({ type: 'bets/reset' });
      },
    });

  /**
   * What the header says, which is the clearest signal of where in the round we are.
   * @param {any} state
   * @param {object|null} player
   * @param {boolean} offerCarry
   * @returns {object} arguments for header()
   */
  function headingFor(state, player, offerCarry) {
    // The pill counts bets, not turns. Those used to be the same thing; since bets can be carried
    // over, somebody who joined afterwards would otherwise be counted as done.
    const inProgress = player && !editing && !offerCarry ? 1 : 0;
    const done = Math.min(state.bets.length + inProgress, state.players.length);
    const aside = el('span', {
      className: 'progress-pill num',
      text: `${done} / ${state.players.length}`,
    });

    /** Everyone still without a bet. */
    const open = state.players.filter((entry) => !betOf(state, entry.id));

    if (offerCarry) {
      return { title: 'Noch mal dasselbe?', subtitle: 'Oder setzt neu, wer mag.', aside };
    }
    if (player) {
      // Somebody stepping out of the summary is changing a bet — unless they never had one,
      // which is what a player who joined after the last race is doing here.
      const changing = editing && betOf(state, player.id);
      return {
        title: `${player.avatar} ${player.name} ${changing ? 'ändert' : 'ist dran'}`,
        subtitle: changing
          ? 'Neues Pferd wählen oder den Einsatz anpassen.'
          : `Wähl ein Pferd und setz deine ${sipWord(state.settings, 2)}.`,
        aside,
      };
    }
    if (open.length > 0) {
      // Carried-over bets can leave somebody out: a player who joined after the last race.
      const names = open.map((entry) => entry.name).join(' und ');
      return {
        title: 'Fast bereit',
        subtitle: `${names} ${open.length === 1 ? 'fehlt' : 'fehlen'} noch — tippt auf die Zeile.`,
        aside,
      };
    }
    return {
      title: 'Bereit zum Rennen',
      subtitle: 'Gib das Gerät zurück in die Mitte.',
      aside,
    };
  }

  /**
   * Redraws everything for the current state.
   *
   * Every redraw replaces the nodes, which throws the keyboard focus back to the document body —
   * a player who picked a horse with Enter would have to tab through all six again to reach the
   * stepper. So whatever was focused is looked up again afterwards by its stable handle (audit
   * A4, "Fokus-Reihenfolge").
   */
  function render() {
    const state = store.getState();
    const player = bettingPlayer(state);
    // The card is offered once per visit, at the start of a fresh round, and only when there is
    // something to offer.
    const offerCarry =
      !carryDismissed &&
      !editing &&
      state.bets.length === 0 &&
      state.bettingTurn === 0 &&
      restorableBets(state).length > 0;
    const focusedHorse = document.activeElement?.closest?.('.horse-card')?.dataset.horse ?? null;

    // A fresh player must see the horses, not wherever the previous one had scrolled to. The
    // same goes for somebody stepping out of the summary to change their bet.
    const at = `${state.bettingTurn}:${editing ?? ''}`;
    if (at !== lastTurn) {
      lastTurn = at;
      container.querySelector('.screen__body')?.scrollTo({ top: 0 });
    }

    headerHost.replaceChildren(header(headingFor(state, player, offerCarry)));

    if (offerCarry) {
      body.replaceChildren(carryCard(state));
    } else if (player) {
      body.replaceChildren(
        el(
          'div',
          { className: 'horse-grid' },
          HORSES.map((horse) => horseCard(horse, state, draft?.horseId === horse.id)),
        ),
        draft ? stakePanel(state) : el('p', { className: 'hint', text: 'Tipp auf ein Pferd.' }),
        // A change can be called off; the round in progress cannot, there is nothing to go back to.
        editing
          ? button({
              label: 'Abbrechen',
              variant: 'ghost',
              onClick: () => {
                editing = null;
                draft = null;
                render();
              },
            })
          : null,
      );
    } else {
      body.replaceChildren(overview(state));
    }

    if (focusedHorse) {
      body.querySelector(`.horse-card[data-horse="${focusedHorse}"]`)?.focus();
    }

    // The goal button stays visible the whole time; while it is disabled it says why.
    const missing = state.players.length - state.bets.length;
    const missingWord = missing === 1 ? 'Wette' : 'Wetten';
    // Starting mid-change would run the race on the old bet and throw the new one away without
    // saying so. The way out of a change is "Setzen" or "Abbrechen", not the start button.
    const reason = editing
      ? 'Erst die Änderung bestätigen oder abbrechen.'
      : missing > 0
        ? `Es ${missing === 1 ? 'fehlt' : 'fehlen'} noch ${missing} ${missingWord}.`
        : null;

    footer.replaceChildren(
      button({
        label: `${ICON.start} Rennen starten`,
        wide: true,
        disabled: reason !== null,
        title: reason ?? undefined,
        describedBy: reason ? HINT_ID : undefined,
        onClick: () => {
          store.dispatch({ type: 'race/clear' });
          store.dispatch({ type: 'screen/go', payload: 'race' });
        },
      }),
      reason
        ? el('p', {
            className: 'hint betting__footer-hint',
            text: reason,
            attrs: { id: HINT_ID },
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
