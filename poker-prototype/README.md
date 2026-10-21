# Afterhours — poker practice prototype

A working local Texas Hold’em table, inspired by the supplied dark poker UI. The working product name is **Afterhours**; it can be changed.

## What you can test

- Play complete no-limit Hold’em hands against 2–5 bots with different styles.
- Fold, check, call, raise, use pot presets, or go all-in.
- Main pots, side pots, tied hands, odd chips, uncalled returns, short all-ins, and heads-up play.
- Switch all live stack, pot, and bet amounts between chips and big blinds. The chronological action log deliberately records raw chips for a consistent history.
- Set starting stacks and blinds for a new session; choose bot pace, pause/resume, and enable auto-deal.
- Inspect hand histories, review visible showdown cards, download the last 50 hands, and see session stats.
- Responsive desktop/tablet/mobile layout, keyboard controls and accessible modal dialogs.

**This version supports six practice games:** Hold’em plus Omaha Fixed (exactly 2/4), Omaha Clean (1–2/4), Omaha Dirty (2–3/4), your Irish (1–2/3), and Discard (5 cards, discard after each street, finish with 2). Use **Change game → Poker variation → Start new session**. Changing games starts a fresh session; it never changes an in-progress hand. All games use no-limit betting and one community board. It does not yet implement private multiplayer rooms, 999, bomb pots, a custom-rule builder, accounts, payments, or advertising. Those remain the next product phases described in the parent product plan.

## Run it again

The preview is started for the current session at **http://127.0.0.1:4173/**. On a regular Node.js installation:

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

Use Node 22.12+ or Node 24. If using pnpm, the project also includes `pnpm-lock.yaml` for repeatable installation.

On this particular computer, Node is available but npm is not on PATH. With dependencies already installed, the equivalent restart command from this folder is:

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173 --strictPort
```

Refreshing creates a new practice session. Table, display and pace preferences are saved locally. Hand history is in memory; download it before refreshing if you want to keep it.

## Host the testing version on Vercel

1. Put the project in a Git repository, excluding the files in `.gitignore`.
2. Import that repository into Vercel. If the repository contains this project's parent folder, select **poker-prototype** as the Root Directory.
3. Use **Vite** as the framework. The included `vercel.json` sets install to `npm install`, build to `npm run build`, and output to **dist/client**.
4. Deploy when you are ready to share it. No API keys or database are needed for this practice build.

Vercel officially supports Vite and configurable build/output settings: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Build configuration](https://vercel.com/docs/builds/configure-a-build).

Hosting this prototype gives each visitor their **own browser-local bot game**. It does not make a shared room. Multiplayer needs a separate authoritative game service for rooms, WebSocket connections, reconnect recovery and private-card delivery. The server must own the deck and betting state; never use this client-only practice model for adversarial multiplayer or real-money play.

No deployment has been made. The template’s existing Sites runtime and packaging files are also preserved for an optional later Sites handoff.

## Poker implementation

`src/poker/cards.js` creates a 52-card deck and uses Fisher–Yates with Web Crypto random values. Rejection sampling removes modulo bias. It evaluates the best five-card hand out of up to seven cards, including wheel straights and kickers.

`src/poker/engine.js` owns action order, blind rotation, legal actions, raise reopening, street progression, all-in runouts, side-pot eligibility and settlement. Unchanged eligibility tiers are merged before odd-chip distribution. Odd chips go clockwise from the dealer. All chips are integers, and settlement asserts chip conservation.

`src/poker/bots.js` receives only a sanitized observation: its own cards, the public board, public stacks/actions and legal options. It estimates equity by sampling hypothetical unknown cards. These are lightweight practice bots, not solver-trained opponents. All game data still exists inside the local browser; the separation is a bot decision boundary, not a multiplayer security boundary.

## Checks

```sh
npm test
npm run build
npm run test:sites
```

Tests include all **2,598,960 five-card combinations**, 500 randomized complete hands, side-pot fixtures, folded-money/odd-chip cases, full and short raises, heads-up blinds and bot information boundaries. Build before `test:sites`, because that suite verifies emitted hosting artifacts.

Local browser evidence is in `qa/`, and the visual comparison report is `design-qa.md`. `scripts/browser-check.cjs` uses this machine's installed browser and Playwright runtime; adjust those paths on another machine. It is not needed to run or host the app.

## Design and assets

The UI follows the reference’s charcoal panels, oval table, six seat layout, white playing cards, blue accents and three-button betting dock. Session metrics replace fictional ranking/ELO data. Generated raster assets are used for the table, chips and avatars; bot avatars deliberately communicate that these seats are automated. Phosphor supplies the icons. DM Sans supplies typography, with an Arial fallback if Google Fonts is unavailable.

Original PNGs and prompt provenance remain in `public/assets/`; the interface serves optimized WebP versions. No user photographs or external player accounts are used.

## Variation update — 20 October 2026

Discard choices happen immediately after each flop, turn and river is dealt, before betting on that street. Every non-folded player, including all-in players, must discard once. Choices are final; discarded identities stay out of public logs and opponents’ bot observations. Final two cards play as Hold’em. Bots use the selected variant evaluator and choose discards from their own cards and the public board. Their discard policy is a simple current-hand heuristic, not an expert strategy.

Variant-specific regression checks are in `tests/variants.test.mjs`, including 150 completed hands across the five additions. Browser evidence is in `qa/variants/`.
