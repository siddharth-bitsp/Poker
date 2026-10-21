# Your Table, Your Rules
## Product requirements, business strategy and project roadmap

**Owner:** Sid  
**Working title:** Your Table, Your Rules — final brand name undecided  
**Version:** 0.2, 15 October 2026  
**Status:** Pre-development; no website has been built or deployed.

> A free online poker room where friends can recreate their house games, understand every rule and result, and keep playing together wherever they live.

### About this document

This document explains the entire project: why it exists, who it serves, what will be built, how players will use it, how it could earn money, and what would justify investing more time.

**Confirmed** requirements come from Sid. **Proposed** choices are recommendations. **Hypotheses** must be tested with users. Recommendations are not automatically accepted house rules or commercial commitments.

The seven-mode product vision remains intact. Smaller releases are recommended so real playtesting begins early. The [original detailed specification](PRD-v0.1-archive.md) is preserved as a reference; this version takes precedence wherever scope, sequencing or defaults differ.

### Reading guide

- Sections 1–5: purpose, audience, goals and competitors.
- Sections 6–10: releases, games, features, workflows and problem handling.
- Sections 11–15: future ideas, revenue, costs, growth and success measures.
- Sections 16–18: responsibilities, delivery requirements and open decisions.

## 1. The idea and its origin

Sid and his friends used to play poker together in their hostel. After returning to their homes, they started using online rooms to keep playing. Some services charge for additional features, and available game formats do not always match the variations the group plays in person.

Their games include Clean, Dirty and Fixed Omaha; an Irish house variant; progressive discards; multi-board bomb pots; and a hybrid number-and-poker game. These rules are part of the group's shared experience.

The immediate goal is personal and practical: recreate those evenings online. The longer-term ambition is to serve other groups with similar needs, keep gameplay free, and earn enough to sustain and potentially grow the product.

Sid has tested Shuflr and likes it. That establishes a useful product benchmark. It also raises the standard: the new product must give groups a meaningful reason to switch beyond a different appearance.

## 2. Problem statement

**Friends who play poker with house rules struggle to reproduce their games online without compromising rules, paying for selected features, or making the organiser manage workarounds.**

An organiser wants to say, “Let's play our usual game,” share a link and begin. Players want familiar rules, confidence in the results and an enjoyable evening. They should not have to translate local names into a platform's terminology or manually resolve special payouts.

| Problem | Effect on players | Proposed response |
| --- | --- | --- |
| Exact house variant is unavailable | Favourite games are abandoned or improvised outside the app. | Supported house presets and a constrained variation builder. |
| Useful extras cost money | The organiser pays or persuades the group to compromise. | Free rooms, supported game modes and basic customisation. |
| Names such as “Irish” mean different things | Players disagree about the rules. | Explicit card-use, discard and payout summaries. |
| Complex payouts are unclear | Confusion and distrust interrupt the evening. | Explain each pot and highlight winning cards. |
| Joining, mobile controls or reconnecting is difficult | The organiser becomes technical support. | Guest links, recoverable seats and readable controls. |
| Setup repeats every week | Starting the game takes unnecessary effort. | Named, saved and shareable presets. |

These problems are grounded in the founder's experience and product analysis. Their frequency across other groups is not yet known. The PRD is a proposal for solving them, not evidence of a large market.

## 3. Vision, goals and principles

### Vision

Become the place friend groups choose when they want their own version of poker, with straightforward setup and reliable play.

### Goals

| Horizon | Goal | Evidence |
| --- | --- | --- |
| First playable version | Sid's group completes a normal poker night. | A sustained session works across separate devices without corrupted hands or balances. |
| External test release | Other organisers recreate meaningful house games. | They run sessions without the founder guiding every step. |
| Product validation | Groups repeatedly choose the product. | Returning sessions and recurring use of custom rules. |
| Sustainability | Cover operating costs while preserving free gameplay. | Measured revenue, costs and retention after monetisation tests. |
| Longer term | Build a trusted home for custom social card games. | More retained groups, useful shared presets and manageable support work. |

### Product principles

1. **Gameplay stays free.** Core rooms, supported variants and basic variation creation should not become surprise paywalls.
2. **Correctness earns trust.** A good-looking table cannot compensate for a wrong winner or lost chips.
3. **Start simple, reveal depth.** Presets are the default path; advanced settings appear when needed.
4. **Explain the rules.** Everyone should know what game is active, what action is required and why a hand won.
5. **Protect the shared evening.** One player's connection problem or ad should not strand the whole table.
6. **Build from actual sessions.** Fix observed problems before expanding an untested feature list.

