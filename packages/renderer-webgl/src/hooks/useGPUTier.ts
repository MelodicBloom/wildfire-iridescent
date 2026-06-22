import { useState, useEffect } from 'react'

export type GPUTier = 'low' | 'mid' | 'high'

export interface GPUQuality {
  tier: GPUTier
  /** dpr cap: low=1, mid=1.25, high=1.5 */
  dpr: [number, number]
  /** max fragment shader samples */
  samples: number
  /** whether to enable full thin-film interference pass */
  filmPass: boolean
  /** whether chromatic aberration is enabled */
  aberration: boolean
}

/**
 * Detects GPU capability using WebGL renderer string heuristics.
 * Scales shader quality to keep 60fps on mid-tier and graceful
 * 30fps on low-tier devices.
 *
 * TOKEN DEPENDENCY: none — pure capability detection.
 */
export function useGPUTier(): GPUQuality {
  const [quality, setQuality] = useState<GPUQuality>({
    tier: 'high',
    dpr: [1, 1.5],
    samples: 4,
    filmPass: true,
    aberration: true,
  })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      if (!gl) return

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
        : ''

      const rendererLower = renderer.toLowerCase()

      // Low tier: Mali-4xx, Adreno 3xx/4xx, PowerVR SGX, Intel HD 3000-4000
      const isLow =
        /mali-4|mali-3|adreno 3|adreno 4|powervr sgx|intel hd (3|4)/.test(rendererLower) ||
        rendererLower.includes('swiftshader')

      // Mid tier: Mali-7xx, Adreno 5xx, Intel UHD 6xx, Intel Iris (non-Xe)
      const isMid =
        /mali-7|mali-6|adreno 5|intel uhd 6|intel iris (plus|pro)/.test(rendererLower)

      if (isLow) {
        setQuality({ tier: 'low', dpr: [1, 1], samples: 1, filmPass: false, aberration: false })
      } else if (isMid) {
        setQuality({ tier: 'mid', dpr: [1, 1.25], samples: 2, filmPass: true, aberration: false })
      }
      // else stays 'high'
    } catch {
      // Silently keep high default if detection fails
    }
  }, [])

  return quality
}
