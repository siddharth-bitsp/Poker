# Private Poker Rooms — Product Requirements Document

**Version:** 0.1 — proposed implementation baseline  
**Date:** 15 October 2026  
**Product name:** To be decided  
**Status:** Planning only. No website implementation or deployment is included in this document.

## 1. Product purpose

Let groups of friends recreate their home poker nights online, including the house rules that conventional poker rooms do not offer. A host creates a room, shares a link, and friends join from a browser on their phones or computers.

The product should make unusual rules understandable and dependable. Players should always be able to answer: what game are we playing, what can I do now, which cards can I use, and why did that player win?

### Confirmed requirements

- All launch gameplay features are free, including private rooms, variants and the supported variation builder.
- Seven initial game modes, including the user's Omaha and Irish rules and Triple Number + Poker.
- Two- and three-board bomb pots, with shared-river layouts distinguished from complete separate boards.
- Optional 7–2 bounty.
- A variation builder based on supported settings.
- A polished interface suitable for mobile and desktop.
- Triple Number: the dealer-button player chooses the target before dealing; higher/lower is declared beforehand; players allocate their five cards at showdown; half the pot is for numbers and half for poker; ties are allowed.
- A personal display setting for **Chip values** or **Big blinds (BB)**, inspired by the supplied Shuflr screenshot.

Everything else below is a proposed product default unless explicitly described as confirmed. Open decisions are recorded in section 15; they must not silently become implemented house rules.

## 2. Audience and success criteria

### Primary audience

Existing friend groups who already know one another, have an organiser, and want private, recurring poker nights with their own rules. The initial audience brings its own players; a public matchmaking pool is unnecessary.

### Roles

| Role | Responsibilities and permissions |
| --- | --- |
| Host | Create the room, approve entrants, configure future hands, pause/resume, manage seating and chip adjustments. |
| Player | Join, sit, act, select/discard cards, choose personal display preferences, and inspect allowed history. |
| Dealer-button player | Normal dealer position plus target selection in Triple Number. This role does not grant access to other players' cards or host permissions. |
| Spectator | Optional admitted guest who watches public action only. Spectating is off by default in the first pilot. |

### Pilot success criteria

These are proposed acceptance targets, not market benchmarks:

- A new guest can open an invitation and request a seat without creating an account.
- A group can complete a two-hour session without losing chips, duplicating cards or corrupting a hand.
- Every result can be explained from visible rules, eligible players and revealed cards.
- A returning player can recover their seat after a short connection interruption.
- At least five of ten invited external groups return for sessions in three of four weeks before broader expansion.
- Actual server and storage usage is measured before making claims about player capacity or operating cost.

## 3. Scope and delivery stages

| Stage | Deliverable | Exit condition |
| --- | --- | --- |
| A: Rules and foundation | Formal rule definitions, game state model, payout examples, design direction. | No unresolved rule is hidden behind an assumed implementation. Standard Hold'em is fully specified. |
| B: Playable foundation | One genuine multiplayer Hold'em room, invitations, betting, showdown, reconnects and Chips/BB display. | A complete session works across separate devices; core correctness checks pass. |
| C: Complete launch feature set | Seven modes, compatible extras, saved presets, variation builder and session history. | Each enabled mode and combination passes its acceptance cases. Triple Number scoring is confirmed. |
| D: Private beta and polish | Responsive design, edge-case repairs, usability testing and usage measurement. | Friends and external test groups can play independently. |
| E: Public release | Public access to room creation with appropriate operational controls. | Capacity, recovery, privacy and product requirements are reviewed using measured beta results. |

Stage B is a testable milestone, not a claim that the entire seven-mode product is finished. All features in Stage C belong to the intended launch scope.

### Deferred work

- Advertising and ad-frequency experiments.
- Real-money deposits, withdrawals, cash settlement or a rake business.
- Native mobile apps, integrated video calling and public matchmaking.
- Multi-table tournaments, bots, advanced coaching and AI-generated arbitrary game rules.
- A public community marketplace for presets, global leaderboards and extensive social profiles.

The initial experience uses play chips. Free access to the software and play-money game design are separate concepts; this PRD does not define a real-money service.

