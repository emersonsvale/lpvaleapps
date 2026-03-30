begin;

create table if not exists public.projetos_compras_horas (
    id bigserial primary key,
    projeto_id bigint not null references public.projetos_admin(id) on delete cascade,
    data_compra date not null default current_date,
    descricao text,
    horas numeric not null default 0 check (horas >= 0),
    valor_hora numeric not null default 0 check (valor_hora >= 0),
    valor_total numeric generated always as (round((horas * valor_hora)::numeric, 2)) stored,
    observacoes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.projetos_compras_horas_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projetos_compras_horas_updated_at on public.projetos_compras_horas;
create trigger trg_projetos_compras_horas_updated_at before update on public.projetos_compras_horas
  for each row execute function public.projetos_compras_horas_set_updated_at();

create index if not exists idx_projetos_compras_horas_projeto_id
  on public.projetos_compras_horas (projeto_id, data_compra desc, created_at desc);

insert into public.projetos_compras_horas (
  projeto_id,
  data_compra,
  descricao,
  horas,
  valor_hora,
  observacoes
)
select
  projeto.id,
  coalesce(projeto.data_inicio, projeto.created_at::date, current_date),
  'Compra inicial migrada',
  greatest(coalesce(projeto.horas_previstas, 0), 0),
  case
    when coalesce(projeto.valor_hora_vendida, 0) > 0 then coalesce(projeto.valor_hora_vendida, 0)
    when coalesce(projeto.horas_previstas, 0) > 0 and coalesce(projeto.orcamento_total, 0) > 0
      then round((coalesce(projeto.orcamento_total, 0) / nullif(projeto.horas_previstas, 0))::numeric, 2)
    else 0
  end,
  'Backfill do saldo inicial que antes ficava salvo diretamente em projetos_admin.'
from public.projetos_admin projeto
where not exists (
  select 1
  from public.projetos_compras_horas compra
  where compra.projeto_id = projeto.id
)
and (
  coalesce(projeto.horas_previstas, 0) > 0
  or coalesce(projeto.orcamento_total, 0) > 0
);

alter table public.projetos_compras_horas enable row level security;
drop policy if exists "projetos_compras_horas_auth_all" on public.projetos_compras_horas;
create policy "projetos_compras_horas_auth_all" on public.projetos_compras_horas
  for all to authenticated using (true) with check (true);

commit;