import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import bundledDb from "@/data/portfolio-db.json";
import { BlogPost, Project, SkillCategoryGroup } from "@/types/portfolio";

export const dynamic = "force-dynamic";

interface PortfolioDbShape {
  skills: SkillCategoryGroup[];
  projects: Project[];
  posts: BlogPost[];
}

const DB_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "portfolio-db.json"
);

async function readDbFile(): Promise<PortfolioDbShape> {
  try {
    const raw = await fs.readFile(DB_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<PortfolioDbShape>;
    return {
      skills: Array.isArray(parsed.skills)
        ? parsed.skills
        : (bundledDb.skills as SkillCategoryGroup[]),
      projects: Array.isArray(parsed.projects)
        ? parsed.projects
        : (bundledDb.projects as Project[]),
      posts: Array.isArray(parsed.posts)
        ? parsed.posts
        : (bundledDb.posts as BlogPost[]),
    };
  } catch {
    return {
      skills: bundledDb.skills as SkillCategoryGroup[],
      projects: bundledDb.projects as Project[],
      posts: bundledDb.posts as BlogPost[],
    };
  }
}

export async function GET() {
  const db = await readDbFile();
  return NextResponse.json({
    ...db,
    isReadOnlyHost: Boolean(process.env.VERCEL),
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PortfolioDbShape>;
    const current = await readDbFile();

    const nextDb: PortfolioDbShape = {
      skills: Array.isArray(body.skills) ? body.skills : current.skills,
      projects: Array.isArray(body.projects) ? body.projects : current.projects,
      posts: Array.isArray(body.posts) ? body.posts : current.posts,
    };

    try {
      await fs.writeFile(
        DB_FILE_PATH,
        JSON.stringify(nextDb, null, 2) + "\n",
        "utf8"
      );
      return NextResponse.json({
        ...nextDb,
        savedToDisk: true,
        isReadOnlyHost: false,
      });
    } catch {
      // Read-only serverless filesystem (e.g. Vercel deployment) -> fallback to localStorage on client
      return NextResponse.json({
        ...nextDb,
        savedToDisk: false,
        isReadOnlyHost: true,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid portfolio payload." },
      { status: 400 }
    );
  }
}

