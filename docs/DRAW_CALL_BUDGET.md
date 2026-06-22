# Draw Call Budget — Wildfire Iridescent

## Baseline (v6.0.0)

| Component | Draw calls / frame | Geometry | Shared context |
|---|---|---|---|
| AbaloneCanvas | 1 | Fullscreen quad | No — own canvas |
| PrismEyeCursor | 1 | Fullscreen quad | No — own canvas |
| TiltedChromaCard (per card) | 1 | Instanced quad | Yes — SharedChromaProvider scissor-test |
| **Grid of N cards** | **N** | N instanced quads | Yes |

## Rules

1. **No regression**: A PR must not increase draw calls per frame for any
   component without documented justification in the PR description.

2. **Grid ceiling**: A single page should not exceed **16 TiltedChromaCard
   instances** without upgrading to GPU instancing (single draw call for N).

3. **Measurement**: Run `npm run storybook` and open the Three.js stats panel
   (press `s` in the Storybook canvas toolbar) to verify draw call count.
   Screenshot the stats panel in the PR if the budget changes.

## Planned Optimisation

- Upgrade TiltedChromaCard grid rendering to true GPU instancing
  (single `THREE.InstancedMesh` draw call for N cards).
  Target: before v7.0.0.

## Memory Budget (per page)

| Resource | Budget |
|---|---|
| GPU texture memory | < 64 MB |
| Vertex/index buffers | < 4 MB |
| JS heap (renderer-webgl init) | < 8 MB |

All resources must be disposed on component unmount via `useDispose`.
