-- Adiciona descrição nas conversas
-- Data: 2026-03-15

alter table public.ai_conversations
add column if not exists descricao text default '';

comment on column public.ai_conversations.descricao is 'Descrição opcional da conversa';