## 4. Navigation and screens

### Home

- Clear **Create room** and **Join room** actions.
- Enter an invitation code or open a direct invitation link.
- See a brief explanation of the available modes.
- Return to an active room on the same device when a valid session exists.

### Room setup and lobby

- Host chooses a preset, starting stacks, blinds or bomb-pot contribution, seat count and action timer.
- Show a readable rules summary before the first hand.
- Invite via link or code; copy-link feedback confirms success.
- Host admits players, assigns or lets them choose available seats, and starts when at least two eligible players are ready.
- Guest nickname is required; duplicate display names receive a visible differentiator.
- Initial proposed capacity is 2–9 players, reduced automatically when the selected rules require more cards than the deck contains.

### Main table

- Private cards, board(s), stacks, current bets, main/side pots, dealer button and turn indicator.
- Fold, check, call, bet and raise controls that reflect the legal action at that moment.
- Useful bet shortcuts, exact amount entry and a clear distinction between raise-to and raise-by amounts.
- A prominent mode label and expandable rules summary.
- Room controls, player list, text chat, recent actions and connection status.
- Selection controls for discards and Triple Number appear only when required.
- A visible banner for pauses, pending next-hand changes and dealer target selection.

### Variation builder

- Start from a supported preset; adjust compatible fields.
- Show a live plain-language summary and explain invalid combinations.
- Name, save and share a versioned preset.
- Importing a shared preset displays its complete rules before use.
- Pilot preset ownership uses the host's persistent guest session; cross-device recovery and account-based libraries are later enhancements.

### Session results and hand history

- Starting chips, additions/removals, net game result and ending chips per player.
- Recent completed hands, betting actions, public boards and payout explanations.
- Unrevealed private cards and discarded cards remain hidden from other players, hosts and spectators.
- Proposed pilot retention: seven days for hand history, clearly stated in the interface. The retention policy is configurable and must be confirmed before public launch.

## 5. Chip values / Big blinds display

The supplied screenshot establishes a display selector with two options: **Chip values** and **Big blinds (BB)**. This is a personal preference, not a rule change for the table.

### Required behaviour

- Apply the selected unit consistently to stacks, current bets, call amounts, pots, bet shortcuts and the current-hand action log.
- Changing display does not alter balances, betting limits or other players' screens.
- Store all game amounts internally as exact integer chip units; never settle a pot using rounded BB values.
- Display up to two decimal places for BB; provide the exact chip amount through accessible detail text or tap/hover information.
- Remember the preference on the same browser. A future account can synchronise it across devices.
- Label every numeric bet input with its current unit.
- Validate BB inputs against legal chip increments. If conversion is not exact, show the proposed chip amount and require confirmation; do not silently round a submitted wager.
- Preserve a draft bet's underlying chip amount when switching units and visibly convert the input.

### Examples

| Situation | Chip display | BB display |
| --- | --- | --- |
| Big blind is 20; player stack is 2,000 | 2,000 chips | 100 BB |
| Big blind is 20; pot is 150 | 150 chips | 7.5 BB |
| Big blind is 20; player raises to 60 | Raise to 60 chips | Raise to 3 BB |
| Next hand's big blind changes from 20 to 40; stack stays 2,000 | 2,000 chips | 50 BB |

Historical hands use the big blind recorded for that hand, not today's blind. If a bomb-pot game has no active big blind, configure and label a reference BB before allowing BB display. Otherwise show chip values with an explanation. The app must never divide by zero or invent an invisible reference value.

## 6. Launch game modes

