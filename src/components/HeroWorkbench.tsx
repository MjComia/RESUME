"use client";

import React, { useState } from "react";
import { Activity, Code2, Columns2 } from "lucide-react";
import { SyntaxCodeBlock } from "@/components/SyntaxCodeBlock";
import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_DATA } from "@/data/seed";

type WorkbenchLens = "split" | "dev" | "data";

const TELEMETRY_SERIES = [
  { period: "Jun", commits: 38, queries: 22 },
  { period: "Jul", commits: 52, queries: 34 },
  { period: "Aug", commits: 64, queries: 48 },
  { period: "Sep", commits: 59, queries: 61 },
  { period: "Oct", commits: 78, queries: 74 },
  { period: "Nov", commits: 86, queries: 89 },
];

export function HeroWorkbench() {
  const { stats } = usePortfolio();
  const [lens, setLens] = useState<WorkbenchLens>("split");
  const [codeTab, setCodeTab] = useState<"tsx" | "sql">("tsx");
  const [activePoint, setActivePoint] = useState<number>(
    TELEMETRY_SERIES.length - 1
  );

  const reactSnippet = `// Easycom-inspired modular telemetry hook
export function usePortfolioMetrics() {
  const summary = {
    role: "React Full Stack & Data",
    projectsShipped: ${stats.projectsBuilt},
    stackTools: ${stats.technologiesUsed},
    articlesPublished: ${stats.publishedPosts},
  };

  return <KpiWorkbench data={summary} />;
}`;

  const sqlSnippet = `-- Monthly build & analytical query cadence
SELECT
  category,
  COUNT(id) AS total_artifacts,
  ROUND(AVG(impact_score), 1) AS kpi_index
FROM mj_portfolio_items
WHERE status = 'SHIPPED'
GROUP BY category
ORDER BY total_artifacts DESC;`;

  // Chart geometry
  const chartW = 320;
  const chartH = 148;
  const padX = 24;
  const padY = 18;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;
  const maxVal = 100;

  const coordsFor = (key: "commits" | "queries") =>
    TELEMETRY_SERIES.map((d, idx) => {
      const x = padX + (idx / (TELEMETRY_SERIES.length - 1)) * innerW;
      const y = padY + innerH - (d[key] / maxVal) * innerH;
      return { x, y, ...d };
    });

  const commitPts = coordsFor("commits");
  const queryPts = coordsFor("queries");

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const dataAreaPath = `${toPath(queryPts)} L${queryPts[
    queryPts.length - 1
  ].x.toFixed(1)},${(padY + innerH).toFixed(1)} L${queryPts[0].x.toFixed(
    1
  )},${(padY + innerH).toFixed(1)} Z`;

  const selected = TELEMETRY_SERIES[activePoint] ?? TELEMETRY_SERIES[5];

  return (
    <section
      id="overview"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Identity, Role, Intro, CTAs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-panel border border-hairline font-mono text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-code" />
            <span>TUP Manila · BS Information Systems</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-mono text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink tracking-tight leading-[1.12]">
              {PROFILE_DATA.name}
            </h1>
            <p className="font-mono text-base sm:text-lg font-medium text-code">
              {PROFILE_DATA.tagline}
            </p>
          </div>

          <p className="text-base text-muted leading-relaxed max-w-[52ch]">
            {PROFILE_DATA.intro} Completed a Full Stack Developer internship at{" "}
            <strong className="font-medium text-ink">
              Easycom Japan Philippines Inc.
            </strong>{" "}
            with a focus on production React interfaces.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#projects"
              className="px-4 py-2.5 rounded-sm font-mono text-xs sm:text-sm font-semibold bg-code text-[#071214] hover:opacity-90 transition-opacity"
            >
              View projects
            </a>
            <a
              href="#blog"
              className="px-4 py-2.5 rounded-sm font-mono text-xs sm:text-sm font-medium bg-panel border border-hairline text-ink hover:border-data/60 hover:text-data transition-colors"
            >
              Read blog
            </a>
            <a
              href="#contact"
              className="px-4 py-2.5 rounded-sm font-mono text-xs sm:text-sm font-medium bg-transparent border border-hairline text-muted hover:text-ink hover:bg-elevated transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Right Column: Signature "Code meets Data" Visual Split Workbench */}
        <div className="lg:col-span-7">
          <div className="rounded-lg border border-hairline bg-panel shadow-xl overflow-hidden">
            {/* Workbench Header Bar + View Mode Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-hairline bg-elevated/65">
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span className="inline-block w-2 h-2 rounded-full bg-code" />
                <span className="inline-block w-2 h-2 rounded-full bg-data" />
                <span className="text-ink font-medium">
                  mj.workbench
                </span>
                <span className="hidden sm:inline text-faint">
                  / code-meets-data
                </span>
              </div>

              <div
                role="group"
                aria-label="Switch workbench lens between Dev view, Split view, and Data view"
                className="inline-flex items-center rounded-sm bg-canvas border border-hairline p-0.5 font-mono text-[11px]"
              >
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setLens("dev")}
                  aria-pressed={lens === "dev"}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition-colors ${
                    lens === "dev"
                      ? "bg-code/15 text-code font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Dev view</span>
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setLens("split")}
                  aria-pressed={lens === "split"}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition-colors ${
                    lens === "split"
                      ? "bg-elevated text-ink font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>Split</span>
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setLens("data")}
                  aria-pressed={lens === "data"}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition-colors ${
                    lens === "data"
                      ? "bg-data/15 text-data font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Data view</span>
                </button>
              </div>
            </div>

            {/* Split or Single Pane Body */}
            <div
              className={`grid grid-cols-1 ${
                lens === "split"
                  ? "md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline"
                  : ""
              }`}
            >
              {/* LEFT PANE: Syntax-Highlighted Code Editor */}
              {(lens === "split" || lens === "dev") && (
                <div className="p-4 bg-[#080d18] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="inline-flex rounded-xs bg-[#11192c] p-0.5 border border-slate-800 font-mono text-[11px]">
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => setCodeTab("tsx")}
                          className={`px-2 py-0.5 rounded-xs transition-colors ${
                            codeTab === "tsx"
                              ? "bg-[#14D9C4]/15 text-[#14D9C4]"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Telemetry.tsx
                        </button>
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => setCodeTab("sql")}
                          className={`px-2 py-0.5 rounded-xs transition-colors ${
                            codeTab === "sql"
                              ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          kpi_query.sql
                        </button>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        UTF-8 · TypeScript
                      </span>
                    </div>

                    <SyntaxCodeBlock
                      code={codeTab === "tsx" ? reactSnippet : sqlSnippet}
                      language={codeTab}
                      filename={
                        codeTab === "tsx"
                          ? "src/hooks/usePortfolioMetrics.tsx"
                          : "queries/kpi_query.sql"
                      }
                      compact
                    />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14D9C4]" />
                      Compiled cleanly
                    </span>
                    <span className="tabular-nums text-[#14D9C4]">
                      {stats.projectsBuilt} modules active
                    </span>
                  </div>
                </div>
              )}

              {/* RIGHT PANE: Mini Analytical Dashboard (Line Chart + KPI Cards) */}
              {(lens === "split" || lens === "data") && (
                <div className="p-4 flex flex-col justify-between bg-panel">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="font-mono text-xs font-semibold text-ink">
                          Output &amp; Query Telemetry
                        </div>
                        <div className="font-mono text-[11px] text-muted">
                          Hover points · {selected.period}:{" "}
                          <span className="text-code tabular-nums">
                            {selected.commits} commits
                          </span>{" "}
                          ·{" "}
                          <span className="text-data tabular-nums">
                            {selected.queries} SQL runs
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini KPI Cards inside Dashboard */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="p-2.5 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Projects
                        </div>
                        <div className="font-mono text-lg font-bold text-ink tabular-nums">
                          {stats.projectsBuilt}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Data Share
                        </div>
                        <div className="font-mono text-lg font-bold text-data tabular-nums">
                          {stats.projectsBuilt > 0
                            ? Math.round(
                                (stats.dataProjects / stats.projectsBuilt) * 100
                              )
                            : 0}
                          %
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Stack Tools
                        </div>
                        <div className="font-mono text-lg font-bold text-code tabular-nums">
                          {stats.technologiesUsed}
                        </div>
                      </div>
                    </div>

                    {/* Interactive SVG Line + Area Chart */}
                    <div className="rounded-sm border border-hairline bg-canvas/70 p-2">
                      <svg
                        viewBox={`0 0 ${chartW} ${chartH}`}
                        className="w-full h-auto overflow-visible"
                        role="img"
                        aria-label="Line chart of monthly React commits and SQL analytical runs"
                      >
                        <defs>
                          <linearGradient
                            id="heroDataGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgb(var(--color-data))"
                              stopOpacity="0.28"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgb(var(--color-data))"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>

                        {/* Horizontal reference lines */}
                        {[0.25, 0.5, 0.75].map((r) => {
                          const y = padY + innerH * (1 - r);
                          return (
                            <line
                              key={r}
                              x1={padX}
                              y1={y}
                              x2={chartW - padX}
                              y2={y}
                              stroke="rgb(var(--color-hairline))"
                              strokeDasharray="3 3"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* Active vertical crosshair */}
                        {queryPts[activePoint] && (
                          <line
                            x1={queryPts[activePoint].x}
                            y1={padY}
                            x2={queryPts[activePoint].x}
                            y2={padY + innerH}
                            stroke="rgb(var(--color-faint))"
                            strokeDasharray="2 2"
                            strokeWidth="1"
                          />
                        )}

                        {/* Area + Series paths */}
                        <path d={dataAreaPath} fill="url(#heroDataGrad)" />
                        <path
                          d={toPath(commitPts)}
                          fill="none"
                          stroke="rgb(var(--color-code))"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d={toPath(queryPts)}
                          fill="none"
                          stroke="rgb(var(--color-data))"
                          strokeWidth="2.25"
                          strokeLinecap="round"
                        />

                        {/* Interactive points + X-axis labels */}
                        {TELEMETRY_SERIES.map((d, idx) => {
                          const cp = commitPts[idx];
                          const qp = queryPts[idx];
                          const isSelected = activePoint === idx;
                          return (
                            <g
                              key={d.period}
                              className="cursor-pointer"
                              onMouseEnter={() => setActivePoint(idx)}
                              onClick={() => setActivePoint(idx)}
                            >
                              <rect
                                x={cp.x - 16}
                                y={padY}
                                width={32}
                                height={innerH + 16}
                                fill="transparent"
                              />
                              <circle
                                cx={cp.x}
                                cy={cp.y}
                                r={isSelected ? 4.5 : 3}
                                fill="rgb(var(--color-code))"
                              />
                              <circle
                                cx={qp.x}
                                cy={qp.y}
                                r={isSelected ? 5 : 3.2}
                                fill="rgb(var(--color-data))"
                              />
                              <text
                                x={cp.x}
                                y={chartH - 2}
                                textAnchor="middle"
                                className={`font-mono text-[9px] fill-current ${
                                  isSelected
                                    ? "text-ink font-semibold"
                                    : "text-faint"
                                }`}
                              >
                                {d.period}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between font-mono text-[11px] text-muted">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-code inline-block" />
                        React commits
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-data inline-block" />
                        SQL / BI runs
                      </span>
                    </div>
                    <span className="tabular-nums text-data">
                      +{stats.insightsDocumented} insights logged
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

