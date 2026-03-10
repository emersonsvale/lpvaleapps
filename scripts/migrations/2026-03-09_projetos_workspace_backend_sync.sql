begin;

create table if not exists public.projetos_admin (
    id bigserial primary key,
    nome text not null,
    slug text not null unique,
    status text not null default 'iniciando' check (status in ('iniciando', 'em_andamento', 'pausado', 'concluido', 'cancelado')),
    cliente_nome text,
    fase text,
    progresso_percentual integer not null default 0 check (progresso_percentual >= 0 and progresso_percentual <= 100),
    data_inicio date,
    data_fim_prevista date,
    data_fim_real date,
    horas_previstas numeric not null default 0,
    horas_executadas numeric not null default 0,
    orcamento_total numeric not null default 0,
    orcamento_consumido numeric not null default 0,
    prioridade text not null default 'media' check (prioridade in ('baixa', 'media', 'alta', 'urgente')),
    responsavel_texto text,
    cliente_id bigint,
    contrato_id bigint,
    proposta_id bigint,
    descricao_comercial text,
    tech_stack text[] not null default '{}'::text[],
    status_visualizacao text not null default 'interno' check (status_visualizacao in ('interno', 'cliente', 'portfolio')),
    tags jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.projetos_admin add column if not exists cliente_id bigint;
alter table public.projetos_admin add column if not exists contrato_id bigint;
alter table public.projetos_admin add column if not exists proposta_id bigint;
alter table public.projetos_admin add column if not exists descricao_comercial text;
alter table public.projetos_admin add column if not exists tech_stack text[] not null default '{}'::text[];
alter table public.projetos_admin add column if not exists status_visualizacao text not null default 'interno';
alter table public.projetos_admin add column if not exists tags jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'projetos_admin_status_visualizacao_check'
  ) then
    alter table public.projetos_admin
      add constraint projetos_admin_status_visualizacao_check
      check (status_visualizacao in ('interno', 'cliente', 'portfolio'));
  end if;
end $$;

create or replace function public.projetos_admin_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projetos_admin_updated_at on public.projetos_admin;
create trigger trg_projetos_admin_updated_at before update on public.projetos_admin
  for each row execute function public.projetos_admin_set_updated_at();