| Mode | Private cards and final-hand rules | Proposed launch defaults |
| --- | --- | --- |
| Texas Hold'em | Two cards; best five from private cards and board, using 0, 1 or 2 private cards. | One board; no-limit. |
| Omaha family | Four cards. Fixed uses exactly 2; Clean uses 1–2; Dirty uses 2–3. Fill the remainder of a five-card hand from the board. | One board; pot-limit by default, with no-limit as an explicit option. “Fixed” describes card use, not fixed-limit betting. |
| Crazy Pineapple | Three cards; discard one after the flop; remaining two play as Hold'em. | Discard before flop betting; this timing is shown in the rules. |
| Progressive Discard | Five cards; discard one after flop, turn and river; finish with two. | Discard before each street's betting; remaining cards play as Hold'em. |
| House Irish | Three cards; use 1 or 2 private cards in the final five-card hand; no discard. | One board; labelled as a house variant. |
| Multi-board Bomb Pot | Choose a compatible base card-use rule; all eligible participants contribute the set amount; skip preflop betting and deal the flop(s). | Two or three complete boards; divide each eligible pot equally across boards. Hold'em and fixed Omaha are initial supported bases. |
| Triple Number + Poker | Five cards partitioned into three number cards and two poker cards, with one normal board. | Number/poker split pot; detailed rules in section 7. |

### Board layouts

- **Separate full boards:** each board has its own flop, turn and river.
- **Shared flop and turn, multiple rivers:** four shared cards plus two or three distinct rivers. This is a separately named configuration and needs confirmation against the user's house rules.
- **Run it twice after an all-in:** not synonymous with either layout; deferred from the initial launch scope.
- Each layout must show how many cards are shared and how the pot is allocated.

### Deck and capacity

Proposed default: one 52-card deck, no jokers and no simulated burn cards. Dealt and discarded cards cannot be reused in the same hand.

Validate seat capacity against the maximum unique cards needed for the entire hand before starting. For example, eight players with five cards each plus three complete boards require 55 cards and must be rejected. Seven such players require 50 cards, so that combination fits if otherwise supported. Never silently add a second deck.

## 7. Triple Number + Poker specification

### Confirmed mechanics

1. The player holding the dealer button chooses the target before private cards are dealt.
2. The higher/lower rule is declared before dealing and remains visible throughout the hand.
3. Deal five private cards per player.
4. Run normal betting with one flop, turn and river.
5. After final betting, all remaining players privately allocate three cards to the number contest and the other two to poker.
6. Players lock their allocations; only after all eligible players are locked do reveals occur.
7. Half of each pot is awarded to eligible number winner(s), and half to eligible poker winner(s).
8. Ties split the relevant portion. A player can win both portions.

### Values and allocation

- For numbers, 2–9 represent their digits; 10, J, Q, K and A represent zero.
- For poker, all ranks retain normal poker meanings.
- The two sets are disjoint; every private card belongs to exactly one set.
- Proposed number interface: players can freely order the three selected cards into hundreds, tens and units. This ordering rule still requires confirmation.
- Proposed poker interpretation: the remaining two cards play as Hold'em, allowing 0–2 private cards in the final hand. Exact-two use is an open alternative.
- Leading zeros must remain visible, for example 009, even though its numeric value is 9.
- Do not automatically choose the “best” number allocation: sacrificing number strength to keep a stronger poker hand is part of the player's decision.

### Example

Target 999; cards are 9♠, 9♦, 8♣, A♥, K♥. One allocation makes 998 and reserves A♥ K♥ for poker. A different allocation may weaken the number while improving a particular poker hand on the board. The interface previews the player's own choices without revealing anyone else's.

### Payout example

For an eligible pot of 1,200 chips, the number portion is 600 and the poker portion is 600. If two players tie for the best number, each receives 300. If one of them also wins poker outright, that player receives 900 total and the other receives 300.

### Side pots and odd chips

- Split and evaluate each pot independently using only its eligible non-folded players.
- Proposed odd-chip convention: divide between number and poker first, assigning an indivisible extra chip to poker; divide tied portions next, assigning remainder chips in seat order clockwise from the dealer button. Display this convention in the rules.
- Board-split pots use a similarly declared order: earlier labelled board receives the first remainder chip, then tied winners use the seat order above.
- If everyone except one player folds, award the entire pot to that player without requiring number selection or a reveal.

### Hidden information and interruptions

- Show who has locked, but never reveal allocations or number values early.
- All-in players must still select their allocation. Normal automatic all-in card exposure is suppressed for this mode until lock-in completes.
- Locked selections are immutable and persisted, so refresh cannot change them.
- A disconnected player can return to their unfinished selection.
- For the private pilot, a missing selection pauses the reveal and presents recovery status. The public-release timeout/fallback policy remains an explicit decision; the software must not invent a selection or silently fold an all-in player.

