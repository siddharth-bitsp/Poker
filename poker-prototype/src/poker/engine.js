import { makeDeck, shuffle, compareScores } from './cards.js';
import { evaluateVariant, variantInfo } from './variants.js';

export const DEFAULT_SETTINGS = { variant: 'holdem', botCount: 5, startingStack: 2000, bigBlind: 20, speed: 1100, autoDeal: false };
export const BOT_PROFILES = [
  { name: 'RiverFox', style: 'Balanced', color: '#8aaefb' },
  { name: 'AceTheory', style: 'Tight', color: '#c6a0ed' },
  { name: 'NightOwl', style: 'Loose', color: '#edbd81' },
  { name: 'BlueShift', style: 'Aggressive', color: '#82cecb' },
  { name: 'LuckyNorth', style: 'Balanced', color: '#a8bcb3' },
];
const clone = state => structuredClone(state);
const active = state => state.players.filter(p => !p.folded && p.hole.length);
const canAct = p => !p.folded && p.hole.length && p.stack > 0;
export const potSize = state => state.players.reduce((sum, p) => sum + p.contribution, 0);

function nextSeat(state, from, predicate) {
  for (let offset = 1; offset <= state.players.length; offset++) {
    const i = (from + offset) % state.players.length;
    if (predicate(state.players[i], i)) return i;
  }
  return null;
}

function log(state, message, kind = 'action') {
  state.log.push({ id: state.log.length, message, kind, street: state.street });
}

function pay(player, amount) {
  const paid = Math.min(player.stack, amount);
  player.stack -= paid;
  player.bet += paid;
  player.contribution += paid;
  player.allIn = player.stack === 0;
  return paid;
}

export function createGame(options = {}) {
  const settings = { ...DEFAULT_SETTINGS, ...options };
  variantInfo(settings.variant);
  if (![2, 3, 4, 5].includes(settings.botCount) || ![1000, 2000, 5000].includes(settings.startingStack) || ![10, 20, 50].includes(settings.bigBlind)) throw new Error('Invalid table settings');
  const players = [{ name: 'You', style: 'Human', color: '#7197ff' }, ...BOT_PROFILES.slice(0, settings.botCount)].map((p, id) => ({ ...p, id, stack: settings.startingStack, hole: [], folded: false, bet: 0, contribution: 0, stats: { hands: 0, wins: 0, vpip: 0 } }));
  const state = { settings, players, dealer: players.length - 3, handNumber: 0, street: 'complete', board: [], deck: [], burned: [], currentBet: 0, minRaise: settings.bigBlind, actor: null, pending: [], log: [], history: [], results: [], totalChips: settings.startingStack * players.length, session: [0], lastPot: 0 };
  return startHand(state, true);
}

export function startHand(input, initial = false) {
  if (input.street !== 'complete') throw new Error('Finish the current hand first');
  const state = clone(input);
  const seated = state.players.filter(p => p.stack > 0);
  if (seated.length < 2 || state.players[0].stack <= 0) return state;
  if (!initial) state.dealer = nextSeat(state, state.dealer, p => p.stack > 0);
  state.handNumber++;
  Object.assign(state, { deck: shuffle(makeDeck()), board: [], burned: [], street: 'preflop', log: [], results: [], lastPot: 0, currentBet: state.settings.bigBlind, minRaise: state.settings.bigBlind, endedByFold: false, winnerIds: [], discardPending: [] });
  for (const p of state.players) {
    Object.assign(p, { hole: [], discarded: [], folded: p.stack === 0, allIn: false, bet: 0, contribution: 0, actedAt: null, lastAction: p.stack === 0 ? 'Sitting out' : '', inPot: false, result: null });
    if (p.stack > 0) p.stats.hands++;
  }
  // Deal one card per player per pass, starting left of the button.
  for (let pass = 0; pass < variantInfo(state.settings.variant).cards; pass++) {
    for (let offset = 1; offset <= state.players.length; offset++) {
      const p = state.players[(state.dealer + offset) % state.players.length];
      if (p.stack > 0) p.hole.push(state.deck.pop());
    }
  }
  const small = seated.length === 2 ? state.dealer : nextSeat(state, state.dealer, p => p.hole.length);
  const big = nextSeat(state, small, p => p.hole.length);
  state.smallBlindSeat = small;
  state.bigBlindSeat = big;
  pay(state.players[small], state.settings.bigBlind / 2);
  pay(state.players[big], state.settings.bigBlind);
  state.players[small].lastAction = 'Small blind';
  state.players[big].lastAction = 'Big blind';
  state.pending = state.players.filter(canAct).map(p => p.id);
  state.actor = nextSeat(state, big, (_, i) => state.pending.includes(i));
  log(state, `Hand #${state.handNumber} · ${variantInfo(state.settings.variant).name} · Blinds ${state.settings.bigBlind / 2} / ${state.settings.bigBlind}`, 'street');
  log(state, `${state.players[small].name} posts ${state.players[small].bet}; ${state.players[big].name} posts ${state.players[big].bet}.`);
  advanceIfReady(state);
  return state;
}

