BEGIN;

-- Criar tabela base de Projetos do Workspace (separado do Portifólio público)
CREATE TABLE IF NOT EXISTS public.projetos_admin (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'iniciando' CHECK (status IN ('iniciando', 'em_andamento', 'pausado', 'concluido', 'cancelado')),
    cliente_nome TEXT,
    fase TEXT,
    progresso_percentual INTEGER DEFAULT 0 CHECK (progresso_percentual >= 0 AND progresso_percentual <= 100),
    data_inicio DATE,
    data_fim_prevista DATE,
    data_fim_real DATE,
    horas_previstas NUMERIC DEFAULT 0,
    horas_executadas NUMERIC DEFAULT 0,
    orcamento_total NUMERIC DEFAULT 0,
    orcamento_consumido NUMERIC DEFAULT 0,
    prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    responsavel_texto TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar trigger para auto-refresh do updated_at na projetos_admin
CREATE OR REPLACE FUNCTION public.projetos_admin_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_projetos_admin_updated_at ON public.projetos_admin;
CREATE TRIGGER trg_projetos_admin_updated_at BEFORE UPDATE ON public.projetos_admin
  FOR EACH ROW EXECUTE FUNCTION public.projetos_admin_set_updated_at();


-- Criar tabela de Tarefas (Kanban e Detalhamento)
CREATE TABLE IF NOT EXISTS public.projetos_tarefas (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES public.projetos_admin(id) ON DELETE CASCADE,
    codigo TEXT, -- ex: R-001
    titulo TEXT NOT NULL,
    descricao TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
    status TEXT NOT NULL DEFAULT 'fazer' CHECK (status IN ('refinar', 'fazer', 'em_progresso', 'sob_revisao', 'concluido')),
    tipo TEXT DEFAULT 'funcionalidade' CHECK (tipo IN ('funcionalidade', 'bug', 'melhoria', 'documentacao', 'design')),
    prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    prazo_inicio DATE,
    prazo_fim DATE,
    horas_estimadas NUMERIC DEFAULT 0,
    horas_executadas NUMERIC DEFAULT 0,
    progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    sprint TEXT,
    release TEXT,
    arvore TEXT,
    pacote TEXT,
    responsavel_texto TEXT,
    ordem_coluna NUMERIC DEFAULT 0,
    ordem_global NUMERIC DEFAULT 0,
    concluida_em TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger de updated_at para projetos_tarefas
CREATE OR REPLACE FUNCTION public.projetos_tarefas_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_projetos_tarefas_updated_at ON public.projetos_tarefas;
CREATE TRIGGER trg_projetos_tarefas_updated_at BEFORE UPDATE ON public.projetos_tarefas
  FOR EACH ROW EXECUTE FUNCTION public.projetos_tarefas_set_updated_at();

-- Cria index para buscar tarefas por projeto de forma rápida
CREATE INDEX IF NOT EXISTS idx_projetos_tarefas_projeto_id ON public.projetos_tarefas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_projetos_tarefas_tags_gin ON public.projetos_tarefas USING gin(tags);


-- Criar tabela de Requisitos
CREATE TABLE IF NOT EXISTS public.projetos_requisitos (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES public.projetos_admin(id) ON DELETE CASCADE,
    tarefa_id BIGINT REFERENCES public.projetos_tarefas(id) ON DELETE SET NULL,
    codigo TEXT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'rejeitado')),
    prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    origem TEXT,
    criterios_aceite TEXT,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger de updated_at para requisitos
CREATE OR REPLACE FUNCTION public.projetos_requisitos_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_projetos_requisitos_updated_at ON public.projetos_requisitos;
CREATE TRIGGER trg_projetos_requisitos_updated_at BEFORE UPDATE ON public.projetos_requisitos
  FOR EACH ROW EXECUTE FUNCTION public.projetos_requisitos_set_updated_at();


-- Criar tabela de Documentação (Árvore hierárquica)
CREATE TABLE IF NOT EXISTS public.projetos_docs (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES public.projetos_admin(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES public.projetos_docs(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    slug TEXT,
    conteudo_json JSONB,
    conteudo_markdown TEXT,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger de updated_at para docs
CREATE OR REPLACE FUNCTION public.projetos_docs_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_projetos_docs_updated_at ON public.projetos_docs;
CREATE TRIGGER trg_projetos_docs_updated_at BEFORE UPDATE ON public.projetos_docs
  FOR EACH ROW EXECUTE FUNCTION public.projetos_docs_set_updated_at();


-- Criar tabela de Lançamentos de Horas / Extrato
CREATE TABLE IF NOT EXISTS public.projetos_Lancamentos_horas (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES public.projetos_admin(id) ON DELETE CASCADE,
    tarefa_id BIGINT REFERENCES public.projetos_tarefas(id) ON DELETE SET NULL,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    descricao TEXT,
    horas NUMERIC NOT NULL DEFAULT 0,
    tipo TEXT DEFAULT 'execucao' CHECK (tipo IN ('execucao', 'ajuste')),
    autor_texto TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela de Releases
CREATE TABLE IF NOT EXISTS public.projetos_releases (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES public.projetos_admin(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    versao TEXT,
    status TEXT DEFAULT 'planejada' CHECK (status IN ('planejada', 'em_andamento', 'publicada', 'cancelada')),
    data_prevista DATE,
    data_publicacao DATE,
    notas TEXT,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger de updated_at para releases
CREATE OR REPLACE FUNCTION public.projetos_releases_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_projetos_releases_updated_at ON public.projetos_releases;
CREATE TRIGGER trg_projetos_releases_updated_at BEFORE UPDATE ON public.projetos_releases
  FOR EACH ROW EXECUTE FUNCTION public.projetos_releases_set_updated_at();


-- RLS Policies (Permissive - All Authenticated)
ALTER TABLE public.projetos_admin ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_admin_auth_all" ON public.projetos_admin;
CREATE POLICY "projetos_admin_auth_all" ON public.projetos_admin 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.projetos_tarefas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_tarefas_auth_all" ON public.projetos_tarefas;
CREATE POLICY "projetos_tarefas_auth_all" ON public.projetos_tarefas 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.projetos_requisitos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_requisitos_auth_all" ON public.projetos_requisitos;
CREATE POLICY "projetos_requisitos_auth_all" ON public.projetos_requisitos 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.projetos_docs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_docs_auth_all" ON public.projetos_docs;
CREATE POLICY "projetos_docs_auth_all" ON public.projetos_docs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.projetos_lancamentos_horas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_lancamentos_horas_auth_all" ON public.projetos_lancamentos_horas;
CREATE POLICY "projetos_lancamentos_horas_auth_all" ON public.projetos_lancamentos_horas 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.projetos_releases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_releases_auth_all" ON public.projetos_releases;
CREATE POLICY "projetos_releases_auth_all" ON public.projetos_releases 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

COMMIT;
