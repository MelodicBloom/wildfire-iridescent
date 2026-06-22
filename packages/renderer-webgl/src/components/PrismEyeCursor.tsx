import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { PrismMesh } from '../meshes/PrismMesh'

interface PrismEyeCursorProps {
  className?: string
}

export function PrismEyeCursor({ className }: PrismEyeCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const readyFired = useRef(false)

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
        dpr={[1, 1.5]}
      >
        <ReadyGateBridge />
        <PrismMesh />
      </Canvas>
    </div>
  )
}
