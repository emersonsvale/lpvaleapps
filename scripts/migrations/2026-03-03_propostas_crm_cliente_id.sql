-- Vincula proposta diretamente ao cliente do CRM
-- Data: 2026-03-03

begin;

alter table if exists public.proposta
  add column if not exists crm_cliente_id bigint;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'proposta_crm_cliente_id_fkey'
  ) then
    alter table public.proposta
      add constraint proposta_crm_cliente_id_fkey
      foreign key (crm_cliente_id)
      references public.crm_clientes(id)
      on delete set null;
  end if;
end $$;

create index if not exists proposta_crm_cliente_id_idx
  on public.proposta(crm_cliente_id);

comment on column public.proposta.crm_cliente_id is 'ID do cliente no CRM vinculado a esta proposta';

commit;
