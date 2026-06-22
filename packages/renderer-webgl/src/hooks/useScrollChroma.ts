// useScrollChroma — scroll velocity → dispersion + tilt → aberration angle
import {useEffect,useRef} from 'react';
import {useScroll,useVelocity,useTransform,useSpring,type MotionValue} from 'framer-motion';
import {useFrame} from '@react-three/fiber';
export interface UseScrollChromaOptions{
  velocityRange?:number;
  spring?:{stiffness:number;damping:number};
  cardTilt?:{rotateX:MotionValue<number>;rotateY:MotionValue<number>};
}
export interface UseScrollChromaResult{
  dispersionRef:React.MutableRefObject<{value:number}|null>;
  aberrationAngleRef:React.MutableRefObject<{value:number}|null>;
}
export function useScrollChroma(options:UseScrollChromaOptions={}):UseScrollChromaResult{
  const{velocityRange=1500,spring={stiffness:180,damping:28},cardTilt}=options;
  const dispersionRef=useRef<{value:number}|null>(null);
  const aberrationAngleRef=useRef<{value:number}|null>(null);
  const latestDispersion=useRef(0);
  const latestAngle=useRef(0);
  const{scrollY}=useScroll();
  const rawVelocity=useVelocity(scrollY);
  const mapped=useTransform(rawVelocity,[-velocityRange,0,velocityRange],[-1,0,1]);
  const smooth=useSpring(mapped,spring);
  useEffect(()=>smooth.on('change',v=>{latestDispersion.current=Math.abs(v);}),[smooth]);
  useEffect(()=>{
    if(!cardTilt)return;
    const u=[cardTilt.rotateX.on('change',()=>{
      const rx=cardTilt.rotateX.get()*Math.PI/180,ry=cardTilt.rotateY.get()*Math.PI/180;
      latestAngle.current=Math.atan2(rx,ry);
    }),cardTilt.rotateY.on('change',()=>{
      const rx=cardTilt.rotateX.get()*Math.PI/180,ry=cardTilt.rotateY.get()*Math.PI/180;
      latestAngle.current=Math.atan2(rx,ry);
    })];
    return()=>u.forEach(u=>u());
  },[cardTilt]);
  useEffect(()=>{
    if(cardTilt)return;
    return rawVelocity.on('change',v=>{latestAngle.current=v>0?Math.PI/2:-Math.PI/2;});
  },[rawVelocity,cardTilt]);
  useFrame(()=>{
    if(dispersionRef.current)dispersionRef.current.value+=(latestDispersion.current-dispersionRef.current.value)*.12;
    if(aberrationAngleRef.current)aberrationAngleRef.current.value+=(latestAngle.current-aberrationAngleRef.current.value)*.08;
  });
  return{dispersionRef,aberrationAngleRef};
}