### Scoring decision still unresolved

“Higher beats / lower beats” is not yet precise enough to implement a winner evaluator. It may mean either:

- Closest absolute distance wins, with higher/lower breaking equal-distance ties; or
- Only numbers on the specified side qualify or take priority.

Example: target 777 in higher mode, with candidates 776 and 780. Which wins? If selection is directional, also define what happens if nobody qualifies. This is a blocker for enabling Triple Number payouts, not a blocker for building standard poker infrastructure.

## 8. Optional 7–2 bounty

- Initial compatibility: two-card Hold'em only.
- Host enables it before a hand and chooses the bounty in chips or BB, converted to chips for that hand.
- Proposed rule: a player who wins the entire contested hand with unsuited 7–2, either by showdown or opponents folding, may claim the bounty by revealing both cards. Split-pot results do not qualify.
- Contributors are the other players dealt into that hand, including players who subsequently folded; the roster is frozen at hand start.
- Proposed no-debt rule: each contributor pays at most their available stack after normal pot settlement. Show any capped contribution; balances never become negative.
- These house-rule details require confirmation before release. Bounty transfers appear separately from pot winnings in history.

## 9. Variation builder requirements

### Editable rule components

- Private-card count and permitted final-hand private-card counts.
- Discard count, street and timing relative to betting.
- Compatible board layouts and board count.
- Normal blinds versus bomb-pot entry.
- No-limit or pot-limit betting where supported.
- Compatible bounty rules and amounts.
- Standard poker scoring or the dedicated Triple Number scoring module.

### Guardrails

- Number/poker partitioning is a dedicated module, not a generic text field interpreted by AI.
- Only tested combinations are enabled. Unsupported combinations explain what must change.
- Final poker hands must contain exactly five cards.
- Prevent contradictory discards, insufficient private cards, excessive deck usage and incompatible extras.
- Presets are versioned. Changing a saved preset never rewrites a hand already played.
- Current rules are immutable during a hand. Queue a changed preset for the next hand and visibly announce it to everyone.
- Changing to a lower-capacity game does not silently remove seated players; the host must resolve seating before the next deal.

## 10. Main user workflows

### A. A group starts its usual poker night

Host creates a room → chooses a saved preset → sets chips and blinds → shares link → guests enter nicknames → host admits them → players see rules → host starts.

Example: six friends join a 10/20 Hold'em game with 2,000 chips each. One player uses chips, another uses BB; both play the same game and see equivalent balances.

### B. The group changes games

Host selects another preset during the current hand → interface says “Next hand: Omaha Dirty” → current hand finishes under its original rules → new rule summary appears → next hand begins.

If the new mode needs fewer seats, dealing waits until the host resolves seating. No stack or hand is discarded to force the change.

### C. Players finish a Triple Number hand

River betting ends → everyone still eligible sees their five cards and allocation slots → each player selects and orders their three number cards → confirms remaining poker cards → locks → all selections reveal together → number and poker awards animate separately → result explains ties and side pots.

### D. A player loses internet

Connection indicator changes → normal action timer continues under the stated table policy → player reconnects using their session → server restores seat, stack, cards and current legal action.

Proposed normal betting timeout: check if legal, otherwise fold. Discard and Triple Number selection require their own declared timeout rules; they must not inherit betting auto-fold behaviour accidentally.

### E. A host makes a house variant

Open builder → duplicate Omaha → choose four private cards and 1–2 permitted cards → choose compatible board settings → read generated rules → name preset → save → share or queue for the next hand.

### F. A player adds chips or leaves

Request additional play chips → host approves → apply between hands → record addition separately from winnings. Leaving mid-hand is treated as sitting out/disconnecting, preserving already committed chips and eligibility for any all-in pots. Settle the hand before finalising the player's departure.

## 11. Problems and expected resolutions

