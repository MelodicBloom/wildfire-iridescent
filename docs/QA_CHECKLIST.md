# Wildfire Iridescent — QA Checklist v1.0

Standards bar: advanced, distinctive, performant, accessible, token-governed, and visually regression-tested.

## 1. Design System & Tokens

- [ ] Canonical token source exists under `packages/theme-iridescent/tokens/`.
- [ ] Token source covers material, motion, cursor, surface, spacing/radius/elevation where applicable.
- [ ] Token build runs before app, Storybook, and visual test builds.
- [ ] CSS custom properties are generated and consumed by DOM, Storybook, and WebGL components.
- [ ] Figma/portable JSON and ESM outputs are generated from the same source, not hand-edited.
- [ ] Component styling avoids hard-coded values where token coverage exists.

## 2. Component Architecture

- [ ] Each component declares token dependencies in comments, JSDoc, or story documentation.
- [ ] Each component documents responsive behavior and container expectations.
- [ ] Public components have Storybook stories for their major states and variants.
- [ ] WebGL components expose `data-ready="1"` through component-level ready gates.
- [ ] Components clean up timers, observers, RAF loops, WebGL resources, and shared contexts on unmount.

## 3. Accessibility & Reduced Motion

- [ ] Interactive elements are keyboard reachable.
- [ ] Focus states are visible.
- [ ] Text and UI contrast meet WCAG AA where the component is text-bearing or controls interaction.
- [ ] `prefers-reduced-motion` or Storybook `motion: reduced` suppresses decorative shader animation.
- [ ] Reduced-motion stories are captured separately when animation affects the visual baseline.

## 4. Motion & Interaction

- [ ] Micro-interactions stay in the 150–300ms range unless justified.
- [ ] Macro transitions stay in the 400–600ms range unless justified.
- [ ] DOM animation uses transform and opacity instead of layout-affecting properties.
- [ ] Framer Motion and shader timing values reference tokenized or centralized motion values.
- [ ] Pointer, scroll, and velocity effects degrade gracefully on touch and low-power devices.

## 5. WebGL Performance

- [ ] DPR is capped and never uses raw uncapped `window.devicePixelRatio` on mobile.
- [ ] Shader quality scales by GPU/device tier where possible.
- [ ] Draw calls, texture budgets, and memory expectations are documented for complex scenes.
- [ ] WebGL fallback state is visible instead of silently rendering a black canvas.
- [ ] No per-frame object allocations in hot render loops unless measured and justified.

## 6. Visual Regression Testing

- [ ] Storybook stories use `data-ready="1"` as the deterministic screenshot gate.
- [ ] Playwright waits on `[data-ready="1"]`, not arbitrary timeouts.
- [ ] Token smoke tests verify CSS custom properties and screenshot output.
- [ ] Reduced-motion and token-mode variants have distinct baselines where relevant.
- [ ] Visual tests run after Storybook is built.

## 7. Build & Type Safety

- [ ] `npm run tokens` exits successfully.
- [ ] `npm run build` exits successfully.
- [ ] `npm run build-sb` exits successfully.
- [ ] `npm run test:visual` exits successfully after Storybook is built.
- [ ] No unused imports or untyped public APIs in new hooks/components.

## 8. Documentation

- [ ] New hooks include purpose and usage notes.
- [ ] New components include a story or usage example.
- [ ] PR descriptions explain what changed, why, risks, and validation commands.
- [ ] Any deferred checklist item is explicitly documented.

## Merge Decision

| Result | Rule |
|---|---|
| Green | All applicable checks pass. |
| Yellow | 1–2 low-risk items deferred with written justification. |
| Red | Build failure, visual-test determinism failure, shader safety failure, or accessibility blocker. |
