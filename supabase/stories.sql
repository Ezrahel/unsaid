create table if not exists public.stories (
  id bigint generated always as identity primary key,
  content text not null,
  emotion text not null default 'unspecified',
  created_at timestamptz not null default now(),
  is_public boolean not null default true,
  author_id text,
  reactions_like integer not null default 0,
  reactions_support integer not null default 0,
  reactions_sad integer not null default 0
);

alter table public.stories enable row level security;

create or replace function public.increment_story_reaction(
  story_id_input bigint,
  reaction_type_input text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if reaction_type_input not in ('like', 'support', 'sad') then
    raise exception 'invalid reaction type';
  end if;

  update public.stories
  set
    reactions_like = reactions_like + case when reaction_type_input = 'like' then 1 else 0 end,
    reactions_support = reactions_support + case when reaction_type_input = 'support' then 1 else 0 end,
    reactions_sad = reactions_sad + case when reaction_type_input = 'sad' then 1 else 0 end
  where id = story_id_input;

  if not found then
    raise exception 'story not found';
  end if;
end;
$$;

revoke all on function public.increment_story_reaction(bigint, text) from public;
grant execute on function public.increment_story_reaction(bigint, text) to anon, authenticated;

drop policy if exists "public can read public stories" on public.stories;
create policy "public can read public stories"
on public.stories
for select
using (is_public = true);

drop policy if exists "anyone can insert stories" on public.stories;
create policy "anyone can insert stories"
on public.stories
for insert
with check (true);

drop policy if exists "service role can update stories directly" on public.stories;
create policy "service role can update stories directly"
on public.stories
for update
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
