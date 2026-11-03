"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.01
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    // Clamp threshold for tall elements so intersectionRatio can always be reached
    const rect = node.getBoundingClientRect();
    const viewportH = window.innerHeight || 800;
    const maxPossibleRatio =
      rect.height > 0 ? Math.min(1, (viewportH * 0.5) / rect.height) : threshold;
    const safeThreshold = Math.max(0.005, Math.min(threshold, maxPossibleRatio));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: safeThreshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
