/**
 * DIAGNÓSTICO: Linking Proposals 404 Issue
 * 
 * PROBLEMA IDENTIFICADO:
 * Links na página admin retornavam 404 ao clicar em propostas.
 * Página funcionava com acesso direto pelo navegador.
 * 
 * CAUSAS IDENTIFICADAS:
 * 1. Propostas antigas no banco sem slug (campo null)
 * 2. Admin gerava URL /proposta/[slug] onde slug era null
 * 3. Rota não encontrava a proposta no banco
 * 
 * SOLUÇÕES APLICADAS:
 * 1. ✅ Slug normalization: aceita "Projeto_Varzea" e "projeto-varzea"
 * 2. ✅ Garantir geração automática de slug ao criar proposta
 * 3. ✅ Debug logging adicionado em:
 *    - [slug].vue: logs "slug recebido", "proposta encontrada"
 *    - admin/propostas/index.vue: logs total de propostas e quais têm slug
 * 
 * COMO TESTAR:
 * 
 * 1. Browser Console (quando proposal page carrega):
 *    - Procure por logs: [PROPOSTA DEBUG] e [PROPOSTA RESULT]
 *    - Deve mostrar o slug recebido e se a proposta foi encontrada
 * 
 * 2. Admin Page (quando lista propostas):
 *    - Procure por logs: [ADMIN PROPOSTAS LIST]
 *    - Deve mostrar total de propostas e quais têm slug
 * 
 * 3. Criar/Editar Proposta:
 *    - A pronta form agora gera slug automático do nome do projeto
 *    - Se não for fornecido slug, slugifyProposta() é chamado
 *    - Slug é salvo imediatamente no banco
 * 
 * 4. Testar URLs manualmente:
 *    GET /proposta/projeto-varzea-play (com hífens) → 200 OK
 *    GET /proposta/Projeto_Varzea_Play (com underscores) → 200 OK
 *    GET /proposta/projeto-invalido (inexistente) → 404
 * 
 * ESTRUTURA DO FLUXO:
 * 
 *   Admin Page (propostas/index.vue)
 *   └─ Fetch propostas via useAsyncData
 *   └─ forEach proposta
 *      └─ linkProposta(p.slug) = `/proposta/${p.slug}`
 *      └─ Renderiza link: <a href="/proposta/projeto-varzea-play">
 *      └─ User clica
 *      
 *   Browser navega para: /proposta/projeto-varzea-play
 *   └─ Route [slug].vue é ativado
 *   └─ slug = "projeto-varzea-play" (do URL)
 *   └─ fetchPropostaBySlug("projeto-varzea-play")
 *      └─ normalizarSlugParaBusca(slug)
 *         └─ variantes = ["projeto-varzea-play", "projeto-varzea-play"]
 *      └─ Supabase: .in('slug', variantes)
 *      └─ Encontra a proposta no banco
 *      └─ Proposta renderizada com sucesso
 * 
 * SE AINDA RECEBER 404:
 * 
 * 1. Verificar console logs [PROPOSTA RESULT] para confirmar se encontrou
 * 2. Se não encontrou (found: false), significa:
 *    a) Slug no banco está em formato diferente do esperado
 *    b) Proposta não tem slug no banco (null)
 * 3. Soluções:
 *    a) Editar proposta no admin e salvar novamente (vai gerar slug)
 *    b) Criar nova proposta (vai gerar slug automaticamente)
 *    c) Verificar campo 'slug' na tabela proposta do Supabase
 * 
 * PRÓXIMOS PASSOS SE PROBLEMA PERSISTIR:
 * 1. Verificar se propostas tem slug = null no Supabase
 * 2. Se sim, editar cada uma no admin e salvar (vai preencher slug)
 * 3. Ou usar uma migração/edge function para popular slugs em massa
 */

export const diagnosticoPropostas = {
    checkBrowserConsole:
        'Abra DevTools → Console. Procure pelos logs [PROPOSTA DEBUG] e [PROPOSTA RESULT]',
    checkAdminLogs:
        'Abra /admin/propostas. No Console, procure por [ADMIN PROPOSTAS LIST]',
    testURLFormats: {
        withHyphens: 'GET /proposta/projeto-varzea-play',
        withUnderscores: 'GET /proposta/Projeto_Varzea_Play',
        bothShouldReturn: '200 OK'
    },
    commonIssues: {
        '404 ao clicar': 'Proposta sem slug no banco. Edite e salve novamente no admin.',
        'slug undefined': 'Form do admin não preenchendo slug. Verifique PropostaForm.vue',
        'searchNotWorking': 'Verificar normalizarSlugParaBusca() na composable'
    }
}
