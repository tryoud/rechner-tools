import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 300): number {
  const [displayed, setDisplayed] = useState(target);
  // Tracks the current *animated* position, not the animation start.
  // This allows smooth chaining when a new target arrives mid-animation.
  const displayedRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = displayedRef.current;

    // Already at the target — nothing to animate.
    // displayedRef is in sync so displayed state is also correct.
    if (from === target) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);
      const next = Math.round(from + (target - from) * eased);

      displayedRef.current = next;
      setDisplayed(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Snap to exact target to avoid float rounding drift
        displayedRef.current = target;
        setDisplayed(target);
        rafRef.current = null;
      }
    };

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        // Leave displayedRef at its current mid-animation value so the
        // next animation starts from wherever we stopped.
      }
    };
  }, [target, duration]);

  return displayed;
}
