-- Lote 2 de endurecimento das funções SQL/PLpgSQL.
-- Objetivo: remover warnings `function_search_path_mutable` sem alterar a lógica
-- das funções existentes, apenas fixando um search_path explícito.

alter function public.contratos_set_updated_at()
  set search_path = public, extensions;

alter function public.crm_set_updated_at()
  set search_path = public, extensions;

alter function public.crm_sync_ultima_interacao()
  set search_path = public, extensions;

alter function public.equipe_sync_responsavel_referencias()
  set search_path = public, extensions;

alter function public.executar_sql_ia(query text)
  set search_path = public, extensions;

alter function public.handle_ai_agents_updated_at()
  set search_path = public, extensions;

alter function public.handle_ai_conversations_updated_at()
  set search_path = public, extensions;

alter function public.match_projeto_conhecimento(query_embedding vector, p_projeto_id bigint, match_threshold double precision, match_count integer)
  set search_path = public, extensions;

alter function public.projetos_admin_set_updated_at()
  set search_path = public, extensions;

alter function public.projetos_docs_set_updated_at()
  set search_path = public, extensions;

alter function public.projetos_lancamentos_horas_apply_delta()
  set search_path = public, extensions;

alter function public.projetos_releases_set_updated_at()
  set search_path = public, extensions;

alter function public.projetos_requisitos_set_updated_at()
  set search_path = public, extensions;

alter function public.projetos_sync_horas_from_lancamento_delta(p_tarefa_id bigint, p_projeto_id bigint, p_delta_horas numeric)
  set search_path = public, extensions;

alter function public.projetos_tarefas_set_updated_at()
  set search_path = public, extensions;

alter function public.projetos_tarefas_sync_responsavel_texto()
  set search_path = public, extensions;

alter function public.set_updated_at_timestamp()
  set search_path = public, extensions;

alter function public.update_email_blocks_updated_at()
  set search_path = public, extensions;

alter function public.update_email_templates_updated_at()
  set search_path = public, extensions;