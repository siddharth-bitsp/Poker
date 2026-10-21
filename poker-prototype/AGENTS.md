# Prototype Instructions

## User-approved direction

Build a local testing poker webpage inspired by the supplied dark Poker Arena screenshot: charcoal panels, cool blue accents, an oval table, six seats, white cards and a clear betting dock. The current playable scope is Hold’em plus Omaha Fixed, Omaha Clean, Omaha Dirty, Irish and Discard with bots, authorized on 20 October 2026. All use no-limit betting and one board. Discard choices occur after each board street before betting, including for all-in players. Keep actual game logic and working controls; do not invent rankings or claim multiplayer or a custom variation builder is implemented. Chips/BB display is a priority. Direct local Playwright browser checks were explicitly approved by the user in this conversation. Do not publish without a deployment request.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
