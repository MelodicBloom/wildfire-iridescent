// AbaloneCanvas — thin-film WebGL canvas component
// Full source in v6 zip / renderer-webgl package
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMotionValue, useReducedMotion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';

export interface AbaloneCanvasProps {
  thicknessMotion?: MotionValue<number>;
  baseColor?: [number, number, number];
  profile?: { motionLevel: string; gpuTier: string; maxInterferenceOrders: number };
  style?: React.CSSProperties;
  className?: string;
}

export function AbaloneCanvas({ thicknessMotion, baseColor = [0.04, 0.02, 0.09], profile, style, className }: AbaloneCanvasProps) {
  const reduced = useReducedMotion();
  if (reduced || profile?.motionLevel === 'REDUCED' || profile?.motionLevel === 'NONE') {
    return <div style={{ background: 'linear-gradient(135deg,#0f0e1f,#1a0a2e)', ...style }} className={className} />;
  }
  return (
    <Canvas style={style} className={className} gl={{ antialias: false }} camera={{ position: [0,0,1] }}>
      <AbaloneScene thicknessMotion={thicknessMotion} baseColor={baseColor} orders={profile?.maxInterferenceOrders ?? 4} />
    </Canvas>
  );
}

function AbaloneScene({ thicknessMotion, baseColor, orders }: { thicknessMotion?: MotionValue<number>; baseColor: [number,number,number]; orders: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const latest = useRef(0.3);
  useEffect(() => {
    if (!thicknessMotion) return;
    return thicknessMotion.on('change', v => { latest.current = v; });
  }, [thicknessMotion]);
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uFilmThickness.value += (latest.current - matRef.current.uniforms.uFilmThickness.value) * 0.08;
  });
  const uniforms = useMemo(() => ({
    uTime:          { value: 0 },
    uFilmThickness: { value: 0.3 },
    uBaseColor:     { value: new THREE.Vector3(...baseColor) },
    uN2:            { value: 1.35 },
    uN3:            { value: 1.50 },
    uOrders:        { value: orders },
  }), []);
  return (
    <mesh>
      <planeGeometry args={[2,2]} />
      <shaderMaterial ref={matRef} uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
varying vec2 vUv;
uniform float uTime,uFilmThickness,uN2;
uniform int uOrders;
uniform vec3 uBaseColor;
vec3 spectral(float w){vec3 c=vec3(0.212,0.701,0.895),d=vec3(0.449,0.255,0.130);vec3 x=abs(vec3(w)-c)/d;return clamp(exp(-0.5*x*x),0.,1.);}
void main(){
  vec2 uv=vUv-0.5;float dist=length(uv);float cos0=1.-dist*1.2;
  float t=0.3+uFilmThickness*0.6+sin(uTime*0.4+dist*6.)*0.05;
  vec3 col=vec3(0.);
  for(int n=1;n<=4;n++){if(n>uOrders)break;float lam=2.*uN2*t*clamp(cos0,0.,1.)/float(n);float w=clamp((lam-0.38)/0.36,0.,1.);col+=spectral(w)/float(n);}
  gl_FragColor=vec4(mix(uBaseColor,col,0.85),1.);
}`} />
    </mesh>
  );
}
