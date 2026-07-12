import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type * as THREE from 'three'

/**
 * Bridges generated CSS custom properties into shader uniforms.
 *
 * Token dependencies currently supported:
 * - `--iridescent-shader-animation-speed` → `uAnimationSpeed`
 * - `--iridescent-material-film-thickness-min` → `uFilmThicknessMin`
 * - `--iridescent-material-film-thickness-max` → `uFilmThicknessMax`
 *
 * The hook intentionally ignores missing CSS variables so it remains safe across
 * Storybook, Vite playground, and app builds where not every shader consumes
 * every token.
 */
const NUMERIC_TOKEN_MAP: Record<string, string> = {
  uAnimationSpeed: '--iridescent-shader-animation-speed',
  uFilmThicknessMin: '--iridescent-material-film-thickness-min',
  uFilmThicknessMax: '--iridescent-material-film-thickness-max',
}

type MaterialRef = MutableRefObject<THREE.ShaderMaterial | null>
type MaterialListRef = MutableRefObject<THREE.ShaderMaterial[]>

function resolveMaterials(ref: MaterialRef | MaterialListRef): THREE.ShaderMaterial[] {
  const current = ref.current
  if (Array.isArray(current)) return current
  return current ? [current] : []
}

export function useTokenUniforms(materialsRef: MaterialRef | MaterialListRef) {
  const resolvedRef = useRef<Record<string, number>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const computed = getComputedStyle(document.documentElement)
    const resolved: Record<string, number> = {}

    for (const [uniform, cssVar] of Object.entries(NUMERIC_TOKEN_MAP)) {
      const raw = computed.getPropertyValue(cssVar).trim()
      const numericValue = Number.parseFloat(raw)
      if (Number.isFinite(numericValue)) {
        resolved[uniform] = numericValue
      }
    }

    resolvedRef.current = resolved

    for (const material of resolveMaterials(materialsRef)) {
      for (const [uniform, value] of Object.entries(resolved)) {
        if (material.uniforms[uniform]) {
          material.uniforms[uniform].value = value
        }
      }
    }
  }, [materialsRef])

  return resolvedRef
}
