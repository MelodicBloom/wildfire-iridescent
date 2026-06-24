import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePointerUniforms } from '../hooks/usePointerUniforms'

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
  uniform vec2  uPointer;
  varying vec2  vUv;

  vec3 prismChroma(vec2 uv, vec2 ptr, float t) {
    float d = length(uv - ptr);
    float ring = smoothstep(0.35, 0.0, d) * smoothstep(0.0, 0.35, d);
    float r = ring * (0.5 + 0.5 * sin(t + uv.x * 8.0));
    float g = ring * (0.5 + 0.5 * sin(t + uv.y * 8.0 + 2.094));
    float b = ring * (0.5 + 0.5 * sin(t + (uv.x + uv.y) * 6.0 + 4.189));
    return vec3(r, g, b);
  }

  void main() {
    vec3 col = prismChroma(vUv, uPointer * 0.5 + 0.5, uTime);
    gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
`

export function PrismMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = usePointerUniforms()

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    matRef.current.uniforms.uPointer.value = uniforms.uPointer.value
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
          uTime:    { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  )
}
