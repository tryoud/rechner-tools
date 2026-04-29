import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  formatFn?: (val: number) => string;
  durationMs?: number;
}

// Ease out expo for a snappy but smooth slowdown
const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export function AnimatedNumber({
  value,
  formatFn = String,
  durationMs = 400,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;

    // If the value hasn't changed, no need to animate
    if (startValue === value) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      const ease = easeOutExpo(progress);

      const current = startValue + (value - startValue) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, durationMs]); // Only re-run when the target value changes

  return <>{formatFn ? formatFn(displayValue) : String(displayValue)}</>;
}
