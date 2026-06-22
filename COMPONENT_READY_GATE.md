# Component-Level WebGL Ready Gate

## What Changed

`useWebGLReadyGate` has been moved from Storybook story files into the renderer components themselves. The hook now lives at:

```
packages/renderer-webgl/src/hooks/useWebGLReadyGate.ts
```

## How It Works

Each component (`AbaloneCanvas`, `PrismEyeCursor`, `TiltedChromaCard`) holds a `ref` on its root DOM element and passes it to `useWebGLReadyGate`. After the WebGL context confirms its first painted frame, the hook emits `data-ready="1"` on that element after two `requestAnimationFrame` ticks — guaranteeing the GPU has submitted at least one real frame.

### AbaloneCanvas
Uses R3F's `onCreated` callback with a one-shot `setAnimationLoop` to fire `onReady` after the first frame, then immediately clears the loop.

### PrismEyeCursor / TiltedChromaCard
Uses an inner `ReadyGateBridge` R3F component that calls `useFrame` to fire `onReady` on the first tick, guarded by a `readyFired` ref.

## Why This Matters

Previously, `data-ready="1"` was emitted by story-level scaffolding. This meant:
- Any component rendered outside Storybook had no ready signal
- Playwright and Chromatic had nothing authoritative to wait on
- New stories required manual gate wiring to stay stable

Now, the gate is automatic in every render context — Storybook, Next.js app router, Vite playground, or any future consumer.

## Chromatic Impact

Story `delay` values tightened from 800ms → 300ms because the gate is now authoritative rather than a timing guess. Chromatic waits for `data-ready="1"` + `pauseAnimationAtEnd` before snapshotting.

## Playwright Impact

`e2e/webgl-ready.spec.ts` now uses `waitForSelector('[data-ready="1"]')` with a 5000ms timeout. No story-level helper is needed.

## Running Tests

```bash
npm run storybook        # confirm stories render, no manual gate
npm run test:visual      # Playwright — all three hit data-ready within 300ms
npm run build            # confirm no type errors
```

## Next: Option A — Token Pipeline

With the gate authoritative at component level, token injection can be safely sequenced before the ready signal fires. This prevents stale shader uniforms on the first frame when CSS custom properties arrive after WebGL context initialization.