export function legalActions(state, id = state.actor) {
  const p = state.players[id];
  if (state.discardPending?.length) return { canAct: false };
  if (!p || state.street === 'complete' || state.actor !== id || !canAct(p)) return { canAct: false };
  const owed = Math.max(0, state.currentBet - p.bet);
  const call = Math.min(owed, p.stack);
  const minTo = state.currentBet < state.settings.bigBlind ? state.settings.bigBlind : state.currentBet + state.minRaise;
  const maxTo = p.bet + p.stack;
  const reopened = p.actedAt === null || state.currentBet - p.actedAt >= state.minRaise;
  const opponentsWithChips = state.players.some(other => other.id !== id && canAct(other));
  return { canAct: true, canCheck: owed === 0, call, owed, minTo, maxTo, canRaise: reopened && maxTo > state.currentBet && opponentsWithChips, shortAllIn: maxTo < minTo };
}

export function act(input, type, amount, playerId = input.actor) {
  if (type === 'discard') return discardCard(input, amount, playerId);
  const legal = legalActions(input, playerId);
  if (!legal.canAct) throw new Error('It is not this player’s turn');
  if (!['fold', 'check', 'call', 'raise'].includes(type)) throw new Error('Unknown action');
  if (type === 'check' && !legal.canCheck) throw new Error('Call or fold to continue');
  if (type === 'call' && legal.canCheck) type = 'check';
  if (type === 'raise' && (!legal.canRaise || !Number.isInteger(amount) || amount <= input.currentBet || amount > legal.maxTo || (amount < legal.minTo && amount !== legal.maxTo))) throw new Error('That raise is not allowed');
  const state = clone(input);
  const p = state.players[playerId];
  state.pending = state.pending.filter(id => id !== playerId);
  if (type === 'fold') {
    p.folded = true;
    p.lastAction = 'Fold';
    log(state, `${p.name} folds.`);
  } else if (type === 'check') {
    p.lastAction = 'Check';
    p.actedAt = state.currentBet;
    log(state, `${p.name} checks.`);
  } else if (type === 'call') {
    const paid = pay(p, legal.call);
    p.lastAction = p.allIn ? `All-in ${p.bet}` : `Call ${paid}`;
    p.actedAt = state.currentBet;
    log(state, `${p.name} calls ${paid}${p.allIn ? ' (all-in)' : ''}.`);
  } else {
    const oldBet = state.currentBet;
    const fullRaise = amount >= legal.minTo;
    pay(p, amount - p.bet);
    state.currentBet = amount;
    if (fullRaise) {
      state.minRaise = oldBet < state.settings.bigBlind ? Math.max(state.settings.bigBlind, amount) : amount - oldBet;
      state.pending = state.players.filter(other => canAct(other) && other.id !== playerId).map(other => other.id);
    } else {
      for (const other of state.players) if (canAct(other) && other.id !== playerId && other.bet < amount && !state.pending.includes(other.id)) state.pending.push(other.id);
    }
    p.actedAt = amount;
    p.lastAction = `${p.allIn ? 'All-in' : oldBet === 0 ? 'Bet' : 'Raise'} ${amount}`;
    log(state, `${p.name} ${oldBet === 0 ? 'bets' : 'raises to'} ${amount}${p.allIn ? ' (all-in)' : ''}.`);
  }
  if (state.street === 'preflop' && ['call', 'raise'].includes(type) && !p.inPot) {
    p.inPot = true;
    p.stats.vpip++;
  }
  state.actor = nextSeat(state, playerId, (_, id) => state.pending.includes(id));
  advanceIfReady(state);
  return state;
}

