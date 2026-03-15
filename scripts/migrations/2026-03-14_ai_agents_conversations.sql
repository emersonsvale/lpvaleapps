-- Agentes especialistas (tipo Gems/ChatGPT projects), conversas e mensagens
-- Data: 2026-03-14

-- Agentes: vendas, eng. software, etc.
create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null,
  descricao text default '',
  instrucoes_sistema text not null default 'Você é um assistente prestativo.',
  provider text not null default 'gemini' check (provider in ('chatgpt', 'gemini')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug)
);

create index if not exists idx_ai_agents_created_by on public.ai_agents(created_by);
create index if not exists idx_ai_agents_slug on public.ai_agents(slug);

-- Conhecimento do agente: texto ou referência a arquivo (para RAG/contexto)
create table if not exists public.ai_agent_knowledge (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.ai_agents(id) on delete cascade,
  tipo text not null check (tipo in ('text', 'file')),
  titulo text default '',
  conteudo_texto text,
  storage_path text,
  nome_arquivo text,
  mime_type text,
  created_at timestamptz not null default now(),
  constraint knowledge_content check (
    (tipo = 'text' and conteudo_texto is not null) or
    (tipo = 'file' and storage_path is not null)
  )
);

create index if not exists idx_ai_agent_knowledge_agent_id on public.ai_agent_knowledge(agent_id);

-- Conversas (threads) por agente
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.ai_agents(id) on delete cascade,
  titulo text default 'Nova conversa',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ai_conversations_agent_id on public.ai_conversations(agent_id);
create index if not exists idx_ai_conversations_created_by on public.ai_conversations(created_by);
create index if not exists idx_ai_conversations_updated_at on public.ai_conversations(updated_at desc);

-- Mensagens da conversa
create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null default '',
  image_base64 text,
  image_mime_type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_messages_conversation_id on public.ai_messages(conversation_id);
create index if not exists idx_ai_messages_created_at on public.ai_messages(conversation_id, created_at);

-- Trigger updated_at para ai_agents
create or replace function public.handle_ai_agents_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_agents_updated_at on public.ai_agents;
create trigger ai_agents_updated_at
  before update on public.ai_agents
  for each row execute function public.handle_ai_agents_updated_at();

-- Trigger updated_at para ai_conversations
create or replace function public.handle_ai_conversations_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_conversations_updated_at on public.ai_conversations;
create trigger ai_conversations_updated_at
  before update on public.ai_conversations
  for each row execute function public.handle_ai_conversations_updated_at();

-- RLS: ai_agents (admin ou dono pode tudo; leitura para authenticated se quisermos compartilhar depois)
alter table public.ai_agents enable row level security;

drop policy if exists "Users can read ai_agents" on public.ai_agents;
create policy "Users can read ai_agents"
on public.ai_agents for select to authenticated
using (true);

drop policy if exists "Users can insert ai_agents" on public.ai_agents;
create policy "Users can insert ai_agents"
on public.ai_agents for insert to authenticated
with check (created_by = auth.uid());

drop policy if exists "Users can update own ai_agents" on public.ai_agents;
create policy "Users can update own ai_agents"
on public.ai_agents for update to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "Users can delete own ai_agents" on public.ai_agents;
create policy "Users can delete own ai_agents"
on public.ai_agents for delete to authenticated
using (created_by = auth.uid());

-- RLS: ai_agent_knowledge (via agent ownership)
alter table public.ai_agent_knowledge enable row level security;

drop policy if exists "Users can manage knowledge of own agents" on public.ai_agent_knowledge;
create policy "Users can manage knowledge of own agents"
on public.ai_agent_knowledge for all to authenticated
using (
  exists (select 1 from public.ai_agents a where a.id = agent_id and a.created_by = auth.uid())
)
with check (
  exists (select 1 from public.ai_agents a where a.id = agent_id and a.created_by = auth.uid())
);

-- RLS: ai_conversations
alter table public.ai_conversations enable row level security;

drop policy if exists "Users can read own conversations" on public.ai_conversations;
create policy "Users can read own conversations"
on public.ai_conversations for select to authenticated
using (created_by = auth.uid());

drop policy if exists "Users can insert conversations" on public.ai_conversations;
create policy "Users can insert conversations"
on public.ai_conversations for insert to authenticated
with check (created_by = auth.uid());

drop policy if exists "Users can update own conversations" on public.ai_conversations;
create policy "Users can update own conversations"
on public.ai_conversations for update to authenticated
using (created_by = auth.uid());

drop policy if exists "Users can delete own conversations" on public.ai_conversations;
create policy "Users can delete own conversations"
on public.ai_conversations for delete to authenticated
using (created_by = auth.uid());

-- RLS: ai_messages (via conversation ownership)
alter table public.ai_messages enable row level security;

drop policy if exists "Users can manage messages of own conversations" on public.ai_messages;
create policy "Users can manage messages of own conversations"
on public.ai_messages for all to authenticated
using (
  exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.created_by = auth.uid())
)
with check (
  exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.created_by = auth.uid())
);

-- Bucket para arquivos de conhecimento dos agentes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'agent-knowledge',
  'agent-knowledge',
  false,
  10485760,
  array['application/pdf', 'text/plain', 'text/markdown', 'application/json', 'text/csv']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage: usuário só acessa arquivos em pastas que correspondem a agentes que ele criou
-- Política simplificada: authenticated pode ler/insert/update/delete em agent-knowledge
-- (restrição fina exigiria RLS por pasta = agent_id; para isso usamos app logic ou storage policies por path)
drop policy if exists "Authenticated read agent-knowledge" on storage.objects;
create policy "Authenticated read agent-knowledge"
on storage.objects for select to authenticated
using (bucket_id = 'agent-knowledge');

drop policy if exists "Authenticated insert agent-knowledge" on storage.objects;
create policy "Authenticated insert agent-knowledge"
on storage.objects for insert to authenticated
with check (bucket_id = 'agent-knowledge');

drop policy if exists "Authenticated update agent-knowledge" on storage.objects;
create policy "Authenticated update agent-knowledge"
on storage.objects for update to authenticated
using (bucket_id = 'agent-knowledge');

drop policy if exists "Authenticated delete agent-knowledge" on storage.objects;
create policy "Authenticated delete agent-knowledge"
on storage.objects for delete to authenticated
using (bucket_id = 'agent-knowledge');
