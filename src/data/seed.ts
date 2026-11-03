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

export const SKILLS_DATA: SkillCategoryGroup[] = [
  {
    id: "programming-languages",
    category: "Programming Languages",
    description: "Application logic, relational queries, and algorithmic problem-solving",
    accent: "code",
    items: ["JavaScript (ES6+)", "TypeScript", "SQL", "Python", "Java", "C / C++"],
  },
  {
    id: "web-frontend",
    category: "Frontend & Web Development",
    description: "Component architecture, responsive layouts, and interactive UI",
    accent: "code",
    items: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    id: "backend-databases",
    category: "Backend & Databases",
    description: "API integration, relational schema modeling, and persistence",
    accent: "code",
    items: ["Node.js", "REST APIs", "MySQL", "PostgreSQL / Supabase"],
  },
  {
    id: "data-analysis",
    category: "Data Analysis & Visualization",
    description: "Data cleaning, cohort & KPI modeling, and dashboard reporting",
    accent: "data",
    items: [
      "Excel (Pivot Tables, Power Query, XLOOKUP)",
      "Power BI",
      "Tableau",
      "Pandas",
      "Matplotlib",
      "Exploratory Data Analysis",
    ],
  },
  {
    id: "tools-workflow",
    category: "Tools & Workflow",
    description: "Version control, team collaboration, and development environment",
    accent: "data",
    items: ["Git & GitHub", "VS Code", "Agile / Sprint Workflow", "Code Reviews"],
  },
];

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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-ops-workbench",
    slug: "react-order-operations-workbench",
    title: "Order & Inventory Operations Workbench",
    summary:
      "Modular React + TypeScript interface for tracking fulfillment queues, SLA thresholds, and stock movements with instant multi-column filtering.",
    description:
      "Designed around lessons learned building production React frontends: operators need fast keyboard navigation, URL-synced filters, and zero layout shift when switching status queues.\n\nThe interface separates filter state from table rendering so 1,000+ order rows filter smoothly without redundant re-renders. Includes inline status inspection, SLA breach indicators, and CSV export for downstream reporting.",
    category: "Web Dev",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST API"],
    thumbnail: "/images/projects/react-ops-board.svg",
    screenshots: ["/images/projects/react-ops-board.svg"],
    liveUrl: "https://github.com/MjComia",
    githubUrl: "https://github.com/MjComia",
    featured: true,
    createdAt: "2026-08-14",
  },
  {
    id: "proj-retail-cohort-bi",
    slug: "metro-retail-cohort-telemetry",
    title: "Retail Cohort & Margin Telemetry",
    summary:
      "End-to-end SQL and Power BI analysis of 48,900+ retail transactions uncovering repeat-buyer retention drivers and SKU margin concentration.",
    description:
      "Raw transactional exports often hide profitability problems behind rising gross revenue. In this analysis, I cleaned multi-month order logs using Python and SQL CTEs, deduplicated customer identifiers, and modeled monthly retention cohorts alongside SKU-level net margin.\n\nThe resulting dashboard pairs cohort heatmaps with a Pareto margin breakdown so merchandising teams can spot high-return product lines versus discount-heavy volume traps.",
    category: "Data Analytics",
    tags: ["SQL", "Power BI", "Python", "Excel", "Cohort Analysis"],
    thumbnail: "/images/projects/ecommerce-cohort-bi.svg",
    screenshots: ["/images/projects/ecommerce-cohort-bi.svg"],
    liveUrl: "https://github.com/MjComia",
    githubUrl: "https://github.com/MjComia",
    featured: true,
    insights: [
      {
        metric: "34.8%",
        label: "90-day repeat rate",
        detail: "Customers whose second order occurred within 21 days retained at 2.4x the baseline rate.",
      },
      {
        metric: "18.4% SKUs",
        label: "Pareto margin share",
        detail: "Less than one-fifth of catalog items generated 71% of net contribution margin after discounts.",
      },
      {
        metric: "-14.2%",
        label: "Promo margin leakage",
        detail: "Sitewide voucher campaigns lifted order count but compressed net margin on core staples.",
      },
    ],
    createdAt: "2026-09-22",
  },
  {
    id: "proj-grade-portal",
    slug: "academic-grade-records-portal",
    title: "Teacher & Student Grade Portal",
    summary:
      "Role-based academic portal built with Java and MySQL enabling faculty to manage student records while giving students read-only grade visibility.",
    description:
      "Built to replace error-prone manual grade sheets with a structured relational database and graphical desktop interface. Teachers authenticate into a management view where they can register student records, encode term grades, and update contact details.\n\nStudents log into a restricted read-only view scoped strictly to their own academic standing. Backed by a normalized MySQL schema enforcing student ID constraints and audit-ready record lookups.",
    category: "Web Dev",
    tags: ["Java", "MySQL", "SQL", "Swing GUI", "RBAC"],
    thumbnail: "/images/projects/gui.jpg",
    screenshots: ["/images/projects/gui.jpg"],
    githubUrl: "https://github.com/MjComia/Projects/tree/main/gui%20in%20Java",
    featured: true,
    createdAt: "2024-11-10",
  },
  {
    id: "proj-huffman-compressor",
    slug: "huffman-frequency-file-compressor",
    title: "Huffman Tree Compression & Bit Telemetry",
    summary:
      "Lossless file compression utility in C++ using character frequency distributions, priority queues, and binary Huffman trees to shrink text payloads.",
    description:
      "Developed collaboratively to study how statistical character distributions directly reduce storage footprint. The engine scans input files to build a frequency table, constructs a min-heap priority queue, and derives optimal prefix-free binary codes via a Huffman tree.\n\nDuring execution, the CLI outputs complete bit-level telemetry—character frequencies, padded binary streams, compressed byte counts, and exact execution time—verifying zero data loss upon decompression.",
    category: "Data Analytics",
    tags: ["C++", "Huffman Trees", "Frequency Analysis", "Data Structures"],
    thumbnail: "/images/projects/compress.jpg",
    screenshots: ["/images/projects/compress.jpg"],
    githubUrl:
      "https://github.com/MjComia/Projects/tree/main/Compression%20and%20Decompression%20using%20Huffman%20Tree",
    featured: false,
    insights: [
      {
        metric: "42%–55%",
        label: "Payload bit reduction",
        detail: "High-skew English text strings compressed to roughly half their fixed 8-bit ASCII bit length.",
      },
      {
        metric: "0.67s",
        label: "Decode verification",
        detail: "Sub-second tree reconstruction and bit-padding removal with 100% lossless round-trip parity.",
      },
    ],
    createdAt: "2024-09-18",
  },
  {
    id: "proj-usb-atm",
    slug: "usb-token-atm-simulation",
    title: "Hardware-Token ATM Banking System",
    summary:
      "C++ banking workflow simulation that uses a physical USB flash drive as an encrypted ATM card for balance inquiries, transfers, and PIN management.",
    description:
      "Models end-to-end automated teller workflows including account creation, balance checks, deposits, withdrawals, cash transfers, and PIN updates.\n\nInstead of typing an account number manually, the system detects an inserted USB drive acting as the user's physical bank card and verifies an encrypted PIN file stored on the volume before unlocking ledger transactions.",
    category: "Web Dev",
    tags: ["C++", "File I/O", "Encryption", "Systems Design"],
    thumbnail: "/images/projects/bank.jpg",
    screenshots: ["/images/projects/bank.jpg"],
    githubUrl: "https://github.com/MjComia/Projects/tree/main/ATM%20simulation",
    featured: false,
    createdAt: "2024-06-05",
  },
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: "post-react-internship-lessons",
    slug: "composable-react-interfaces-internship-lessons",
    title: "What My Full-Stack Internship Taught Me About Composable React Interfaces",
    excerpt:
      "Practical patterns from Easycom Japan Philippines Inc. on splitting state boundaries, taming data-heavy tables, and designing forms that help users recover from errors.",
    coverImage: "/images/blog/react-architecture-cover.svg",
    date: "2026-10-12",
    readingTime: 5,
    tags: ["React", "TypeScript", "Frontend", "Internship"],
    status: "published",
    updatedAt: "2026-10-12",
    content: `Shipping features inside a real team environment changes how you write React. On solo student projects, you can get away with a single 400-line component holding eight \`useState\` calls. In a shared codebase—like the environment I worked in during my internship at **Easycom Japan Philippines Inc.**—every component has to be legible to the next developer who opens the file.

Here are three concrete habits I picked up while focusing on React frontend work.

## 1. Keep filter state close to the URL or a single reducer

Data-heavy screens almost always start simple—one search box—and quickly grow status tabs, date ranges, and sort columns. Scattering those across independent state hooks invites synchronization bugs, such as forgetting to reset \`page\` to \`1\` when a category filter changes.

Grouping query parameters into a typed reducer keeps transitions explicit:

\`\`\`tsx
type FilterState = {
  query: string;
  category: "all" | "web" | "data";
  page: number;
};

type FilterAction =
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_CATEGORY"; category: FilterState["category"] }
  | { type: "SET_PAGE"; page: number };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query, page: 1 };
    case "SET_CATEGORY":
      return { ...state, category: action.category, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.page };
  }
}
\`\`\`

Notice how \`SET_QUERY\` and \`SET_CATEGORY\` automatically reset \`page: 1\`. You eliminate an entire class of "empty table on page 4" bugs in one place.

## 2. Treat loading, empty, and error states as first-class UI

Early on, it is tempting to code only the happy path where the API returns 20 clean rows. In production interfaces, empty and error states happen constantly:

- **Empty search results** should tell the user which filter matched zero items and offer a one-click button to clear filters.
- **Validation errors** should state what went wrong and how to fix it right next to the field, rather than firing a vague alert banner.
- **Skeletons and tabular numbers** (\`font-variant-numeric: tabular-nums\`) prevent numeric columns from jittering horizontally when live counts update.

## 3. Separate presentation primitives from domain logic

When a \`StatCard\` or \`DataTable\` knows nothing about a specific API endpoint, you can reuse it across admin views, reports, and public dashboards without rewriting markup.

> Good component boundaries look a lot like normalized database tables: each module owns one clear responsibility and communicates through well-typed keys.

That mindset is also why I fell in love with data analytics—once you care about how data is rendered on screen, you naturally want to trace how it is modeled, queried, and aggregated upstream.`,
  },
  {
    id: "post-sql-window-functions-kpis",
    slug: "raw-sql-tables-to-honest-kpis",
    title: "From Raw SQL Tables to Honest KPIs: Cleaning Data Before Charting It",
    excerpt:
      "Why dashboard accuracy is won or lost in the SQL layer—using CTEs, deduplication, and window functions before opening Power BI or Python.",
    coverImage: "/images/blog/sql-kpi-pipeline-cover.svg",
    date: "2026-10-26",
    readingTime: 6,
    tags: ["SQL", "Data Analytics", "Power BI", "Python"],
    status: "published",
    updatedAt: "2026-10-26",
    content: `A polished Power BI or Tableau chart cannot rescue an unverified denominator. Whenever I start exploring a dataset—whether academic records in MySQL or multi-month retail order logs—I try to answer three questions in plain SQL before touching a visual chart.

## Step 1: Audit duplicates and status flags first

Real exports almost always include retried webhooks, cancelled checkouts, or test accounts. Summing \`amount\` directly inflates revenue by 5% to 15%.

\`\`\`sql
WITH deduplicated_orders AS (
  SELECT
    order_id,
    customer_id,
    created_at,
    net_amount,
    ROW_NUMBER() OVER (
      PARTITION BY order_id
      ORDER BY updated_at DESC
    ) AS row_num
  FROM raw_orders
  WHERE order_status IN ('COMPLETED', 'SHIPPED')
    AND customer_email NOT LIKE '%@test.internal'
)
SELECT
  DATE_FORMAT(created_at, '%Y-%m-01') AS order_month,
  COUNT(order_id) AS valid_orders,
  ROUND(SUM(net_amount), 2) AS net_revenue
FROM deduplicated_orders
WHERE row_num = 1
GROUP BY 1
ORDER BY 1;
\`\`\`

Using \`ROW_NUMBER() OVER (PARTITION BY order_id ...)\` guarantees each order is counted once, even if an upstream ingestion script appended duplicate status rows.

## Step 2: Pair averages with distributions

Reporting only an "Average Order Value" of ₱1,450 hides whether most customers spend ₱1,400 or whether a handful of wholesale buyers mask a ₱450 retail median.

| Metric | Raw Export | Cleaned Cohort | Why It Matters |
| :--- | :--- | :--- | :--- |
| Gross Orders | 52,140 | 48,920 | Removes 3,220 cancelled & duplicate rows |
| Mean Order Value | ₱1,510 | ₱1,425 | Reflects settled net revenue |
| Median Order Value | ₱980 | ₱960 | Anchors realistic promo thresholds |

## Step 3: Let visuals highlight the decision, not decorate the page

When bringing cleaned tables into Power BI, Excel, or a custom React SVG chart:

1. **Reserve color for signal.** Keep gridlines and axes quiet so a single warm accent draws the eye directly to the threshold or cohort shift that needs attention.
2. **Show deltas alongside absolutes.** "34.8% 90-day retention (+6.2 pts YoY)" gives immediate context; a lone number without a baseline forces the reader to guess whether it is healthy.
3. **Document your metric definitions.** Writing a two-line tooltip explaining how a KPI is calculated builds instant trust with both engineers and business stakeholders.`,
  },
];

