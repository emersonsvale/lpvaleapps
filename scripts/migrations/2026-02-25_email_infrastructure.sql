-- ============================================================================
-- Email Infrastructure Migration
-- ============================================================================
-- Create tables for email templates, blocks, and logs
-- Supabase project: vale-apps
-- Created: 2026-02-25

-- ============================================================================
-- Table: email_templates
-- Description: Armazena templates de email com suporte a variaveis
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id BIGSERIAL PRIMARY KEY,
  
  -- Identificacao
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('boas_vindas', 'proposta', 'leads', 'newsletter', 'admin', 'relatorio')),
  descricao TEXT,
  
  -- Conteudo
  assunto TEXT NOT NULL,
  conteudo_html TEXT NOT NULL,
  conteudo_texto TEXT,
  
  -- Variaveis suportadas: JSON array como ["{{ nome }}", "{{ email }}", ...]
  variaveis_suportadas JSONB DEFAULT '[]'::jsonb,
  
  -- Blocos (armazenados como JSON para reconstrucao)
  blocos JSONB DEFAULT '[]'::jsonb,
  
  -- Metadados
  versao INTEGER DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now(),
  
  -- Auditoria
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  atualizado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indices
CREATE INDEX idx_email_templates_slug ON email_templates(slug);
CREATE INDEX idx_email_templates_tipo ON email_templates(tipo);
CREATE INDEX idx_email_templates_ativo ON email_templates(ativo);

-- Comments
COMMENT ON TABLE email_templates IS 'Templates de email com suporte a variaveis dinamicamente interpoladas';
COMMENT ON COLUMN email_templates.variaveis_suportadas IS 'Array JSON com nomes de variaveis ex: ["{{ nome }}", "{{ email }}"]';
COMMENT ON COLUMN email_templates.blocos IS 'Estrutura de blocos do construtor visual para reconstrucao';

-- ============================================================================
-- Table: email_blocks
-- Description: Blocos individuais de email (para construtor visual)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_blocks (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
  
  -- Tipo do bloco
  tipo TEXT NOT NULL CHECK (tipo IN ('header', 'titulo', 'paragrafo', 'imagem', 'botao', 'divisor', 'social', 'footer')),
  
  -- Posicao e ordem
  posicao INTEGER NOT NULL,
  
  -- Dados do bloco (estrutura especifica por tipo)
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Estilos CSS como JSON
  estilos JSONB DEFAULT '{}'::jsonb,
  
  -- Metadados
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE INDEX idx_email_blocks_template_id ON email_blocks(template_id);
CREATE INDEX idx_email_blocks_posicao ON email_blocks(template_id, posicao);

-- Comments
COMMENT ON TABLE email_blocks IS 'Blocos individuais que compoem templates de email construidos visualmente';
COMMENT ON COLUMN email_blocks.dados IS 'JSON flexivel com conteudo especifico do bloco (ex: {"texto": "...", "link": "..."}';
COMMENT ON COLUMN email_blocks.estilos IS 'CSS como JSON (ex: {"backgroundColor": "#fff", "padding": "16px"})';

-- ============================================================================
-- Table: email_logs
-- Description: Registro de envios de email com status e auditoria
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- Referencia
  template_id BIGINT REFERENCES email_templates(id) ON DELETE SET NULL,
  
  -- Destinatario e assunto
  para_email TEXT NOT NULL,
  para_nome TEXT,
  assunto TEXT NOT NULL,
  
  -- Conteudo (armazenar por auditoria)
  conteudo_html TEXT,
  conteudo_texto TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'bounced')),
  
  -- Resend tracking
  resend_message_id TEXT,
  resend_response JSONB,
  
  -- Erro
  erro_mensagem TEXT,
  erro_detalhes JSONB,
  
  -- Tentativas
  tentativas INTEGER DEFAULT 0,
  proxima_tentativa_em TIMESTAMPTZ,
  
  -- Metadados
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT now(),
  enviado_em TIMESTAMPTZ,
  
  -- Variaveis interpoladas (para debug)
  variaveis JSONB DEFAULT '{}'::jsonb
);

