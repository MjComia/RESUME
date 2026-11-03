import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const SUPABASE_SETUP_SQL = `-- Optional Supabase schema for Mj Portfolio CMS
create table if not exists public.portfolio_projects (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.portfolio_posts (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.portfolio_messages (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security & allow client reads/writes (tighten writes once Supabase Auth is added)
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_posts enable row level security;
alter table public.portfolio_messages enable row level security;

create policy "Allow public read/write projects" on public.portfolio_projects for all using (true) with check (true);
create policy "Allow public read/write posts" on public.portfolio_posts for all using (true) with check (true);
create policy "Allow public read/write messages" on public.portfolio_messages for all using (true) with check (true);`;

