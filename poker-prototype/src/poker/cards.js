export const SUITS = ['c', 'd', 'h', 's'];
export const HAND_NAMES = ['High card', 'One pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush'];

export function makeDeck() {
  return SUITS.flatMap(suit => Array.from({ length: 13 }, (_, i) => ({ rank: i + 2, suit, id: `${i + 2}${suit}` })));
}

// Rejection sampling avoids the modulo bias of a random integer % n.
export function randomInt(n) {
  if (!Number.isInteger(n) || n < 1) throw new Error('Invalid random range');
  const word = new Uint32Array(1);
  const limit = Math.floor(4294967296 / n) * n;
  do { globalThis.crypto.getRandomValues(word); } while (word[0] >= limit);
  return word[0] % n;
}

export function shuffle(cards, random = randomInt) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function combinations(items, size) {
  const out = [];
  function walk(start, chosen) {
    if (chosen.length === size) { out.push(chosen); return; }
    for (let i = start; i <= items.length - (size - chosen.length); i++) walk(i + 1, [...chosen, items[i]]);
  }
  walk(0, []);
  return out;
}

export function compareScores(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0) ? 1 : -1;
  }
  return 0;
}

export function evaluateFive(cards) {
  if (cards.length !== 5) throw new Error('Five cards required');
  const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
  const counts = new Map();
  for (const rank of ranks) counts.set(rank, (counts.get(rank) || 0) + 1);
  const groups = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const flush = cards.every(c => c.suit === cards[0].suit);
  const unique = [...new Set(ranks)];
  let straight = 0;
  if (unique.length === 5 && unique[0] - unique[4] === 4) straight = unique[0];
  if (unique.join(',') === '14,5,4,3,2') straight = 5;
  let score;
  if (flush && straight) score = [8, straight];
  else if (groups[0][1] === 4) score = [7, groups[0][0], groups[1][0]];
  else if (groups[0][1] === 3 && groups[1][1] === 2) score = [6, groups[0][0], groups[1][0]];
  else if (flush) score = [5, ...ranks];
  else if (straight) score = [4, straight];
  else if (groups[0][1] === 3) score = [3, ...groups.map(g => g[0])];
  else if (groups[0][1] === 2 && groups[1][1] === 2) score = [2, ...groups.map(g => g[0])];
  else if (groups[0][1] === 2) score = [1, ...groups.map(g => g[0])];
  else score = [0, ...ranks];
  return { score, name: score[0] === 8 && straight === 14 ? 'Royal flush' : HAND_NAMES[score[0]], cards };
}

export function evaluate(cards) {
  if (cards.length < 5 || cards.length > 7) throw new Error('Evaluate requires 5 to 7 cards');
  let best = null;
  for (const five of combinations(cards, 5)) {
    const hand = evaluateFive(five);
    if (!best || compareScores(hand.score, best.score) > 0) best = hand;
  }
  return best;
}

export function rankLabel(rank) { return ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[rank] || String(rank); }

export function describePocket(cards) {
  if (cards.length !== 2) return '';
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  if (sorted[0].rank === sorted[1].rank) return `Pocket ${rankLabel(sorted[0].rank)}s`;
  return `${rankLabel(sorted[0].rank)}${rankLabel(sorted[1].rank)} ${sorted[0].suit === sorted[1].suit ? 'suited' : 'offsuit'}`;
}
