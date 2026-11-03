"use client";

import React from "react";
import { SkillCategoryGroup } from "@/types/portfolio";

interface SkillChartProps {
  skills: SkillCategoryGroup[];
}

export function SkillChart({ skills }: SkillChartProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-mono text-lg font-semibold text-ink">
          Technical Stack
        </h3>
        <p className="text-sm text-muted">
          Languages, frameworks, and analytical tools grouped by how I use them.
        </p>
      </div>

      <div className="bg-panel border border-hairline rounded-md divide-y divide-hairline overflow-hidden">
        {skills.map((group) => {
          const isCode = group.accent === "code";
          return (
            <div
              key={group.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 p-5 sm:p-6 hover:bg-elevated/35 transition-colors"
            >
              {/* Left: Category of Use */}
              <div className="md:col-span-4 space-y-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-xs shrink-0 ${
                      isCode ? "bg-code" : "bg-data"
                    }`}
                    aria-hidden="true"
                  />
                  <h4 className="font-mono text-sm font-semibold text-ink">
                    {group.category}
                  </h4>
                </div>
                <p className="text-xs text-muted pl-[18px] leading-relaxed">
                  {group.description}
                </p>
              </div>

              {/* Right: Clean Text List */}
              <div className="md:col-span-8 flex items-center pl-[18px] md:pl-0">
                <p className="font-mono text-xs sm:text-sm text-ink leading-relaxed">
                  {group.items.map((item, idx) => (
                    <React.Fragment key={item}>
                      <span>{item}</span>
                      {idx < group.items.length - 1 && (
                        <span
                          className="mx-2.5 text-faint select-none"
                          aria-hidden="true"
                        >
                          /
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
