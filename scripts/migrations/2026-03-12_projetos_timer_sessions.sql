begin;

alter table public.projetos_lancamentos_horas
  add column if not exists iniciado_em timestamptz,
  add column if not exists finalizado_em timestamptz,
  add column if not exists duracao_segundos integer;

create index if not exists idx_projetos_lancamentos_horas_tarefa_created_at
  on public.projetos_lancamentos_horas (tarefa_id, created_at desc);

create or replace function public.projetos_sync_horas_from_lancamento_delta(
  p_tarefa_id bigint,
  p_projeto_id bigint,
  p_delta_horas numeric
)
returns void
language plpgsql
as $$
declare
  v_horas_executadas numeric;
  v_horas_estimadas numeric;
  v_progresso integer;
begin
  if p_tarefa_id is not null and p_delta_horas <> 0 then
    update public.projetos_tarefas
    set horas_executadas = round(coalesce(horas_executadas, 0) + p_delta_horas, 4)
    where id = p_tarefa_id;

    select coalesce(horas_executadas, 0), coalesce(horas_estimadas, 0)
      into v_horas_executadas, v_horas_estimadas
    from public.projetos_tarefas
    where id = p_tarefa_id;

    if found then
      v_progresso := case
        when v_horas_estimadas <= 0 and v_horas_executadas > 0 then 100
        when v_horas_estimadas <= 0 then 0
        else greatest(0, least(100, round((v_horas_executadas / nullif(v_horas_estimadas, 0)) * 100)))
      end;

      update public.projetos_tarefas
      set progresso = v_progresso
      where id = p_tarefa_id;
    end if;
  end if;

  if p_projeto_id is not null and p_delta_horas <> 0 then
    update public.projetos_admin
    set horas_executadas = round(coalesce(horas_executadas, 0) + p_delta_horas, 4)
    where id = p_projeto_id;
  end if;
end;
$$;

create or replace function public.projetos_lancamentos_horas_apply_delta()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    perform public.projetos_sync_horas_from_lancamento_delta(new.tarefa_id, new.projeto_id, coalesce(new.horas, 0));
    return new;
  end if;

  if tg_op = 'DELETE' then
    perform public.projetos_sync_horas_from_lancamento_delta(old.tarefa_id, old.projeto_id, -coalesce(old.horas, 0));
    return old;
  end if;

  if old.tarefa_id is distinct from new.tarefa_id or old.projeto_id is distinct from new.projeto_id then
    perform public.projetos_sync_horas_from_lancamento_delta(old.tarefa_id, old.projeto_id, -coalesce(old.horas, 0));
    perform public.projetos_sync_horas_from_lancamento_delta(new.tarefa_id, new.projeto_id, coalesce(new.horas, 0));
    return new;
  end if;

  perform public.projetos_sync_horas_from_lancamento_delta(new.tarefa_id, new.projeto_id, coalesce(new.horas, 0) - coalesce(old.horas, 0));
  return new;
end;
$$;

drop trigger if exists trg_projetos_lancamentos_horas_apply_delta on public.projetos_lancamentos_horas;
create trigger trg_projetos_lancamentos_horas_apply_delta
after insert or update or delete on public.projetos_lancamentos_horas
for each row execute function public.projetos_lancamentos_horas_apply_delta();

commit;