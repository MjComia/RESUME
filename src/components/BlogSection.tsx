"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { FilterOption, TagFilter } from "@/components/TagFilter";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReveal } from "@/hooks/useReveal";

export function BlogSection() {
  const { publishedPosts } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const { ref, visible } = useReveal<HTMLElement>(0.08);

  const tagOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    publishedPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    const opts: FilterOption[] = [
      {
        value: "All",
        label: "All topics",
        count: publishedPosts.length,
        accent: "neutral",
      },
    ];

    Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([tag, count]) => {
        const isDataTag = /sql|data|bi|python|tableau|excel|cohort/i.test(tag);
        opts.push({
          value: tag,
          label: tag,
          count,
          accent: isDataTag ? "data" : "code",
        });
      });

    return opts;
  }, [publishedPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedPosts.filter((post) => {
      const matchesTag = activeTag === "All" || post.tags.includes(activeTag);
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [publishedPosts, activeTag, searchQuery]);

  return (
    <section
      id="blog"
      ref={ref}
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 reveal-section ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Engineering &amp; Data Notes
          </h2>
          <p className="text-base text-muted">
            Write-ups on React architecture, SQL query patterns, and lessons
            from building software and analyzing datasets.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            suppressHydrationWarning
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            aria-label="Search blog posts"
            className="w-full pl-9 pr-8 py-2 rounded-sm bg-panel border border-hairline font-mono text-xs text-ink placeholder:text-faint focus:border-code transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tag Filter Bar */}
      <TagFilter
        options={tagOptions}
        selected={activeTag}
        onChange={setActiveTag}
        ariaLabel="Filter blog posts by tag"
      />

      {filteredPosts.length === 0 ? (
        <div className="bg-panel border border-hairline rounded-md p-10 text-center space-y-3">
          <p className="font-mono text-sm text-ink">
            No articles matched your filter.
          </p>
          <p className="text-sm text-muted">
            Try clearing the search query or selecting another topic tag.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTag("All");
            }}
            className="px-3.5 py-1.5 rounded-sm font-mono text-xs bg-elevated border border-hairline text-code hover:border-code/50"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

