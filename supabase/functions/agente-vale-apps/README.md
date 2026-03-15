# Edge Function: agente-vale-apps

Agente do Vale Apps com RAG (dados do projeto) e **tool calling**: o assistente pode **criar, editar e excluir tarefas** do projeto via ferramentas (`criar_tarefa`, `editar_tarefa`, `excluir_tarefa`). O frontend envia `mensagem`, `projeto_id` e `projeto_nome`; o backend injeta o contexto no prompt e executa as ações no Supabase com o JWT do usuário (RLS aplicado).

## Body da requisição (POST)

```json
{
  "mensagem": "string",
  "projeto_id": 123,
  "projeto_nome": "Nome do Projeto",
  "provider": "chatgpt"
}
```

- `mensagem`: texto do usuário (obrigatório).
- `projeto_id`: número ou `null` (quando o usuário não está em um projeto).
- `projeto_nome`: opcional; quando presente, o agente sabe o nome do projeto atual.
- `provider`: `"chatgpt"` (padrão) ou `"gemini"`. Define qual modelo usar.
  - **chatgpt**: OpenAI `gpt-4o` (mais capaz). Requer `OPENAI_API_KEY`.
  - **gemini**: Google `gemini-2.0-flash`. Requer `GEMINI_API_KEY`.

## Resposta

```json
{
  "resposta": "texto em markdown"
}
```

## Autenticação

Enviar o JWT do Supabase no header: `Authorization: Bearer <token>`.

## Deploy

```bash
supabase functions deploy agente-vale-apps
```

Secrets:

```bash
# ChatGPT (gpt-4o)
supabase secrets set OPENAI_API_KEY=sua-chave-openai

# Gemini (gemini-2.0-flash)
supabase secrets set GEMINI_API_KEY=sua-chave-google-ai
```

## Personalização

Substitua a função `runAgente` em `index.ts` pela sua lógica (RAG vetorial, Text-to-SQL, outro LLM). O `systemPrompt` já inclui o contexto do projeto (`buildProjetoContext`). Use `projetoId` nas queries para filtrar por projeto quando fizer sentido.
