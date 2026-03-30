-- Lote 1 de endurecimento das policies RLS.
-- Objetivo: remover acesso anon/roleless indevido e substituir policies ALL com true
-- por predicates mínimos baseados em autenticação, preservando o comportamento atual.

-- ---------------------------------------------------------------------------
-- Tabelas internas/operacionais: acesso para usuários autenticados
-- ---------------------------------------------------------------------------

drop policy if exists "geral" on public.acess;
drop policy if exists "acess_authenticated_all" on public.acess;
create policy "acess_authenticated_all"
  on public.acess
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "clientes_authenticated_all" on public.clientes;
create policy "clientes_authenticated_all"
  on public.clientes
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "contratos_auth_all" on public.contratos;
create policy "contratos_auth_all"
  on public.contratos
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "crm_clientes_auth_all" on public.crm_clientes;
create policy "crm_clientes_auth_all"
  on public.crm_clientes
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "crm_interacoes_auth_all" on public.crm_interacoes;
create policy "crm_interacoes_auth_all"
  on public.crm_interacoes
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "notas_geradas_authenticated_all" on public.notas_geradas;
create policy "notas_geradas_authenticated_all"
  on public.notas_geradas
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "projetos_admin_auth_all" on public.projetos_admin;
create policy "projetos_admin_auth_all"
  on public.projetos_admin
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "projetos_docs_auth_all" on public.projetos_docs;
create policy "projetos_docs_auth_all"
  on public.projetos_docs
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "projetos_lan_horas_auth_all" on public.projetos_lancamentos_horas;
drop policy if exists "projetos_lancamentos_horas_auth_all" on public.projetos_lancamentos_horas;
create policy "projetos_lancamentos_horas_auth_all"
  on public.projetos_lancamentos_horas
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "projetos_releases_auth_all" on public.projetos_releases;
create policy "projetos_releases_auth_all"
  on public.projetos_releases
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "projetos_requisitos_auth_all" on public.projetos_requisitos;
create policy "projetos_requisitos_auth_all"
  on public.projetos_requisitos
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "projetos_tarefas_auth_all" on public.projetos_tarefas;
create policy "projetos_tarefas_auth_all"
  on public.projetos_tarefas
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "proposta_authenticated_all" on public.proposta;
create policy "proposta_authenticated_all"
  on public.proposta
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "proposta_itens_hora_authenticated_all" on public.proposta_itens_hora;
create policy "proposta_itens_hora_authenticated_all"
  on public.proposta_itens_hora
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ---------------------------------------------------------------------------
-- Conteúdo público: leitura pública explícita, escrita restrita a autenticados
-- ---------------------------------------------------------------------------

drop policy if exists "geral" on public.categorias_proejto;
drop policy if exists "categorias_proejto_public_read" on public.categorias_proejto;
drop policy if exists "categorias_proejto_authenticated_all" on public.categorias_proejto;
create policy "categorias_proejto_public_read"
  on public.categorias_proejto
  for select
  to anon, authenticated
  using (true);
create policy "categorias_proejto_authenticated_all"
  on public.categorias_proejto
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "geral" on public.clientes_parceiros;
drop policy if exists "clientes_parceiros_public_read" on public.clientes_parceiros;
drop policy if exists "clientes_parceiros_authenticated_all" on public.clientes_parceiros;
create policy "clientes_parceiros_public_read"
  on public.clientes_parceiros
  for select
  to anon, authenticated
  using (true);
create policy "clientes_parceiros_authenticated_all"
  on public.clientes_parceiros
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Geral" on public.depoimentos;
drop policy if exists "depoimentos_public_read" on public.depoimentos;
drop policy if exists "depoimentos_authenticated_all" on public.depoimentos;
create policy "depoimentos_public_read"
  on public.depoimentos
  for select
  to anon, authenticated
  using (true);
create policy "depoimentos_authenticated_all"
  on public.depoimentos
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "publico" on public.educacao;
drop policy if exists "educacao_public_read" on public.educacao;
drop policy if exists "educacao_authenticated_all" on public.educacao;
create policy "educacao_public_read"
  on public.educacao
  for select
  to anon, authenticated
  using (true);
create policy "educacao_authenticated_all"
  on public.educacao
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "publico" on public.experiencias;
drop policy if exists "experiencias_public_read" on public.experiencias;
drop policy if exists "experiencias_authenticated_all" on public.experiencias;
create policy "experiencias_public_read"
  on public.experiencias
  for select
  to anon, authenticated
  using (true);
create policy "experiencias_authenticated_all"
  on public.experiencias
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Geral" on public.ferramentas;
drop policy if exists "ferramentas_public_read" on public.ferramentas;
drop policy if exists "ferramentas_authenticated_all" on public.ferramentas;
create policy "ferramentas_public_read"
  on public.ferramentas
  for select
  to anon, authenticated
  using (true);
create policy "ferramentas_authenticated_all"
  on public.ferramentas
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Publico" on public.projetos;
drop policy if exists "projetos_public_read" on public.projetos;
drop policy if exists "projetos_authenticated_all" on public.projetos;
create policy "projetos_public_read"
  on public.projetos
  for select
  to anon, authenticated
  using (coalesce(valeapps, false) = true);
create policy "projetos_authenticated_all"
  on public.projetos
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ---------------------------------------------------------------------------
-- Blog: leitura pública já é específica; gestão continua para autenticados
-- ---------------------------------------------------------------------------

drop policy if exists "Authenticated can manage blog posts" on public.blog_posts;
create policy "Authenticated can manage blog posts"
  on public.blog_posts
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated can manage blog categories" on public.blog_categories;
create policy "Authenticated can manage blog categories"
  on public.blog_categories
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated can manage blog tags" on public.blog_tags;
create policy "Authenticated can manage blog tags"
  on public.blog_tags
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated can manage blog post categories" on public.blog_post_categories;
create policy "Authenticated can manage blog post categories"
  on public.blog_post_categories
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated can manage blog post tags" on public.blog_post_tags;
create policy "Authenticated can manage blog post tags"
  on public.blog_post_tags
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);