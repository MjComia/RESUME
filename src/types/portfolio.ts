export type ProjectCategory = "Web Dev" | "Data Analytics";

export interface ProjectInsight {
  metric: string;
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  thumbnail: string;
  screenshots?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  insights?: ProjectInsight[];
  createdAt: string;
}

export type PostStatus = "published" | "draft";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readingTime: number;
  tags: string[];
  status: PostStatus;
  updatedAt: string;
}

export interface SkillCategoryGroup {
  id: string;
  category: string;
  description: string;
  accent: "code" | "data";
  items: string[];
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: "experience" | "education";
  summary: string;
  highlights: string[];
  accent: "code" | "data";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

