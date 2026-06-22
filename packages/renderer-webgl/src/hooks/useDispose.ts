import { useEffect, useRef } from 'react'
import type * as THREE from 'three'

/**
 * Registers WebGL resources for automatic disposal on unmount.
 * Prevents GPU memory leaks when components are removed from the tree.
 *
 * Usage:
 *   const { registerGeometry, registerMaterial, registerTexture } = useDispose()
 */
export function useDispose() {
  const geometries = useRef<THREE.BufferGeometry[]>([])
  const materials  = useRef<THREE.Material[]>([])
  const textures   = useRef<THREE.Texture[]>([])

  useEffect(() => {
    return () => {
      geometries.current.forEach(g => g.dispose())
      materials.current.forEach(m => m.dispose())
      textures.current.forEach(t => t.dispose())
      geometries.current = []
      materials.current  = []
      textures.current   = []
    }
  }, [])

  return {
    registerGeometry: (g: THREE.BufferGeometry) => { geometries.current.push(g) },
    registerMaterial: (m: THREE.Material)       => { materials.current.push(m) },
    registerTexture:  (t: THREE.Texture)        => { textures.current.push(t) },
  }
}
