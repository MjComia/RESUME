"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, active: boolean, duration = 750) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    let startTimestamp: number | null = null;
    let rafId = 0;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [target, active, duration]);

  return value;
}

