"use client";

import React, { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { FilterOption, TagFilter } from "@/components/TagFilter";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReveal } from "@/hooks/useReveal";
import { Project } from "@/types/portfolio";

export function ProjectsSection() {
  const { projects } = usePortfolio();
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref, visible } = useReveal<HTMLElement>(0.08);

  const filterOptions = useMemo<FilterOption[]>(() => {
    const webCount = projects.filter((p) => p.category === "Web Dev").length;
    const dataCount = projects.filter(
      (p) => p.category === "Data Analytics"
    ).length;

    return [
      {
        value: "All",
        label: "All",
        count: projects.length,
        accent: "neutral",
      },
      {
        value: "Web Dev",
        label: "Web Dev",
        count: webCount,
        accent: "code",
      },
      {
        value: "Data Analytics",
        label: "Data Analytics",
        count: dataCount,
        accent: "data",
      },
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const base =
      categoryFilter === "All"
        ? projects
        : projects.filter((p) => p.category === categoryFilter);
    return [...base].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [projects, categoryFilter]);

  return (
    <section
      id="projects"
      ref={ref}
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 reveal-section ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Selected Projects
          </h2>
          <p className="text-base text-muted">
            Production-inspired React applications, database systems, and
            quantified analytical case studies. Select any card to inspect
            architecture and key findings.
          </p>
        </div>

        <TagFilter
          options={filterOptions}
          selected={categoryFilter}
          onChange={setCategoryFilter}
          ariaLabel="Filter projects by category"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-panel border border-hairline rounded-md p-10 text-center space-y-3">
          <p className="font-mono text-sm text-ink">
            No projects found in &ldquo;{categoryFilter}&rdquo;.
          </p>
          <p className="text-sm text-muted">
            Switch back to all categories or add a new project from the admin
            workspace.
          </p>
          <button
            type="button"
            onClick={() => setCategoryFilter("All")}
            className="px-3.5 py-1.5 rounded-sm font-mono text-xs bg-elevated border border-hairline text-code hover:border-code/50"
          >
            Show all projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

