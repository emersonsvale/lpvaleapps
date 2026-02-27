-- Policies para upload de imagens do blog no bucket existente "images"
-- Caminho permitido: blog/**
-- Data: 2026-02-27

drop policy if exists "Public can read images/blog" on storage.objects;
create policy "Public can read images/blog"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = 'blog'
);

drop policy if exists "Authenticated can upload images/blog" on storage.objects;
create policy "Authenticated can upload images/blog"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = 'blog'
);

drop policy if exists "Authenticated can update images/blog" on storage.objects;
create policy "Authenticated can update images/blog"
on storage.objects for update
to authenticated
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = 'blog'
)
with check (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = 'blog'
);

drop policy if exists "Authenticated can delete images/blog" on storage.objects;
create policy "Authenticated can delete images/blog"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = 'blog'
);
