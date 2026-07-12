import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Canvas } from '@react-three/fiber'
import { AbaloneShader } from '../shaders/AbaloneShader'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useGPUTier } from '../hooks/useGPUTier'

/**
 * AbaloneCanvas
 *
 * Renders the iridescent abalone thin-film shader as a full-bleed canvas.
 *
 * Token dependencies:
 * - `--iridescent-material-film-thickness-min`
 * - `--iridescent-material-film-thickness-max`
 * - `--iridescent-shader-animation-speed`
 * - `--iridescent-surface-page-background`
 *
 * Responsive behavior: fills 100% of its parent; callers must provide explicit
 * width/height on the wrapper or parent container.
 *
 * Accessibility: exposed as an image-like decorative visualization with a
 * caller-overridable `aria-label`.
 */
export interface AbaloneCanvasProps {
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

function dprForTier(gpuTier?: string): [number, number] {
  if (gpuTier === 'HIGH') return [1, 1.5]
  if (gpuTier === 'MEDIUM') return [1, 1.25]
  return [1, 1]
}

export function AbaloneCanvas({
  className,
  style,
  'aria-label': ariaLabel = 'Iridescent abalone shader surface',
}: AbaloneCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const profile = useGPUTier()

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
        dpr={dprForTier(profile?.gpuTier)}
        onCreated={({ gl }) => {
          gl.setAnimationLoop(() => {
            onReady()
            gl.setAnimationLoop(null)
          })
        }}
      >
        <AbaloneShader />
      </Canvas>
    </div>
  )
}
