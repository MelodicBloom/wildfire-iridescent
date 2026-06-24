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
  uniform vec2  uMouse;
  varying vec2  vUv;

  vec3 thinFilm(vec2 uv, float t, vec2 ptr) {
    float d = length(uv - (ptr * 0.5 + 0.5));
    float phase = t * 0.5 + d * 9.0;
    float r  = 0.5 + 0.5 * sin(phase);
    float g  = 0.5 + 0.5 * sin(phase + 2.094);
    float b  = 0.5 + 0.5 * sin(phase + 4.189);
    float r2 = 0.3 + 0.3 * sin(phase * 2.0 + 0.5);
    float g2 = 0.3 + 0.3 * sin(phase * 2.0 + 2.594);
    float b2 = 0.3 + 0.3 * sin(phase * 2.0 + 4.689);
    return mix(vec3(r, g, b), vec3(r2, g2, b2), 0.4);
  }

  void main() {
    vec3 col = thinFilm(vUv, uTime, uMouse);
    gl_FragColor = vec4(col, 1.0);
  }
`

export function AbaloneShader() {
  const mouseRef    = useRef<{ value: [number, number] }>(null)
  const velocityRef = useRef<{ value: number }>(null)
  const matRef      = useRef<THREE.ShaderMaterial>(null)

  usePointerUniforms({ uMouse: mouseRef, uMouseVelocity: velocityRef })

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value  = clock.getElapsedTime()
    matRef.current.uniforms.uMouse.value = mouseRef.current?.value ?? [0, 0]
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime:  { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  )
}
