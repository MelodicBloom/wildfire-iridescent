import { useEffect, useRef } from 'react'
import type * as THREE from 'three'

/**
 * TOKEN DEPENDENCIES:
 *   --iridescent-shader-aberration-strength  → uAberrationStrength (float)
 *   --iridescent-shader-film-thickness       → uFilmThickness       (float)
 *   --iridescent-shader-refraction-i-o-r     → uRefractionIOR       (float)
 *   --iridescent-shader-animation-speed      → uAnimationSpeed      (float)
 *   --iridescent-shader-dispersion-spread    → uDispersionSpread    (float)
 *   --iridescent-color-prism-a               → uColorPrismA         (vec3)
 *   --iridescent-color-prism-b               → uColorPrismB         (vec3)
 *   --iridescent-color-abalone-base          → uColorAbaloneBase    (vec3)
 *
 * Called AFTER useWebGLReadyGate fires to guarantee CSS vars are
 * settled before uniform upload. Safe in Storybook, Next.js, and
 * the Vite playground.
 */

const TOKEN_MAP: Record<string, string> = {
  uAberrationStrength: '--iridescent-shader-aberration-strength',
  uFilmThickness:      '--iridescent-shader-film-thickness',
  uRefractionIOR:      '--iridescent-shader-refraction-i-o-r',
  uAnimationSpeed:     '--iridescent-shader-animation-speed',
  uDispersionSpread:   '--iridescent-shader-dispersion-spread',
}

function hexToVec3(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return [r, g, b]
}

export function useTokenUniforms(
  materialsRef: React.MutableRefObject<THREE.ShaderMaterial[]>
) {
  const resolvedRef = useRef<Record<string, number | [number, number, number]>>({})

  useEffect(() => {
    const root = document.documentElement
    const computed = getComputedStyle(root)
    const resolved: Record<string, number | [number, number, number]> = {}

    // Numeric tokens
    for (const [uniform, cssVar] of Object.entries(TOKEN_MAP)) {
      const raw = computed.getPropertyValue(cssVar).trim()
      const num = parseFloat(raw)
      if (!isNaN(num)) resolved[uniform] = num
    }

    // Color tokens → vec3
    const colorVars: Record<string, string> = {
      uColorPrismA:      '--iridescent-color-prism-a',
      uColorPrismB:      '--iridescent-color-prism-b',
      uColorAbaloneBase: '--iridescent-color-abalone-base',
    }
    for (const [uniform, cssVar] of Object.entries(colorVars)) {
      const hex = computed.getPropertyValue(cssVar).trim()
      if (hex) resolved[uniform] = hexToVec3(hex)
    }

    resolvedRef.current = resolved

    for (const mat of materialsRef.current) {
      for (const [uniform, val] of Object.entries(resolved)) {
        if (mat.uniforms[uniform] !== undefined) {
          mat.uniforms[uniform].value = val
        }
      }
    }
  }, [materialsRef])

  return resolvedRef
}
