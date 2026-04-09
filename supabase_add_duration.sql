-- Run this in Supabase → SQL Editor → New query → Run
-- Adds optional duration tracking to game sessions

alter table game_sessions
  add column if not exists duration_seconds int;
