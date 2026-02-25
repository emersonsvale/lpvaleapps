-- Migração: suportar propostas por tipo (empreitada x hora)
-- Data: 2026-02-24

begin;

alter table public.proposta
  add column if not exists tipo_proposta text,
  add column if not exists valor_hora numeric(12,2),
  add column if not exists total_horas numeric(12,2);

update public.proposta
set tipo_proposta = 'empreitada'
where tipo_proposta is null;

alter table public.proposta
  alter column tipo_proposta set default 'empreitada';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'proposta_tipo_proposta_check'
  ) then
    alter table public.proposta
      add constraint proposta_tipo_proposta_check
      check (tipo_proposta in ('empreitada', 'hora'));
  end if;
end $$;

create table if not exists public.proposta_itens_hora (
  id bigserial primary key,
  proposta_id bigint not null references public.proposta(id) on delete cascade,
  etapa text not null,
  descricao text,
  horas numeric(10,2) not null default 0,
  valor_hora numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  constraint proposta_itens_hora_horas_check check (horas >= 0),
  constraint proposta_itens_hora_valor_hora_check check (valor_hora >= 0),
  constraint proposta_itens_hora_subtotal_check check (subtotal >= 0)
);

create index if not exists proposta_itens_hora_proposta_id_idx
  on public.proposta_itens_hora(proposta_id, ordem);

commit;
