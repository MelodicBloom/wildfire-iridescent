import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useAberrationAngle } from '../hooks/useAberrationAngle'
import { useGPUTier } from '../hooks/useGPUTier'
import { ChromaMesh } from '../meshes/ChromaMesh'

/**
 * TiltedChromaCard
 *
 * Interactive card with a WebGL chroma layer and DOM children above it.
 *
 * Token dependencies:
 * - `--iridescent-shader-animation-speed`
 * - `--iridescent-surface-card-background`
 * - `--iridescent-surface-text-primary`
 * - `--iridescent-surface-card-radius`
 *
 * Responsive behavior: fills the caller-provided width/height. The component
 * does not impose layout outside its own relative positioning.
 *
 * Accessibility: semantic `article`, keyboard-focusable, visible focus ring,
 * caller-overridable `aria-label`, and readable DOM children expected.
 */
export interface TiltedChromaCardProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

function dprForTier(gpuTier?: string): [number, number] {
  if (gpuTier === 'HIGH') return [1, 1.5]
  if (gpuTier === 'MEDIUM') return [1, 1.25]
  return [1, 1]
}

export function TiltedChromaCard({
  children,
  className,
  style,
  'aria-label': ariaLabel,
}: TiltedChromaCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const readyFired = useRef(false)
  const aberrationAngle = useAberrationAngle()
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
      role="article"
      aria-label={ariaLabel}
      tabIndex={0}
      style={{
        position: 'relative',
        borderRadius: 'var(--iridescent-surface-card-radius, 16px)',
        outline: 'none',
        ...style,
      }}
      onFocus={(event) => {
        event.currentTarget.style.boxShadow = '0 0 0 2px currentColor, 0 0 0 4px rgba(255,255,255,0.3)'
      }}
      onBlur={(event) => {
        event.currentTarget.style.boxShadow = ''
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={dprForTier(profile?.gpuTier)}
      >
        <ReadyGateBridge />
        <ChromaMesh aberrationAngle={aberrationAngle} />
      </Canvas>
      {children}
    </div>
  )
}
