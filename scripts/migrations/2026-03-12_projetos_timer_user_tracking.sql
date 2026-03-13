begin;

alter table public.projetos_lancamentos_horas
  add column if not exists equipe_id bigint,
  add column if not exists autor_uid uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projetos_lancamentos_horas_equipe_id_fkey'
  ) then
    alter table public.projetos_lancamentos_horas
      add constraint projetos_lancamentos_horas_equipe_id_fkey
      foreign key (equipe_id) references public.equipe(id) on delete set null;
  end if;
end $$;

create index if not exists idx_projetos_lancamentos_horas_equipe_id
  on public.projetos_lancamentos_horas (equipe_id, created_at desc);

create index if not exists idx_projetos_lancamentos_horas_autor_uid
  on public.projetos_lancamentos_horas (autor_uid, created_at desc);

commit;