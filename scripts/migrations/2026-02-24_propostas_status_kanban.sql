-- Status Kanban de propostas
-- Data: 2026-02-24

begin;

alter table if exists public.proposta
  add column if not exists status_proposta text;

update public.proposta
set status_proposta = 'nova'
where status_proposta is null;

alter table if exists public.proposta
  alter column status_proposta set default 'nova';

alter table if exists public.proposta
  drop constraint if exists proposta_status_proposta_check;

alter table if exists public.proposta
  add constraint proposta_status_proposta_check
  check (status_proposta in ('nova', 'em_analise', 'aprovada', 'em_execucao', 'entregue', 'cancelada'));

create index if not exists proposta_status_proposta_idx
  on public.proposta(status_proposta);

comment on column public.proposta.status_proposta is 'Status da proposta no Kanban comercial';

commit;
