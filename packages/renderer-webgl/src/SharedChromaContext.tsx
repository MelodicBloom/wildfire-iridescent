// SharedChromaContext — single WebGL context for all TiltedChromaCard instances
// Uses scissor-test pattern: one Canvas, one draw call per card per frame
"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect, useMemo, useId, PropsWithChildren } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export interface CardUniforms { uDispersion: number; uAberrationAngle: number; }
interface CardRegistration { id: string; domRef: React.RefObject<HTMLElement>; uniforms: React.MutableRefObject<CardUniforms>; }
interface SharedChromaContextValue { register: (r: CardRegistration) => void; unregister: (id: string) => void; }

const SharedChromaCtx = createContext<SharedChromaContextValue | null>(null);
export function useSharedChroma() {
  const ctx = useContext(SharedChromaCtx);
  if (!ctx) throw new Error('useSharedChroma must be inside SharedChromaProvider');
  return ctx;
}

const VERT=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
FRAG=`precision mediump float;varying vec2 vUv;uniform float uDispersion,uAberrationAngle;
void main(){vec2 dir=vUv-0.5;float len=length(dir);vec2 ax=vec2(cos(uAberrationAngle),sin(uAberrationAngle));
vec2 off=ax*len*uDispersion*0.022;vec3 base=vec3(0.12+vUv.x*.15,0.08+vUv.y*.12,0.22+(vUv.x+vUv.y)*.10);
float r=base.r+length(clamp(vUv-off,.001,.999)-.5)*.3,g=base.g,b=base.b+length(clamp(vUv+off,.001,.999)-.5)*.3;
gl_FragColor=vec4(clamp(vec3(r,g,b),0.,1.),1.);}`,
geo=new THREE.PlaneGeometry(2,2);

function SharedScene({regs}:{regs:React.MutableRefObject<Map<string,CardRegistration>>}){
  const {gl,camera,scene}=useThree();
  const mat=useMemo(()=>new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:FRAG,uniforms:{uDispersion:{value:0},uAberrationAngle:{value:0}}}),[]);
  const mesh=useMemo(()=>new THREE.Mesh(geo,mat),[mat]);
  useEffect(()=>{scene.add(mesh);return()=>{scene.remove(mesh);}},[scene,mesh]);
  useFrame(()=>{
    const cb=gl.domElement.getBoundingClientRect();
    gl.setScissorTest(true);
    regs.current.forEach(({domRef,uniforms})=>{
      const el=domRef.current; if(!el) return;
      const r=el.getBoundingClientRect();
      const l=r.left-cb.left,bot=cb.bottom-r.bottom,w=r.width,h=r.height;
      if(w<=0||h<=0)return;
      gl.setViewport(l,bot,w,h);gl.setScissor(l,bot,w,h);
      mat.uniforms.uDispersion.value=uniforms.current.uDispersion;
      mat.uniforms.uAberrationAngle.value=uniforms.current.uAberrationAngle;
      gl.render(scene,camera);
    });
    gl.setScissorTest(false);gl.setViewport(0,0,gl.domElement.width,gl.domElement.height);
  },1);
  return null;
}

export function SharedChromaProvider({children}:PropsWithChildren){
  const reduced=useReducedMotion();
  const regs=useRef<Map<string,CardRegistration>>(new Map());
  const register=useCallback((r:CardRegistration)=>{regs.current.set(r.id,r);},[]);
  const unregister=useCallback((id:string)=>{regs.current.delete(id);},[]);
  return(
    <SharedChromaCtx.Provider value={{register,unregister}}>
      {children}
      {!reduced&&(
        <Canvas style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:10,mixBlendMode:'screen'}}
          gl={{antialias:false,alpha:true}} camera={{position:[0,0,1]}} frameloop='always'>
          <SharedScene regs={regs}/>
        </Canvas>
      )}
    </SharedChromaCtx.Provider>
  );
}
