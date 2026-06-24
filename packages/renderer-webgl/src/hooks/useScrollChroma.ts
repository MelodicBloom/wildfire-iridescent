// useScrollChroma — scroll velocity → dispersion + tilt → aberration angle
// Uses a plain rAF loop instead of useFrame so it is safe to call outside a
// React Three Fiber <Canvas> (e.g. from TiltedChromaCard which is a DOM component).
import { useEffect, useRef } from 'react';
import {
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';

export interface UseScrollChromaOptions {
  velocityRange?: number;
  spring?: { stiffness: number; damping: number };
  cardTilt?: { rotateX: MotionValue<number>; rotateY: MotionValue<number> };
}

export interface UseScrollChromaResult {
  dispersionRef: React.MutableRefObject<{ value: number } | null>;
  aberrationAngleRef: React.MutableRefObject<{ value: number } | null>;
}

export function useScrollChroma(
  options: UseScrollChromaOptions = {}
): UseScrollChromaResult {
  const {
    velocityRange = 1500,
    spring = { stiffness: 180, damping: 28 },
    cardTilt,
  } = options;

  const dispersionRef = useRef<{ value: number } | null>(null);
  const aberrationAngleRef = useRef<{ value: number } | null>(null);
  const latestDispersion = useRef(0);
  const latestAngle = useRef(0);

  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const mapped = useTransform(
    rawVelocity,
    [-velocityRange, 0, velocityRange],
    [-1, 0, 1]
  );
  const smooth = useSpring(mapped, spring);

  // Subscribe to smooth dispersion value changes
  useEffect(
    () => smooth.on('change', (v) => { latestDispersion.current = Math.abs(v); }),
    [smooth]
  );

  // Subscribe to card tilt changes for aberration angle
  useEffect(() => {
    if (!cardTilt) return;
    const unsubs = [
      cardTilt.rotateX.on('change', () => {
        const rx = cardTilt.rotateX.get() * Math.PI / 180;
        const ry = cardTilt.rotateY.get() * Math.PI / 180;
        latestAngle.current = Math.atan2(rx, ry);
      }),
      cardTilt.rotateY.on('change', () => {
        const rx = cardTilt.rotateX.get() * Math.PI / 180;
        const ry = cardTilt.rotateY.get() * Math.PI / 180;
        latestAngle.current = Math.atan2(rx, ry);
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [cardTilt]);

  // Fallback: derive angle from scroll direction when no tilt is provided
  useEffect(() => {
    if (cardTilt) return;
    return rawVelocity.on('change', (v) => {
      latestAngle.current = v > 0 ? Math.PI / 2 : -Math.PI / 2;
    });
  }, [rawVelocity, cardTilt]);

  // Plain rAF loop — safe outside R3F Canvas, identical cadence to useFrame
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (dispersionRef.current) {
        dispersionRef.current.value +=
          (latestDispersion.current - dispersionRef.current.value) * 0.12;
      }
      if (aberrationAngleRef.current) {
        aberrationAngleRef.current.value +=
          (latestAngle.current - aberrationAngleRef.current.value) * 0.08;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return { dispersionRef, aberrationAngleRef };
}
