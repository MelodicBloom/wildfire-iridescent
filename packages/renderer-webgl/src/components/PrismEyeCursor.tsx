import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useGPUTier } from '../hooks/useGPUTier'
import { PrismMesh } from '../meshes/PrismMesh'

/**
 * PrismEyeCursor
 *
 * Fixed-position prism cursor overlay.
 *
 * Token dependencies:
 * - `--iridescent-shader-animation-speed`
 * - `--iridescent-cursor-iris-radius`
 * - `--iridescent-cursor-pupil-radius`
 *
 * Responsive behavior: fixed, full viewport, pointer-events none.
 * Accessibility: `aria-hidden` because this is a decorative pointer overlay.
 */
interface PrismEyeCursorProps {
  className?: string
}

function dprForTier(gpuTier?: string): [number, number] {
  if (gpuTier === 'HIGH') return [1, 1.5]
  if (gpuTier === 'MEDIUM') return [1, 1.25]
  return [1, 1]
}

export function PrismEyeCursor({ className }: PrismEyeCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const readyFired = useRef(false)
  const profile = useGPUTier()

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
        dpr={dprForTier(profile?.gpuTier)}
      >
        <ReadyGateBridge />
        <PrismMesh />
      </Canvas>
    </div>
  )
}
