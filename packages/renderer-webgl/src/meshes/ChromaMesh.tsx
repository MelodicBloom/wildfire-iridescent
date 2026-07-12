import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTokenUniforms } from '../hooks/useTokenUniforms'

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */`
  precision mediump float;
  uniform float uTime;
  uniform float uAnimationSpeed;
  uniform float uAberrationAngle;
  varying vec2  vUv;

  void main() {
    float t = uTime * 0.4 * uAnimationSpeed + uAberrationAngle;
    float r = 0.5 + 0.5 * sin(t + vUv.x * 5.0);
    float g = 0.5 + 0.5 * sin(t + vUv.y * 5.0 + 2.094);
    float b = 0.5 + 0.5 * sin(t + (vUv.x + vUv.y) * 4.0 + 4.189);
    float alpha = 0.18 + 0.12 * sin(t);
    gl_FragColor = vec4(r, g, b, alpha);
  }
`

interface ChromaMeshProps {
  aberrationAngle: number
}

export function ChromaMesh({ aberrationAngle }: ChromaMeshProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  useTokenUniforms(matRef)

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    matRef.current.uniforms.uAberrationAngle.value = aberrationAngle
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={{
          uTime: { value: 0 },
          uAnimationSpeed: { value: 1 },
          uAberrationAngle: { value: 0 },
        }}
      />
    </mesh>
  )
}
