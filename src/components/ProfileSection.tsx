"use client";

import React from "react";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { SkillChart } from "@/components/SkillChart";
import { StatCard } from "@/components/StatCard";
import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_DATA, SKILLS_DATA, TIMELINE_DATA } from "@/data/seed";
import { useReveal } from "@/hooks/useReveal";

export function ProfileSection() {
  const { stats } = usePortfolio();
  const { ref, visible } = useReveal<HTMLElement>(0.08);

  return (
    <section
      id="profile"
      ref={ref}
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-14 reveal-section ${
        visible ? "is-visible" : ""
      }`}
    >
      {/* Section Header */}
      <div className="max-w-2xl space-y-2">
        <h2 className="font-mono text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Profile &amp; Background
        </h2>
        <p className="text-base text-muted">
          Combining frontend engineering discipline with structured analytical
          problem-solving.
        </p>
      </div>

      {/* Live KPI Stat Strip (Joined Ledger Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-hairline border border-hairline rounded-md overflow-hidden bg-panel">
        <StatCard
          label="Projects built"
          value={stats.projectsBuilt}
          delta={`${stats.webProjects} dev · ${stats.dataProjects} data`}
          detail="Live count synced automatically from portfolio repository."
          accent="code"
        />
        <StatCard
          label="Technologies used"
          value={stats.technologiesUsed}
          suffix="+"
          delta="Full stack + BI"
          detail="Distinct languages, frameworks, and analytical tools applied."
          accent="data"
        />
        <StatCard
          label="Blog posts written"
          value={stats.publishedPosts}
          delta="Technical notes"
          detail="Published engineering & SQL analytics write-ups."
          accent="code"
        />
        <StatCard
          label="Key insights logged"
          value={stats.insightsDocumented}
          delta="Quantified"
          detail="Verified metrics documented across analytical case studies."
          accent="data"
        />
      </div>

      {/* Bio + Photo + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bio & Photo Card */}
        <div className="lg:col-span-5 bg-panel border border-hairline rounded-md p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-hairline bg-elevated shrink-0">
              <img
                src={PROFILE_DATA.photo}
                alt={PROFILE_DATA.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-mono text-lg font-semibold text-ink">
                {PROFILE_DATA.name}
              </h3>
              <p className="font-mono text-xs text-code mt-0.5">
                BS Information Systems @ TUP
              </p>
              <p className="inline-flex items-center gap-1 font-mono text-xs text-muted mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-data" />
                {PROFILE_DATA.location}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-hairline text-sm text-muted leading-relaxed">
            {PROFILE_DATA.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Chronological Experience & Education Timeline */}
        <div className="lg:col-span-7 bg-panel border border-hairline rounded-md p-6">
          <h3 className="font-mono text-base font-semibold text-ink pb-4 mb-6 border-b border-hairline">
            Experience &amp; Education Timeline
          </h3>

          <ol className="relative border-l border-hairline ml-3 space-y-8">
            {TIMELINE_DATA.map((item) => {
              const isExp = item.type === "experience";
              return (
                <li key={item.id} className="pl-6 relative">
                  <span
                    className={`absolute -left-3 top-0.5 flex items-center justify-center w-6 h-6 rounded-xs border ${
                      item.accent === "code"
                        ? "bg-panel border-code text-code"
                        : "bg-panel border-data text-data"
                    }`}
                  >
                    {isExp ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5" />
                    )}
                  </span>

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span
                      className={`font-mono text-xs font-medium tabular-nums ${
                        item.accent === "code" ? "text-code" : "text-data"
                      }`}
                    >
                      {item.period}
                    </span>
                    <span className="font-mono text-xs text-faint">
                      {item.location}
                    </span>
                  </div>

                  <h4 className="mt-1 font-mono text-base font-semibold text-ink">
                    {item.role}
                  </h4>
                  <div className="font-mono text-xs text-muted mt-0.5">
                    {item.organization}
                  </div>

                  <p className="mt-2.5 text-sm text-muted leading-relaxed">
                    {item.summary}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs sm:text-sm text-ink/85 list-disc pl-4 marker:text-muted">
                    {item.highlights.map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Dual-Group SkillChart (Dev Stack + Data Stack) */}
      <SkillChart skills={SKILLS_DATA} />
    </section>
  );
}

