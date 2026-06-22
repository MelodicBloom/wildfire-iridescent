import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useGPUTier } from '../hooks/useGPUTier'
import { useAberrationAngle } from '../hooks/useAberrationAngle'
import { ChromaMesh } from '../meshes/ChromaMesh'

/**
 * TiltedChromaCard
 *
 * Interactive card with GPU-composited 3D tilt and chromatic aberration.
 * Children render on top of the WebGL layer.
 *
 * TOKEN DEPENDENCIES:
 *   --iridescent-shader-aberration-strength
 *   --iridescent-shader-dispersion-spread
 *   --iridescent-color-prism-a
 *   --iridescent-color-prism-b
 *   --iridescent-color-surface
 *   --spacing-card-radius
 *
 * RESPONSIVE: fills parent container. Set explicit width/height on usage.
 *
 * REDUCED MOTION: tilt and aberration disabled when
 *   --iridescent-shader-animation-speed resolves to 0.
 *
 * ACCESSIBILITY:
 *   - role="article" — semantic card wrapper
 *   - Keyboard-focusable — tabIndex=0
 *   - Visible focus ring via CSS (2px solid currentColor, 4px offset)
 *   - Children must include readable text or aria-label
 *
 * DRAW CALLS: 1 per card per frame (scissor-test shared canvas).
 *   See docs/DRAW_CALL_BUDGET.md.
 */

interface TiltedChromaCardProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
}

export function TiltedChromaCard({
  children,
  className,
  style,
  'aria-label': ariaLabel
}: TiltedChromaCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const readyFired = useRef(false)
  const aberrationAngle = useAberrationAngle()
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
      role="article"
      aria-label={ariaLabel}
      tabIndex={0}
      style={{
        position: 'relative',
        borderRadius: 'var(--iridescent-spacing-card-radius, 12px)',
        outline: 'none',
        ...style
      }}
      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px currentColor, 0 0 0 4px rgba(255,255,255,0.3)'}
      onBlur={e => e.currentTarget.style.boxShadow = ''}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={quality.dpr}
      >
        <ReadyGateBridge />
        <ChromaMesh
          aberrationAngle={aberrationAngle}
          aberration={quality.aberration}
          samples={quality.samples}
        />
      </Canvas>
      {children}
    </div>
  )
}
