begin;

alter table public.projetos_tarefas
  add column if not exists responsavel_equipe_id bigint;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'projetos_tarefas_responsavel_equipe_id_fkey'
  ) then
    alter table public.projetos_tarefas
      add constraint projetos_tarefas_responsavel_equipe_id_fkey
      foreign key (responsavel_equipe_id) references public.equipe(id) on delete set null;
  end if;
end $$;

update public.projetos_tarefas tarefa
set responsavel_equipe_id = equipe.id
from public.equipe equipe
where tarefa.responsavel_equipe_id is null
  and tarefa.responsavel_texto is not null
  and lower(trim(tarefa.responsavel_texto)) = lower(trim(equipe.nome));

create or replace function public.projetos_tarefas_sync_responsavel_texto()
returns trigger
language plpgsql
as $$
declare
  v_nome text;
  v_equipe_id bigint;
begin
  if new.responsavel_equipe_id is null and new.responsavel_texto is not null then
    select id, nome
      into v_equipe_id, v_nome
    from public.equipe
    where lower(trim(nome)) = lower(trim(new.responsavel_texto))
    order by id
    limit 1;

    if found then
      new.responsavel_equipe_id := v_equipe_id;
      new.responsavel_texto := v_nome;
      return new;
    end if;
  end if;

  if new.responsavel_equipe_id is null then
    new.responsavel_texto := null;
    return new;
  end if;

  select nome
    into v_nome
  from public.equipe
  where id = new.responsavel_equipe_id;

  new.responsavel_texto := v_nome;
  return new;
end;
$$;

drop trigger if exists trg_projetos_tarefas_sync_responsavel_texto on public.projetos_tarefas;
create trigger trg_projetos_tarefas_sync_responsavel_texto
before insert or update of responsavel_equipe_id, responsavel_texto on public.projetos_tarefas
for each row execute function public.projetos_tarefas_sync_responsavel_texto();

create or replace function public.equipe_sync_responsavel_referencias()
returns trigger
language plpgsql
as $$
begin
  update public.projetos_tarefas
  set responsavel_texto = new.nome
  where responsavel_equipe_id = new.id;

  update public.projetos_lancamentos_horas
  set autor_texto = new.nome
  where equipe_id = new.id;

  return new;
end;
$$;

drop trigger if exists trg_equipe_sync_responsavel_referencias on public.equipe;
create trigger trg_equipe_sync_responsavel_referencias
after update of nome on public.equipe
for each row execute function public.equipe_sync_responsavel_referencias();

create index if not exists idx_projetos_tarefas_responsavel_equipe_id
  on public.projetos_tarefas (responsavel_equipe_id);

commit;