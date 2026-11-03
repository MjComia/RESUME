import React from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/types/portfolio";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col bg-panel border border-hairline rounded-md overflow-hidden card-code-hover">
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col flex-1 focus:outline-none"
      >
        <div className="relative aspect-[16/9] w-full bg-elevated border-b border-hairline overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-faint">
              mj.notes
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-code" />
              {post.date}
            </span>
            <span className="text-faint">/</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-data" />
              {post.readingTime} min read
            </span>
          </div>

          <h3 className="mt-3 font-mono text-base sm:text-lg font-semibold text-ink group-hover:text-code transition-colors leading-snug">
            {post.title}
          </h3>

          <p className="mt-2 text-sm text-muted line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="mt-4 pt-3.5 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-xs bg-elevated border border-hairline font-mono text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="font-mono text-xs font-medium text-code group-hover:underline underline-offset-4">
              Read article
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