create table if not exists public.projetos_tarefas (
    id bigserial primary key,
    projeto_id bigint not null references public.projetos_admin(id) on delete cascade,
    codigo text,
    titulo text not null,
    descricao text,
    tags text[] not null default '{}'::text[],
    status text not null default 'fazer' check (status in ('refinar', 'fazer', 'em_progresso', 'sob_revisao', 'concluido')),
    tipo text not null default 'funcionalidade' check (tipo in ('funcionalidade', 'bug', 'melhoria', 'documentacao', 'design')),
    prioridade text not null default 'media' check (prioridade in ('baixa', 'media', 'alta', 'urgente')),
    prazo_inicio date,
    prazo_fim date,
    horas_estimadas numeric not null default 0,
    horas_executadas numeric not null default 0,
    progresso integer not null default 0 check (progresso >= 0 and progresso <= 100),
    sprint text,
    release text,
    arvore text,
    pacote text,
    responsavel_texto text,
    ordem_coluna numeric not null default 0,
    ordem_global numeric not null default 0,
    concluida_em timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.projetos_tarefas_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projetos_tarefas_updated_at on public.projetos_tarefas;
create trigger trg_projetos_tarefas_updated_at before update on public.projetos_tarefas
  for each row execute function public.projetos_tarefas_set_updated_at();

create index if not exists idx_projetos_tarefas_projeto_id on public.projetos_tarefas(projeto_id);
create index if not exists idx_projetos_tarefas_tags_gin on public.projetos_tarefas using gin(tags);

create table if not exists public.projetos_requisitos (
    id bigserial primary key,
    projeto_id bigint not null references public.projetos_admin(id) on delete cascade,
    tarefa_id bigint references public.projetos_tarefas(id) on delete set null,
    codigo text,
    titulo text not null,
    descricao text,
    status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluido', 'rejeitado')),
    prioridade text not null default 'media' check (prioridade in ('baixa', 'media', 'alta')),
    origem text,
    criterios_aceite text,
    ordem integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.projetos_requisitos_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projetos_requisitos_updated_at on public.projetos_requisitos;
create trigger trg_projetos_requisitos_updated_at before update on public.projetos_requisitos
  for each row execute function public.projetos_requisitos_set_updated_at();

create table if not exists public.projetos_docs (
    id bigserial primary key,
    projeto_id bigint not null references public.projetos_admin(id) on delete cascade,
    parent_id bigint references public.projetos_docs(id) on delete cascade,
    titulo text not null,
    slug text,
    conteudo_json jsonb,
    conteudo_markdown text,
    ordem integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.projetos_docs alter column ordem set default 0;

create or replace function public.projetos_docs_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projetos_docs_updated_at on public.projetos_docs;
create trigger trg_projetos_docs_updated_at before update on public.projetos_docs
  for each row execute function public.projetos_docs_set_updated_at();

create index if not exists idx_projetos_docs_projeto_parent_ordem on public.projetos_docs(projeto_id, parent_id, ordem);
create index if not exists idx_projetos_docs_parent_id on public.projetos_docs(parent_id);

create table if not exists public.projetos_lancamentos_horas (
    id bigserial primary key,
    projeto_id bigint not null references public.projetos_admin(id) on delete cascade,
    tarefa_id bigint references public.projetos_tarefas(id) on delete set null,
    data date not null default current_date,
    descricao text,
    horas numeric not null default 0,
    tipo text not null default 'execucao' check (tipo in ('execucao', 'ajuste')),
    autor_texto text,
    created_at timestamptz not null default now()
);

create index if not exists idx_projetos_lancamentos_horas_projeto_id on public.projetos_lancamentos_horas(projeto_id, data desc);

create table if not exists public.projetos_releases (
    id bigserial primary key,
    projeto_id bigint not null references public.projetos_admin(id) on delete cascade,
    nome text not null,
    versao text,
    status text not null default 'planejada' check (status in ('planejada', 'em_andamento', 'publicada', 'cancelada')),
    data_prevista date,
    data_publicacao date,
    notas text,
    ordem integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.projetos_releases_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projetos_releases_updated_at on public.projetos_releases;
create trigger trg_projetos_releases_updated_at before update on public.projetos_releases
  for each row execute function public.projetos_releases_set_updated_at();

do $$
begin
  if to_regclass('public.crm_clientes') is not null and not exists (
    select 1 from pg_constraint where conname = 'projetos_admin_cliente_id_fkey'
  ) then
    alter table public.projetos_admin
      add constraint projetos_admin_cliente_id_fkey
      foreign key (cliente_id) references public.crm_clientes(id) on delete set null;
  end if;

  if to_regclass('public.contratos') is not null and not exists (
    select 1 from pg_constraint where conname = 'projetos_admin_contrato_id_fkey'
  ) then
    alter table public.projetos_admin
      add constraint projetos_admin_contrato_id_fkey
      foreign key (contrato_id) references public.contratos(id) on delete set null;
  end if;

  if to_regclass('public.proposta') is not null and not exists (
    select 1 from pg_constraint where conname = 'projetos_admin_proposta_id_fkey'
  ) then
    alter table public.projetos_admin
      add constraint projetos_admin_proposta_id_fkey
      foreign key (proposta_id) references public.proposta(id) on delete set null;
  end if;
end $$;

create index if not exists idx_projetos_admin_slug on public.projetos_admin(slug);
create index if not exists idx_projetos_admin_cliente_id on public.projetos_admin(cliente_id);
create index if not exists idx_projetos_admin_contrato_id on public.projetos_admin(contrato_id);
create index if not exists idx_projetos_admin_proposta_id on public.projetos_admin(proposta_id);

alter table public.projetos_admin enable row level security;
drop policy if exists "projetos_admin_auth_all" on public.projetos_admin;
create policy "projetos_admin_auth_all" on public.projetos_admin
  for all to authenticated using (true) with check (true);

alter table public.projetos_tarefas enable row level security;
drop policy if exists "projetos_tarefas_auth_all" on public.projetos_tarefas;
create policy "projetos_tarefas_auth_all" on public.projetos_tarefas
  for all to authenticated using (true) with check (true);

alter table public.projetos_requisitos enable row level security;
drop policy if exists "projetos_requisitos_auth_all" on public.projetos_requisitos;
create policy "projetos_requisitos_auth_all" on public.projetos_requisitos
  for all to authenticated using (true) with check (true);

alter table public.projetos_docs enable row level security;
drop policy if exists "projetos_docs_auth_all" on public.projetos_docs;
create policy "projetos_docs_auth_all" on public.projetos_docs
  for all to authenticated using (true) with check (true);

alter table public.projetos_lancamentos_horas enable row level security;
drop policy if exists "projetos_lancamentos_horas_auth_all" on public.projetos_lancamentos_horas;
create policy "projetos_lancamentos_horas_auth_all" on public.projetos_lancamentos_horas
  for all to authenticated using (true) with check (true);

alter table public.projetos_releases enable row level security;
drop policy if exists "projetos_releases_auth_all" on public.projetos_releases;
create policy "projetos_releases_auth_all" on public.projetos_releases
  for all to authenticated using (true) with check (true);

commit;