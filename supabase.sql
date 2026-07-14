create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ticker text not null,
  created_at timestamptz default now(),
  unique(user_id, ticker)
);
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ticker text not null, direction text, entry numeric, stop numeric, result text, lesson text,
  created_at timestamptz default now()
);
alter table public.watchlist enable row level security;
alter table public.journal_entries enable row level security;
create policy "own watchlist" on public.watchlist for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own journal" on public.journal_entries for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
