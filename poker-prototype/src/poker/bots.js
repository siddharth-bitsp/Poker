import { makeDeck, shuffle, compareScores, randomInt } from './cards.js';
import { evaluateVariant, variantInfo } from './variants.js';

// Samples only unknown cards. The real shuffled deck is never supplied here.
export function estimateEquity(view, samples = 36) {
  const known = new Set([...view.hole, ...view.board, ...(view.discarded || [])].map(c => c.id));
  const unseen = makeDeck().filter(c => !known.has(c.id));
  const opponents = view.players.filter(p => p.id !== view.id && !p.folded && p.inHand).length;
  if (!opponents) return 1;
  let equity = 0;
  for (let i = 0; i < samples; i++) {
    const deck = shuffle(unseen);
    const board = [...view.board];
    while (board.length < 5) board.push(deck.pop());
    const own = evaluateVariant(view.hole, board, view.variant);
    let better = false;
    let tied = 1;
    for (let j = 0; j < opponents; j++) {
      const other = evaluateVariant(Array.from({ length: view.variant === 'discard' ? view.hole.length : variantInfo(view.variant).cards }, () => deck.pop()), board, view.variant);
      const cmp = compareScores(other.score, own.score);
      if (cmp > 0) { better = true; break; }
      if (cmp === 0) tied++;
    }
    if (!better) equity += 1 / tied;
  }
  return equity / samples;
}

export function chooseBotAction(view) {
  if (view.discardRequired) {
    let best = null;
    for (const card of view.hole) {
      const hand = evaluateVariant(view.hole.filter(c => c.id !== card.id), view.board, view.variant);
      const cmp = best ? compareScores(hand.score, best.score) : 1;
      if (cmp > 0 || (cmp === 0 && card.rank < best.card.rank)) best = { card, score: hand.score };
    }
    return { type: 'discard', amount: best.card.id };
  }
  const l = view.legal;
  if (!l.canAct) throw new Error('Bot has no action');
  const equity = estimateEquity(view);
  const chance = randomInt(1000) / 1000;
  const style = { Tight: -0.045, Loose: 0.07, Aggressive: 0.035, Balanced: 0 }[view.style] || 0;
  const strength = equity + style;
  const potOdds = l.call / Math.max(1, view.pot + l.call);
  const opponents = view.players.filter(p => p.id !== view.id && !p.folded && p.inHand).length;
  const strong = strength > Math.max(0.37, 1 / (opponents + 1) + 0.18);
  const bluff = chance < (view.style === 'Aggressive' ? 0.09 : 0.035);
  if (l.canRaise && (strong && chance < 0.72 || bluff && l.owed <= view.bigBlind * 2)) {
    const me = view.players.find(p => p.id === view.id);
    const sizing = view.street === 'preflop' ? view.bigBlind * (3 + Math.floor(opponents / 3)) : Math.round((view.pot + l.call) * (view.style === 'Aggressive' ? 0.75 : 0.55));
    const to = Math.min(l.maxTo, Math.max(l.minTo, me.bet + l.call + sizing));
    if (to >= l.minTo || to === l.maxTo) return { type: 'raise', amount: to };
  }
  if (l.canCheck) return { type: 'check' };
  if (strength >= potOdds + 0.025 || (l.call <= view.bigBlind && strength > 0.12) || chance < 0.06) return { type: 'call' };
  return { type: 'fold' };
}