| Problem or action | Expected product behaviour |
| --- | --- |
| A player thinks 3 BB means three chips. | Unit labels appear beside input and confirmation; show the exact chip equivalent. |
| Blinds change and the player's displayed BB stack falls. | Explain that chip balance is unchanged; only the conversion changed. Historical hands keep their original BB. |
| Player taps Raise twice on a slow connection. | Give the action a unique ID; server accepts it once and returns the same result for duplicates. |
| Old browser tab submits an action for the previous turn. | Reject the stale action, refresh state and explain that the turn has changed. |
| Someone opens their seat in two tabs. | One active controller per seat; the second tab can explicitly take over. Other tab becomes read-only. |
| A browser is refreshed after locking number cards. | Restore the same locked selection; no opportunity to change it. |
| Another player finishes selection faster. | Display “Locked”; reveal no cards or scores until all eligible players finish. |
| An all-in player disconnects before selecting number cards. | Preserve eligibility and pause selection in the pilot; expose the unresolved fallback policy before public launch. |
| A Crazy Pineapple player forgets to discard. | Block progression and show the required choice. A proposed timed fallback discards the last dealt eligible card, disclosed in rules; confirm before implementation. |
| A variant would require 55 cards. | Reject the setup and explain the maximum seat count or smaller board count needed. |
| A host changes the rules during a hand. | Queue changes for the next hand; current rules remain fixed. |
| Players tie on numbers and have different side-pot eligibility. | Resolve each pot separately, then split its number portion among eligible tied winners. |
| A player asks why their Omaha flush lost. | Highlight the winning five cards and explain the permitted private-card count. |
| A player claims a 7–2 bounty but another player has too few chips. | Apply the declared no-debt cap and show each contribution. |
| A stranger obtains an invitation link. | Require host admission; support room locking and invitation rotation. Links alone do not grant host privileges. |
| A nickname or chat message contains HTML/script. | Treat it as text, apply length limits, and prevent script execution. |
| A player spams chat or seat requests. | Rate-limit requests; host can mute or reject. Removing a seated player must preserve current-hand settlement. |
| The host closes their browser. | Live hand continues. An explicitly designated co-host can manage the room; never grant host access merely by nickname. Without one, pause between hands after a grace period. |
| The dealer-button player is absent before choosing a target. | Wait or mark that player sitting out before dealing and assign the next eligible dealer consistently. Never choose after looking at cards. |
| The server restarts mid-hand. | Restore the last committed state and accepted actions; never reshuffle an already-started hand. |
| State cannot be recovered safely. | Stop dealing and show a recoverable error. If rollback is required, restore the pre-hand chip snapshot as an atomic, logged cancellation; never guess payouts. |
| Free hosting limits are reached. | Stop accepting new rooms before capacity is exhausted where possible; clearly report availability problems and preserve persisted state. Free tiers do not guarantee uninterrupted service. |
| A mobile player accidentally hits All-in. | Separate high-impact controls and offer a confirmation for the All-in shortcut; do not permit undo after an accepted action reveals information. |

## 12. Reliability, fairness and privacy

- The server is authoritative for deck order, actions, timers, winners and balances.
- Use a cryptographically secure source of randomness and an unbiased shuffle. Do not claim independent RNG certification without obtaining it.
- Only send a player's own private cards and permitted public information to their browser. Hiding opponent cards visually is insufficient.
- Host controls do not expose opponents' cards, the undealt deck or private allocations.
- Persist enough state to recover accepted actions and ongoing hands.
- Keep a chip ledger: ordinary gameplay conserves chips; explicit host additions/removals are separately recorded.
- Protect reconnect sessions; an invitation code or nickname alone cannot reclaim another player's seat.
- Rate-limit room creation, joining, chat and game actions.
- Limit stored personal information; start with nicknames and minimal session data.
- Give histories and presets explicit retention policies. Do not log hidden cards into public analytics or routine error messages.
- Private rooms reduce exposure to strangers but cannot prevent friends from sharing their own cards outside the website; do not promise complete collusion prevention.

## 13. Design requirements

