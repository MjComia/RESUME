"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Github, RefreshCw } from "lucide-react";
import { PROFILE_DATA } from "@/data/seed";

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface ContributionWeek {
  firstDay: string;
  contributionDays: ContributionDay[];
}

interface GitHubActivityPayload {
  username: string;
  profileUrl: string;
  totalContributions: number;
  totalCommits: number;
  restrictedCount: number;
  weeks: ContributionWeek[];
  fetchedAt: string;
}

type RangeWindow = "6m" | "12m";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatShortDate(isoDate: string): string {
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${MONTH_NAMES[(month - 1) % 12]} ${day}, ${year}`;
}

function getLevelClass(count: number, maxCount: number): string {
  if (count <= 0) {
    return "bg-elevated/80 border-hairline/70";
  }
  const upper = Math.max(maxCount, 4);
  const ratio = count / upper;
  if (ratio <= 0.25) {
    return "bg-code/25 border-code/35";
  }
  if (ratio <= 0.5) {
    return "bg-code/50 border-code/60";
  }
  if (ratio <= 0.75) {
    return "bg-code/75 border-code/80";
  }
  return "bg-code border-code";
}

export function GitHubActivity() {
  const [data, setData] = useState<GitHubActivityPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [range, setRange] = useState<RangeWindow>("12m");
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const loadActivity = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch(
        forceRefresh ? "/api/github?refresh=1" : "/api/github"
      );
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setError(
          "GitHub API route is not ready yet. Restart `npm run dev` so Next.js registers /api/github."
        );
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Unable to load GitHub contribution data.");
      } else if (!Array.isArray(json.weeks)) {
        setError("Unexpected response format from GitHub API.");
      } else {
        setData(json as GitHubActivityPayload);
      }
    } catch {
      setError("Network error while fetching GitHub contribution history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActivity(false);
  }, [loadActivity]);

  const visibleWeeks = useMemo(() => {
    if (!data?.weeks) return [];
    if (range === "6m") {
      return data.weeks.slice(-26);
    }
    return data.weeks;
  }, [data, range]);

  const { rangeTotal, maxDaily, activeDays, monthLabels, monthlyTotals } =
    useMemo(() => {
      let total = 0;
      let max = 0;
      let active = 0;
      const labels: Array<{ weekIndex: number; label: string }> = [];
      const monthBuckets = new Map<string, { label: string; count: number }>();

      let prevMonth = -1;

      visibleWeeks.forEach((week, wIdx) => {
        const days = Array.isArray(week.contributionDays)
          ? week.contributionDays
          : [];
        const firstInWeek = days[0];
        if (firstInWeek) {
          const [, mStr] = firstInWeek.date.split("-");
          const mIdx = Number(mStr) - 1;
          const prevLabelWeek =
            labels.length > 0 ? labels[labels.length - 1].weekIndex : -4;
          if (mIdx !== prevMonth && (wIdx === 0 || wIdx - prevLabelWeek >= 3)) {
            labels.push({ weekIndex: wIdx, label: MONTH_NAMES[mIdx] });
            prevMonth = mIdx;
          }
        }

        days.forEach((day) => {
          total += day.contributionCount;
          if (day.contributionCount > max) max = day.contributionCount;
          if (day.contributionCount > 0) active += 1;

          const [yStr, mStr] = day.date.split("-");
          const key = `${yStr}-${mStr}`;
          const mLabel = `${MONTH_NAMES[Number(mStr) - 1]} '${yStr.slice(2)}`;
          const existing = monthBuckets.get(key);
          if (existing) {
            existing.count += day.contributionCount;
          } else {
            monthBuckets.set(key, { label: mLabel, count: day.contributionCount });
          }
        });
      });

      const monthly = Array.from(monthBuckets.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([, val]) => val)
        .slice(-6);

      return {
        rangeTotal: total,
        maxDaily: max,
        activeDays: active,
        monthLabels: labels,
        monthlyTotals: monthly,
      };
    }, [visibleWeeks]);

  const maxMonthly = useMemo(
    () => Math.max(1, ...monthlyTotals.map((m) => m.count)),
    [monthlyTotals]
  );

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-lg font-semibold text-ink">
              GitHub Commit Activity
            </h3>
            <a
              href={data?.profileUrl || PROFILE_DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-code hover:underline underline-offset-4"
            >
              <Github className="w-3.5 h-3.5" />
              <span>@{data?.username || "MjComia"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-sm text-muted">
            Live contribution history fetched via the GitHub GraphQL API from
            past months up to today.
          </p>
        </div>

        {/* Range Switcher + Sync */}
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Select GitHub contribution time window"
            className="inline-flex rounded-sm border border-hairline bg-panel p-0.5 font-mono text-xs"
          >
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setRange("6m")}
              aria-pressed={range === "6m"}
              className={`px-2.5 py-1 rounded-xs transition-colors ${
                range === "6m"
                  ? "bg-elevated text-ink font-medium"
                  : "text-muted hover:text-ink"
              }`}
            >
              Past 6 months
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setRange("12m")}
              aria-pressed={range === "12m"}
              className={`px-2.5 py-1 rounded-xs transition-colors ${
                range === "12m"
                  ? "bg-elevated text-ink font-medium"
                  : "text-muted hover:text-ink"
              }`}
            >
              Past 12 months
            </button>
          </div>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => loadActivity(true)}
            disabled={loading || refreshing}
            aria-label="Sync latest GitHub commits"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-panel border border-hairline font-mono text-xs text-muted hover:text-ink hover:border-code/50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-code" : ""}`}
            />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* Body Panel */}
      <div className="bg-panel border border-hairline rounded-md p-5 sm:p-6 overflow-hidden">
        {loading ? (
          <div className="space-y-4 py-4">
            <div className="h-4 w-56 rounded-xs bg-elevated animate-pulse" />
            <div className="h-28 w-full rounded-sm bg-elevated/70 animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div className="space-y-1">
              <div className="font-mono text-xs font-semibold text-data">
                Could not load GitHub GraphQL feed
              </div>
              <p className="text-sm text-muted">{error}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => loadActivity(true)}
                className="px-3 py-1.5 rounded-sm bg-elevated border border-hairline font-mono text-xs text-ink hover:border-code/50"
              >
                Retry
              </button>
              <a
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-sm bg-code text-[#071214] font-mono text-xs font-semibold"
              >
                Open GitHub profile
              </a>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Top Summary Metrics + Hovered Day Readout */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline">
              <div className="flex flex-wrap items-center gap-6 font-mono">
                <div>
                  <span className="text-2xl font-bold text-ink tabular-nums">
                    {rangeTotal}
                  </span>
                  <span className="ml-2 text-xs text-muted">
                    contributions ({range === "6m" ? "last 6 mos" : "last 12 mos"})
                  </span>
                </div>
                <div className="text-xs text-muted tabular-nums">
                  <span className="text-code font-semibold">{activeDays}</span>{" "}
                  active days
                </div>
                {maxDaily > 0 && (
                  <div className="text-xs text-muted tabular-nums">
                    Peak day:{" "}
                    <span className="text-data font-semibold">
                      {maxDaily}
                    </span>
                  </div>
                )}
              </div>

              <div className="font-mono text-xs text-muted min-h-[1.25rem]">
                {hoveredDay ? (
                  <span>
                    <strong className="text-code tabular-nums">
                      {hoveredDay.contributionCount}
                    </strong>{" "}
                    {hoveredDay.contributionCount === 1
                      ? "contribution"
                      : "contributions"}{" "}
                    on{" "}
                    <span className="text-ink">
                      {formatShortDate(hoveredDay.date)}
                    </span>
                  </span>
                ) : (
                  <span className="text-faint">
                    Hover any day square to inspect exact date &amp; count
                  </span>
                )}
              </div>
            </div>

            {/* Contribution Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex items-start gap-2 min-w-max">
                {/* Weekday Labels (offset top by h-4 + mb-1.5 = 22px to match month row) */}
                <div className="w-7 shrink-0 pt-[22px] grid grid-rows-7 gap-[3px] font-mono text-[10px] text-faint select-none leading-[12px]">
                  <span className="h-[12px]" />
                  <span className="h-[12px]">Mon</span>
                  <span className="h-[12px]" />
                  <span className="h-[12px]">Wed</span>
                  <span className="h-[12px]" />
                  <span className="h-[12px]">Fri</span>
                  <span className="h-[12px]" />
                </div>

                {/* Month Labels + Week Columns */}
                <div>
                  <div className="relative h-4 mb-1.5 font-mono text-[10px] text-muted select-none">
                    {monthLabels.map((m) => (
                      <span
                        key={`${m.label}-${m.weekIndex}`}
                        className="absolute top-0"
                        style={{ left: `${m.weekIndex * 15}px` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-[3px]">
                    {visibleWeeks.map((week) => (
                      <div
                        key={week.firstDay}
                        className="grid grid-rows-7 gap-[3px]"
                      >
                        {Array.from({ length: 7 }).map((_, weekdayIdx) => {
                          const day = week.contributionDays.find(
                            (d) => d.weekday === weekdayIdx
                          );
                          if (!day) {
                            return (
                              <span
                                key={`empty-${weekdayIdx}`}
                                className="w-[12px] h-[12px] block"
                              />
                            );
                          }
                          return (
                            <button
                              key={day.date}
                              type="button"
                              suppressHydrationWarning
                              onMouseEnter={() => setHoveredDay(day)}
                              onFocus={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              aria-label={`${day.contributionCount} contributions on ${day.date}`}
                              className={`w-[12px] h-[12px] rounded-[2px] border transition-transform hover:scale-125 focus:scale-125 ${getLevelClass(
                                day.contributionCount,
                                maxDaily
                              )}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Monthly Breakdown + Color Legend */}
            <div className="pt-4 border-t border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Recent 6 Months Totals */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
                <span className="text-faint">Recent months:</span>
                {monthlyTotals.map((m) => (
                  <div
                    key={m.label}
                    className="inline-flex items-center gap-1.5 tabular-nums"
                  >
                    <span className="text-muted">{m.label}:</span>
                    <span
                      className={
                        m.count > 0
                          ? m.count === maxMonthly
                            ? "text-data font-semibold"
                            : "text-ink font-medium"
                          : "text-faint"
                      }
                    >
                      {m.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cyan Intensity Legend */}
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-faint self-start lg:self-auto">
                <span>Less</span>
                <span className="w-[11px] h-[11px] rounded-[2px] border bg-elevated/80 border-hairline/70 inline-block" />
                <span className="w-[11px] h-[11px] rounded-[2px] border bg-code/25 border-code/35 inline-block" />
                <span className="w-[11px] h-[11px] rounded-[2px] border bg-code/50 border-code/60 inline-block" />
                <span className="w-[11px] h-[11px] rounded-[2px] border bg-code/75 border-code/80 inline-block" />
                <span className="w-[11px] h-[11px] rounded-[2px] border bg-code border-code inline-block" />
                <span>More</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
