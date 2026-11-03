"use client";

import React from "react";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  accent?: "code" | "data" | "neutral";
}

interface TagFilterProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function TagFilter({
  options,
  selected,
  onChange,
  ariaLabel = "Filter items",
}: TagFilterProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((opt) => {
        const active = selected === opt.value;
        const accent = opt.accent ?? "code";

        let activeStyle =
          "bg-code/15 text-code border-code/50 shadow-[0_0_16px_-6px_rgb(var(--color-code)/0.45)]";
        if (accent === "data") {
          activeStyle =
            "bg-data/15 text-data border-data/50 shadow-[0_0_16px_-6px_rgb(var(--color-data)/0.45)]";
        } else if (accent === "neutral") {
          activeStyle = "bg-elevated text-ink border-ink/30";
        }

        return (
          <button
            key={opt.value}
            type="button"
            suppressHydrationWarning
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs border transition-all ${
              active
                ? activeStyle
                : "bg-panel text-muted border-hairline hover:text-ink hover:border-muted/50"
            }`}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span
                className={`tabular-nums text-[11px] px-1.5 py-0.2 rounded-xs ${
                  active ? "bg-canvas/60" : "bg-elevated text-faint"
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

