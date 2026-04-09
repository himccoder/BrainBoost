-- Run this in Supabase → SQL Editor → New query → Run
-- Adds an AI-generated recommendation column to assessments

alter table assessments
  add column if not exists ai_recommendation text;
