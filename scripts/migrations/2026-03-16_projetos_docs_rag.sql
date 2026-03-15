-- Função RAG sobre a tabela existente projetos_conhecimento_chunks.
-- Uso: o agente do projeto chama match_projeto_conhecimento() com o embedding da
-- mensagem do usuário e recebe apenas os trechos mais relevantes para o contexto.
-- Índice existente: hnsw (embedding vector_ip_ops) → operador <#> (negative inner product).

begin;

-- Busca por similaridade (inner product: vetores normalizados = cosine similarity).
-- query_embedding: vetor da mensagem (ex.: OpenAI text-embedding-3-small, 1536 dims).
create or replace function public.match_projeto_conhecimento(
  query_embedding extensions.vector(1536),
  p_projeto_id bigint,
  match_threshold float default 0.5,
  match_count int default 10
)
returns table (
  id bigint,
  origem_tipo text,
  origem_id bigint,
  conteudo_texto text,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.origem_tipo,
    c.origem_id,
    c.conteudo_texto,
    - (c.embedding <#> query_embedding) as similarity
  from public.projetos_conhecimento_chunks c
  where c.projeto_id = p_projeto_id
    and c.embedding is not null
    and (c.embedding <#> query_embedding) < -match_threshold
  order by c.embedding <#> query_embedding asc
  limit least(match_count, 50);
$$;

comment on function public.match_projeto_conhecimento is 'RAG: retorna chunks de conhecimento do projeto mais similares à query (embedding da mensagem). Usa tabela projetos_conhecimento_chunks.';

commit;
