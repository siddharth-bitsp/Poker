import { combinations, evaluateFive, compareScores } from './cards.js';

export const VARIANTS = {
  holdem: { name: 'Hold’em', cards: 2, min: 0, max: 2, rule: '2 private cards · use 0, 1 or 2', description: 'Make your best five-card hand from your two cards and the board. You may play the board alone.' },
  omahaFixed: { name: 'Omaha Fixed', cards: 4, min: 2, max: 2, rule: '4 private cards · use exactly 2', description: 'Use exactly two of your four private cards and exactly three community cards. A flush on the board alone does not give you a flush.' },
  omahaClean: { name: 'Omaha Clean', cards: 4, min: 1, max: 2, rule: '4 private cards · use 1 or 2', description: 'Your house rules: use one or two of your four private cards. Complete your five-card hand with four or three community cards respectively. You cannot play the board alone.' },
  omahaDirty: { name: 'Omaha Dirty', cards: 4, min: 2, max: 3, rule: '4 private cards · use 2 or 3', description: 'Your house rules: use two or three of your four private cards. Complete your five-card hand with three or two community cards respectively.' },
  irish: { name: 'Irish', cards: 3, min: 1, max: 2, rule: '3 private cards · use 1 or 2', description: 'Your house version: receive three cards and keep them throughout the hand. Use one or two, together with four or three board cards. There is no discard in this version.' },
  discard: { name: 'Discard', cards: 5, min: 0, max: 2, rule: '5 → 4 → 3 → 2 cards · discard each street', description: 'Receive five cards. Immediately after the flop, turn and river are dealt, discard one card before betting. Discards are private and final. All-in players still discard. Play the final two cards as Hold’em: use zero, one or two.' },
};

export function variantInfo(id = 'holdem') {
  const variant = VARIANTS[id];
  if (!variant) throw new Error('Unknown poker variation');
  return variant;
}

export function evaluateVariant(hole, board, id = 'holdem') {
  const rules = variantInfo(id);
  let best = null;
  for (let count = rules.min; count <= Math.min(rules.max, hole.length); count++) {
    if (5 - count > board.length) continue;
    for (const pocket of combinations(hole, count)) {
      for (const shared of combinations(board, 5 - count)) {
        const hand = evaluateFive([...pocket, ...shared]);
        if (!best || compareScores(hand.score, best.score) > 0) best = hand;
      }
    }
  }
  if (!best) throw new Error('Not enough cards to make a legal hand');
  return best;
}
