-- Corrige tabelas expostas no schema public sem RLS.
-- Estratégia:
-- 1. Backoffice autenticado continua com acesso amplo em tabelas operacionais.
-- 2. Tabelas internas/legadas ficam protegidas por RLS sem exposição direta ao cliente.

alter table if exists public.clientes enable row level security;
alter table if exists public.notas_geradas enable row level security;
alter table if exists public.projetos_conhecimento_chunks enable row level security;
alter table if exists public.proposta enable row level security;
alter table if exists public.proposta_itens_hora enable row level security;

drop policy if exists "clientes_authenticated_all" on public.clientes;
create policy "clientes_authenticated_all"
  on public.clientes
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "notas_geradas_authenticated_all" on public.notas_geradas;
create policy "notas_geradas_authenticated_all"
  on public.notas_geradas
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "proposta_authenticated_all" on public.proposta;
create policy "proposta_authenticated_all"
  on public.proposta
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "proposta_itens_hora_authenticated_all" on public.proposta_itens_hora;
create policy "proposta_itens_hora_authenticated_all"
  on public.proposta_itens_hora
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "projetos_conhecimento_chunks_no_direct_access" on public.projetos_conhecimento_chunks;
create policy "projetos_conhecimento_chunks_no_direct_access"
  on public.projetos_conhecimento_chunks
  for all
  to anon, authenticated
  using (false)
  with check (false);