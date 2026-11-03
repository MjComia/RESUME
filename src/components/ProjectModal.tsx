"use client";

import React, { useEffect, useRef } from "react";
import { ExternalLink, Github, TrendingUp, X } from "lucide-react";
import { Project } from "@/types/portfolio";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  const isData = project.category === "Data Analytics";
  const paragraphs = project.description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-panel border border-hairline rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-1.5 w-full ${isData ? "bg-data" : "bg-code"}`}
          aria-hidden="true"
        />

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-4 bg-panel/95 backdrop-blur border-b border-hairline">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded-xs font-mono text-[11px] font-medium border ${
                  isData
                    ? "bg-data/10 text-data border-data/30"
                    : "bg-code/10 text-code border-code/30"
                }`}
              >
                {project.category}
              </span>
              <span className="font-mono text-xs text-faint tabular-nums">
                {project.createdAt}
              </span>
            </div>
            <h2
              id="project-modal-title"
              className="font-mono text-xl sm:text-2xl font-bold text-ink"
            >
              {project.title}
            </h2>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-sm bg-elevated border border-hairline text-muted hover:text-ink transition-colors"
            aria-label="Close project detail dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Primary Screenshot */}
          {project.thumbnail && (
            <div className="rounded-md overflow-hidden border border-hairline bg-elevated">
              <img
                src={project.thumbnail}
                alt={`${project.title} screenshot`}
                className="w-full max-h-[380px] object-contain mx-auto"
              />
            </div>
          )}

          {/* Action links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-xs font-semibold bg-code text-[#081018] hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open live demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-xs font-medium bg-elevated border border-hairline text-ink hover:border-code/50 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View source on GitHub</span>
                </a>
              )}
            </div>
          )}

          {/* Key Insights block (for Data Analytics projects or quantified projects) */}
          {project.insights && project.insights.length > 0 && (
            <div className="rounded-md border border-data/35 bg-data/5 p-5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-data mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>Key analytical insights</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-panel border border-hairline rounded-sm p-3.5"
                  >
                    <div className="font-mono text-xl font-bold text-data tabular-nums">
                      {insight.metric}
                    </div>
                    <div className="font-mono text-xs font-medium text-ink mt-0.5">
                      {insight.label}
                    </div>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Narrative */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold text-ink">
              Overview &amp; Implementation
            </h3>
            {paragraphs.map((para, idx) => (
              <p key={idx} className="text-sm sm:text-base text-muted leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Tools & Technologies Used */}
          <div>
            <h3 className="font-mono text-sm font-semibold text-ink mb-2.5">
              Tools &amp; Stack Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-xs bg-elevated border border-hairline font-mono text-xs text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

