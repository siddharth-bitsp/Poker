# Afterhours prototype — visual and interaction QA

**final result: passed**

No actionable P0, P1 or P2 findings remain for the agreed local Hold’em practice prototype.

## Evidence and normalization

- Source visual truth: `C:/Users/sid/AppData/Local/Temp/codex-clipboard-0a12a8f5-cf3e-4f1b-b9b1-08492f64a401.png`.
- Source pixels: 1356 × 819. The reference includes gallery/contact chrome outside the poker product; that chrome is excluded from the comparison.
- Source app crop: x 136, y 137, width 1105, height 622.
- Browser implementation: `http://127.0.0.1:4173/`, automated local Chrome via Playwright, explicitly approved by the user.
- Primary viewport: 1356 × 819 CSS pixels, deviceScaleFactor 1.
- Implementation app box: x 54, y 62, width 1248, height 751 CSS pixels. Full-page evidence includes decorative page margins below the viewport; the betting controls remain visible within the initial desktop viewport.
- Latest implementation: `qa/final-desktop.png` (preflop), `qa/final-flop.png` (flop, human to act).
- Both app crops were placed into **one comparison image** at a common width of 1105 px, preserving their aspect ratios: `qa/comparison-full.png` (2230 × 665). The implemented frame is taller because of practice controls and a status footer; this is an intentional product adaptation.
- Focused comparisons: `qa/comparison-board.png` and `qa/comparison-actions.png`, each containing the actual source and implementation regions side by side. These were opened and inspected, not inferred from code.
- Responsive evidence: `qa/final-1440.png`, `qa/final-1024.png`, `qa/final-820.png`, `qa/final-600.png`, `qa/final-390.png`, `qa/final-360.png`. Desktop/tablet height 900, narrow viewport height 844, all at density 1.
- Additional states: `qa/rules.png`, `qa/settings.png`, `qa/mobile-settings.png`, `qa/hand-history.png`, and `qa/showdown-1.png`.
- Machine-readable browser evidence: `qa/browser-results.json`, `qa/final-capture.json`.

## Comparison history and resolved findings

1. **P2 — Desktop frame too tall; oversized table intruded into sidebar space.** The first browser capture was 1035 px high. The table extended past its column and the full betting dock was too low relative to the reference. Reduced header and table spacing, constrained artwork to its column, and reduced sidebar feed height. Post-fix full view shows distinct sidebar/table boundaries and the complete primary betting controls above the desktop fold.
2. **P2 — Table letterboxing detached seats from the felt on mobile.** The initial mobile screenshot showed an excessively shallow oval with a large gap below the top player. Adjusted the responsive table asset container to occupy the available table area; the same six-seat layout becomes taller on narrow screens. Confirmed in final 390 px and 360 px captures.
3. **P2 — Community street text and the hero hand crowded each other.** Moved desktop community content upward, then tightened the hand-name line box. The final focused board image and final 1024 px capture show separate board, street, hole cards, hand name, and seat panel.
4. **P2 — Decorative chip covered footer copy.** Moved the lower chip behind the application frame. Footer labels and actions are now fully visible.
5. **P2 — Player and support text was too small relative to the source.** Increased desktop player names, stacks, session labels, activity text and action labels; increased mobile player and main action text. Verified the revised comparison and mobile captures with no label overflow.
6. **P2 — Settings fields needed explicit accessible names.** Nested option text made exact label lookup unreliable. Added explicit names to the three selectors. Browser checks now successfully change player count, stack, and blinds and start a new session.
7. **Preview reliability issue.** Vite attempted to watch a browser download while Windows held the file open. Excluded QA output from the development watcher; subsequent browser runs completed without server failure. Added a small favicon to remove the initial 404 console error.

Earlier working captures were overwritten by later browser runs; this log records the findings rather than claiming those superseded files still exist. The final named captures and comparison images are the retained post-fix evidence.

## Required fidelity surfaces

