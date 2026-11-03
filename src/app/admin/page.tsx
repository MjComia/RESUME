"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  FolderKanban,
  ImagePlus,
  Inbox,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Navbar } from "@/components/Navbar";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  compressImageFile,
  estimateReadingTime,
  slugify,
} from "@/lib/image";
import {
  hasAdminSession,
  setAdminSession,
  updateAdminPassword,
  verifyAdminPassword,
} from "@/lib/storage";
import { SUPABASE_SETUP_SQL } from "@/lib/supabase";
import {
  BlogPost,
  PostStatus,
  Project,
  ProjectCategory,
  ProjectInsight,
} from "@/types/portfolio";

type AdminTab = "projects" | "blog" | "inbox";
type EditorView = "split" | "write" | "preview";

export default function AdminPage() {
  const {
    projects,
    posts,
    messages,
    storageBackend,
    saveProject,
    deleteProject,
    savePost,
    deletePost,
    resetData,
  } = usePortfolio();

  const [authenticated, setAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [toast, setToast] = useState<string | null>(null);

  // Project Form State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projSummary, setProjSummary] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCategory, setProjCategory] = useState<ProjectCategory>("Web Dev");
  const [projTags, setProjTags] = useState("");
  const [projThumb, setProjThumb] = useState("");
  const [projLive, setProjLive] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projFeatured, setProjFeatured] = useState(false);
  const [projInsights, setProjInsights] = useState<ProjectInsight[]>([]);
  const [projFormError, setProjFormError] = useState("");
  const [confirmDeleteProjId, setConfirmDeleteProjId] = useState<string | null>(
    null
  );

  // Blog Post Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postCover, setPostCover] = useState("");
  const [postTags, setPostTags] = useState("");
  const [postContent, setPostContent] = useState("");
  const [editorView, setEditorView] = useState<EditorView>("split");
  const [postFormError, setPostFormError] = useState("");
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(
    null
  );

  // Admin Settings State
  const [newAdminPass, setNewAdminPass] = useState("");
  const [showSqlModal, setShowSqlModal] = useState(false);

  const markdownRef = useRef<HTMLTextAreaElement | null>(null);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAuthenticated(hasAdminSession());
    setCheckedAuth(true);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setAdminSession(true);
      setAuthenticated(true);
      setPasswordInput("");
      setAuthError("");
    } else {
      setAuthError(
        "Password did not match. Enter your admin password to unlock content management."
      );
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setAuthenticated(false);
  };

  // Project Helpers
  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle("");
    setProjSummary("");
    setProjDesc("");
    setProjCategory("Web Dev");
    setProjTags("");
    setProjThumb("");
    setProjLive("");
    setProjGithub("");
    setProjFeatured(false);
    setProjInsights([]);
    setProjFormError("");
  };

  const startEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjTitle(proj.title);
    setProjSummary(proj.summary);
    setProjDesc(proj.description);
    setProjCategory(proj.category);
    setProjTags(proj.tags.join(", "));
    setProjThumb(proj.thumbnail);
    setProjLive(proj.liveUrl ?? "");
    setProjGithub(proj.githubUrl ?? "");
    setProjFeatured(proj.featured);
    setProjInsights(proj.insights ?? []);
    setProjFormError("");
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setProjThumb(compressed);
      showToast("Project image uploaded");
    } catch (err) {
      setProjFormError(
        err instanceof Error ? err.message : "Could not process image."
      );
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjFormError("");

    if (!projTitle.trim() || !projSummary.trim()) {
      setProjFormError("Provide a project title and short description.");
      return;
    }

    const existing = editingProjectId
      ? projects.find((p) => p.id === editingProjectId)
      : undefined;

    const cleanTags = projTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanInsights = projInsights.filter(
      (ins) => ins.metric.trim() && ins.label.trim()
    );

    const payload: Project = {
      id: existing?.id ?? `proj-${Date.now()}`,
      slug: existing?.slug ?? slugify(projTitle),
      title: projTitle.trim(),
      summary: projSummary.trim(),
      description: projDesc.trim() || projSummary.trim(),
      category: projCategory,
      tags: cleanTags.length > 0 ? cleanTags : [projCategory],
      thumbnail: projThumb.trim() || "/images/projects/react-ops-board.svg",
      screenshots: [
        projThumb.trim() || "/images/projects/react-ops-board.svg",
      ],
      liveUrl: projLive.trim() || undefined,
      githubUrl: projGithub.trim() || undefined,
      featured: projFeatured,
      insights: cleanInsights.length > 0 ? cleanInsights : undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    await saveProject(payload);
    showToast(existing ? "Project updated" : "Project added");
    resetProjectForm();
  };

  // Blog Post Helpers
  const resetPostForm = () => {
    setEditingPostId(null);
    setPostTitle("");
    setPostExcerpt("");
    setPostCover("");
    setPostTags("");
    setPostContent("");
    setPostFormError("");
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostExcerpt(post.excerpt);
    setPostCover(post.coverImage);
    setPostTags(post.tags.join(", "));
    setPostContent(post.content);
    setPostFormError("");
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePostCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setPostCover(compressed);
      showToast("Cover image uploaded");
    } catch (err) {
      setPostFormError(
        err instanceof Error ? err.message : "Could not process cover image."
      );
    }
  };

  const handleInlineImageInsert = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 960, 0.8);
      insertMarkdownSnippet(`\n![${file.name}](${compressed})\n`);
      showToast("Inline image inserted into Markdown");
    } catch {
      // Ignore invalid file
    }
  };

  const insertMarkdownSnippet = (snippet: string) => {
    const el = markdownRef.current;
    if (!el) {
      setPostContent((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? postContent.length;
    const end = el.selectionEnd ?? postContent.length;
    const updated =
      postContent.slice(0, start) + snippet + postContent.slice(end);
    setPostContent(updated);
    setTimeout(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const handleSavePostWithStatus = async (status: PostStatus) => {
    setPostFormError("");
    if (!postTitle.trim() || !postContent.trim()) {
      setPostFormError("Enter a post title and Markdown body content.");
      return;
    }

    const existing = editingPostId
      ? posts.find((p) => p.id === editingPostId)
      : undefined;

    const cleanTags = postTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const autoExcerpt =
      postExcerpt.trim() ||
      postContent
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[#>*_`[\]()!-]/g, "")
        .trim()
        .slice(0, 165) + "...";

    const today = new Date().toISOString().slice(0, 10);

    const payload: BlogPost = {
      id: existing?.id ?? `post-${Date.now()}`,
      slug: existing?.slug ?? slugify(postTitle),
      title: postTitle.trim(),
      excerpt: autoExcerpt,
      content: postContent,
      coverImage:
        postCover.trim() || "/images/blog/react-architecture-cover.svg",
      date: existing?.date ?? today,
      readingTime: estimateReadingTime(postContent),
      tags: cleanTags.length > 0 ? cleanTags : ["Notes"],
      status,
      updatedAt: today,
    };

    await savePost(payload);
    showToast(status === "published" ? "Published" : "Draft saved");
    resetPostForm();
  };

  if (!checkedAuth) {
    return null;
  }

  // Password Login View
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-panel border border-hairline rounded-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-sm bg-code/10 border border-code/30 text-code">
                <Lock className="w-5 h-5" />
              </span>
              <div>
                <h1 className="font-mono text-xl font-bold text-ink">
                  Admin Workspace
                </h1>
                <p className="font-mono text-xs text-muted">
                  mj.comia / content-manager
                </p>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Sign in with your workspace password to add projects, write
              Markdown articles, and manage portfolio content.
            </p>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-sm border border-data/50 bg-data/10 font-mono text-xs text-data"
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-password"
                  className="block font-mono text-xs text-muted mb-1.5"
                >
                  Admin password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-3 py-2.5 rounded-sm bg-canvas border border-hairline font-mono text-sm text-ink focus:border-code"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-sm font-mono text-xs sm:text-sm font-semibold bg-code text-[#071214] hover:opacity-90 transition-opacity"
              >
                Unlock workspace
              </button>
            </form>

            <div className="pt-4 border-t border-hairline flex items-center justify-between font-mono text-xs text-faint">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-muted hover:text-ink"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to portfolio</span>
              </Link>
              <span>Storage: {storageBackend}</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-panel border border-code font-mono text-xs text-ink shadow-xl"
        >
          <Check className="w-4 h-4 text-code" />
          <span>{toast}</span>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Bar */}
        <div
          ref={formTopRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-mono text-2xl font-bold text-ink">
                Content Management
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-elevated border border-hairline font-mono text-[11px] text-code">
                <Database className="w-3 h-3" />
                {storageBackend}
              </span>
            </div>
            <p className="text-sm text-muted mt-1">
              Changes save immediately and update portfolio sections and KPI
              counters in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-panel border border-hairline font-mono text-xs text-muted hover:text-ink"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View live site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-panel border border-hairline font-mono text-xs text-muted hover:text-data"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock session</span>
            </button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-xs border transition-colors ${
              activeTab === "projects"
                ? "bg-code/15 text-code border-code/50 font-semibold"
                : "bg-panel text-muted border-hairline hover:text-ink"
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blog")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-xs border transition-colors ${
              activeTab === "blog"
                ? "bg-data/15 text-data border-data/50 font-semibold"
                : "bg-panel text-muted border-hairline hover:text-ink"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Blog Posts ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-xs border transition-colors ${
              activeTab === "inbox"
                ? "bg-elevated text-ink border-ink/30 font-semibold"
                : "bg-panel text-muted border-hairline hover:text-ink"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox &amp; Settings ({messages.length})</span>
          </button>
        </div>

        {/* ==================== TAB 1: PROJECTS MANAGER ==================== */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Add / Edit Project Form */}
            <form
              onSubmit={handleSaveProject}
              className="lg:col-span-6 bg-panel border border-hairline rounded-md p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <h2 className="font-mono text-base font-semibold text-ink">
                  {editingProjectId ? "Edit Project" : "Add Project"}
                </h2>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="font-mono text-xs text-muted hover:text-ink"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              {projFormError && (
                <div
                  role="alert"
                  className="p-3 rounded-sm border border-data/50 bg-data/10 font-mono text-xs text-data"
                >
                  {projFormError}
                </div>
              )}

              <div>
                <label className="block font-mono text-xs text-muted mb-1">
                  Project title *
                </label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g., Sales Funnel Cohort Dashboard"
                  className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    Category *
                  </label>
                  <select
                    value={projCategory}
                    onChange={(e) =>
                      setProjCategory(e.target.value as ProjectCategory)
                    }
                    className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                  >
                    <option value="Web Dev">Web Dev</option>
                    <option value="Data Analytics">Data Analytics</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={projFeatured}
                      onChange={(e) => setProjFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#14D9C4]"
                    />
                    <span className="font-mono text-xs text-ink inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-data" />
                      Featured project
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1">
                  Short card summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={projSummary}
                  onChange={(e) => setProjSummary(e.target.value)}
                  placeholder="One-sentence summary shown on the project card..."
                  className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1">
                  Full detail description
                </label>
                <textarea
                  rows={4}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Architecture notes, problem statement, and workflow details shown in the case-study modal..."
                  className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1">
                  Tech stack tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  placeholder="React, TypeScript, SQL, Power BI"
                  className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                />
              </div>

              {/* Image Upload + URL */}
              <div className="space-y-2">
                <label className="block font-mono text-xs text-muted">
                  Thumbnail / Screenshot (upload file or paste path/URL)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-elevated border border-hairline font-mono text-xs text-ink hover:border-code/50 cursor-pointer">
                    <ImagePlus className="w-3.5 h-3.5 text-code" />
                    <span>Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <input
                    type="text"
                    value={projThumb}
                    onChange={(e) => setProjThumb(e.target.value)}
                    placeholder="/images/projects/..."
                    className="flex-1 min-w-[180px] px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                  />
                </div>
                {projThumb && (
                  <img
                    src={projThumb}
                    alt="Thumbnail preview"
                    className="h-28 w-auto rounded-xs border border-hairline object-cover"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    Live demo link
                  </label>
                  <input
                    type="url"
                    value={projLive}
                    onChange={(e) => setProjLive(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    GitHub repository link
                  </label>
                  <input
                    type="url"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/MjComia/..."
                    className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                  />
                </div>
              </div>

              {/* Optional Key Insights Builder (ideal for Data Analytics) */}
              <div className="pt-2 border-t border-hairline space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-data font-medium">
                    Key insights (shown in modal for Data Analytics)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProjInsights((prev) => [
                        ...prev,
                        { metric: "", label: "", detail: "" },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-xs bg-data/10 border border-data/30 font-mono text-[11px] text-data"
                  >
                    <Plus className="w-3 h-3" />
                    Add insight
                  </button>
                </div>

                {projInsights.map((ins, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-sm bg-canvas border border-hairline space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={ins.metric}
                        onChange={(e) =>
                          setProjInsights((prev) =>
                            prev.map((item, i) =>
                              i === idx
                                ? { ...item, metric: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Metric (e.g. +24.5%)"
                        className="px-2.5 py-1.5 rounded-xs bg-panel border border-hairline font-mono text-xs text-ink"
                      />
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={ins.label}
                          onChange={(e) =>
                            setProjInsights((prev) =>
                              prev.map((item, i) =>
                                i === idx
                                  ? { ...item, label: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Label (e.g. Retention)"
                          className="flex-1 px-2.5 py-1.5 rounded-xs bg-panel border border-hairline font-mono text-xs text-ink"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProjInsights((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label="Remove insight"
                          className="px-2 text-muted hover:text-data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={ins.detail}
                      onChange={(e) =>
                        setProjInsights((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, detail: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder="Short context explaining this finding..."
                      className="w-full px-2.5 py-1.5 rounded-xs bg-panel border border-hairline text-xs text-ink"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-sm font-mono text-xs sm:text-sm font-semibold bg-code text-[#071214] hover:opacity-90 transition-opacity"
              >
                {editingProjectId ? "Update project" : "Add project"}
              </button>
            </form>

            {/* Existing Projects List */}
            <div className="lg:col-span-6 space-y-3">
              <h2 className="font-mono text-base font-semibold text-ink">
                Existing Projects ({projects.length})
              </h2>

              {projects.map((proj) => {
                const isData = proj.category === "Data Analytics";
                const confirming = confirmDeleteProjId === proj.id;
                return (
                  <div
                    key={proj.id}
                    className="p-4 rounded-md bg-panel border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-16 h-12 rounded-xs object-cover border border-hairline bg-elevated shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded-xs font-mono text-[10px] border ${
                              isData
                                ? "bg-data/10 text-data border-data/30"
                                : "bg-code/10 text-code border-code/30"
                            }`}
                          >
                            {proj.category}
                          </span>
                          {proj.featured && (
                            <span className="font-mono text-[10px] text-data">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-mono text-sm font-semibold text-ink truncate mt-1">
                          {proj.title}
                        </h3>
                        <p className="font-mono text-[11px] text-muted truncate">
                          {proj.tags.join(" · ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditProject(proj)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-elevated border border-hairline font-mono text-xs text-ink hover:border-code/50"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-code" />
                        <span>Edit</span>
                      </button>

                      {confirming ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteProject(proj.id);
                            setConfirmDeleteProjId(null);
                            if (editingProjectId === proj.id)
                              resetProjectForm();
                            showToast("Project deleted");
                          }}
                          className="px-2.5 py-1.5 rounded-xs bg-red-500/20 border border-red-500/50 font-mono text-xs text-red-300"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteProjId(proj.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-panel border border-hairline font-mono text-xs text-muted hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: BLOG POSTS MANAGER ==================== */}
        {activeTab === "blog" && (
          <div className="space-y-8">
            {/* Write / Edit Blog Post Editor */}
            <div className="bg-panel border border-hairline rounded-md p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-hairline">
                <div>
                  <h2 className="font-mono text-base font-semibold text-ink">
                    {editingPostId ? "Edit Blog Post" : "Write Blog Post"}
                  </h2>
                  <p className="text-xs text-muted">
                    Supports headings, syntax-highlighted code blocks, lists,
                    quotes, tables, and images.
                  </p>
                </div>

                {editingPostId && (
                  <button
                    type="button"
                    onClick={resetPostForm}
                    className="font-mono text-xs text-muted hover:text-ink"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              {postFormError && (
                <div
                  role="alert"
                  className="p-3 rounded-sm border border-data/50 bg-data/10 font-mono text-xs text-data"
                >
                  {postFormError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    Post title *
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g., Cleaning Messy Survey Data with SQL CTEs"
                    className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="SQL, Data Analytics, React"
                    className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    Short excerpt (optional — auto-generated if blank)
                  </label>
                  <input
                    type="text"
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    placeholder="Concise summary for the blog card..."
                    className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-muted mb-1">
                    Cover image (upload or URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-elevated border border-hairline font-mono text-xs text-ink hover:border-code/50 cursor-pointer shrink-0">
                      <ImagePlus className="w-3.5 h-3.5 text-data" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePostCoverUpload}
                        className="sr-only"
                      />
                    </label>
                    <input
                      type="text"
                      value={postCover}
                      onChange={(e) => setPostCover(e.target.value)}
                      placeholder="/images/blog/..."
                      className="w-full px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                    />
                  </div>
                </div>
              </div>

              {/* Markdown Formatting Toolbar + Live View Switcher */}
              <div className="border border-hairline rounded-md overflow-hidden bg-canvas">
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-elevated border-b border-hairline font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertMarkdownSnippet("\n## Section Heading\n")}
                      className="px-2 py-1 rounded-xs bg-panel border border-hairline text-muted hover:text-ink"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSnippet("**bold text**")}
                      className="px-2 py-1 rounded-xs bg-panel border border-hairline text-muted hover:text-ink"
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet(
                          "\n```tsx\nconst result = useMemo(() => compute(data), [data]);\n```\n"
                        )
                      }
                      className="px-2 py-1 rounded-xs bg-panel border border-hairline text-code hover:border-code/50"
                    >
                      + TSX Code
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet(
                          "\n```sql\nSELECT category, COUNT(*) AS total\nFROM dataset\nGROUP BY 1;\n```\n"
                        )
                      }
                      className="px-2 py-1 rounded-xs bg-panel border border-hairline text-data hover:border-data/50"
                    >
                      + SQL Block
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet("\n- First takeaway\n- Second takeaway\n")
                      }
                      className="px-2 py-1 rounded-xs bg-panel border border-hairline text-muted hover:text-ink"
                    >
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet("\n> Key insight or takeaway.\n")
                      }
                      className="px-2 py-1 rounded-xs bg-panel border border-hairline text-muted hover:text-ink"
                    >
                      Quote
                    </button>
                    <label className="px-2 py-1 rounded-xs bg-panel border border-hairline text-muted hover:text-ink cursor-pointer">
                      + Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleInlineImageInsert}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div className="inline-flex rounded-xs bg-panel border border-hairline p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setEditorView("write")}
                      className={`px-2 py-0.5 rounded-xs ${
                        editorView === "write"
                          ? "bg-elevated text-ink font-medium"
                          : "text-muted"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorView("split")}
                      className={`px-2 py-0.5 rounded-xs ${
                        editorView === "split"
                          ? "bg-elevated text-ink font-medium"
                          : "text-muted"
                      }`}
                    >
                      Split preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorView("preview")}
                      className={`px-2 py-0.5 rounded-xs ${
                        editorView === "preview"
                          ? "bg-elevated text-ink font-medium"
                          : "text-muted"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    editorView === "split"
                      ? "lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-hairline"
                      : ""
                  }`}
                >
                  {(editorView === "write" || editorView === "split") && (
                    <textarea
                      ref={markdownRef}
                      rows={16}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write your article in Markdown..."
                      className="w-full p-4 bg-canvas font-mono text-xs sm:text-sm text-ink leading-relaxed focus:outline-none resize-y"
                    />
                  )}

                  {(editorView === "preview" || editorView === "split") && (
                    <div className="p-5 bg-panel min-h-[340px] max-h-[520px] overflow-y-auto">
                      <div className="font-mono text-[11px] text-faint mb-3 uppercase">
                        Live preview · ~
                        {estimateReadingTime(postContent || "word")} min read
                      </div>
                      {postContent.trim() ? (
                        <MarkdownRenderer content={postContent} />
                      ) : (
                        <p className="text-sm text-faint italic">
                          Start typing Markdown on the left to preview headings,
                          syntax-highlighted code blocks, tables, and lists.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Draft & Publish Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleSavePostWithStatus("draft")}
                  className="px-4 py-2.5 rounded-sm font-mono text-xs sm:text-sm font-medium bg-elevated border border-hairline text-ink hover:border-data/50 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePostWithStatus("published")}
                  className="px-5 py-2.5 rounded-sm font-mono text-xs sm:text-sm font-semibold bg-code text-[#071214] hover:opacity-90 transition-opacity"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Existing Blog Posts List */}
            <div className="space-y-3">
              <h2 className="font-mono text-base font-semibold text-ink">
                All Blog Posts ({posts.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => {
                  const isDraft = post.status === "draft";
                  const confirming = confirmDeletePostId === post.id;
                  return (
                    <div
                      key={post.id}
                      className="p-4 rounded-md bg-panel border border-hairline flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded-xs border ${
                              isDraft
                                ? "bg-data/15 text-data border-data/40"
                                : "bg-code/15 text-code border-code/40"
                            }`}
                          >
                            {isDraft ? "Draft" : "Published"}
                          </span>
                          <span className="text-muted tabular-nums">
                            {post.date} · {post.readingTime} min read
                          </span>
                        </div>
                        <h3 className="font-mono text-sm font-semibold text-ink">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-code"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview page</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditPost(post)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-elevated border border-hairline font-mono text-xs text-ink hover:border-code/50"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-code" />
                            <span>Edit</span>
                          </button>

                          {confirming ? (
                            <button
                              type="button"
                              onClick={async () => {
                                await deletePost(post.id);
                                setConfirmDeletePostId(null);
                                if (editingPostId === post.id) resetPostForm();
                                showToast("Post deleted");
                              }}
                              className="px-2.5 py-1 rounded-xs bg-red-500/20 border border-red-500/50 font-mono text-xs text-red-300"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePostId(post.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-panel border border-hairline font-mono text-xs text-muted hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: INBOX & SETTINGS ==================== */}
        {activeTab === "inbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Messages */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-mono text-base font-semibold text-ink">
                Contact Form Submissions ({messages.length})
              </h2>

              {messages.length === 0 ? (
                <div className="p-8 rounded-md bg-panel border border-hairline text-sm text-muted">
                  No messages received yet. Submissions from the public contact
                  form appear here automatically.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-md bg-panel border border-hairline space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="font-semibold text-ink">{msg.name}</span>
                      <span className="text-faint tabular-nums">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-code">
                      {msg.email} · {msg.subject}
                    </div>
                    <p className="text-sm text-ink/90 whitespace-pre-wrap pt-1">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Storage & Security Settings */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-md bg-panel border border-hairline space-y-4">
                <h2 className="font-mono text-base font-semibold text-ink">
                  Database &amp; Persistence
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  Active storage engine:{" "}
                  <strong className="font-mono text-code">
                    {storageBackend}
                  </strong>
                  . Content persists immediately in browser{" "}
                  <code className="font-mono">localStorage</code> out of the
                  box, and automatically syncs with Supabase Postgres whenever{" "}
                  <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                  and{" "}
                  <code className="font-mono">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </code>{" "}
                  are set in <code className="font-mono">.env.local</code>.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSqlModal((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xs bg-elevated border border-hairline font-mono text-xs text-ink hover:border-code/50"
                  >
                    {showSqlModal
                      ? "Hide Supabase SQL schema"
                      : "View Supabase SQL schema"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const snapshot = {
                        exportedAt: new Date().toISOString(),
                        storageBackend,
                        projects,
                        posts,
                        messages,
                      };
                      const blob = new Blob(
                        [JSON.stringify(snapshot, null, 2)],
                        { type: "application/json" }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `mj-portfolio-db-${new Date()
                        .toISOString()
                        .slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast("Exported JSON database snapshot");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-elevated border border-hairline font-mono text-xs text-code hover:border-code/50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON snapshot</span>
                  </button>
                </div>

                {showSqlModal && (
                  <pre className="p-3 rounded-sm bg-[#080d18] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {SUPABASE_SETUP_SQL}
                  </pre>
                )}

                <div className="pt-4 border-t border-hairline">
                  <button
                    type="button"
                    onClick={async () => {
                      await resetData();
                      showToast("Restored default sample projects and posts");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-panel border border-hairline font-mono text-xs text-muted hover:text-data"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to initial projects &amp; posts</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-md bg-panel border border-hairline space-y-3">
                <h2 className="font-mono text-base font-semibold text-ink">
                  Update Admin Password
                </h2>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="New password..."
                    className="flex-1 px-3 py-2 rounded-sm bg-canvas border border-hairline font-mono text-xs text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAdminPass.trim().length < 4) {
                        showToast("Choose a password of at least 4 characters");
                        return;
                      }
                      updateAdminPassword(newAdminPass.trim());
                      setNewAdminPass("");
                      showToast("Admin password updated");
                    }}
                    className="px-3.5 py-2 rounded-sm bg-code text-[#071214] font-mono text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

