import test from 'node:test';
import assert from 'node:assert/strict';
import { VARIANTS, evaluateVariant } from '../src/poker/variants.js';
import { createGame, act, legalActions, observation, startHand } from '../src/poker/engine.js';
import { chooseBotAction } from '../src/poker/bots.js';
const cards = s => s.split(' ').map(t => { const rank = ({ A:14,K:13,Q:12,J:11,T:10 })[t.slice(0,-1)] || +t.slice(0,-1); const suit=t.at(-1); return {rank,suit,id:`${rank}${suit}`}; });

test('Omaha Fixed cannot play a board royal flush or use only one private card', () => {
  const board=cards('Ah Kh Qh Jh Th'), hole=cards('2c 3d 4s 5c');
  assert.equal(evaluateVariant(hole,board,'omahaFixed').score[0],0);
  assert.equal(evaluateVariant(cards('9h 2c 3d 4s'),board,'omahaClean').score[0],8);
  assert.notEqual(evaluateVariant(cards('9h 2c 3d 4s'),board,'omahaFixed').score[0],8);
});
test('Dirty can use three pocket cards; Clean cannot', () => {
  const board=cards('2h 3h 7c 8d 9s'),hole=cards('Ah Kh Qh 4c');
  assert.equal(evaluateVariant(hole,board,'omahaDirty').score[0],5);
  assert.notEqual(evaluateVariant(hole,board,'omahaClean').score[0],5);
  assert.equal(evaluateVariant(hole,board,'omahaDirty').cards.filter(c=>hole.some(h=>h.id===c.id)).length,3);
});
test('Irish requires one or two of its three cards; cannot use a pocket set or board alone', () => {
  assert.equal(evaluateVariant(cards('Ah Ad Ac'),cards('2c 4d 7s 9h Jc'),'irish').score[0],1);
  assert.notEqual(evaluateVariant(cards('2c 3d 4s'),cards('Ah Kh Qh Jh Th'),'irish').score[0],8);
});
test('all variants deal correctly and reject unknown rules', () => {
  for(const [variant,r] of Object.entries(VARIANTS)) {
    const s=createGame({variant});assert.ok(s.players.every(p=>p.hole.length===r.cards));
    assert.equal(new Set(s.players.flatMap(p=>p.hole.map(c=>c.id))).size,r.cards*6);
  }
  assert.throws(()=>createGame({variant:'nope'}));
});
test('Discard pauses all-in runouts on each street, hides discards, ends with two cards', () => {
  let s=createGame({variant:'discard',botCount:2});
  s=act(s,'raise',legalActions(s).maxTo);s=act(s,'call');s=act(s,'call');
  for(const [street,count] of [['flop',5],['turn',4],['river',3]]) {
    assert.equal(s.street,street); assert.equal(s.discardPending.length,3);
    assert.equal(legalActions(s).canAct,false);assert.throws(()=>act(s,'check'));
    assert.throws(()=>act(s,'discard','bad-card'));
    for(let n=0;n<3;n++) {
      const id=s.actor, card=s.players[id].hole[0].id;
      const v=observation(s,id);assert.equal(v.discardRequired,true);
      assert.ok(v.players.every(p=>!('discarded' in p) && !('hole' in p)));
      s=act(s,'discard',card);
      assert.equal(s.players[id].hole.length,count-1);
      assert.ok(!s.log.at(-1).message.includes(card));
    }
  }
  assert.equal(s.street,'complete');
  assert.ok(s.players.every(p=>p.hole.length===2 && p.discarded.length===3));
  assert.equal(s.players.reduce((n,p)=>n+p.stack,0),6000);
  assert.equal(s.history[0].variant,'discard');
});
test('discard choices cannot be made out of turn and betting resumes after all choices', () => {
  let s=createGame({variant:'discard',botCount:2});
  s=act(s,'call');s=act(s,'call');s=act(s,'check');
  const first=s.actor, other=(first+1)%3;
  assert.throws(()=>act(s,'discard',s.players[other].hole[0].id,other));
  for(let i=0;i<3;i++) s=act(s,'discard',s.players[s.actor].hole[0].id);
  assert.equal(s.street,'flop');assert.equal(s.actor,first);
  assert.equal(legalActions(s).canCheck,true);
});
test('150 varied hands finish, keep cards unique and conserve chips including discarded cards', () => {
  for(const variant of Object.keys(VARIANTS).filter(k=>k!=='holdem')) for(let hand=0;hand<30;hand++) {
    let s=createGame({variant,botCount:2+(hand%4)}),steps=0;
    while(s.street!=='complete') {
      assert.ok(++steps<150);
      if(s.discardPending.length) {
        const v=observation(s,s.actor),d=chooseBotAction(v);s=act(s,d.type,d.amount);
      } else {
        const l=legalActions(s);
        if(hand%3===0 && l.canRaise) s=act(s,'raise',l.maxTo);
        else if(hand%5===0 && !l.canCheck) s=act(s,'fold');
        else s=act(s,l.canCheck?'check':'call');
      }
      const all=[...s.deck,...s.board,...s.burned,...s.players.flatMap(p=>[...p.hole,...(p.discarded||[])])];
      assert.equal(all.length,52);assert.equal(new Set(all.map(c=>c.id)).size,52);
      assert.equal(s.players.reduce((n,p)=>n+p.stack+(s.street==='complete'?0:p.contribution),0),s.totalChips);
    }
    if(!s.endedByFold && variant==='discard') assert.ok(s.players.filter(p=>!p.folded).every(p=>p.hole.length===2));
  }
});
test('bots make legal betting decisions in each variation', () => {
  for(const variant of Object.keys(VARIANTS)) {
    let s=createGame({variant,botCount:2});
    for(let n=0;n<20 && s.street!=='complete';n++) {
      const d=chooseBotAction(observation(s,s.actor));
      s=act(s,d.type,d.amount);
    }
  }
});
