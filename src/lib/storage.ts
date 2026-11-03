import { INITIAL_POSTS, INITIAL_PROJECTS } from "@/data/seed";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { BlogPost, ContactMessage, Project } from "@/types/portfolio";

const KEYS = {
  PROJECTS: "mj_portfolio_projects_v1",
  POSTS: "mj_portfolio_posts_v1",
  MESSAGES: "mj_portfolio_messages_v1",
  ADMIN_SESSION: "mj_portfolio_admin_session_v1",
  ADMIN_PASS: "mj_portfolio_admin_custom_pass_v1",
  THEME: "mj_portfolio_theme_v1",
} as const;

export const PORTFOLIO_SYNC_EVENT = "mj-portfolio-updated";

function notifySync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PORTFOLIO_SYNC_EVENT));
  }
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  notifySync();
}

export async function fetchProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("payload")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map((row) => row.payload as Project);
        writeLocal(KEYS.PROJECTS, mapped);
        return mapped;
      }
      if (!error && data && data.length === 0) {
        // Seed initial projects into Supabase on first empty run
        await Promise.all(
          INITIAL_PROJECTS.map((proj) =>
            supabase!.from("portfolio_projects").upsert({ id: proj.id, payload: proj })
          )
        );
        return INITIAL_PROJECTS;
      }
    } catch {
      // Fallback cleanly to localStorage
    }
  }
  return readLocal<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
}

export async function upsertProject(project: Project): Promise<Project[]> {
  const current = readLocal<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  const exists = current.some((p) => p.id === project.id);
  const next = exists
    ? current.map((p) => (p.id === project.id ? project : p))
    : [project, ...current];
  writeLocal(KEYS.PROJECTS, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("portfolio_projects")
        .upsert({ id: project.id, payload: project });
    } catch {
      // Local copy already persisted
    }
  }
  return next;
}

export async function removeProject(id: string): Promise<Project[]> {
  const current = readLocal<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  const next = current.filter((p) => p.id !== id);
  writeLocal(KEYS.PROJECTS, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("portfolio_projects").delete().eq("id", id);
    } catch {
      // Local deletion already persisted
    }
  }
  return next;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_posts")
        .select("payload")
        .order("updated_at", { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map((row) => row.payload as BlogPost);
        writeLocal(KEYS.POSTS, mapped);
        return mapped;
      }
      if (!error && data && data.length === 0) {
        await Promise.all(
          INITIAL_POSTS.map((post) =>
            supabase!.from("portfolio_posts").upsert({ id: post.id, payload: post })
          )
        );
        return INITIAL_POSTS;
      }
    } catch {
      // Fallback cleanly to localStorage
    }
  }
  return readLocal<BlogPost[]>(KEYS.POSTS, INITIAL_POSTS);
}

export async function upsertPost(post: BlogPost): Promise<BlogPost[]> {
  const current = readLocal<BlogPost[]>(KEYS.POSTS, INITIAL_POSTS);
  const exists = current.some((p) => p.id === post.id);
  const next = exists
    ? current.map((p) => (p.id === post.id ? post : p))
    : [post, ...current];
  writeLocal(KEYS.POSTS, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("portfolio_posts")
        .upsert({ id: post.id, payload: post, updated_at: new Date().toISOString() });
    } catch {
      // Local copy already persisted
    }
  }
  return next;
}

export async function removePost(id: string): Promise<BlogPost[]> {
  const current = readLocal<BlogPost[]>(KEYS.POSTS, INITIAL_POSTS);
  const next = current.filter((p) => p.id !== id);
  writeLocal(KEYS.POSTS, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("portfolio_posts").delete().eq("id", id);
    } catch {
      // Local deletion already persisted
    }
  }
  return next;
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_messages")
        .select("payload")
        .order("created_at", { ascending: false });
      if (!error && data) {
        const mapped = data.map((row) => row.payload as ContactMessage);
        writeLocal(KEYS.MESSAGES, mapped);
        return mapped;
      }
    } catch {
      // Fallback cleanly to localStorage
    }
  }
  return readLocal<ContactMessage[]>(KEYS.MESSAGES, []);
}

export async function addContactMessage(msg: ContactMessage): Promise<ContactMessage[]> {
  const current = readLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  const next = [msg, ...current];
  writeLocal(KEYS.MESSAGES, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("portfolio_messages").insert({ id: msg.id, payload: msg });
    } catch {
      // Local copy already persisted
    }
  }
  return next;
}

export async function resetAllPortfolioData(): Promise<{
  projects: Project[];
  posts: BlogPost[];
}> {
  writeLocal(KEYS.PROJECTS, INITIAL_PROJECTS);
  writeLocal(KEYS.POSTS, INITIAL_POSTS);
  return { projects: INITIAL_PROJECTS, posts: INITIAL_POSTS };
}

// Simple Admin Password Auth Helpers
const DEFAULT_ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "mj-admin-2026";

export function verifyAdminPassword(input: string): boolean {
  if (typeof window === "undefined") return false;
  const custom = window.localStorage.getItem(KEYS.ADMIN_PASS);
  const expected = custom || DEFAULT_ADMIN_PASSWORD;
  return input === expected;
}

export function setAdminSession(active: boolean) {
  if (typeof window === "undefined") return;
  if (active) {
    window.sessionStorage.setItem(KEYS.ADMIN_SESSION, "authenticated");
  } else {
    window.sessionStorage.removeItem(KEYS.ADMIN_SESSION);
  }
}

export function hasAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(KEYS.ADMIN_SESSION) === "authenticated";
}

export function updateAdminPassword(newPassword: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.ADMIN_PASS, newPassword);
}

export function getStoredTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const val = window.localStorage.getItem(KEYS.THEME);
  return val === "light" ? "light" : "dark";
}

export function saveStoredTheme(theme: "dark" | "light") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.THEME, theme);
}