### Initial boundaries

The proposed initial product uses play chips. It excludes cash deposits, withdrawals, cash settlement and rake. Native apps, public matchmaking, bots, multi-table tournaments and built-in video are deferred. These are scope choices, not a legal clearance for every possible use.

## 4. Audience and reasons to use the product

The initial audience is existing adult friend groups who already play and have an organiser. Hostel and college alumni living apart are a practical starting community because Sid understands their situation directly.

| Person | Main need | Desired outcome |
| --- | --- | --- |
| Organiser | Configure, invite and keep the session moving. | “I saved our rules once; starting next week is easy.” |
| Casual friend | Join and know what to do next. | “I didn't need an installation or a long explanation.” |
| House-rule enthusiast | Adjust cards, discards or boards. | “The app supports our actual version.” |
| Returning player | Recover a seat and inspect results. | “My connection dropped, but my chips and hand were intact.” |

### User stories

- When our friends live in different cities, we want one invitation link so we can play together that evening.
- When the group changes games, players want the new rules announced before the next hand.
- When a hand has several winners, players want to understand how each pot was divided.
- When a host invents a variant, they want to start from a familiar preset and change a few settings.

### Hypotheses to test

Enough groups share the need for unusual rules; those rules are a strong enough reason to switch; useful variations can be expressed through a manageable settings interface; and some revenue mechanism can cover costs without hurting the experience. None of these is proven yet.

## 5. Competitors and positioning

The following official pages were reviewed on **15 October 2026**. Capabilities are advertised, not independently verified in full live sessions. Missing documentation does not establish that a feature is absent. Prices and availability can change.

