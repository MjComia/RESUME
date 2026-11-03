import dbJson from "@/data/portfolio-db.json";
import {
  BlogPost,
  Project,
  SkillCategoryGroup,
  TimelineItem,
} from "@/types/portfolio";

export const PROFILE_DATA = {
  name: "Mark Joel Comia",
  shortName: "Mj",
  handle: "mj.comia",
  tagline: "Web Developer & Aspiring Data Analyst",
  intro:
    "BS Information Systems graduate from the Technological University of the Philippines. I build modular React interfaces and turn relational datasets into clear operational decisions.",
  bio: [
    "I'm Mark Joel Comia (Mj), a BS Information Systems graduate from the Technological University of the Philippines (TUP Manila). My work sits where application engineering meets analytical thinking: building interfaces people rely on daily, then inspecting the data those systems produce.",
    "During my Full Stack Developer internship at Easycom Japan Philippines Inc., I focused on production React frontend work—translating complex workflows into reusable components, tightening form validation, and keeping UI state predictable across views. Alongside web engineering, I spend my time writing SQL queries, cleaning datasets in Python and Excel, and designing KPI dashboards in Power BI and Tableau.",
  ],
  photo: "/images/profile-mj.jpg",
  location: "Manila, Philippines",
  email: "comiamarkjoel@gmail.com",
  academicEmail: "markjoel.comia@tup.edu.ph",
  github: "https://github.com/MjComia",
  linkedin: "https://www.linkedin.com/in/mark-joel-comia-445b18338/",
};

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "tl-easycom",
    period: "2025 — 2026",
    role: "Full Stack Developer Intern (React Frontend Focus)",
    organization: "Easycom Japan Philippines Inc.",
    location: "Philippines",
    type: "experience",
    accent: "code",
    summary:
      "Contributed to client-facing and internal web modules within a cross-functional engineering team, concentrating on React component quality and API integration.",
    highlights: [
      "Built reusable React table, filter, and form components following strict layout and state conventions.",
      "Integrated frontend views with backend REST endpoints, handling loading, empty, and validation states cleanly.",
      "Collaborated in code reviews and sprint ceremonies to ship responsive screens across desktop and mobile viewports.",
    ],
  },
  {
    id: "tl-tup",
    period: "2022 — 2026",
    role: "Bachelor of Science in Information Systems",
    organization: "Technological University of the Philippines (TUP)",
    location: "Manila, Philippines",
    type: "education",
    accent: "data",
    summary:
      "Focused on systems analysis, relational database design, data structures, enterprise information systems, and quantitative decision support.",
    highlights: [
      "Designed normalized MySQL schemas and desktop/web portals for academic grade tracking and transaction workflows.",
      "Implemented classic algorithmic systems in C++ and Java, including lossless file compression and hardware-token ATM simulation.",
      "Bridged coursework in business systems with self-directed data analytics projects in SQL, Python, and Power BI.",
    ],
  },
];

export const SKILLS_DATA = dbJson.skills as SkillCategoryGroup[];
export const INITIAL_PROJECTS = dbJson.projects as Project[];
export const INITIAL_POSTS = dbJson.posts as BlogPost[];
