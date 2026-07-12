import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePointerUniforms } from '../hooks/usePointerUniforms'
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
  uniform vec2  uMouse;
  varying vec2  vUv;

  vec3 prismChroma(vec2 uv, vec2 ptr, float t) {
    float d = length(uv - (ptr * 0.5 + 0.5));
    float ring = smoothstep(0.35, 0.0, d) * smoothstep(0.0, 0.35, d);
    float r = ring * (0.5 + 0.5 * sin(t + uv.x * 8.0));
    float g = ring * (0.5 + 0.5 * sin(t + uv.y * 8.0 + 2.094));
    float b = ring * (0.5 + 0.5 * sin(t + (uv.x + uv.y) * 6.0 + 4.189));
    return vec3(r, g, b);
  }

  void main() {
    vec3 col = prismChroma(vUv, uMouse, uTime * uAnimationSpeed);
    gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
`

export function PrismMesh() {
  const mouseRef = useRef<{ value: [number, number] }>(null)
  const velocityRef = useRef<{ value: number }>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  usePointerUniforms({ uMouse: mouseRef, uMouseVelocity: velocityRef })
  useTokenUniforms(matRef)

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    matRef.current.uniforms.uMouse.value = mouseRef.current?.value ?? [0, 0]
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
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  )
}
