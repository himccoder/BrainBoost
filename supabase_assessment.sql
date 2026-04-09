-- Run this in Supabase → SQL Editor → New query → Run
-- Adds assessment tracking tables

create table if not exists assessments (
  id            bigint generated always as identity primary key,
  user_id       uuid references profiles(id) on delete cascade not null,
  type          text not null check (type in ('onboarding', 'biweekly')),
  status        text not null default 'completed' check (status in ('completed', 'partial')),
  -- Per-domain scores (0-100)
  score_memory        int,
  score_attention     int,
  score_working_mem   int,
  score_reasoning     int,
  score_processing    int,
  overall_score       int,
  -- Raw task data for report generation
  task_results  jsonb,
  started_at    timestamptz default now(),
  completed_at  timestamptz default now()
);

alter table assessments enable row level security;
create policy "Own assessments" on assessments
  for all using (auth.uid() = user_id);

-- Index for efficient per-user queries
create index if not exists assessments_user_id_idx on assessments(user_id, completed_at desc);
