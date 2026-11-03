"use client";

import React from "react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const isData = project.category === "Data Analytics";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      suppressHydrationWarning
      onClick={() => onSelect(project)}
      onKeyDown={handleKeyDown}
      aria-label={`Inspect project details for ${project.title}`}
      className={`group flex flex-col bg-panel border border-hairline rounded-md overflow-hidden cursor-pointer text-left ${
        isData ? "card-data-hover" : "card-code-hover"
      }`}
    >
      {/* Category top bar */}
      <div
        className={`h-1 w-full ${isData ? "bg-data" : "bg-code"}`}
        aria-hidden="true"
      />

      {/* Thumbnail frame */}
      <div className="relative aspect-[16/10] w-full bg-elevated overflow-hidden border-b border-hairline">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-faint">
            No preview image
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-xs font-mono text-[11px] font-medium backdrop-blur-md border ${
              isData
                ? "bg-[#0B101B]/85 text-[#F59E0B] border-[#F59E0B]/40"
                : "bg-[#0B101B]/85 text-[#14D9C4] border-[#14D9C4]/40"
            }`}
          >
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[11px] bg-[#0B101B]/85 text-slate-200 border border-slate-700">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-mono text-base sm:text-lg font-semibold text-ink group-hover:text-code transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-muted line-clamp-3 flex-1">
          {project.summary}
        </p>

        {/* Tech stack tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-xs bg-elevated border border-hairline font-mono text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 5 && (
            <span className="px-2 py-0.5 rounded-xs font-mono text-[11px] text-faint">
              +{project.tags.length - 5}
            </span>
          )}
        </div>

        {/* Footer links + inspect prompt */}
        <div className="mt-5 pt-3.5 border-t border-hairline flex items-center justify-between gap-2 font-mono text-xs">
          <span
            className={`font-medium ${
              isData ? "text-data" : "text-code"
            } group-hover:underline underline-offset-4`}
          >
            Inspect case study
          </span>

          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors"
                aria-label={`Live demo for ${project.title}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-muted hover:text-ink transition-colors"
                aria-label={`GitHub repository for ${project.title}`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

