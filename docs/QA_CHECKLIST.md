# Wildfire Iridescent — QA Checklist v1.0

> Standards bar: Advanced / Unique / 2027-ready / Proprietary / Stunning / Performant
> Every PR must pass all applicable sections before merge.

---

## 1. Design System & Tokens

### Source of Truth
- [ ] A canonical token source file exists (`packages/theme-iridescent/src/tokens.json` or equivalent)
- [ ] Token source covers **all six categories**: color, typography, spacing, radius/elevation, motion (duration, easing, delay), and shadow/glow
- [ ] No hard-coded style values exist in component files — all values reference tokens
- [ ] Token build step runs in CI and produces all output formats before any component is built

### Output Formats
- [ ] CSS custom properties file generated (`:root { --iridescent-* }`) — consumed by DOM and Storybook
- [ ] W3C Design Token JSON generated — consumed by Figma Variables sync
- [ ] TypeScript token module generated — consumed by renderer-webgl shader uniforms and React components
- [ ] All three outputs are build artifacts (never hand-edited)

### Governance
- [ ] Token changes require a PR — no direct commits to token source on `main`
- [ ] Token changes trigger full VRT run automatically
- [ ] Figma Variables sync workflow runs after token build in CI

---

## 2. Component Architecture

### Per-Component Requirements
- [ ] Each component declares its token dependencies explicitly (inline comment or JSDoc)
- [ ] Each component includes a responsive behavior spec (min-width breakpoints or container query behavior documented)
- [ ] Each component includes a `prefers-reduced-motion` path — shader animations damp or halt, DOM transitions reduce to state-only changes
- [ ] Each component has a Storybook story per major variant
- [ ] Each Storybook story emits `data-ready="1"` via the component-level ready gate — **no story-level gate wiring**

### Accessibility
- [ ] Focus states are visible and meet WCAG 2.1 AA contrast requirements
- [ ] Interactive components are keyboard-navigable
- [ ] Color contrast meets WCAG AA minimum (4.5:1 text, 3:1 large text and UI components)
- [ ] No animation is triggered without user action on first load unless `prefers-reduced-motion: no-preference` is confirmed

---

## 3. Motion & Interaction

### Timing Bands
- [ ] Micro-interactions (hover, press, subtle card tilt): **150–300ms**
- [ ] Macro sequences (page transitions, scroll reveals, modal open/close): **400–600ms**
- [ ] Any outlier outside these bands has a documented justification in the PR description

### Motion Tokens
- [ ] All Framer Motion `transition` props reference motion tokens — no hard-coded duration/easing values
- [ ] All shader time-based parameters (animation speed, overshoot, oscillation) reference motion tokens or are driven by them
- [ ] Named easing curves are defined as tokens (e.g., `--motion-ease-spring`, `--motion-ease-out-expo`)

### GPU Compositing
- [ ] All DOM animations use only `transform` and `opacity` — no `width`, `height`, `margin`, `top`, `left` animations
- [ ] No layout-affecting CSS properties are animated
- [ ] `will-change` is used sparingly and only on elements confirmed to animate

### Reduced Motion
- [ ] `prefers-reduced-motion: reduce` suppresses all decorative shader animations
- [ ] `prefers-reduced-motion: reduce` reduces Framer Motion transitions to instant or minimal state changes
- [ ] Reduced-motion behavior is tested via a dedicated Storybook story parameter (`globals: { motion: 'reduced' }`) or explicit story variant

---

## 4. WebGL Performance

### Frame Rate Targets
- [ ] Smooth render at **60fps** on mid-tier laptops (e.g., 2020-era Intel UHD 620, Apple M1)
- [ ] Acceptable render at **30fps** graceful degradation on mid-range mobile (e.g., Snapdragon 720G, Apple A13)
- [ ] GPU tier detection in place (`packages/renderer-webgl/src/utils/gpuTier.ts` or equivalent) and used to scale shader quality

### Draw Calls & Geometry
- [ ] Repeated card instances use instanced geometry — no unique mesh per card
- [ ] Draw call count per frame is documented and does not regress between PRs
- [ ] Buffers are reused across frames — no per-frame allocations in render loops
- [ ] `dpr` is capped at `[1, 1.5]` — no uncapped `window.devicePixelRatio` on mobile

### Shader Quality
- [ ] Fragment shaders use `mediump` precision on mobile paths with `highp` guarded by extension check
- [ ] No `discard` in hot fragment shader paths on known Mali/Adreno targets
- [ ] Shader compile errors surface as visible fallback (not silent black canvas)
- [ ] Shader fallback tested on WebGL 1.0 target (SwiftShader in Playwright is acceptable proxy)

### Memory
- [ ] Total GPU memory allocation per page estimated and documented
- [ ] Textures are power-of-two or explicitly non-power-of-two where needed
- [ ] No texture/buffer leaks on component unmount (WebGL resources disposed in cleanup)
- [ ] SharedChromaProvider correctly disposes shared canvas context on page unload

---

## 5. Visual Regression Testing

### Determinism
- [ ] All Storybook stories for WebGL components emit `data-ready="1"` via the component-level gate
- [ ] Playwright specs use `waitForSelector('[data-ready="1"]', { timeout: 5000 })` before screenshot
- [ ] No Playwright spec relies on fixed `setTimeout` / `page.waitForTimeout` as the primary wait strategy
- [ ] Chromatic `delay` ≤ 300ms for all WebGL stories (gate is authoritative, not timing)
- [ ] `pauseAnimationAtEnd: true` set on all animated Chromatic stories

### Coverage
- [ ] VRT story exists for every public component variant
- [ ] VRT story exists for every token "mode" or theme variant (if applicable)
- [ ] Reduced-motion variant story captured as a separate baseline
- [ ] Token smoke test story confirms that CSS variable changes propagate visually

### CI Enforcement
- [ ] Chromatic run is required check on every PR to `main`
- [ ] Playwright VRT run is required check on every PR to `main`
- [ ] PR cannot merge if visual diffs are unreviewed in Chromatic
- [ ] Playwright `test-results/` screenshots are uploaded as CI artifacts

---

## 6. Build & Type Safety

- [ ] `npm run build` exits 0 with no TypeScript errors
- [ ] `npm run build` exits 0 with no ESLint errors (warnings acceptable, errors block merge)
- [ ] Token build step (`npm run tokens`) runs before component build in CI pipeline order
- [ ] No `any` types in renderer-webgl package — all shader uniform types are explicit
- [ ] All new hooks and utilities have explicit return type annotations
- [ ] No unused imports in committed files

---

## 7. Documentation

- [ ] Every new hook has a JSDoc comment explaining purpose, parameters, and usage context
- [ ] Every new component has a brief usage example in its story file
- [ ] PR description explains what changed, why, and any known risks
- [ ] Any deviation from this checklist is documented in the PR with justification
- [ ] `COMPONENT_READY_GATE.md` or equivalent architecture doc is kept current

---

## Scoring Guide

| Result | Threshold |
|---|---|
| ✅ **Green — merge** | All applicable items pass |
| 🟡 **Yellow — merge with note** | 1–2 items deferred with documented justification |
| 🔴 **Red — do not merge** | Any Section 4 shader safety item fails, any VRT determinism item fails, or `npm run build` fails |

---

*Checklist version: 1.0 — June 2026*
*Next review: before v2.0.0 tag or major architecture change*
