import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'
import { useAberrationAngle } from '../hooks/useAberrationAngle'
import { ChromaMesh } from '../meshes/ChromaMesh'

interface TiltedChromaCardProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function TiltedChromaCard({ children, className, style }: TiltedChromaCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)
  const readyFired = useRef(false)
  const aberrationAngle = useAberrationAngle()

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
      style={{ position: 'relative', ...style }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ReadyGateBridge />
        <ChromaMesh aberrationAngle={aberrationAngle} />
      </Canvas>
      {children}
    </div>
  )
}
