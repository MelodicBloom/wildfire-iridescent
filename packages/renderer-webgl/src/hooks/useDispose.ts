import { useEffect, useRef } from 'react'
import type * as THREE from 'three'

/**
 * Registers WebGL resources for automatic disposal on unmount.
 *
 * Use this for manually-created geometries, materials, and textures that are not
 * fully owned by React Three Fiber's normal lifecycle. Registered resources are
 * disposed exactly once when the component using this hook unmounts.
 */
export function useDispose() {
  const geometries = useRef<THREE.BufferGeometry[]>([])
  const materials = useRef<THREE.Material[]>([])
  const textures = useRef<THREE.Texture[]>([])

  useEffect(() => {
    return () => {
      geometries.current.forEach((geometry) => geometry.dispose())
      materials.current.forEach((material) => material.dispose())
      textures.current.forEach((texture) => texture.dispose())
      geometries.current = []
      materials.current = []
      textures.current = []
    }
  }, [])

  return {
    registerGeometry: (geometry: THREE.BufferGeometry) => {
      geometries.current.push(geometry)
    },
    registerMaterial: (material: THREE.Material) => {
      materials.current.push(material)
    },
    registerTexture: (texture: THREE.Texture) => {
      textures.current.push(texture)
    },
  }
}
