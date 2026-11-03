"use client";

import React from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useReveal } from "@/hooks/useReveal";

export interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  delta?: string;
  detail: string;
  accent?: "code" | "data";
}

export function StatCard({
  label,
  value,
  suffix = "",
  delta,
  detail,
  accent = "code",
}: StatCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  const animatedValue = useCountUp(value, visible);

  const isCode = accent === "code";

  return (
    <div
      ref={ref}
      className={`group relative bg-panel p-5 transition-colors ${
        isCode ? "hover:bg-elevated/60" : "hover:bg-elevated/60"
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity opacity-75 group-hover:opacity-100 ${
          isCode ? "bg-code" : "bg-data"
        }`}
      />
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-xs text-muted">{label}</span>
        {delta && (
          <span
            className={`font-mono text-[11px] px-1.5 py-0.5 rounded-xs tabular-nums ${
              isCode
                ? "bg-code/10 text-code border border-code/25"
                : "bg-data/10 text-data border border-data/25"
            }`}
          >
            {delta}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1 font-mono text-3xl sm:text-4xl font-bold text-ink tabular-nums tracking-tight">
        <span>{animatedValue}</span>
        {suffix && (
          <span
            className={`text-lg font-medium ${
              isCode ? "text-code" : "text-data"
            }`}
          >
            {suffix}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-muted leading-snug">{detail}</p>
    </div>
  );
}

