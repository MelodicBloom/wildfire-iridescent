// PrismEyeCursor — spectral iris cursor overlay
// Tracks pointer via mousemove + touchmove; velocity drives outer glow
'use client';
import React,{useRef,useMemo,useEffect} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {useReducedMotion} from 'framer-motion';
export interface PrismEyeCursorProps{radius?:number;pupilRadius?:number;zIndex?:number;}
export function PrismEyeCursor({radius=0.045,pupilRadius=0.014,zIndex=9999}:PrismEyeCursorProps){
  const reduced=useReducedMotion();
  if(reduced)return null;
  return(
    <Canvas style={{position:'fixed',inset:0,pointerEvents:'none',zIndex,mixBlendMode:'screen'}}
      gl={{antialias:false,alpha:true}} camera={{position:[0,0,1]}}>
      <PrismScene radius={radius} pupilRadius={pupilRadius}/>
    </Canvas>
  );
}
function PrismScene({radius,pupilRadius}:{radius:number;pupilRadius:number}){
  const matRef=useRef<THREE.ShaderMaterial>(null!);
  const mouse=useRef<[number,number]>([0,0]);
  const prevMouse=useRef<[number,number]>([0,0]);
  const touching=useRef(false);
  useEffect(()=>{
    const onMM=(e:MouseEvent)=>{mouse.current=[e.clientX/window.innerWidth-.5,-(e.clientY/window.innerHeight-.5)];touching.current=false;};
    const onTM=(e:TouchEvent)=>{if(!e.touches.length)return;const t=e.touches[0];mouse.current=[t.clientX/window.innerWidth-.5,-(t.clientY/window.innerHeight-.5)];touching.current=true;};
    const onTE=()=>{touching.current=false;};
    window.addEventListener('mousemove',onMM,{passive:true});
    window.addEventListener('touchmove',onTM,{passive:true});
    window.addEventListener('touchend',onTE,{passive:true});
    window.addEventListener('touchcancel',onTE,{passive:true});
    return()=>{window.removeEventListener('mousemove',onMM);window.removeEventListener('touchmove',onTM);window.removeEventListener('touchend',onTE);window.removeEventListener('touchcancel',onTE);};
  },[]);
  const uniforms=useMemo(()=>({uMouse:{value:new THREE.Vector2(0,0)},uMouseVelocity:{value:0},uTime:{value:0},uRadius:{value:radius},uPupilRadius:{value:pupilRadius}}),[radius,pupilRadius]);
  useFrame(({clock})=>{
    if(!matRef.current)return;
    const[cx,cy]=mouse.current,[px,py]=prevMouse.current;
    const spd=Math.hypot(cx-px,cy-py);
    uniforms.uMouse.value.set(cx,cy);
    if(!touching.current&&spd<0.0001)uniforms.uMouseVelocity.value*=0.88;
    else uniforms.uMouseVelocity.value=uniforms.uMouseVelocity.value*0.82+spd*0.18;
    uniforms.uTime.value=clock.elapsedTime;
    prevMouse.current=[cx,cy];
  });
  return(
    <mesh>
      <planeGeometry args={[2,2]}/>
      <shaderMaterial ref={matRef} uniforms={uniforms} transparent
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;uniform vec2 uMouse;uniform float uMouseVelocity,uTime,uRadius,uPupilRadius;
vec3 spectral(float w){vec3 c=vec3(.212,.701,.895),d=vec3(.449,.255,.130);vec3 x=abs(vec3(w)-c)/d;return clamp(exp(-.5*x*x),0.,1.);}
void main(){
vec2 p=vUv-.5-uMouse;float dist=length(p);
float outer=smoothstep(uRadius+.006,uRadius,dist),inner=smoothstep(uPupilRadius,uPupilRadius+.004,dist),ring=outer*inner;
float a=atan(p.y,p.x),h=fract(a/6.2832+uTime*.12);
vec3 sc=spectral(h);
float gd=smoothstep(uRadius+.04+uMouseVelocity*.06,uRadius,dist);
vec3 col=sc*ring+sc*gd*uMouseVelocity*.55;
gl_FragColor=vec4(col,max(ring,gd*uMouseVelocity*.4));}`}/>
    </mesh>
  );
}
