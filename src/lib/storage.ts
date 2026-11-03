import { INITIAL_POSTS, INITIAL_PROJECTS, SKILLS_DATA } from "@/data/seed";
import { compressImageFile } from "@/lib/image";
import {
  BlogPost,
  ContactMessage,
  Project,
  SkillCategoryGroup,
} from "@/types/portfolio";

const KEYS = {
  SKILLS: "mj_portfolio_skills_v1",
  PROJECTS: "mj_portfolio_projects_v1",
  POSTS: "mj_portfolio_posts_v1",
  MESSAGES: "mj_portfolio_messages_v1",
  LOCAL_OVERRIDE: "mj_portfolio_local_override_v1",
  ADMIN_SESSION: "mj_portfolio_admin_session_v1",
  ADMIN_PASS: "mj_portfolio_admin_custom_pass_v1",
  THEME: "mj_portfolio_theme_v1",
} as const;

export const PORTFOLIO_SYNC_EVENT = "mj-portfolio-updated";

export interface PortfolioSnapshot {
  skills: SkillCategoryGroup[];
  projects: Project[];
  posts: BlogPost[];
  isReadOnlyHost: boolean;
}

function notifySync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PORTFOLIO_SYNC_EVENT));
  }
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function cacheLocalSnapshot(data: {
  skills: SkillCategoryGroup[];
  projects: Project[];
  posts: BlogPost[];
}) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEYS.SKILLS, JSON.stringify(data.skills));
    window.localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
    window.localStorage.setItem(KEYS.POSTS, JSON.stringify(data.posts));
  } catch {
    // Ignore storage quota issues when disk JSON is active
  }
}

export async function fetchPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  try {
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as PortfolioSnapshot;
      const hasLocalOverride =
        typeof window !== "undefined" &&
        window.localStorage.getItem(KEYS.LOCAL_OVERRIDE) === "1";

      // On read-only hosts (e.g. Vercel), only use localStorage if user explicitly edited via /admin on that browser
      if (json.isReadOnlyHost && hasLocalOverride) {
        return {
          skills: readLocal(KEYS.SKILLS, json.skills),
          projects: readLocal(KEYS.PROJECTS, json.projects),
          posts: readLocal(KEYS.POSTS, json.posts),
          isReadOnlyHost: true,
        };
      }

      // Otherwise portfolio-db.json is the authoritative source of truth
      cacheLocalSnapshot(json);
      return json;
    }
  } catch {
    // Fallback to localStorage / bundled seed
  }

  return {
    skills: readLocal(KEYS.SKILLS, SKILLS_DATA),
    projects: readLocal(KEYS.PROJECTS, INITIAL_PROJECTS),
    posts: readLocal(KEYS.POSTS, INITIAL_POSTS),
    isReadOnlyHost: false,
  };
}

async function persistDbUpdate(partial: {
  skills?: SkillCategoryGroup[];
  projects?: Project[];
  posts?: BlogPost[];
}): Promise<{
  skills: SkillCategoryGroup[];
  projects: Project[];
  posts: BlogPost[];
  savedToDisk: boolean;
}> {
  const fallbackSkills =
    partial.skills ?? readLocal(KEYS.SKILLS, SKILLS_DATA);
  const fallbackProjects =
    partial.projects ?? readLocal(KEYS.PROJECTS, INITIAL_PROJECTS);
  const fallbackPosts =
    partial.posts ?? readLocal(KEYS.POSTS, INITIAL_POSTS);

  try {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });

    if (res.ok) {
      const json = (await res.json()) as {
        skills: SkillCategoryGroup[];
        projects: Project[];
        posts: BlogPost[];
        savedToDisk: boolean;
      };
      cacheLocalSnapshot(json);
      if (typeof window !== "undefined") {
        if (json.savedToDisk) {
          window.localStorage.removeItem(KEYS.LOCAL_OVERRIDE);
        } else {
          window.localStorage.setItem(KEYS.LOCAL_OVERRIDE, "1");
        }
      }
      notifySync();
      return json;
    }
  } catch {
    // Fallback to localStorage below
  }

  const fallback = {
    skills: fallbackSkills,
    projects: fallbackProjects,
    posts: fallbackPosts,
    savedToDisk: false,
  };
  cacheLocalSnapshot(fallback);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.LOCAL_OVERRIDE, "1");
  }
  notifySync();
  return fallback;
}

export async function saveAllSkills(
  skills: SkillCategoryGroup[]
): Promise<{ skills: SkillCategoryGroup[]; savedToDisk: boolean }> {
  const res = await persistDbUpdate({ skills });
  return { skills: res.skills, savedToDisk: res.savedToDisk };
}

export async function upsertProject(
  project: Project,
  currentProjects: Project[]
): Promise<{ projects: Project[]; savedToDisk: boolean }> {
  const exists = currentProjects.some((p) => p.id === project.id);
  const next = exists
    ? currentProjects.map((p) => (p.id === project.id ? project : p))
    : [project, ...currentProjects];
  const res = await persistDbUpdate({ projects: next });
  return { projects: res.projects, savedToDisk: res.savedToDisk };
}

export async function removeProject(
  id: string,
  currentProjects: Project[]
): Promise<{ projects: Project[]; savedToDisk: boolean }> {
  const next = currentProjects.filter((p) => p.id !== id);
  const res = await persistDbUpdate({ projects: next });
  return { projects: res.projects, savedToDisk: res.savedToDisk };
}

export async function upsertPost(
  post: BlogPost,
  currentPosts: BlogPost[]
): Promise<{ posts: BlogPost[]; savedToDisk: boolean }> {
  const exists = currentPosts.some((p) => p.id === post.id);
  const next = exists
    ? currentPosts.map((p) => (p.id === post.id ? post : p))
    : [post, ...currentPosts];
  const res = await persistDbUpdate({ posts: next });
  return { posts: res.posts, savedToDisk: res.savedToDisk };
}

export async function removePost(
  id: string,
  currentPosts: BlogPost[]
): Promise<{ posts: BlogPost[]; savedToDisk: boolean }> {
  const next = currentPosts.filter((p) => p.id !== id);
  const res = await persistDbUpdate({ posts: next });
  return { posts: res.posts, savedToDisk: res.savedToDisk };
}

export async function uploadAssetFile(file: File): Promise<string> {
  const compressedDataUrl = await compressImageFile(file);
  try {
    const res = await fetch("/api/portfolio/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        dataUrl: compressedDataUrl,
      }),
    });
    if (res.ok) {
      const json = (await res.json()) as { url?: string };
      if (json.url) return json.url;
    }
  } catch {
    // Fallback to compressed data URL
  }
  return compressedDataUrl;
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  return readLocal<ContactMessage[]>(KEYS.MESSAGES, []);
}

export async function addContactMessage(
  msg: ContactMessage
): Promise<ContactMessage[]> {
  const current = readLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  const next = [msg, ...current];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.MESSAGES, JSON.stringify(next));
  }
  notifySync();
  return next;
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
