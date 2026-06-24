import { useRef, useEffect } from 'react'

/**
 * Tracks scroll velocity and maps it to a chromatic aberration angle (radians).
 * Returns a smoothed float in [0, 2π] range.
 */
export function useAberrationAngle(): number {
  const angleRef = useRef(0)
  const lastScrollY = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    let smoothed = 0
    let raw = 0

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY
      raw = Math.atan2(delta * 0.01, 1)
    }

    const tick = () => {
      smoothed += (raw - smoothed) * 0.08
      raw *= 0.92
      angleRef.current = smoothed
      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return angleRef.current
}
