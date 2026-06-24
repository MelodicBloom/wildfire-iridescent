import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AbaloneShader } from '../shaders/AbaloneShader'
import { useWebGLReadyGate } from '../hooks/useWebGLReadyGate'

export interface AbaloneCanvasProps {
  className?: string
  style?: React.CSSProperties
}

export function AbaloneCanvas({ className, style }: AbaloneCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { onReady } = useWebGLReadyGate(rootRef)

  return (
    <div ref={rootRef} className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setAnimationLoop(() => {
            onReady()
            gl.setAnimationLoop(null)
          })
        }}
        dpr={[1, 1.5]}
      >
        <AbaloneShader />
      </Canvas>
    </div>
  )
}