| Competitor | Relevant offering and pricing | Implication |
| --- | --- | --- |
| **Poker Now** | Basic hosting is free. Plus lists US$9.99/month or US$69.60/year; special features such as bomb pots, double boards and 7–2 bounty have coin access on Basic and unlimited access on Plus. [Pricing](https://www.pokernow.com/subscription/plus?no_redirect=true) | A benchmark for private rooms; free extras may help but are not unique. |
| **Shuflr** | Free private browser games, multiple variants, progressive discards and double boards. Cosmetic pass ₹99/24 hours; clubs start at ₹499/month. [Games](https://shuflr.club/games/poker) · [Pricing](https://shuflr.club/premium) | Closest reference. Exact house rules and usability must earn the switch. |
| **Pokerrrr 2** | Private games and clubs. Hosting uses gold: ordinary games charged hourly, tournaments per game. [FAQ](https://www.pokerrrrapp.com/faq) | Hosting cost is a specific frustration to investigate with organisers. |
| **PokerStars Home Games** | Private clubs, saved setups, scheduling and multiple formats. Advertised as free to use; instructions describe downloaded software. [Overview](https://www.pokerstars.com/poker/home-games/) | Organising clubs and saving setups are established capabilities. |
| **Poker Friends** | Private rooms, adjustable blinds/stacks, chat and browser/app access. Advertises free and ad-free play. [Website](https://pokerfriends.online/en) | Free poker rooms alone are not sufficient differentiation. |

### Positioning statement

**For friend groups whose poker nights include house rules, this product is a private browser room that makes those rules playable, understandable and reusable.**

The proposed advantage is exact house-rule support combined with clear explanations and dependable play. Clean/Dirty Omaha settings and Triple Number are useful early examples. Their commercial value remains a hypothesis; this document does not claim global uniqueness.

Avoid claims that all competitors charge, none offer variants, or this is the first custom poker platform. “Better UI” must be demonstrated through successful tasks, not asserted from a colour palette.

A collection of tested presets, a reputation for reliability and strong relationships with organisers could become lasting advantages. Features are copyable; the project does not currently have an established competitive moat.

## 6. Scope and release plan

| Release | What it contains | Condition for advancing |
| --- | --- | --- |
| **R0: Rules and design** | Resolve critical rules; map joining, playing and special showdowns; choose a visual direction. | Players understand the sample flows and results. |
| **R1: First playable version** | Hold'em, private rooms, guest joining, host controls, betting/payouts, reconnects, Chips/BB display and basic history. | Sid's friends complete a full session without a critical integrity error. |
| **R2: External test release** | Omaha Fixed/Clean/Dirty, Progressive Discard and specified Triple Number; save supported settings as presets. | Independent groups use the house rules and return. |
| **R3: Full initial feature set** | House Irish, Crazy Pineapple, multi-board bomb pots, 7–2 bounty and an expanded variation builder. | Every enabled combination works and is understandable without founder assistance. |
| **R4: Growth and sustainability** | Selected recurring-group features and limited monetisation experiments. | Evidence supports the added cost and complexity. |

The smaller release order is a recommendation; all seven requested modes remain in the product vision. These are milestones, not calendar promises. Estimate dates after R1 reveals actual development pace.

**Prioritisation:** fix incorrect play, privacy failures and blocked sessions first; improve joining and confusing rules next; add variations based on demonstrated demand. Private testing starts at R1 and continues throughout development.

## 7. Game modes and house rules

| Mode | Intended rules |
| --- | --- |
| **Texas Hold'em** | Two private cards; one board; best five-card hand using 0–2 private cards. |
| **Omaha family** | Four private cards. Fixed: exactly 2; Clean: 1–2; Dirty: 2–3. Remaining cards in the five-card hand come from the board. |
| **Progressive Discard** | Five private cards; discard after flop, turn and river; finish with two. |
| **Triple Number + Poker** | Five cards divided into three for numbers and two for poker; one board; split pot. |
| **House Irish** | Three private cards; use one or two in the final five-card hand; no discard. |
| **Crazy Pineapple** | Three private cards; discard one after the flop; continue with two. |
| **Multi-board Bomb Pot** | Everyone contributes the agreed amount; skip preflop betting; play two or three boards and split eligible pots. |

“Fixed” describes Omaha card use, not fixed-limit betting. Proposed defaults are no-limit Hold'em, pot-limit Omaha, and discards before that street's betting. Betting alternatives and discard timing must be explicit; these defaults are not confirmed house rules.

### Triple Number: confirmed mechanics

1. The dealer-button player chooses the target before dealing.
2. Higher/lower is declared beforehand and remains visible.
3. Deal five private cards to each player.
4. Play normal betting with one flop, turn and river.
5. After final betting, remaining players privately allocate three number cards and two poker cards.
6. Lock allocations; reveal only after everyone eligible has finished.
7. Half of each pot goes to eligible number winners and half to eligible poker winners. Ties split the relevant portion.

For numbers, **10, J, Q, K and A equal zero**, while 2–9 retain their digits. Poker ranks remain normal. The two sets cannot overlap.

**Example:** with 9♠ 9♦ 8♣ A♥ K♥, a player can make 998 and retain A♥ K♥ for poker. A different allocation may sacrifice number strength to improve poker. Do not automatically choose the allocation for them.

**Payout example:** a 1,200-chip pot gives 600 to numbers and 600 to poker. Two tied number winners receive 300 each. One player winning poker receives another 600, even if they also won a number share.

**Unresolved:** higher/lower may be an equal-distance tie-breaker or a directional qualification rule. For target 777 in higher mode, does 776 beat 780 because it is closer, or does 780 win because it is higher? Also confirm target restrictions, free digit ordering, what happens when nobody qualifies, and whether the poker portion uses normal Hold'em card use or exactly two cards. No payout implementation may invent these answers.

### Boards and bounty

Separate complete boards, a shared flop/turn with multiple rivers, and repeated all-in runouts are different configurations. Full two/three-board bomb pots are planned; shared-river house details need confirmation. Run-it-twice is a future candidate.

7–2 bounty begins as a Hold'em extra. Before enabling it, specify suited/unsuited eligibility, qualifying wins, required reveal, contributors and payment caps. A no-debt cap is proposed, not a universal rule.

## 8. Features and requirements

### Private rooms

Create a room, choose a nickname, share a link/code and admit friends. Proposed capacity is 2–9, reduced by deck requirements. Host admission, room locking and invitation rotation protect private play. A nickname or invitation alone cannot reclaim another person's seat or grant host privileges.

### Table and betting

Show private cards, boards, stacks, bets, main/side pots, dealer and active player. Display legal actions only. Clearly label raise-to versus raise-by amounts. All-ins, uncalled bet returns and split pots must settle correctly. Accepted actions happen once, including after retries.

### Chips / Big Blinds display

Each player chooses **Chip values** or **Big blinds (BB)** independently. At a 20-chip big blind, 2,000 chips becomes 100 BB and a 150-chip pot becomes 7.5 BB. This changes presentation only.

Apply units consistently to stacks, pots, calls, bets and input labels. Store exact integer chips internally. BB values may display to two decimals, but payouts never use rounded values. Show exact chip equivalents on demand. If a BB input cannot convert exactly into legal chip increments, show the proposed chip amount for confirmation instead of silently rounding.

Remember the preference locally. Historical hands use their original blind; new hands use the new blind. A bomb-pot-only room must have an explicit reference BB or use chip display alone.

### Explain rules and results

Keep important constraints visible: “Use exactly 2,” “Discard one,” or the current number target. Use short examples to teach unfamiliar modes. At showdown, highlight valid winning cards and explain each number, board and side-pot award.

### Customise and save a game

Start from a preset; edit compatible private-card counts, permitted card use, discard stages, boards, betting and extras. Show a live explanation, then let the host name and save the preset. Add shareable, versioned presets as the builder expands.

Only tested combinations are enabled. The builder is not an unrestricted AI rules interpreter. Prevent contradictions, insufficient cards and deck exhaustion. Updating a preset does not modify a running hand or historical rules. Pilot guest ownership does not imply cross-device recovery; persistent accounts are a later enhancement.

### Host controls and history

Hosts can admit players, manage seating, pause, queue next-hand changes and approve chip adjustments. Balance changes apply between hands and are logged separately from winnings. Hosts cannot inspect opponents' cards or the deck.

Show recent actions and a session summary of starting chips, additions/removals, net results and ending stacks. Proposed pilot history retention is seven days; the actual policy must be displayed. Basic history and recovery remain free core functions.

### Social, visual and accessibility requirements

Start with text chat and presence indicators; friends can continue using their existing voice-call app. Keep mobile actions readable, stable and easy to tap. Support keyboard focus, reduced motion, sound controls and suit identification without colour alone.

Use an original visual design. The current suggested direction is a dark background, green felt and readable cards with restrained highlights. Select a mockup direction before substantial frontend work; visual quality is judged by successful play, not decorative complexity.

## 9. Workflows and examples

**Start a night:** host creates a room → selects preset/chips → reviews rules → shares invitation → friends enter nicknames → host admits them → players see rules → deal.

Example: six former hostel friends play 10/20 Hold'em with 2,000 chips. One views 100 BB while another sees 2,000 chips. Their game state is identical.

**Change games:** host selects Dirty Omaha → banner says “Next hand” → current hand settles → new rules become active → next deal. A change requiring fewer seats waits for seating to be resolved.

**Triple Number showdown:** final betting ends → players arrange three number slots and two poker slots → preview privately → lock → reveal together → display separate awards. Showing that someone has locked must not reveal their choices.

**Reconnect:** connection drops → table marks reconnecting → the declared timeout policy applies → protected session restores seat and hand → accepted actions are not repeated.

**Create a variant:** duplicate Omaha → set allowed private-card use to 1–2 → read the generated explanation → save “Hostel Clean” → reuse next week.

**End the evening:** finish the current hand → settle every pot → show a play-chip summary → optionally save the preset → leave. This is not a cash payment or debt-settlement workflow.

## 10. Problems and recovery

| Problem | Required response |
| --- | --- |
| Double-tap Raise or resend after a connection issue | Process the uniquely identified action once. |
| Old tab acts on the previous turn | Reject the stale action and refresh state. |
| Two tabs control the same seat | Explicit takeover; only one controller at a time. |
| Normal betting timeout | Proposed: check if legal, otherwise fold; disclose before play. |
| All-in player misses Triple Number selection | Preserve eligibility and pause for recovery in the pilot. Agree a finite public-release fallback; do not silently fold them or invent a selection. |
| Refresh after locking allocation | Restore the same immutable selection. |
| Required discard is missing | Show the required choice; follow only an agreed timeout policy. Automatic last-card discard is an unapproved option. |
| Eight players request five cards and three complete boards | Reject: 40 private cards plus 15 board cards exceeds a single deck. Explain the valid capacity. |
| Ties and multiple side pots | Evaluate each pot among its eligible players, then split its number/board portions. |
| Indivisible odd chip | Use a declared deterministic rule and explain the extra chip. |
| Host disconnects | Continue the live hand; use explicitly delegated co-host authority or pause between hands after a stated grace period. |
| Dealer absent before choosing target | Resolve participation/dealer position before dealing; never choose after seeing cards. |
| Player leaves mid-hand | Preserve committed chips and all-in eligibility; settle before removing the seat. |
| Unwanted guest or spam | Admission controls, mute/reject actions and rate limits; removal cannot corrupt a running hand. |
| Server restart | Restore committed state without reshuffling or duplicating payouts. |
| State cannot be recovered safely | Stop play and preserve evidence. Any exceptional cancellation restores the full pre-hand snapshot atomically and is logged. Never offer a routine player-controlled undo after information is revealed. |
| Ad absent or delayed for one player | A bounded shared-break policy prevents the table waiting indefinitely. |

Proposed deck default is one 52-card deck with no simulated burns or jokers. Confirm the default before implementation. Dealt/discarded cards cannot be reused within a hand. Validate the maximum cards needed, not just the first deal.

## 11. Future product opportunities

These are candidates, not promises. Add them when repeated user behaviour justifies the development and operating cost.

| Opportunity | Benefit | Evidence needed before prioritising |
| --- | --- | --- |
| Persistent groups and optional accounts | Save members, preferred rules and sessions across devices. | Regular groups return and ask for continuity. |
| Dealer's-choice rotations | Automatically rotate agreed presets by hand or orbit. | Groups repeatedly change games manually. |
| Shared preset library | Discover, copy and adapt tested house rules. | People already share private presets; moderation and versioning are ready. |
| Custom themes and card backs | Give a group its own identity. | Players ask for personalisation without compromising card readability. |
| Season statistics and friendly awards | Give recurring groups a shared history. | Organisers use basic summaries and request longer-term records. |
| Accessible hand replay | Revisit decisions and resolve questions. | Players regularly inspect completed hands. Hidden-card privacy is preserved. |
| Recurring game reminders | Help groups organise their next evening. | Scheduling is a repeated problem and users opt in. |
| More variants and board layouts | Serve additional house-game communities. | Several groups request the same well-defined rules. |
| Run-it-twice | Support a specific all-in convention. | Demand justifies eligibility, consent and payout complexity. |
| Localisation | Make rules and controls understandable to more groups. | Sustained demand in a language the team can support. |
| Installable browser app | Easier return visits from a phone's home screen. | Mobile repeat use is strong. |
| Voice/video | Bring conversation closer to the table. | Existing call apps create material friction and usage can fund media costs. |
| Tournaments and larger clubs | Serve organised recurring events. | Reliable single-table play and organiser demand justify a separate project. |

The most valuable early expansion may be better preset reuse and result explanations rather than more game names. A feature should reduce friction, increase repeat use or support sustainability; novelty alone is insufficient.

## 12. Ways to earn without compromising the product

### Commercial objective

First cover operating costs. Then establish whether the product can compensate ongoing development and support. Core gameplay remains free; no revenue mechanism is selected yet.

Sid's current preference is to make features free and consider advertising. Optional paid ideas below are alternatives to evaluate, not permission to paywall requested features. If the intended promise becomes “every feature, including cosmetics, is free,” remove paid-feature options and rely on sponsorship, voluntary support or approved advertising.

| Option | How it earns | Trade-off | Recommended status |
| --- | --- | --- | --- |
| **Voluntary supporter payments** | People contribute because they value the service; recognition can be optional. | Unpredictable and may not cover costs. Payment fees apply. | Low-pressure early experiment after repeat use. |
| **Direct sponsorship** | A relevant brand pays for a labelled placement or sponsored theme. | Needs a credible audience, sales work and brand controls. | Explore after audience and engagement are measurable. |
| **Display ads outside active play** | Approved ad inventory on useful public pages or suitable lobby surfaces. | Revenue depends on eligible views, geography, demand and blockers. | Test carefully; do not fill the table with banners. |
| **Between-hand game ads** | Approved interstitial inventory at a natural break. | Can interrupt a group and create unequal waiting. | Later experiment, not a launch dependency. |
| **Cosmetic purchases** | Optional themes, card backs or personalised table appearances. | Requires revising an all-features-free promise if that is the final commitment. | Optional alternative only; no gameplay advantage. |
| **Supporter subscription** | Voluntary recurring support, possibly with cosmetic recognition or ad removal. | Conversion is unknown; must not create core game restrictions. | Consider after groups ask how to support the product. |
| **Services for communities** | Custom branding, event setup or separately scoped organisational services. | Adds sales and service work; risks distracting from the main product. | Long-term option, not initial scope. |

Do not charge for better cards, stronger odds, access to opponents' information, basic reconnects, fair payouts or core house variants. Avoid making players watch an ad to take their turn, recover a seat or unlock their chip balance.

### The “ad after every five hands” idea

Keep this as a testable hypothesis. Five hands can take very different amounts of time, and full-screen interruptions can affect everyone at once. An ad trigger is not a guaranteed filled or paid impression.

For example, a 100-hand session would create 20 potential breaks under a strict five-hand rule. If each added 15 seconds, that is five minutes of interruption per player, before loading or synchronisation delays. This is illustrative arithmetic, not a measured session average.

A future experiment should compare a no-ad baseline with limited natural breaks. Define a minimum time between breaks, a session cap, no interruptions during actions or selections, and bounded handling when an ad fails. Measure completed sessions, complaints and returning groups as well as revenue. Start with one policy rather than exposing hosts to many ad controls.

Google's H5 Games ad product requires application and approval, including an approved AdSense account. The placement system considers frequency and ad availability; access and serving are not guaranteed. Ordinary banner placements have separate policies, including restrictions on automatic refresh. [H5 Games eligibility](https://developers.google.com/ad-placement/docs/signup) · [Placement behaviour](https://developers.google.com/ad-placement) · [AdSense placement rules](https://support.google.com/adsense/answer/1346295?hl=en)

### Revenue scenarios: assumptions, not forecasts

Use a simple model before investing in advertising:

**Monthly ad revenue = group sessions × players per session × eligible opportunities per player × fill rate × realised revenue per 1,000 served impressions ÷ 1,000.**

Illustration: 500 active groups × 4 sessions × 6 players × 4 opportunities × 50% fill gives 24,000 served impressions. At an assumed ₹100 per 1,000 served impressions, that is **₹2,400 per month**, before operating costs and other deductions. None of those assumptions is a forecast or industry benchmark. Actual revenue could be materially different or zero if the site is not approved.

Alternative illustrations: 100 voluntary supporters contributing ₹99/month generate ₹9,900 gross; 200 cosmetic purchases at ₹49 generate ₹9,800 gross. These examples show the arithmetic, not likely demand. Include payment fees, taxes, refunds and the effort needed to acquire supporters when assessing net results.

The decision is not simply “can we place ads?” It is whether measured revenue covers the cost of serving the audience without reducing the reason they came.

## 13. Costs and operating model

### Early planning budget

The figures below are allowances for a self-built, lightweight browser product. They exclude the value of the founder's time, hired developers, paid coding tools, legal advice, marketing and business administration.

| Item | Planning allowance | Qualification |
| --- | --- | --- |
| Development on an existing computer | ₹0 additional with free tools | Time and existing subscriptions are not free economic resources. |
| Small friends-only hosting pilot | Potentially ₹0/month | Depends on implementation and remaining free quotas. |
| Custom domain | Roughly ₹1,000–₹2,000/year | Optional estimate; check chosen name, renewal and taxes before purchase. |
| Small public beta infrastructure | Set aside roughly ₹500–₹3,000/month | Not a quote or capacity guarantee; measure the actual system. |
| Paid assistance and professional services | Separately scoped | Obtain estimates against a specific milestone, not “build a poker site.” |
| Growing audience | Usage-based budget | Concurrent tables, storage, logs and session behaviour determine cost. |

Cloudflare Workers has a free tier; its paid plan starts at US$5/month with usage charges where applicable. Durable Objects are also available on the free tier, with limits; exceeding free allowances can cause operations to fail. These facts support trying a low-cost pilot, not promising an unlimited free service. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

### Measure the cost of the service

- Server cost per completed group session and per active table-hour.
- Storage and log growth per week.
- Peak simultaneous tables and players.
- Support minutes per active group.
- Failure rate and recovery effort.
- Gross revenue, payment fees and net contribution to infrastructure.

Infrastructure break-even occurs when net receipts cover infrastructure and other operating expenses. It does not mean the business pays for the founder's labour. For example, hypothetical ₹2,000 monthly infrastructure requires at least ₹2,000 after payment costs merely to cover that line item.

### Keep early costs controlled

Use a provider subdomain during testing; keep history retention explicit; avoid integrated video; avoid AI calls in ordinary gameplay; limit admission to the pilot cohort; monitor usage before opening access more broadly. Preserve private cards in neither public analytics nor unnecessary logs.

### Product and legal classification

Before a public launch, choose the intended countries and operating model. For an India-focused launch, the 2025 online-gaming Act and 2026 rules make the distinction between social games and money games material. Get advice on the actual product and its intended use, including whether features facilitate outside stakes. A “play money” label or lack of a wallet is not by itself a legal assessment. [Official Act](https://www.meity.gov.in/static/uploads/2025/10/8a7f103cefc68ed8aaa2ebc9a2ed7c13.pdf) · [2026 rules](https://www.meity.gov.in/static/uploads/2026/04/7e0b02d37fd07f81fa48578a9996aa85.pdf)

## 14. Finding the first users

### Start with organisers

The organiser is the most efficient starting contact because they already bring a group. Begin with Sid's friends, then other hostel/alumni groups and independent home-game organisers. Recruit adults who already play; do not assume an individual signup represents a functioning group.

### Discovery conversations

Ask about behaviour, not whether the idea sounds good:

1. What did your group play during its last two sessions?
2. Which site did you use, and why?
3. Which house rule could you not reproduce?
4. What workarounds or payments did that cause?
5. What would stop your group from trying another site for one evening?

Record the current alternative and the exact unmet rule. Invite groups to try the product when that rule works. Avoid collecting a large waitlist for features that do not exist.

### Acquisition experiments

| Experiment | What to show | What to measure |
| --- | --- | --- |
| Founder-led test nights | One working house game and a simple invitation. | Completed sessions and independently organised return visits. |
| Short demonstrations | Create a custom preset or finish a Triple Number showdown. | Organisers who proceed to a real group session. |
| Community posts, where allowed | Specific rules and an honest invitation to test. | Qualified group trials, not likes. |
| Searchable rule guides | Clear explanations with playable supported presets. | Visitors who create rooms that actually start. |
| Preset sharing | Let satisfied organisers share useful configurations. | Another group using the preset and returning. |

This section proposes outreach; it does not authorise sending messages or posting publicly without Sid's direction.

### Market sizing

Do not invent a total addressable market from the global poker industry. Begin with a reachable pool of organisers, the fraction with a relevant unmet need, the fraction that activates, and the fraction that returns. Use those observations to estimate a reachable audience and its economics. The initial hypothesis is a focused community product; a large business is a possibility to test, not an established conclusion.

## 15. Measurement and decision criteria

### Main measure

**Weekly returning groups that complete a meaningful session.** Proposed definition: a group with at least three human players completes at least ten hands and has completed a session previously. Track heads-up use separately rather than declaring it invalid. These definitions are measurement choices, not game restrictions.

| Measure | Definition / purpose |
| --- | --- |
| Room activation | Created rooms reaching a first completed hand with at least three human players. |
| Joining friction | Time from invitation open to seated, plus failure/abandonment rate. |
| Repeat use | Share of activated groups that play again in subsequent weeks. |
| Custom-rule value | Sessions using a house preset and the organiser's stated reason for choosing it. |
| Independence | Sessions completed without founder intervention. |
| Reliability | Incorrect payouts, state failures, reconnect success and forced cancellations. |
| Understanding | Questions/disputes about rules and result explanations. |
| Economics | Infrastructure cost per session and net revenue per active group. |

Suggested analytics events include room created, guest admitted, first hand completed, preset applied, reconnect succeeded, session completed and result explanation opened. Never include opponents' hidden cards, chat content or private selections in general analytics.

### Four-week external pilot

Recruit ten independent groups once R2 is usable. Proposed positive signal: at least five groups return in three of the four weeks; several repeatedly use a house feature; and organisers can run sessions unaided. These thresholds are practical decision aids, not validated industry benchmarks.

**Continue:** groups return for a specific benefit, integrity holds and support/costs are manageable.

**Adjust:** people try it but get stuck, misunderstand rules or return to competitors. Identify whether the cause is reliability, joining, missing rules or lack of meaningful advantage before adding features.

**Pause expansion or reconsider:** even after the main usability/reliability issues are repaired, independent groups do not return, custom features go unused, or there is no acceptable way to fund the service. Sid may still keep it as a useful personal project; a product can succeed for friends without becoming a business.

## 16. Who does what

### Sid: founder and product owner

- Own the vision, free-feature promise and scope priorities.
- Explain house rules with actual hands, especially ambiguous scoring and payouts.
- Choose the brand and visual direction.
- Recruit organisers, observe sessions and collect direct feedback.
- Decide which problems deserve work and which requests wait.
- Own hosting/domain accounts, budgets, business decisions and public communications.
- Choose any revenue experiment and obtain professional advice where needed.

### Design and development work

- Translate confirmed rules into a clear interface and tested game logic.
- Build server-authoritative rooms, private-card handling and recovery.
- Implement mobile controls, Chips/BB conversion, presets and results.
- Verify payouts, edge cases and multiplayer behaviour.
- Measure usage, repair failures and keep requirements current.

Software assistance can produce designs, code and tests. It does not replace the founder's rule decisions, user research, real group playtesting or responsibility for running the service.

### Test groups

Play realistic sessions, report what happened before a failure, explain confusing rules, and say honestly whether they would use the site again. Feedback from independent groups matters because the founder's friends may tolerate problems that other users will not.

### Working routine

Keep one short backlog: current integrity problems, current usability problems, next validated feature, and later ideas. After each test night, review what prevented play, what required explanation, what participants valued and whether they scheduled another session. Update priorities before starting more features.

## 17. Delivery, quality and launch requirements

### Proposed implementation

Use a responsive browser interface, a separate rules engine, a server that controls each live room, and persistent state for recovery and records. React/TypeScript and Cloudflare Workers/Durable Objects are a candidate implementation, subject to deployment support and measured limits. Accounts are optional for first play; secure guest sessions are still required.

The server controls shuffling, dealing, legal actions and settlement. A browser receives only its own private cards and permitted public information. A visual card back is not a security measure. Use an unbiased shuffle with a cryptographically secure randomness source; do not claim independent certification unless obtained.

### Test requirements

- Every supported card-use rule, including board-only Hold'em and exact-card Omaha.
- Heads-up order, blinds, minimum raises, pot-limit maxima and short all-ins that may not reopen action.
- Main/side pots, folded contributors, uncalled bets, ties, board splits and odd chips.
- Triple Number scoring against confirmed examples, valid partitions and simultaneous reveal.
- Required discards during all-in runouts and deck-capacity validation.
- Duplicate/stale actions, multiple tabs, reconnection and server restarts.
- No hidden-card leakage in messages, histories, spectators or routine logs.
- Exact chip accounting despite rounded BB display and changed blinds.
- Full sessions across real devices and a measured pilot load.

### Release gates

Do not release an enabled game with unresolved winner rules. Do not leave known incorrect payouts, chip loss or private-card leaks unresolved. Every enabled preset needs a readable rule summary and meaningful tests. Declare history retention and timeout behaviour. Verify the actual end-to-end multiplayer flow; a clickable visual prototype is not a complete poker product.

Public release also needs a clear privacy notice, service terms, supported geography/age policy appropriate to the operating model, feedback route, usage monitoring and a recovery procedure. The precise obligations should be established for that model rather than copied from another site.

## 18. Open decisions and immediate next steps

| Decision | Owner | Why it matters |
| --- | --- | --- |
| Higher/lower number scoring; result when nobody qualifies | Sid, with sample hands | Determines number winners and payouts. |
| Allowed targets, digit ordering and poker card usage in Triple Number | Sid | Determines valid input and hand construction. |
| Discard timing and selection timeouts | Sid plus playtesting | Prevents disputes and stalled tables. |
| Complete-board versus shared-river layout | Sid | Determines dealing, capacity and pot splitting. |
| 7–2 bounty eligibility, contributors and cap | Sid | Determines chip transfers. |
| Odd-chip distribution and burn-card convention | Product/rules decision | Makes rare outcomes deterministic. |
| Initial visual direction and final name | Sid | Guides design and branding. |
| Smaller release sequence | Sid | Sets the next implementation scope while preserving the full vision. |
| Intended countries, operating model and budget | Sid | Sets launch and operating requirements. |
| Whether any optional feature may ever be paid | Sid | Distinguishes free gameplay from an all-features-free promise. |

### Immediate project sequence

1. Resolve Triple Number using a small set of concrete winning, losing and tied examples; write down all accepted house rules.
2. Select a visual direction for the mobile table, invitation flow and Triple Number selection screen.
3. Build and test the R1 Hold'em foundation.
4. Add house variants incrementally and test each with friends.
5. Run the external pilot before committing to the full roadmap.
6. Evaluate sustainable revenue only after the product demonstrates repeat use.

### Project decision

**Proceed as a focused, staged experiment.** The founder has a concrete problem, access to initial players and a plausible custom-rules direction. The main uncertainties are whether unrelated groups will switch, whether the rule combinations remain understandable and reliable, and whether a free experience can sustain its costs. Progress should answer those questions through completed poker nights, not merely a longer feature list.
