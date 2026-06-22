# Diff v8 → v9 — Codex PR review fixes

## P1 — Style Dictionary v4 API
StyleDictionary.extend() removed in v4. Now uses `new StyleDictionary({})` + `await sd.buildAllPlatforms()`.

## P2 — CSS variable prefix
`prefix: 'iridescent'` added to CSS platform → variables are `--iridescent-*` matching Storybook/Playwright reads.

## P2 — GPU tier singleton probe
Module-level `probePromise` singleton — one probe canvas per page load. Context released via `WEBGL_lose_context` immediately after reading tier.

## P2 — Entry point exports from src/components/
src/index.ts now re-exports from src/components/* (updated implementations) not legacy top-level stubs.

## P2 — Token build gates all entry scripts
`storybook`, `dev`, `build-sb` all run `npm run tokens` first. Clean checkout safe.

## P2 — VRT CI race condition fixed
`build-sb` is foregrounded. Playwright webServer serves storybook-static and waits on port 6006 before any test runs.

## P2 — @playwright/test + wait-on added
`@playwright/test` and `wait-on` added as devDependencies.
