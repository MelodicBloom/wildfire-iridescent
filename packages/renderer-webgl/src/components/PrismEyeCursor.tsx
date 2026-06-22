import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useGPUTier } from '../hooks/useGPUTier'
import { PrismMesh } from '../meshes/PrismMesh'

/**
 * PrismEyeCursor
 *
 * Fixed-position prism distortion cursor overlay.
 * Renders a single instanced quad with GLSL chromatic aberration.
 *
 * TOKEN DEPENDENCIES:
 *   --iridescent-shader-aberration-strength
 *   --iridescent-shader-dispersion-spread
 *   --iridescent-color-prism-a
 *   --iridescent-color-prism-b
 *
 * RESPONSIVE: position:fixed, covers full viewport, pointer-events:none.
 *
 * REDUCED MOTION: aberration effect disabled when
 *   --iridescent-shader-animation-speed resolves to 0.
 *
 * ACCESSIBILITY: aria-hidden — purely decorative overlay.
 *
 * DRAW CALLS: 1 per frame (single fullscreen quad). See docs/DRAW_CALL_BUDGET.md.
 */

interface PrismEyeCursorProps {
  className?: string
}

export function PrismEyeCursor({ className }: PrismEyeCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const readyFired = useRef(false)
  const quality = useGPUTier()

  function ReadyGateBridge() {
    useFrame(() => {
      if (readyFired.current) return
      readyFired.current = true
      onReady()
    })
    return null
  }

  return (
    <div
      ref={rootRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        zIndex: 9999,
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={quality.dpr}
      >
        <ReadyGateBridge />
        <PrismMesh aberration={quality.aberration} />
      </Canvas>
    </div>
  )
}
