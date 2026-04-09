-- Run this in Supabase → SQL Editor → New query → Run
-- Adds date_of_birth and gender to the profiles table

alter table profiles
  add column if not exists date_of_birth date,
  add column if not exists gender        text check (gender in ('male', 'female', 'prefer_not_to_say'));
