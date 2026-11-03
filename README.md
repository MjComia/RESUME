# Mark Joel "Mj" Comia — Personal Portfolio (`Code meets Data`)

A Next.js + TypeScript personal portfolio and content management workspace built for **Mark Joel Comia (Mj)**, BS Information Systems student at the Technological University of the Philippines (TUP Manila), Full Stack Developer (React), and aspiring Data Analyst.

## Features

- **"Code meets Data" Visual Identity**: Dark theme by default (`#0B101B`) with an accessible light-mode toggle, electric cyan (`#14D9C4`) for engineering elements, warm signal amber (`#F59E0B`) for data elements, subtle chart-canvas gridlines, and coordinate axis dividers.
- **Interactive Hero Workbench**: Switch between **Dev view**, **Split**, and **Data view** to inspect live syntax-highlighted React/SQL snippets alongside an interactive telemetry chart and KPI summary.
- **Profile & Dual-Stack Proficiency**: Bio, TUP & Easycom Japan Philippines Inc. timeline, live-updating KPI `StatCard` counters, and a `SkillChart` with both animated proficiency bars and an SVG radar overlay.
- **Filterable Projects + Case Study Modal**: Filter across `All`, `Web Dev`, and `Data Analytics` (`TagFilter`), and click any `ProjectCard` to view full descriptions, screenshots, stack tags, and quantified **Key Insights**.
- **Technical Blog (`/blog/[slug]`)**: Searchable, tag-filtered `BlogCard` directory and dedicated Markdown reader supporting headings, copyable syntax-highlighted code blocks, tables, blockquotes, images, and lists.
- **Built-in Admin CMS (`/admin`)**: Password-protected workspace to add/edit/delete projects (with client-side image upload compression & Key Insights builder) and write/edit/delete blog posts with a live side-by-side Markdown preview, **Save Draft**, and **Publish**. Uses Supabase automatically when configured in `.env.local`, or `localStorage` out of the box.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Admin Content Management

Navigate to http://localhost:3000/admin:
- **Default password**: `mj-admin-2026` (can be changed inside `/admin` -> **Inbox & Settings**, or via `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`).
