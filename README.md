# Mark Joel "Mj" Comia — Personal Portfolio (`Code meets Data`)

A Next.js + TypeScript personal portfolio and content management workspace built for **Mark Joel Comia (Mj)**, BS Information Systems graduate from the Technological University of the Philippines (TUP Manila), Full Stack Developer (React), and aspiring Data Analyst.

## Features

- **"Code meets Data" Visual Identity**: Dark theme by default (`#0B101B`) with an accessible light-mode toggle, electric cyan (`#14D9C4`) for engineering elements, warm signal amber (`#F59E0B`) for data elements, subtle chart-canvas gridlines, and coordinate axis dividers.
- **Interactive Hero Workbench**: Switch between **Dev view**, **Split**, and **Data view** to inspect live syntax-highlighted React/SQL snippets alongside live KPI counters.
- **Profile, Tech Stack Ledger & GitHub Activity**: Bio, TUP & Easycom Japan Philippines Inc. timeline, live-updating KPI `StatCard` counters, categorized technical stack specification (`SkillChart`), and live GitHub contribution heatmap (`GitHubActivity`).
- **Filterable Projects + Case Study Modal**: Filter across `All`, `Web Dev`, and `Data Analytics` (`TagFilter`), and click any `ProjectCard` to view full descriptions, screenshots, stack tags, and quantified **Key Insights**.
- **Technical Blog (`/blog/[slug]`)**: Searchable, tag-filtered `BlogCard` directory and dedicated Markdown reader supporting headings, copyable syntax-highlighted code blocks, tables, blockquotes, images, and lists.
- **Built-in JSON CMS (`/admin`)**: Password-protected workspace to add/edit/delete projects, write/edit/delete Markdown blog posts with live preview, and manage categorized tech stacks (automatically recounting overall stack tools). Saves directly to `src/data/portfolio-db.json` (plus `public/images/uploads/` for images) during local development, with `localStorage` fallback and one-click JSON export on read-only hosts like Vercel.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Admin Content Management & Deployment Workflow

Navigate to http://localhost:3000/admin:
- **Default password**: `mj-admin-2026` (can be changed inside `/admin` -> **Inbox & JSON DB**, or via `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env`).
- **Updating live content for Vercel**:
  1. Run `npm run dev` locally and open `http://localhost:3000/admin`.
  2. Add or edit **Projects**, **Blog Posts**, or **Tech Stack** tools — changes write straight to `src/data/portfolio-db.json` (and uploaded images save to `public/images/uploads/`).
  3. Commit and push (`git add . && git commit -m "Update portfolio content" && git push`) so Vercel automatically rebuilds and publishes your updates for all visitors.
