-- Tabela de perfis de usuário e bucket de avatares
-- Data: 2026-03-12

-- Tabela de perfis
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  cargo text not null default '',
  telefone text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger de updated_at
create or replace function public.handle_user_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_user_profiles_updated_at();

-- RLS
alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
on public.user_profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
on public.user_profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Bucket de avatares
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies de storage para avatares
drop policy if exists "Public can read avatars" on storage.objects;
create policy "Public can read avatars"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');

drop policy if exists "Authenticated can upload avatars" on storage.objects;
create policy "Authenticated can upload avatars"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars');

drop policy if exists "Authenticated can update avatars" on storage.objects;
create policy "Authenticated can update avatars"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars')
with check (bucket_id = 'avatars');

drop policy if exists "Authenticated can delete avatars" on storage.objects;
create policy "Authenticated can delete avatars"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars');