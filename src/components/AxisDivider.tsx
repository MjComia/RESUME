import React from "react";

interface AxisDividerProps {
  coordinate: string;
  accent?: "code" | "data";
}

export function AxisDivider({
  coordinate,
  accent = "code",
}: AxisDividerProps) {
  const ticks = ["0%", "25%", "50%", "75%", "100%"];

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 select-none"
      aria-hidden="true"
    >
      <div className="relative py-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-faint mb-1.5">
          <span className="inline-flex items-center gap-2">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                accent === "code" ? "bg-code" : "bg-data"
              }`}
            />
            <span className="text-muted">{coordinate}</span>
          </span>
          <div className="hidden sm:flex items-center gap-12 tabular-nums">
            {ticks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
        </div>
        <div className="relative h-px bg-hairline w-full">
          <div className="absolute inset-x-0 -top-1 flex justify-between pointer-events-none">
            {ticks.map((tick) => (
              <span key={tick} className="w-px h-2 bg-hairline block" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

