'use client';
import dynamic from 'next/dynamic';
export const WebGLLayer=dynamic(()=>import('@wm/renderer-webgl').then(({SharedChromaProvider,PrismEyeCursor})=>{function L(){return(<SharedChromaProvider><PrismEyeCursor/></SharedChromaProvider>);}return{default:L};}),{ssr:false});
export const AbaloneCanvas=dynamic(()=>import('@wm/renderer-webgl').then(m=>({default:m.AbaloneCanvas})),{ssr:false,loading:()=><div style={{background:'#0f0e1f',borderRadius:16}}/>});
export const TiltedChromaCard=dynamic(()=>import('@wm/renderer-webgl').then(m=>({default:m.TiltedChromaCard})),{ssr:false,loading:()=><div style={{background:'#0f0e1f',borderRadius:16}}/>});
