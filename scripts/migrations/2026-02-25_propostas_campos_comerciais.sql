-- Campos comerciais para propostas
-- Compatível com propostas legadas

ALTER TABLE IF EXISTS public.proposta
  ADD COLUMN IF NOT EXISTS validade_orcamento_dias integer,
  ADD COLUMN IF NOT EXISTS suporte_dias integer,
  ADD COLUMN IF NOT EXISTS forma_pagamento jsonb,
  ADD COLUMN IF NOT EXISTS condicoes jsonb,
  ADD COLUMN IF NOT EXISTS garantias jsonb;

ALTER TABLE IF EXISTS public.proposta
  DROP CONSTRAINT IF EXISTS proposta_validade_orcamento_dias_check;

ALTER TABLE IF EXISTS public.proposta
  ADD CONSTRAINT proposta_validade_orcamento_dias_check
  CHECK (validade_orcamento_dias IS NULL OR validade_orcamento_dias >= 0);

ALTER TABLE IF EXISTS public.proposta
  DROP CONSTRAINT IF EXISTS proposta_suporte_dias_check;

ALTER TABLE IF EXISTS public.proposta
  ADD CONSTRAINT proposta_suporte_dias_check
  CHECK (suporte_dias IS NULL OR suporte_dias >= 0);

COMMENT ON COLUMN public.proposta.validade_orcamento_dias IS 'Validade comercial da proposta em dias';
COMMENT ON COLUMN public.proposta.suporte_dias IS 'Janela de suporte pós-entrega em dias';
COMMENT ON COLUMN public.proposta.forma_pagamento IS 'Parcelas comerciais com percentual, valor e marco de horas';
COMMENT ON COLUMN public.proposta.condicoes IS 'Lista de condições comerciais';
COMMENT ON COLUMN public.proposta.garantias IS 'Lista de garantias e observações pós-entrega';
