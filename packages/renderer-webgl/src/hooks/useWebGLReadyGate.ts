import { useEffect, useRef, useCallback } from 'react'

/**
 * Emits data-ready="1" on a DOM element after the WebGL context
 * confirms its first painted frame. Safe to call in any render context
 * (Storybook, Next.js, Vite playground).
 */
export function useWebGLReadyGate(domRef: React.RefObject<HTMLElement | null>) {
  const fired = useRef(false)

  const onReady = useCallback(() => {
    if (fired.current) return
    fired.current = true
    // Two rAF ticks guarantees the GPU has submitted at least one frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (domRef.current) {
          domRef.current.setAttribute('data-ready', '1')
        }
      })
    })
  }, [domRef])

  // Reset gate if component remounts (e.g. HMR, Storybook remount)
  useEffect(() => {
    fired.current = false
    return () => {
      fired.current = false
    }
  }, [])

  return { onReady }
}
