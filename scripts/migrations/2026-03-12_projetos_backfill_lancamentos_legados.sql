begin;

create temporary table tmp_projetos_horas_pendentes on commit drop as
select
  t.id as tarefa_id,
  t.projeto_id,
  greatest(coalesce(t.horas_executadas, 0) - coalesce(sum(l.horas), 0), 0) as horas_pendentes,
  coalesce(t.updated_at, t.created_at, now()) as referencia_at,
  t.titulo,
  t.responsavel_texto,
  t.responsavel_equipe_id
from public.projetos_tarefas t
left join public.projetos_lancamentos_horas l
  on l.tarefa_id = t.id
group by t.id;

insert into public.projetos_lancamentos_horas (
  projeto_id,
  tarefa_id,
  data,
  descricao,
  horas,
  tipo,
  autor_texto,
  created_at,
  iniciado_em,
  finalizado_em,
  duracao_segundos,
  equipe_id,
  autor_uid
)
select
  base.projeto_id,
  base.tarefa_id,
  base.referencia_at::date,
  'Backfill legado: horas migradas de projetos_tarefas para projetos_lancamentos_horas - ' || coalesce(base.titulo, 'Tarefa sem titulo'),
  round(base.horas_pendentes, 4),
  'ajuste',
  coalesce(base.responsavel_texto, 'Migracao automatica'),
  base.referencia_at,
  base.referencia_at - make_interval(secs => greatest(round(base.horas_pendentes * 3600)::integer, 1)),
  base.referencia_at,
  greatest(round(base.horas_pendentes * 3600)::integer, 1),
  base.responsavel_equipe_id,
  membro.uid
from tmp_projetos_horas_pendentes base
left join public.equipe membro
  on membro.id = base.responsavel_equipe_id
where base.horas_pendentes > 0;

create temporary table tmp_projetos_totais_tarefas on commit drop as
select
  tarefa_id,
  round(coalesce(sum(horas), 0), 4) as horas_executadas
from public.projetos_lancamentos_horas
where tarefa_id is not null
group by tarefa_id;

create temporary table tmp_projetos_totais_projetos on commit drop as
select
  projeto_id,
  round(coalesce(sum(horas), 0), 4) as horas_executadas
from public.projetos_lancamentos_horas
group by projeto_id;

update public.projetos_tarefas t
set
  horas_executadas = coalesce(tt.horas_executadas, 0),
  progresso = case
    when coalesce(t.horas_estimadas, 0) <= 0 and coalesce(tt.horas_executadas, 0) > 0 then 100
    when coalesce(t.horas_estimadas, 0) <= 0 then 0
    else greatest(0, least(100, round((coalesce(tt.horas_executadas, 0) / nullif(t.horas_estimadas, 0)) * 100)))
  end,
  updated_at = greatest(coalesce(t.updated_at, now()), now())
from tmp_projetos_totais_tarefas tt
where tt.tarefa_id = t.id;

update public.projetos_tarefas t
set
  horas_executadas = 0,
  progresso = case
    when coalesce(t.horas_estimadas, 0) <= 0 then 0
    else 0
  end,
  updated_at = greatest(coalesce(t.updated_at, now()), now())
where not exists (
  select 1
  from public.projetos_lancamentos_horas l
  where l.tarefa_id = t.id
);

update public.projetos_admin p
set horas_executadas = coalesce(tp.horas_executadas, 0)
from tmp_projetos_totais_projetos tp
where tp.projeto_id = p.id;

update public.projetos_admin p
set horas_executadas = 0
where not exists (
  select 1
  from public.projetos_lancamentos_horas l
  where l.projeto_id = p.id
);

commit;