function dealStreet(state) {
  state.burned.push(state.deck.pop());
  if (state.street === 'preflop') {
    state.board.push(state.deck.pop(), state.deck.pop(), state.deck.pop());
    state.street = 'flop';
  } else {
    state.board.push(state.deck.pop());
    state.street = state.street === 'flop' ? 'turn' : 'river';
  }
  log(state, state.street.charAt(0).toUpperCase() + state.street.slice(1), 'street');
  state.currentBet = 0;
  state.minRaise = state.settings.bigBlind;
  for (const p of state.players) { p.bet = 0; p.actedAt = null; if (!p.folded && !p.allIn) p.lastAction = ''; }
  state.pending = state.players.filter(canAct).map(p => p.id);
  state.actor = nextSeat(state, state.dealer, (_, id) => state.pending.includes(id));
  if (state.settings.variant === 'discard') {
    state.discardPending = active(state).map(p => p.id);
    state.actor = nextSeat(state, state.dealer, (_, id) => state.discardPending.includes(id));
    log(state, 'Each remaining player discards one private card before betting.', 'street');
  }
}

export function discardCard(input, cardId, playerId = input.actor) {
  if (!input.discardPending?.includes(playerId) || input.actor !== playerId) throw new Error('It is not this player’s discard turn');
  const index = input.players[playerId].hole.findIndex(c => c.id === cardId);
  if (index < 0) throw new Error('Select one of your remaining cards');
  const state = clone(input);
  const p = state.players[playerId];
  p.discarded.push(...p.hole.splice(index, 1));
  p.lastAction = 'Discarded 1';
  log(state, `${p.name} discards one card (${p.hole.length} remain).`);
  state.discardPending = state.discardPending.filter(id => id !== playerId);
  if (state.discardPending.length) state.actor = nextSeat(state, playerId, (_, id) => state.discardPending.includes(id));
  else {
    state.actor = nextSeat(state, state.dealer, (_, id) => state.pending.includes(id));
    advanceIfReady(state);
  }
  return state;
}

function advanceIfReady(state) {
  if (state.discardPending?.length) return;
  if (active(state).length === 1) { settle(state, true); return; }
  state.pending = state.pending.filter(id => canAct(state.players[id]));
  const withChips = active(state).filter(canAct);
  // A sole non-all-in player only acts if there is an outstanding call.
  if (withChips.length <= 1) {
    // A short blind is a full bring-in only while others can still bet.
    // With no possible side action, match actual chips, not a nominal blind.
    state.currentBet = Math.max(0, ...active(state).map(p => p.bet));
    state.pending = state.pending.filter(id => state.players[id].bet < state.currentBet);
  }
  if (state.pending.length) {
    if (!state.pending.includes(state.actor)) state.actor = nextSeat(state, state.dealer, (_, id) => state.pending.includes(id));
    return;
  }
  if (state.street === 'river') { settle(state); return; }
  dealStreet(state);
  if (state.discardPending?.length) return;
  if (active(state).filter(canAct).length <= 1) advanceIfReady(state);
}

// Pot levels preserve eligibility for all-ins; odd chips go left of the button.
export function calculatePots(players) {
  const levels = [...new Set(players.map(p => p.contribution).filter(Boolean))].sort((a, b) => a - b);
  let previous = 0;
  const tiers = levels.map(level => {
    const contributors = players.filter(p => p.contribution >= level);
    const amount = (level - previous) * contributors.length;
    previous = level;
    return { amount, contributors: contributors.map(p => p.id), eligible: contributors.filter(p => !p.folded).map(p => p.id) };
  });
  // Folded blind/raise amounts do not create separate pots when eligibility is
  // unchanged. Merging also prevents awarding an extra odd chip per tier.
  return tiers.reduce((pots, tier) => {
    const previousPot = pots.at(-1);
    if (previousPot && previousPot.contributors.length > 1 && tier.contributors.length > 1 && previousPot.eligible.join(',') === tier.eligible.join(',')) previousPot.amount += tier.amount;
    else pots.push(tier);
    return pots;
  }, []);
}

