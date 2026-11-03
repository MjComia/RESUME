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
  fetchPortfolioSnapshot,
  getStoredTheme,
  PORTFOLIO_SYNC_EVENT,
  removePost,
  removeProject,
  saveAllSkills,
  saveStoredTheme,
  upsertPost,
  upsertProject,
} from "@/lib/storage";
import {
  BlogPost,
  ContactMessage,
  Project,
  SkillCategoryGroup,
} from "@/types/portfolio";

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
  skills: SkillCategoryGroup[];
  projects: Project[];
  posts: BlogPost[];
  publishedPosts: BlogPost[];
  messages: ContactMessage[];
  stats: PortfolioStats;
  isHydrated: boolean;
  isReadOnlyHost: boolean;
  storageBackend: string;
  theme: "dark" | "light";
  toggleTheme: () => void;
  saveSkills: (nextSkills: SkillCategoryGroup[]) => Promise<boolean>;
  saveProject: (project: Project) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  savePost: (post: BlogPost) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  sendContactMessage: (
    data: Omit<ContactMessage, "id" | "createdAt">
  ) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(
  undefined
);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<SkillCategoryGroup[]>(SKILLS_DATA);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isReadOnlyHost, setIsReadOnlyHost] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  const loadAll = useCallback(async () => {
    const [snapshot, loadedMessages] = await Promise.all([
      fetchPortfolioSnapshot(),
      fetchMessages(),
    ]);
    setSkills(snapshot.skills);
    setProjects(snapshot.projects);
    setPosts(snapshot.posts);
    setIsReadOnlyHost(snapshot.isReadOnlyHost);
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

  const saveSkills = useCallback(async (nextSkills: SkillCategoryGroup[]) => {
    const { skills: updated, savedToDisk } = await saveAllSkills(nextSkills);
    setSkills(updated);
    setIsReadOnlyHost(!savedToDisk);
    return savedToDisk;
  }, []);

  const saveProject = useCallback(
    async (project: Project) => {
      const { projects: updated, savedToDisk } = await upsertProject(
        project,
        projects
      );
      setProjects(updated);
      setIsReadOnlyHost(!savedToDisk);
      return savedToDisk;
    },
    [projects]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const { projects: updated, savedToDisk } = await removeProject(
        id,
        projects
      );
      setProjects(updated);
      setIsReadOnlyHost(!savedToDisk);
      return savedToDisk;
    },
    [projects]
  );

  const savePost = useCallback(
    async (post: BlogPost) => {
      const { posts: updated, savedToDisk } = await upsertPost(post, posts);
      setPosts(updated);
      setIsReadOnlyHost(!savedToDisk);
      return savedToDisk;
    },
    [posts]
  );

  const deletePost = useCallback(
    async (id: string) => {
      const { posts: updated, savedToDisk } = await removePost(id, posts);
      setPosts(updated);
      setIsReadOnlyHost(!savedToDisk);
      return savedToDisk;
    },
    [posts]
  );

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

  const publishedPosts = useMemo(
    () =>
      posts
        .filter((p) => p.status === "published")
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [posts]
  );

  const stats = useMemo<PortfolioStats>(() => {
    // Automatically count all distinct tech stack items managed in skills
    const techSet = new Set<string>();
    skills.forEach((group) =>
      group.items.forEach((item) => {
        const cleaned = item.trim().toLowerCase();
        if (cleaned) techSet.add(cleaned);
      })
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
  }, [skills, projects, posts, publishedPosts]);

  const storageBackend = isReadOnlyHost
    ? "localStorage (read-only host)"
    : "portfolio-db.json";

  const value = useMemo<PortfolioContextValue>(
    () => ({
      skills,
      projects,
      posts,
      publishedPosts,
      messages,
      stats,
      isHydrated,
      isReadOnlyHost,
      storageBackend,
      theme,
      toggleTheme,
      saveSkills,
      saveProject,
      deleteProject,
      savePost,
      deletePost,
      sendContactMessage,
    }),
    [
      skills,
      projects,
      posts,
      publishedPosts,
      messages,
      stats,
      isHydrated,
      isReadOnlyHost,
      storageBackend,
      theme,
      toggleTheme,
      saveSkills,
      saveProject,
      deleteProject,
      savePost,
      deletePost,
      sendContactMessage,
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
