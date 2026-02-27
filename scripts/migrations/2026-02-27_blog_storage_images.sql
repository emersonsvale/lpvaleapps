-- Bucket e políticas de upload para imagens do blog
-- Data: 2026-02-27

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read blog images" on storage.objects;
create policy "Public can read blog images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'blog-images');

drop policy if exists "Authenticated can upload blog images" on storage.objects;
create policy "Authenticated can upload blog images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated can update blog images" on storage.objects;
create policy "Authenticated can update blog images"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-images')
with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated can delete blog images" on storage.objects;
create policy "Authenticated can delete blog images"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-images');
