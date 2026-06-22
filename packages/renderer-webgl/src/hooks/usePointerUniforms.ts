// usePointerUniforms v2 — mouse + touch → uMouse + uMouseVelocity uniforms
import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
interface PointerUniformRefs{
  uMouse:React.MutableRefObject<{value:[number,number]}|null>;
  uMouseVelocity:React.MutableRefObject<{value:number}|null>;
}
export function usePointerUniforms({uMouse,uMouseVelocity}:PointerUniformRefs){
  const{size}=useThree();
  const raw=useRef<[number,number]>([0,0]);
  const prev=useRef<[number,number]>([0,0]);
  const touching=useRef(false);
  useEffect(()=>{
    const w=size.width,h=size.height;
    const onMM=(e:MouseEvent)=>{raw.current=[e.clientX/w-.5,-(e.clientY/h-.5)];touching.current=false;};
    const onTM=(e:TouchEvent)=>{if(!e.touches.length)return;const t=e.touches[0];raw.current=[t.clientX/w-.5,-(t.clientY/h-.5)];touching.current=true;};
    const onTE=()=>{touching.current=false;};
    window.addEventListener('mousemove',onMM,{passive:true});
    window.addEventListener('touchmove',onTM,{passive:true});
    window.addEventListener('touchend',onTE,{passive:true});
    window.addEventListener('touchcancel',onTE,{passive:true});
    return()=>{window.removeEventListener('mousemove',onMM);window.removeEventListener('touchmove',onTM);window.removeEventListener('touchend',onTE);window.removeEventListener('touchcancel',onTE);};
  },[size.width,size.height]);
  useFrame(()=>{
    const[cx,cy]=raw.current,[px,py]=prev.current,spd=Math.hypot(cx-px,cy-py);
    if(uMouse.current)uMouse.current.value=[cx,cy];
    if(uMouseVelocity.current){
      if(!touching.current&&spd<0.0001)uMouseVelocity.current.value*=0.88;
      else uMouseVelocity.current.value=uMouseVelocity.current.value*.82+spd*.18;
    }
    prev.current=[cx,cy];
  });
}
