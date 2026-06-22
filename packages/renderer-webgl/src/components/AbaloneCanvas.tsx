import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AbaloneShader } from '../shaders/AbaloneShader'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useGPUTier } from '../hooks/useGPUTier'

/**
 * AbaloneCanvas
 *
 * Renders the iridescent abalone thin-film shader as a full-bleed canvas.
 *
 * TOKEN DEPENDENCIES:
 *   --iridescent-shader-film-thickness
 *   --iridescent-shader-animation-speed
 *   --iridescent-color-abalone-base
 *   --iridescent-color-surface
 *
 * RESPONSIVE: fills 100% of parent. Set explicit width/height on the wrapper.
 *
 * REDUCED MOTION: passes uAnimationSpeed=0 to shader when
 *   --iridescent-shader-animation-speed resolves to 0 (set by Storybook
 *   decorator or prefers-reduced-motion media query handler).
 *
 * ACCESSIBILITY: role="img" with descriptive aria-label. Not keyboard
 *   focusable — purely decorative canvas.
 *
 * DRAW CALLS: 1 per frame (single fullscreen quad). See docs/DRAW_CALL_BUDGET.md.
 */

interface AbaloneCanvasProps {
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
}

export function AbaloneCanvas({
  className,
  style,
  'aria-label': ariaLabel = 'Iridescent abalone surface animation'
}: AbaloneCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const quality = useGPUTier()

  return (
    <div
      ref={rootRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <Canvas
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={quality.dpr}
        onCreated={({ gl }) => {
          gl.setAnimationLoop(() => {
            onReady()
            gl.setAnimationLoop(null)
          })
        }}
      >
        <AbaloneShader filmPass={quality.filmPass} />
      </Canvas>
    </div>
  )
}
