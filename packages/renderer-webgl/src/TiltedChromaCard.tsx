// TiltedChromaCard — DOM tilt + shared WebGL chroma overlay
// Registers with SharedChromaProvider; zero per-card Canvas
'use client';
import React,{useRef,useCallback,useId,PropsWithChildren,useEffect} from 'react';
import {motion,useMotionValue,useSpring,useTransform,useReducedMotion} from 'framer-motion';
import {useScrollChroma} from './hooks/useScrollChroma';

export interface TiltedChromaCardProps extends PropsWithChildren{
  width?:number;height?:number;tiltStrength?:number;className?:string;style?:React.CSSProperties;
}

export function TiltedChromaCard({children,width=400,height=280,tiltStrength=12,className,style}:TiltedChromaCardProps){
  const reduced=useReducedMotion();
  const id=useId();
  const domRef=useRef<HTMLDivElement>(null!);
  const uniformsRef=useRef({uDispersion:0,uAberrationAngle:0});
  let sharedCtx:any=null;
  try{const {useSharedChroma}=require('./SharedChromaContext');sharedCtx=useSharedChroma();}catch{}
  const mouseX=useMotionValue(0),mouseY=useMotionValue(0);
  const rotateX=useTransform(mouseY,[-0.5,0.5],[tiltStrength,-tiltStrength]);
  const rotateY=useTransform(mouseX,[-0.5,0.5],[-tiltStrength,tiltStrength]);
  const springRX=useSpring(rotateX,{stiffness:200,damping:22});
  const springRY=useSpring(rotateY,{stiffness:200,damping:22});
  const {dispersionRef,aberrationAngleRef}=useScrollChroma({velocityRange:1200,spring:{stiffness:160,damping:24},cardTilt:{rotateX:springRX,rotateY:springRY}});
  useEffect(()=>{
    dispersionRef.current={get value(){return uniformsRef.current.uDispersion;},set value(v){uniformsRef.current.uDispersion=v;}};
    aberrationAngleRef.current={get value(){return uniformsRef.current.uAberrationAngle;},set value(v){uniformsRef.current.uAberrationAngle=v;}};
  },[]);
  useEffect(()=>{
    if(!sharedCtx||reduced)return;
    sharedCtx.register({id,domRef,uniforms:uniformsRef});
    return()=>sharedCtx.unregister(id);
  },[id,sharedCtx,reduced]);
  const onMouseMove=useCallback((e:React.MouseEvent)=>{
    const r=domRef.current?.getBoundingClientRect();if(!r)return;
    mouseX.set((e.clientX-r.left)/r.width-.5);mouseY.set((e.clientY-r.top)/r.height-.5);
  },[mouseX,mouseY]);
  const onMouseLeave=useCallback(()=>{mouseX.set(0);mouseY.set(0);},[mouseX,mouseY]);
  return(
    <div ref={domRef} className={className} style={{position:'relative',width,height,...style}}>
      <motion.div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
        style={{width:'100%',height:'100%',borderRadius:16,overflow:'hidden',perspective:800,
          rotateX:reduced?0:springRX,rotateY:reduced?0:springRY,transformStyle:'preserve-3d'}}>
        {children}
      </motion.div>
    </div>
  );
}
