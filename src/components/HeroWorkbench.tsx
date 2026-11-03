"use client";

import React, { useState } from "react";
import { Activity, Code2, Columns2 } from "lucide-react";
import { SyntaxCodeBlock } from "@/components/SyntaxCodeBlock";
import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_DATA } from "@/data/seed";

type WorkbenchLens = "split" | "dev" | "data";

export function HeroWorkbench() {
  const { stats } = usePortfolio();
  const [lens, setLens] = useState<WorkbenchLens>("split");
  const [codeTab, setCodeTab] = useState<"tsx" | "sql">("tsx");

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

  const sqlSnippet = `-- Portfolio breakdown by domain category
SELECT
  category,
  COUNT(id) AS total_projects,
  SUM(insights_count) AS logged_insights
FROM mj_portfolio_projects
GROUP BY category
ORDER BY total_projects DESC;`;

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
                <span className="text-ink font-medium">mj.workbench</span>
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

              {/* RIGHT PANE: Live Portfolio KPI Readout (No Sample Chart) */}
              {(lens === "split" || lens === "data") && (
                <div className="p-4 flex flex-col justify-between bg-panel">
                  <div className="space-y-3">
                    <div>
                      <div className="font-mono text-xs font-semibold text-ink">
                        Live Portfolio Snapshot
                      </div>
                      <div className="font-mono text-[11px] text-muted">
                        Synced from active projects, stack &amp; articles
                      </div>
                    </div>

                    {/* 2x2 Real KPI Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Total Projects
                        </div>
                        <div className="mt-1 font-mono text-xl font-bold text-ink tabular-nums">
                          {stats.projectsBuilt}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-code tabular-nums">
                          {stats.webProjects} web · {stats.dataProjects} data
                        </div>
                      </div>

                      <div className="p-3 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Stack Tools
                        </div>
                        <div className="mt-1 font-mono text-xl font-bold text-code tabular-nums">
                          {stats.technologiesUsed}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-muted">
                          Languages, web &amp; BI
                        </div>
                      </div>

                      <div className="p-3 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Articles Written
                        </div>
                        <div className="mt-1 font-mono text-xl font-bold text-ink tabular-nums">
                          {stats.publishedPosts}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-muted">
                          Engineering &amp; SQL notes
                        </div>
                      </div>

                      <div className="p-3 rounded-xs bg-elevated/70 border border-hairline">
                        <div className="font-mono text-[10px] text-muted">
                          Logged Insights
                        </div>
                        <div className="mt-1 font-mono text-xl font-bold text-data tabular-nums">
                          {stats.insightsDocumented}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-data">
                          Case study findings
                        </div>
                      </div>
                    </div>

                    {/* Domain Focus Summary */}
                    <div className="rounded-xs border border-hairline bg-canvas/60 divide-y divide-hairline font-mono text-[11px]">
                      <div className="px-3 py-2 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-code" />
                          Web Engineering
                        </span>
                        <span className="text-muted">React · Next.js · SQL</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-data" />
                          Data Analytics
                        </span>
                        <span className="text-muted">SQL · Excel · Power BI</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Status */}
                  <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between font-mono text-[11px] text-muted">
                    <span>github.com/MjComia</span>
                    <span className="tabular-nums text-data">
                      Real-time store
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