- **Fonts and typography:** DM Sans provides the compact sans-serif hierarchy of the reference, with Arial fallback. The exact source font is not identified. Brand size, game title, card ranks, seat names, numerical stacks, sidebar labels and primary actions were inspected. No unintended wrapping remains in the primary controls. Compact support copy is intentionally smaller than primary game information.
- **Spacing and layout rhythm:** Dark rounded frame, three-column desktop composition, six surrounding seats, centered five-card board, hero cards and three-action dock follow the source. The tablet layout hides the secondary stats column; narrow screens place the activity panel below the table. No horizontal page overflow at 360, 390, 600, 820, 1024 or 1440 px. Primary mobile actions remain visible within an 844 px viewport.
- **Colors and tokens:** Charcoal backgrounds, navy felt, muted slate supporting text, white cards, blue current-player/raise states, red fold and pale call/check controls preserve the source hierarchy. Green indicates won pots and positive results. Disabled and folded states are visually distinct without relying on color alone.
- **Image quality and assets:** Genuine generated raster assets provide the oval table, decorative chip and avatars. WebP derivatives preserve the visible artwork at substantially smaller transfer sizes. No photo placeholders or handmade illustration substitutes are used. A shared robot portrait intentionally identifies practice bots; the source used human opponent portraits. Phosphor supplies standard UI and card-suit icons. The mobile felt is intentionally taller than the desktop oval to accommodate six seats.
- **Copy/content:** Renamed the working product to Afterhours. Actual session statistics replace fictional ELO and ranking charts. Activity/history replaces disconnected social/chat navigation. All monetary-looking values are play chips; practice scope is stated. The About dialog clearly distinguishes implemented Hold’em from planned variants and multiplayer.

## Primary interactions tested

- Initial six-seat deal, human turn and enabled legal actions.
- Chips/BB switch, equivalent stack values, and preference persistence on reload.
- Pot preset amount (initial pot raise-to 70), raise action, calls, checks, folds, bot turns, completed hands and next-hand dealing.
- Pause disables actions; a dedicated test confirms it freezes bot activity and resume continues it.
- Auto-deal advances to the next hand automatically after settlement.
- Rules dialog, Escape dismissal, session dialog, history tab, individual hand detail and JSON download.
- New-session settings change player count, starting chips and blinds; cancelling leaves the game intact.
- Desktop and mobile settings layouts, keyboard focus outlines, native dialog focus handling and reduced-motion support.
- No application exceptions, console errors or failed requests in the final full browser run and final capture run.

## Logic and build checks

17 tests pass: 13 poker suites and 4 hosting/runtime suites. Poker tests include the exhaustive 2,598,960 five-card category distribution, 500 randomized complete hands with chip/card invariants, legal action order, full/short raise reopening, two side pots, tied pots, folded contribution merging, odd chips, uncalled returns, heads-up behavior and short blind runouts. Bot inputs are checked to exclude opponents’ private cards and the real deck.

The production Vite build succeeds. Sites packaging preserves the template worker and emits `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`. Vercel configuration points at `dist/client`; nothing has been deployed.

## Accepted differences and follow-up polish

- This is a functioning practice adaptation of the supplied design, not a pixel-identical reproduction of its static cards, names and amounts.
- A genuine first hand begins preflop with an empty community board; comparison evidence also captures a real flop to match the source state.
- Bots use the same robot portrait with individual names, styles and accent borders. More distinct avatar artwork is optional P3 polish.
- Table texture is more detailed and the metal rim brighter than the reference; same dark/cool visual direction, accepted for this prototype.
- Original source navigation for leaderboard/community and fictional graph panels are replaced with functioning practice controls and real data.
- Cross-browser Safari/Firefox, real devices, screen-reader sessions, 200% zoom, multiplayer security and production-scale load are outside this pass. No claims are made that these have been verified.

## Implementation checklist

- [x] Source and running implementation opened and compared together.
- [x] Full view and detailed board/action comparisons inspected.
- [x] Responsive layouts inspected and overflow assertions passed.
- [x] Primary gameplay, settings and history workflows exercised.
- [x] Poker invariants, exhaustive hand categories and hosting artifacts verified.
- [x] No unresolved P0/P1/P2 findings.
- [x] Local preview left running; hosting steps documented; no publication performed.
