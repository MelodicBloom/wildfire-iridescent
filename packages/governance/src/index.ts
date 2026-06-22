// @wm/governance — GPU tier detection + BehaviorProfile
export type GpuTier = 'HIGH'|'MEDIUM'|'LOW';
export type MotionLevel = 'FULL'|'REDUCED'|'NONE';
export interface BehaviorProfile{
  gpuTier:GpuTier;motionLevel:MotionLevel;
  maxInterferenceOrders:number;supportsHighP:boolean;
}
export async function probeCapability():Promise<BehaviorProfile>{
  const reduced=typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(reduced)return{gpuTier:'LOW',motionLevel:'NONE',maxInterferenceOrders:0,supportsHighP:false};
  const times:number[]=[];
  await new Promise<void>(res=>{
    let last=performance.now(),c=0;
    const tick=()=>{const n=performance.now();times.push(n-last);last=n;if(++c<10)requestAnimationFrame(tick);else res();};
    requestAnimationFrame(tick);
  });
  const avg=times.reduce((a,b)=>a+b,0)/times.length;
  let batteryDerate=false;
  try{const nav=navigator as any;if(nav.getBattery){const b=await nav.getBattery();batteryDerate=!b.charging&&b.level<0.25;}}catch{}
  let gpuTier:GpuTier=avg<6?'HIGH':avg<14?'MEDIUM':'LOW';
  if(batteryDerate&&gpuTier==='HIGH')gpuTier='MEDIUM';
  if(batteryDerate&&gpuTier==='MEDIUM')gpuTier='LOW';
  let supportsHighP=false;
  try{const c=document.createElement('canvas'),gl=c.getContext('webgl') as any;if(gl){const f=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);supportsHighP=f!=null&&f.precision>0;}}catch{}
  const m={HIGH:{orders:4,motion:'FULL' as MotionLevel},MEDIUM:{orders:2,motion:'FULL' as MotionLevel},LOW:{orders:1,motion:'REDUCED' as MotionLevel}};
  return{gpuTier,motionLevel:m[gpuTier].motion,maxInterferenceOrders:m[gpuTier].orders,supportsHighP};
}
