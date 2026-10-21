import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeck, shuffle, evaluate, compareScores, evaluateFive } from '../src/poker/cards.js';
import { createGame, act, startHand, legalActions, observation, settle } from '../src/poker/engine.js';
import { chooseBotAction } from '../src/poker/bots.js';

const cards = value => value.split(' ').map(token => {
  const suit = token.slice(-1), text = token.slice(0, -1);
  const rank = ({ A: 14, K: 13, Q: 12, J: 11, T: 10 })[text] || Number(text);
  return { rank, suit, id: `${rank}${suit}` };
});

test('all hand categories, wheel, kickers, board plays and double trips', () => {
  const cases = [['As Ks Qs Js Ts', 8], ['As Ah Ad Ac 2s', 7], ['Ks Kh Kc 2s 2d', 6], ['As Js 8s 6s 2s', 5], ['As 2h 3c 4s 5d', 4], ['As Ah Ad 9s 2c', 3], ['As Ah Ks Kc 2c', 2], ['As Ah Ks 9c 2c', 1], ['As Kh 9d 6s 2h', 0]];
  for (const [input, category] of cases) assert.equal(evaluate(cards(input)).score[0], category, input);
  assert.equal(evaluate(cards('As 2h 3c 4s 5d')).score[1], 5);
  assert.equal(compareScores(evaluate(cards('As 2h 3c 4s 5d')).score, evaluate(cards('2s 3h 4c 5s 6d')).score), -1);
  assert.equal(compareScores(evaluate(cards('As Ah Kc Qs 9d')).score, evaluate(cards('Ad Ac Kh Qd 8s')).score), 1);
  assert.deepEqual(evaluate(cards('As Ah Ac Ks Kh Kc 2d')).score, [6, 14, 13]);
  assert.equal(evaluate(cards('As Ks Qs Js Ts 2h 3c')).name, 'Royal flush');
  assert.equal(compareScores(evaluate(cards('As Kh Qd Jc Ts 2h 3h')).score, evaluate(cards('As Kh Qd Jc Ts 8h 9h')).score), 0);
});

test('deck is unique, immutable shuffle, and Fisher-Yates visits the correct ranges', () => {
  const deck = makeDeck(), calls = [];
  const shuffled = shuffle(deck, n => { calls.push(n); return 0; });
  assert.equal(new Set(shuffled.map(c => c.id)).size, 52);
  assert.deepEqual(calls, Array.from({ length: 51 }, (_, i) => 52 - i));
  assert.deepEqual(deck, makeDeck());
  assert.notDeepEqual(shuffled, deck);
});

test('blinds, turn order, illegal actions, full raise and big blind option', () => {
  let state = createGame();
  assert.equal(state.actor, 0);
  assert.equal(state.players[4].bet, 10);
  assert.equal(state.players[5].bet, 20);
  assert.throws(() => act(state, 'check'));
  assert.throws(() => act(state, 'raise', 30));
  assert.throws(() => act(state, 'call', undefined, 1));
  const original = JSON.stringify(state);
  let next = act(state, 'raise', 60);
  assert.equal(next.minRaise, 40);
  assert.equal(legalActions(next).minTo, 100);
  assert.equal(JSON.stringify(state), original);
  for (let i = 0; i < 5; i++) state = act(state, 'call');
  assert.equal(state.street, 'preflop');
  assert.equal(state.actor, 5);
  assert.equal(legalActions(state).canCheck, true);
  state = act(state, 'check');
  assert.equal(state.street, 'flop');
  assert.equal(state.actor, 4);
  assert.equal(state.board.length, 3);
});

test('short all-in does not reopen betting; cumulative full raise does', () => {
  let state = createGame();
  state.players[2].stack = 70;
  state.totalChips = state.players.reduce((s, p) => s + p.stack + p.contribution, 0);
  state = act(state, 'raise', 60); // Last full raise: 40.
  state = act(state, 'call');
  state = act(state, 'raise', 70); // Short all-in increase of 10.
  state = act(state, 'fold'); state = act(state, 'fold'); state = act(state, 'fold');
  assert.equal(state.actor, 0);
  assert.equal(legalActions(state).call, 10);
  assert.equal(legalActions(state).canRaise, false);
  assert.throws(() => act(state, 'raise', 110));
  state = act(state, 'call');
  assert.equal(legalActions(state).canRaise, false);

  state = createGame();
  state.players[2].stack = 70; state.players[3].stack = 100;
  state.totalChips = state.players.reduce((s, p) => s + p.stack + p.contribution, 0);
  state = act(state, 'raise', 60); state = act(state, 'call');
  state = act(state, 'raise', 70); state = act(state, 'raise', 100);
  state = act(state, 'fold'); state = act(state, 'fold');
  assert.equal(state.actor, 0);
  assert.equal(legalActions(state).canRaise, true);
});

function showdownFixture(contributions, pockets, board, folded = []) {
  const state = createGame({ botCount: contributions.length - 1 });
  state.board = cards(board); state.street = 'river';
  state.players.forEach((p, id) => { p.contribution = contributions[id]; p.stack = 0; p.hole = cards(pockets[id]); p.folded = folded.includes(id); });
  state.totalChips = contributions.reduce((s, n) => s + n, 0);
  return state;
}

test('main pot and two side pots preserve all-in eligibility and folded money', () => {
  const state = showdownFixture([50, 100, 200, 200], ['As Ah', 'Ks Kh', 'Qs Qh', '5s 5h'], '2c 3d 7h 9s Jc', [3]);
  settle(state);
  assert.deepEqual(state.players.map(p => p.stack), [200, 150, 200, 0]);
  assert.deepEqual(state.results.map(p => p.amount), [200, 150, 200]);
});

