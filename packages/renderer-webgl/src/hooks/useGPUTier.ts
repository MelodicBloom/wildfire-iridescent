/**
 * useGPUTier — singleton probe, one context per page, released immediately.
 */
import { useState, useEffect } from 'react'
import type { GPUTier, BehaviorProfile } from '@wm/governance'

let probePromise: Promise<BehaviorProfile> | null = null

function runProbe(): Promise<BehaviorProfile> {
  if (probePromise) return probePromise

  probePromise = new Promise<BehaviorProfile>((resolve) => {
    if (typeof document === 'undefined') {
      resolve({ gpuTier: 'MEDIUM', motionLevel: 'FULL', maxInterferenceOrders: 2, supportsHighP: false })
      return
    }

    const canvas = document.createElement('canvas')
    const gl =
      (canvas.getContext('webgl2') as WebGLRenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)

    if (!gl) {
      resolve({ gpuTier: 'LOW', motionLevel: 'REDUCED', maxInterferenceOrders: 0, supportsHighP: false })
      return
    }

    const precisionFmt = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
    const supportsHighP = !!precisionFmt && precisionFmt.precision > 0

    // Release probe context immediately — never counts against browser limits
    const ext = gl.getExtension('WEBGL_lose_context')
    if (ext) ext.loseContext()

    const isWebGL2 = 'drawBuffers' in gl
    const tier: GPUTier = isWebGL2 && supportsHighP ? 'HIGH' : supportsHighP ? 'MEDIUM' : 'LOW'
    const orders = tier === 'HIGH' ? 4 : tier === 'MEDIUM' ? 2 : 1

    if ('getBattery' in navigator) {
      ;(navigator as any).getBattery().then((battery: any) => {
        const degraded = !battery.charging && battery.level < 0.25
        resolve({
          gpuTier: degraded && tier === 'HIGH' ? 'MEDIUM' : tier,
          motionLevel: tier === 'LOW' ? 'REDUCED' : 'FULL',
          maxInterferenceOrders: degraded ? Math.max(1, orders - 1) : orders,
          supportsHighP,
        })
      }).catch(() => resolve({ gpuTier: tier, motionLevel: tier === 'LOW' ? 'REDUCED' : 'FULL', maxInterferenceOrders: orders, supportsHighP }))
    } else {
      resolve({ gpuTier: tier, motionLevel: tier === 'LOW' ? 'REDUCED' : 'FULL', maxInterferenceOrders: orders, supportsHighP })
    }
  })

  return probePromise
}

export function useGPUTier(): BehaviorProfile | null {
  const [profile, setProfile] = useState<BehaviorProfile | null>(null)
  useEffect(() => {
    let active = true
    runProbe().then((p) => { if (active) setProfile(p) })
    return () => { active = false }
  }, [])
  return profile
}
