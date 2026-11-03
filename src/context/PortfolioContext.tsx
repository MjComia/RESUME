"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { INITIAL_POSTS, INITIAL_PROJECTS, SKILLS_DATA } from "@/data/seed";
import {
  addContactMessage,
  fetchMessages,
  fetchPosts,
  fetchProjects,
  getStoredTheme,
  PORTFOLIO_SYNC_EVENT,
  removePost,
  removeProject,
  resetAllPortfolioData,
  saveStoredTheme,
  upsertPost,
  upsertProject,
} from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { BlogPost, ContactMessage, Project } from "@/types/portfolio";

interface PortfolioStats {
  projectsBuilt: number;
  webProjects: number;
  dataProjects: number;
  technologiesUsed: number;
  publishedPosts: number;
  draftPosts: number;
  insightsDocumented: number;
}

interface PortfolioContextValue {
  projects: Project[];
  posts: BlogPost[];
  publishedPosts: BlogPost[];
  messages: ContactMessage[];
  stats: PortfolioStats;
  isHydrated: boolean;
  storageBackend: "Supabase" | "localStorage";
  theme: "dark" | "light";
  toggleTheme: () => void;
  saveProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  savePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  sendContactMessage: (
    data: Omit<ContactMessage, "id" | "createdAt">
  ) => Promise<void>;
  resetData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(
  undefined
);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  const loadAll = useCallback(async () => {
    const [loadedProjects, loadedPosts, loadedMessages] = await Promise.all([
      fetchProjects(),
      fetchPosts(),
      fetchMessages(),
    ]);
    setProjects(loadedProjects);
    setPosts(loadedPosts);
    setMessages(loadedMessages);
  }, []);

  useEffect(() => {
    const initialTheme = getStoredTheme();
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    loadAll().finally(() => setIsHydrated(true));

    const handleSync = () => {
      loadAll();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener(PORTFOLIO_SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener(PORTFOLIO_SYNC_EVENT, handleSync);
    };
  }, [loadAll]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      saveStoredTheme(next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const saveProject = useCallback(async (project: Project) => {
    const next = await upsertProject(project);
    setProjects(next);
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const next = await removeProject(id);
    setProjects(next);
  }, []);

  const savePost = useCallback(async (post: BlogPost) => {
    const next = await upsertPost(post);
    setPosts(next);
  }, []);

  const deletePost = useCallback(async (id: string) => {
    const next = await removePost(id);
    setPosts(next);
  }, []);

  const sendContactMessage = useCallback(
    async (data: Omit<ContactMessage, "id" | "createdAt">) => {
      const entry: ContactMessage = {
        ...data,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const next = await addContactMessage(entry);
      setMessages(next);
    },
    []
  );

  const resetData = useCallback(async () => {
    const { projects: p, posts: b } = await resetAllPortfolioData();
    setProjects(p);
    setPosts(b);
  }, []);

  const publishedPosts = useMemo(
    () =>
      posts
        .filter((p) => p.status === "published")
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [posts]
  );

  const stats = useMemo<PortfolioStats>(() => {
    const techSet = new Set<string>();
    SKILLS_DATA.forEach((group) =>
      group.items.forEach((item) => techSet.add(item.trim().toLowerCase()))
    );
    projects.forEach((proj) =>
      proj.tags.forEach((tag) => techSet.add(tag.trim().toLowerCase()))
    );
    const webProjects = projects.filter((p) => p.category === "Web Dev").length;
    const dataProjects = projects.filter(
      (p) => p.category === "Data Analytics"
    ).length;
    const insightsDocumented = projects.reduce(
      (acc, p) => acc + (p.insights?.length ?? 0),
      0
    );

    return {
      projectsBuilt: projects.length,
      webProjects,
      dataProjects,
      technologiesUsed: techSet.size,
      publishedPosts: publishedPosts.length,
      draftPosts: posts.filter((p) => p.status === "draft").length,
      insightsDocumented,
    };
  }, [projects, posts, publishedPosts]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      projects,
      posts,
      publishedPosts,
      messages,
      stats,
      isHydrated,
      storageBackend: isSupabaseConfigured ? "Supabase" : "localStorage",
      theme,
      toggleTheme,
      saveProject,
      deleteProject,
      savePost,
      deletePost,
      sendContactMessage,
      resetData,
    }),
    [
      projects,
      posts,
      publishedPosts,
      messages,
      stats,
      isHydrated,
      theme,
      toggleTheme,
      saveProject,
      deleteProject,
      savePost,
      deletePost,
      sendContactMessage,
      resetData,
    ]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return ctx;
}

