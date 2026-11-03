"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { ContactSection } from "@/components/ContactSection";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Navbar } from "@/components/Navbar";
import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_DATA } from "@/data/seed";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { posts, publishedPosts, isHydrated } = usePortfolio();

  const post = posts.find((p) => p.slug === slug);
  const otherPosts = publishedPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-code transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all articles</span>
        </Link>

        {!post && isHydrated ? (
          <div className="bg-panel border border-hairline rounded-md p-10 space-y-4">
            <h1 className="font-mono text-2xl font-bold text-ink">
              Article not found
            </h1>
            <p className="text-sm text-muted">
              No published or draft post matches the slug{" "}
              <code className="font-mono text-code">{slug}</code>.
            </p>
            <Link
              href="/#blog"
              className="inline-block px-4 py-2 rounded-sm font-mono text-xs font-semibold bg-code text-[#071214]"
            >
              Browse articles
            </Link>
          </div>
        ) : post ? (
          <article>
            {/* Meta Header */}
            <header className="space-y-4 pb-8 border-b border-hairline">
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
                {post.status === "draft" && (
                  <span className="px-2 py-0.5 rounded-xs bg-data/15 border border-data/40 text-data">
                    Draft preview
                  </span>
                )}
              </div>

              <h1 className="font-mono text-2xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={PROFILE_DATA.photo}
                    alt={PROFILE_DATA.name}
                    className="w-8 h-8 rounded-full object-cover border border-hairline"
                  />
                  <div className="font-mono text-xs">
                    <div className="text-ink font-medium">
                      {PROFILE_DATA.name}
                    </div>
                    <div className="text-muted">TUP Manila · Dev &amp; Data</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-xs bg-panel border border-hairline font-mono text-[11px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="my-8 rounded-md overflow-hidden border border-hairline bg-panel">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[380px] object-cover"
                />
              </div>
            )}

            {/* Markdown Article Body */}
            <div className="pt-2">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Related Posts */}
            {otherPosts.length > 0 && (
              <section className="mt-16 pt-10 border-t border-hairline space-y-4">
                <h2 className="font-mono text-sm font-semibold text-muted">
                  Continue reading
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherPosts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="p-4 rounded-md bg-panel border border-hairline hover:border-code/50 transition-colors space-y-1.5"
                    >
                      <div className="font-mono text-[11px] text-muted tabular-nums">
                        {related.date} · {related.readingTime} min read
                      </div>
                      <div className="font-mono text-sm font-semibold text-ink">
                        {related.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        ) : (
          <div className="py-16 font-mono text-xs text-muted">
            Loading article...
          </div>
        )}
      </main>

      <ContactSection />
    </div>
  );
}