- Original visual design inspired by useful interaction patterns, without copying another site's branding or assets.
- Proposed palette: charcoal background, deep green felt, warm white cards and restrained gold highlights.
- Large card ranks, distinct suit shapes and optional four-colour deck.
- Clear focus indicators, keyboard-accessible controls and readable text contrast.
- Support narrow mobile screens without horizontal scrolling for essential actions.
- Keep action buttons stable while pot or card animations play; avoid accidental target movement.
- Respect reduced-motion preferences; sound and animations have personal toggles.
- Explain complicated outcomes through highlighted cards and concise text, not animation alone.
- Show a small permanent indicator for current game and important constraints, such as “Use exactly 2” or “Numbers: A/K/Q/J/10 = 0”.

## 14. Implementation and verification plan

### Proposed structure

- React/TypeScript for the browser interface.
- A separate, testable rules engine for dealing, legal actions, card evaluation and payouts.
- Server-managed live rooms, with Cloudflare Workers and Durable Objects as the proposed hosting approach.
- Persistent room state, chip ledger, preset versions and hand records.
- Verify deployment support and current service allowances before committing to the final hosting route. This document does not promise a particular concurrent-player capacity.

### Required verification

1. Hand evaluation for each permitted private-card count, including board-only Hold'em hands, straights, flushes and ties.
2. Betting legality: heads-up order, blinds, minimum raises, pot-limit maxima, short all-ins and when action reopens.
3. Main pots, multiple side pots, uncalled bet returns, folded contributors, board splits and odd chips.
4. Number scoring against confirmed higher/lower rules; card partition validity and simultaneous reveal.
5. Discard timing, all-in runouts that still require discards, and exhaustion prevention.
6. Duplicate actions, stale actions, concurrent tabs, reconnects and server recovery.
7. Proof that another player's hidden cards do not appear in client messages, public logs or spectators' views.
8. Chips/BB conversion, rounding, exact betting input, changed blinds and historical display.
9. Multi-device sessions and a sustained session test under the intended pilot load.

### Release conditions

- No known incorrect payout, chip-loss or hidden-card leak remains unresolved.
- Every enabled preset has documented rules and meaningful test cases.
- All server decisions that affect chips are traceable in the hand/ledger record.
- Open scoring and timeout decisions are resolved for any affected mode enabled in the release.
- Verification limits and remaining issues are documented honestly; a visual demo is not described as working multiplayer.

## 15. Decisions still required

| Decision | Current status | Impact |
| --- | --- | --- |
| Higher/lower number comparison | Unresolved: tie-breaker versus directional qualification/priority. | Blocks Triple Number winner evaluation. |
| No qualifying number, if directional | Unresolved and dependent on the above. | Blocks complete payout rules. |
| Number ordering and allowed targets | Proposed: freely order digits; confirm whether only repeated targets such as 777/999 are allowed or any three-digit target. | Affects target UI and number evaluation. |
| Triple Number poker card usage | Proposed: normal Hold'em, using 0–2 of the reserved cards. | Changes poker winners. |
| Selection/discard timeouts | Pilot number selection pauses; deterministic discard fallback proposed. Public fallback requires agreement. | Prevents stalled rooms and unfair silent decisions. |
| Exact multi-river house layout | Full boards supported; confirm any shared-card variant. | Changes dealing and deck capacity. |
| 7–2 bounty trigger/contributors/payment cap | Proposed in section 8. | Changes chip transfers. |
| Odd-chip convention and no-burn deck | Proposed defaults above. | Must be shown consistently and tested. |
| Branding and final visual direction | Working palette proposed; name undecided. | Does not block engine development. |

The implementation can begin with standard poker and the room foundation while these choices are settled. Affected custom modes remain disabled until their rules are complete.

## 16. Reference material and boundaries

- User-provided Shuflr screenshot: personal **Chip values / Big blinds (BB)** display preference.
- Shuflr game descriptions: https://shuflr.club/games/poker
- Standard Omaha reference: https://www.pokerstars.com/poker/games/omaha/
- Poker Now feature reference: https://www.pokernow.com/
- Proposed infrastructure pricing references: https://developers.cloudflare.com/workers/platform/pricing/ and https://developers.cloudflare.com/durable-objects/platform/pricing/

References inform comparisons and standard rules. The user's explicit house rules take precedence. Competitor claims are not proof of implementation quality, market demand or available free hosting capacity.