-- Indices
CREATE INDEX idx_email_logs_template_id ON email_logs(template_id);
CREATE INDEX idx_email_logs_para_email ON email_logs(para_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_criado_em ON email_logs(criado_em DESC);
CREATE INDEX idx_email_logs_resend_message_id ON email_logs(resend_message_id);

-- Comments
COMMENT ON TABLE email_logs IS 'Auditoria e historico de todos os emails enviados';
COMMENT ON COLUMN email_logs.resend_message_id IS 'ID retornado pela API Resend para tracking';
COMMENT ON COLUMN email_logs.status IS 'Estado do email: pending (na fila), sending (em envio), sent (sucesso), failed (erro), bounced (rejeitado)';

-- ============================================================================
-- RLS (Row Level Security) Policies
-- ============================================================================
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- email_templates: Admin pode tudo, usuarios veem templates ativos
CREATE POLICY "admin_email_templates" ON email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "users_view_active_templates" ON email_templates
  FOR SELECT USING (ativo = true);

-- email_blocks: Apenas admin (cascata com templates)
CREATE POLICY "admin_email_blocks" ON email_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- email_logs: Admin ve tudo, usuarios veem seus proprios logs
CREATE POLICY "admin_email_logs" ON email_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "users_view_own_logs" ON email_logs
  FOR SELECT USING (usuario_id = auth.uid());

-- ============================================================================
-- Triggers para audit trail
-- ============================================================================
CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  NEW.atualizado_por = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_templates_updated_at
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION update_email_templates_updated_at();

CREATE OR REPLACE FUNCTION update_email_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_blocks_updated_at
BEFORE UPDATE ON email_blocks
FOR EACH ROW
EXECUTE FUNCTION update_email_blocks_updated_at();

-- ============================================================================
-- Integracao com CRM (adicionar coluna de tracking para interacoes)
-- ============================================================================
-- Esta coluna permite rastrear quando um email foi enviado como interacao CRM
ALTER TABLE crm_interacoes ADD COLUMN IF NOT EXISTS email_log_id BIGINT REFERENCES email_logs(id) ON DELETE SET NULL;

-- ============================================================================
-- Dados iniciais (templates padrao)
-- ============================================================================
INSERT INTO email_templates (nome, slug, tipo, descricao, assunto, conteudo_html, variaveis_suportadas, ativo)
VALUES (
  'Boas-vindas - Cliente',
  'boas-vindas-cliente',
  'boas_vindas',
  'Email de boas-vindas para novo cliente',
  'Bem-vindo a Vale Apps!',
  '<h1>Ola {{ nome }}!</h1><p>Obrigado por se cadastrar na Vale Apps.</p>',
  '["{{ nome }}", "{{ email }}", "{{ empresa }}"]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO email_templates (nome, slug, tipo, descricao, assunto, conteudo_html, variaveis_suportadas, ativo)
VALUES (
  'Confirmacao de Proposta',
  'confirmacao-proposta',
  'proposta',
  'Email de confirmacao quando proposta e criada',
  'Sua proposta foi enviada com sucesso',
  '<h1>Proposta Recebida</h1><p>Obrigado por sua proposta {{ numero_proposta }}.</p>',
  '["{{ nome }}", "{{ numero_proposta }}", "{{ valor }}", "{{ data_proposta }}"]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO email_templates (nome, slug, tipo, descricao, assunto, conteudo_html, variaveis_suportadas, ativo)
VALUES (
  'Follow-up Leads',
  'follow-up-leads',
  'leads',
  'Email de acompanhamento automatico para leads',
  'Continuamos aqui para ajudar!',
  '<h1>Ola {{ nome }}!</h1><p>Ficamos de olho no seu interesse em {{ servico }}.</p>',
  '["{{ nome }}", "{{ servico }}", "{{ dias_contato }}"]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO email_templates (nome, slug, tipo, descricao, assunto, conteudo_html, variaveis_suportadas, ativo)
VALUES (
  'Newsletter Padrao',
  'newsletter-padrao',
  'newsletter',
  'Template base para newsletters',
  'Noticias da Vale Apps - {{ mes }} de {{ ano }}',
  '<h1>Newsletter - {{ mes }}</h1><p>Confira as novidades...</p>',
  '["{{ mes }}", "{{ ano }}", "{{ conteudo_principal }}"]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO email_templates (nome, slug, tipo, descricao, assunto, conteudo_html, variaveis_suportadas, ativo)
VALUES (
  'Notificacao Admin - Nova Proposta',
  'notificacao-admin-proposta',
  'admin',
  'Email para admin quando proposta e criada',
  '[ADMIN] Nova proposta: {{ numero_proposta }}',
  '<h1>Nova Proposta</h1><p>Cliente: {{ nome_cliente }}<br/>Valor: {{ valor }}<br/>Status: {{ status }}</p>',
  '["{{ numero_proposta }}", "{{ nome_cliente }}", "{{ valor }}", "{{ status }}", "{{ email_cliente }}"]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO email_templates (nome, slug, tipo, descricao, assunto, conteudo_html, variaveis_suportadas, ativo)
VALUES (
  'Relatorio Mensal',
  'relatorio-mensal',
  'relatorio',
  'Relatorio mensal de atividades',
  'Seu Relatorio de {{ mes }} - Vale Apps',
  '<h1>Relatorio - {{ mes }} de {{ ano }}</h1><p>Propostas: {{ total_propostas }}<br/>Clientes: {{ total_clientes }}</p>',
  '["{{ mes }}", "{{ ano }}", "{{ total_propostas }}", "{{ total_clientes }}", "{{ total_revenue }}"]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;