export function settle(input, folded = false) {
  // Internal mutating settlement is also exported for deterministic edge-case fixtures.
  const state = input;
  const originalPot = potSize(state);
  const payouts = new Map(state.players.map(p => [p.id, 0]));
  const returns = new Map(state.players.map(p => [p.id, 0]));
  const evaluations = new Map();
  if (!folded) for (const p of active(state)) evaluations.set(p.id, evaluateVariant(p.hole, state.board, state.settings.variant));
  state.results = [];
  let potIndex = 0;
  for (const pot of calculatePots(state.players)) {
    if (pot.contributors.length === 1) {
      const id = pot.contributors[0];
      returns.set(id, returns.get(id) + pot.amount);
      log(state, `${pot.amount} uncalled chips returned to ${state.players[id].name}.`);
      continue;
    }
    const eligible = folded ? [active(state)[0].id] : pot.eligible;
    if (!eligible.length) throw new Error('Pot has no eligible player');
    let winners = [eligible[0]];
    if (!folded) for (const id of eligible.slice(1)) {
      const cmp = compareScores(evaluations.get(id).score, evaluations.get(winners[0]).score);
      if (cmp > 0) winners = [id];
      else if (cmp === 0) winners.push(id);
    }
    winners.sort((a, b) => ((a - state.dealer - 1 + state.players.length) % state.players.length) - ((b - state.dealer - 1 + state.players.length) % state.players.length));
    const share = Math.floor(pot.amount / winners.length);
    const remainder = pot.amount % winners.length;
    winners.forEach((id, index) => payouts.set(id, payouts.get(id) + share + (index < remainder ? 1 : 0)));
    state.results.push({ label: potIndex++ === 0 ? 'Main pot' : `Side pot ${potIndex - 1}`, amount: pot.amount, winners, hand: folded ? 'Everyone else folded' : evaluations.get(winners[0]).name });
  }
  state.winnerIds = [...payouts].filter(([, amount]) => amount > 0).map(([id]) => id);
  for (const p of state.players) {
    const won = payouts.get(p.id);
    const returned = returns.get(p.id);
    p.stack += won + returned;
    p.result = { won, returned, net: won + returned - p.contribution, hand: evaluations.get(p.id)?.name || null, bestCards: evaluations.get(p.id)?.cards.map(c => c.id) || [] };
    if (won) p.stats.wins++;
  }
  state.lastPot = originalPot - [...returns.values()].reduce((sum, n) => sum + n, 0);
  state.endedByFold = folded;
  for (const result of state.results) log(state, `${result.winners.map(id => state.players[id].name).join(' & ')} ${result.winners.length > 1 ? 'split' : 'wins'} ${result.amount} · ${result.hand}.`, 'win');
  state.street = 'complete';
  state.actor = null;
  state.pending = [];
  const hero = state.players[0];
  state.history.unshift({ variant: state.settings.variant, number: state.handNumber, board: [...state.board], heroCards: [...hero.hole], pot: state.lastPot, net: hero.result.net, results: clone(state.results), log: clone(state.log), players: state.players.map(p => ({ id: p.id, name: p.name, hole: p.id === 0 || (!p.folded && !folded) ? [...p.hole] : [], folded: p.folded, result: clone(p.result) })) });
  state.history = state.history.slice(0, 50);
  state.session.push(hero.stack - state.settings.startingStack);
  state.session = state.session.slice(-60);
  if (state.players.reduce((sum, p) => sum + p.stack, 0) !== state.totalChips) throw new Error('Chip accounting mismatch');
  return state;
}

// This is the entire information boundary for bots: no deck or opponent cards.
export function observation(state, id) {
  return { id, variant: state.settings.variant, discardRequired: !!state.discardPending?.includes(id), discarded: clone(state.players[id].discarded || []), hole: clone(state.players[id].hole), board: clone(state.board), street: state.street, pot: potSize(state), bigBlind: state.settings.bigBlind, legal: legalActions(state, id), players: state.players.map(p => ({ id: p.id, stack: p.stack, bet: p.bet, folded: p.folded, inHand: p.hole.length > 0 })), style: state.players[id].style };
}
