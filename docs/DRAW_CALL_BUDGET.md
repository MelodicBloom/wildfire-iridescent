# Draw Call Budget — Wildfire Iridescent

## Baseline

| Component | Draw calls / frame | Geometry | Notes |
|---|---:|---|---|
| `AbaloneCanvas` | 1 | Fullscreen quad | Own canvas; DPR capped by GPU tier. |
| `PrismEyeCursor` | 1 | Fullscreen quad | Fixed decorative overlay; DPR capped by GPU tier. |
| `TiltedChromaCard` | 1 per card | Fullscreen quad | One canvas per card in the current implementation. |
| Grid of N cards | N | N quads | Upgrade to instancing before dense grids. |

## Rules

1. A PR must not increase draw calls per component without documenting the reason.
2. A page should avoid rendering more than 16 `TiltedChromaCard` instances at once until instancing lands.
3. Any component with manual WebGL resources must clean them up on unmount or register them through `useDispose`.
4. DPR must stay capped:
   - LOW: `[1, 1]`
   - MEDIUM: `[1, 1.25]`
   - HIGH: `[1, 1.5]`
5. Reduced-motion mode must set decorative animation speed to zero through token-driven uniforms.

## Memory Budget

| Resource | Budget |
|---|---:|
| GPU texture memory | < 64 MB per page |
| Vertex/index buffers | < 4 MB per page |
| Renderer initialization JS heap | < 8 MB |

## Regression Gate

Before merging rendering-heavy changes, run:

```bash
npm run tokens
npm run build-sb
npm run test:visual
```

If draw calls or memory usage increase, document the previous value, new value, and reason in the PR description.

## Instancing Roadmap

The next performance step is replacing dense `TiltedChromaCard` grids with a single `THREE.InstancedMesh` or shared-canvas scissor pipeline so N cards can render closer to one draw call rather than N canvases.
