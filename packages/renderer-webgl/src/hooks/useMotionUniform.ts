// useMotionUniform — bridges MotionValue<number> to a Three.js uniform
import {useEffect,useRef} from 'react';
import {type MotionValue} from 'framer-motion';
import {useFrame} from '@react-three/fiber';
export interface MotionUniformOptions{transform?:(v:number)=>number;lerpFactor?:number;}
export function useMotionUniform(
  motionValue:MotionValue<number>,
  uniformRef:React.MutableRefObject<{value:number}|null>,
  options:MotionUniformOptions={}
){
  const{transform,lerpFactor=1}=options;
  const latest=useRef(0);
  useEffect(()=>motionValue.on('change',v=>{latest.current=transform?transform(v):v;}),[motionValue,transform]);
  useFrame(()=>{
    const u=uniformRef.current;if(!u)return;
    if(lerpFactor>=1)u.value=latest.current;
    else u.value+=(latest.current-u.value)*lerpFactor;
  });
}