test('tied hands split; odd chip goes clockwise from button; folded player cannot win', () => {
  const state = showdownFixture([5, 5, 5], ['2c 3c', '4d 5d', 'Ac Ad'], 'Ts Jh Qd Kc As', [2]);
  state.dealer = 0;
  settle(state);
  assert.deepEqual(state.players.map(p => p.stack), [7, 8, 0]);
  assert.equal(state.results[0].winners.length, 2);
});

test('folded contributions with identical eligibility merge before splitting odd chips', () => {
  const state = showdownFixture([5, 5, 3, 2, 1], ['2c 3c', '4d 5d', 'Ac Ad', '8h 9h', '7c 6d'], 'Ts Jh Qd Kc As', [2, 3, 4]);
  settle(state);
  assert.deepEqual(state.players.map(p => p.stack), [8, 8, 0, 0, 0]);
  assert.equal(state.results.length, 1);
});

test('uncalled chips are returned without counting as won; all-ins run out board', () => {
  const fixture = showdownFixture([50, 100, 200], ['As Ah', 'Ks Kh', 'Qs Qh'], '2c 3d 7h 9s Jc');
  settle(fixture);
  assert.deepEqual(fixture.players.map(p => p.stack), [150, 100, 100]);
  assert.equal(fixture.players[2].result.won, 0);
  assert.equal(fixture.players[2].result.returned, 100);
  assert.equal(fixture.lastPot, 250);
  let state = createGame({ botCount: 2 });
  state = act(state, 'raise', legalActions(state).maxTo);
  state = act(state, 'call'); state = act(state, 'call');
  assert.equal(state.street, 'complete'); assert.equal(state.board.length, 5);
  assert.equal(state.burned.length, 3);
});

test('heads-up dealer posts small blind and acts first preflop, last after flop', () => {
  let state = createGame({ botCount: 2 });
  state.street = 'complete'; state.players[2].stack = 0; state.players[0].stack = 3000; state.players[1].stack = 3000;
  state = startHand(state);
  assert.equal(state.smallBlindSeat, state.dealer);
  assert.equal(state.actor, state.dealer);
  state = act(state, 'call'); state = act(state, 'check');
  assert.equal(state.street, 'flop'); assert.notEqual(state.actor, state.dealer);
});

test('heads-up short blind runs out automatically when the other blind already covers it', () => {
  let state = createGame({ botCount: 2 });
  state.street = 'complete'; state.dealer = 1;
  state.players[0].stack = 5995; state.players[1].stack = 5; state.players[2].stack = 0;
  state = startHand(state);
  assert.equal(state.dealer, 0);
  assert.equal(state.street, 'complete');
  assert.equal(state.board.length, 5);
  assert.equal(state.lastPot, 10);
  assert.equal(state.players[0].result.returned, 5);
});

test('bot observations contain neither deck nor opponent cards, and decisions are legal', () => {
  let state = createGame();
  state = act(state, 'call');
  const view = observation(state, state.actor);
  assert.equal('deck' in view, false); assert.equal('burned' in view, false);
  assert.ok(view.players.every(p => !('hole' in p)));
  assert.equal(view.hole.length, 2);
  for (let i = 0; i < 45; i++) {
    if (state.street === 'complete') state = createGame();
    const decision = chooseBotAction(observation(state, state.actor));
    assert.doesNotThrow(() => { state = act(state, decision.type, decision.amount); });
  }
});

test('500 randomized hands conserve chips, keep cards unique, and always finish', () => {
  let seed = 20261015;
  const rand = n => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % n; };
  let total = 0;
  for (let session = 0; session < 50; session++) {
    let state = createGame({ botCount: 2 + rand(4), bigBlind: [10, 20, 50][rand(3)] });
    for (let hand = 0; hand < 10; hand++) {
      if (state.street === 'complete') {
        if (!state.players[0].stack || state.players.filter(p => p.stack).length < 2) state = createGame({ botCount: 2 + rand(4) });
        else state = startHand(state);
      }
      let steps = 0;
      while (state.street !== 'complete') {
        const l = legalActions(state), r = rand(10);
        assert.ok(l.canAct); assert.ok(++steps < 300);
        if (l.canRaise && r < 2) state = act(state, 'raise', r === 0 ? l.maxTo : Math.min(l.maxTo, l.minTo + rand(4) * state.settings.bigBlind));
        else if (r === 2 && !l.canCheck) state = act(state, 'fold');
        else state = act(state, l.canCheck ? 'check' : 'call');
        const dealt = [...state.board, ...state.burned, ...state.deck, ...state.players.flatMap(p => p.hole)];
        assert.equal(dealt.length, 52); assert.equal(new Set(dealt.map(c => c.id)).size, 52);
        assert.ok(state.players.every(p => Number.isInteger(p.stack) && p.stack >= 0));
        assert.equal(state.players.reduce((s, p) => s + p.stack + (state.street === 'complete' ? 0 : p.contribution), 0), state.totalChips);
      }
      total++;
    }
  }
  assert.equal(total, 500);
});

test('five-card evaluator matches the canonical exhaustive category counts', { timeout: 120000 }, () => {
  const deck = makeDeck(), counts = Array(9).fill(0);
  for (let a = 0; a < 48; a++) for (let b = a + 1; b < 49; b++) for (let c = b + 1; c < 50; c++) for (let d = c + 1; d < 51; d++) for (let e = d + 1; e < 52; e++) counts[evaluateFive([deck[a], deck[b], deck[c], deck[d], deck[e]]).score[0]]++;
  assert.deepEqual(counts, [1302540, 1098240, 123552, 54912, 10200, 5108, 3744, 624, 40]);
});
