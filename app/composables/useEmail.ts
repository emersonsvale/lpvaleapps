/**
 * Composable useEmail
 * Fornece funcoes para envio de emails, gerenciamento de templates e preview.
 */

export interface SendEmailOptions {
    templateId?: number
    templateSlug?: string
    para: string
    paraNome?: string
    assunto?: string
    conteudo?: string
    variaveis?: Record<string, any>
    metadados?: Record<string, any>
}

export interface EmailTemplate {
    id: string
    nome: string
    slug: string
    tipo: string
    assunto: string
    conteudo_html: string
    variaveis_suportadas: string[]
    ativo: boolean
}

export interface PreviewOptions {
    templateId?: number
    templateSlug?: string
    conteudo_html?: string
    assunto?: string
    variaveis?: Record<string, any>
}

export default function useEmail() {
    const supabase = useSupabase()
    const loading = ref(false)
    const erro = ref<string | null>(null)
    const ultimaMensagem = ref<string | null>(null)
    const RESEND_FREE_PLAN_DELAY_MS = 1200

    const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const getTemplatesDirect = async (): Promise<EmailTemplate[]> => {
        if (!supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        const { data, error } = await supabase
            .from('email_templates')
            .select('*')
            .order('tipo', { ascending: true })
            .order('nome', { ascending: true })

        if (error) {
            throw new Error(error.message || 'Erro ao buscar templates')
        }

        return (data || []) as EmailTemplate[]
    }

    /**
     * Obtem token de autenticacao do usuario.
     * Sempre tenta renovar a sessao para garantir token valido.
     */
    const getAuthToken = async (): Promise<string> => {
        if (!supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
            // Tenta refresh como ultimo recurso antes de desistir
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
            if (refreshError || !refreshData.session) {
                throw new Error('Sessao expirada. Faca login novamente.')
            }
            return refreshData.session.access_token
        }

        let sessaoAtual = data.session

        // Tenta renovar o token se expirado ou perto do vencimento (60s de margem).
        const expiraEm = (sessaoAtual.expires_at || 0) * 1000
        const tokenExpiradoOuPerto = expiraEm > 0 && expiraEm <= Date.now() + 60_000

        if (tokenExpiradoOuPerto) {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

            if (refreshError || !refreshData.session) {
                throw new Error('Sessao expirada. Faca login novamente.')
            }

            sessaoAtual = refreshData.session
        }

        if (!sessaoAtual.access_token) {
            throw new Error('Nao foi possivel obter token de autenticacao')
        }

        return sessaoAtual.access_token
    }

    /**
     * Envia request autenticada para a API de email.
     * Se receber 401, renova o token e tenta uma vez mais.
     */
    const fetchComRetry = async (url: string, body: Record<string, any>): Promise<any> => {
        const tentarEnvio = async (token: string) => {
            return $fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body,
            })
        }

        const token = await getAuthToken()

        try {
            return await tentarEnvio(token)
        }
        catch (e: any) {
            const status = e?.statusCode || e?.response?.status
            if (status === 401 && supabase) {
                // Token rejeitado pelo server — forcar refresh e tentar novamente
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
                if (refreshError || !refreshData.session?.access_token) {
                    throw new Error('Sessao expirada. Faca login novamente.')
                }
                return await tentarEnvio(refreshData.session.access_token)
            }
            throw e
        }
    }

    /**
     * Envia um email.
     */
    const sendEmail = async (options: SendEmailOptions): Promise<{
        sucesso: boolean
        logId?: number
        messageId?: string
        erro?: string
    }> => {
        loading.value = true
        erro.value = null

        try {
            const response: any = await fetchComRetry('/api/email/send', {
                templateId: options.templateId,
                templateSlug: options.templateSlug,
                para: options.para,
                paraNome: options.paraNome,
                assunto: options.assunto,
                conteudo: options.conteudo,
                variaveis: options.variaveis || {},
                metadados: options.metadados || {},
            })

            if (response.sucesso) {
                ultimaMensagem.value = response.mensagem
                return {
                    sucesso: true,
                    logId: response.logId,
                    messageId: response.messageId,
                }
            }

            throw new Error(response?.erro || 'Erro desconhecido ao enviar email')
        }
        catch (e: any) {
            const errosValidacao = Array.isArray(e?.data?.data)
                ? e.data.data
                : Array.isArray(e?.data)
                    ? e.data
                    : []

            const detalheValidacao = errosValidacao.length > 0
                ? errosValidacao.map((item: any) => item?.mensagem || item?.message).filter(Boolean).join('; ')
                : null

            const mensagem = detalheValidacao
                || e?.data?.erro
                || e?.data?.statusMessage
                || e?.statusMessage
                || e?.message
                || 'Erro ao enviar email'
            erro.value = mensagem
            return {
                sucesso: false,
                erro: mensagem,
            }
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Envia email para multiplos destinatarios.
     */
    const sendBulk = async (
        destinatarios: Array<{
            email: string
            nome?: string
            variaveis?: Record<string, any>
        }>,
        templateSlug: string,
    ): Promise<{
        total: number
        sucesso: number
        erros: number
    }> => {
        loading.value = true
        erro.value = null

        try {
            let sucessos = 0
            let erros_count = 0

            for (const [index, dest] of destinatarios.entries()) {

                const resultado = await sendEmail({
                    templateSlug,
                    para: dest.email,
                    paraNome: dest.nome,
                    variaveis: dest.variaveis,
                })

                if (resultado.sucesso) sucessos++
                else erros_count++

                if (index < destinatarios.length - 1) {
                    await esperar(RESEND_FREE_PLAN_DELAY_MS)
                }
            }

            ultimaMensagem.value = `${sucessos} emails enviados com sucesso`

            return {
                total: destinatarios.length,
                sucesso: sucessos,
                erros: erros_count,
            }
        }
        catch (e: any) {
            const mensagem = e.message || 'Erro ao enviar bulk de emails'
            erro.value = mensagem
            throw e
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Busca lista de templates disponiveis.
     */
    const getTemplates = async (): Promise<EmailTemplate[]> => {
        loading.value = true
        erro.value = null

        try {
            try {
                const token = await getAuthToken()

                const response = await $fetch('/api/email/templates', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                return response.templates || []
            }
            catch (apiError: any) {
                const statusCode = apiError?.statusCode || apiError?.response?.status
                const statusMessage = apiError?.data?.statusMessage || apiError?.statusMessage || apiError?.message || ''

                if (statusCode === 401) {
                    console.warn('[useEmail.getTemplates] API retornou 401; usando fallback direto via Supabase.')
                    return await getTemplatesDirect()
                }

                throw new Error(statusMessage || 'Erro ao buscar templates')
            }
        }
        catch (e: any) {
            erro.value = e.message || 'Erro ao buscar templates'
            return []
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Gera preview HTML de um template.
     */
    const getPreview = async (options: PreviewOptions): Promise<{
        assunto: string
        html: string
        template?: {
            id: string
            nome: string
            tipo: string
        }
    } | null> => {
        loading.value = true
        erro.value = null

        try {
            const response: any = await fetchComRetry('/api/email/preview', {
                templateId: options.templateId,
                templateSlug: options.templateSlug,
                conteudo_html: options.conteudo_html,
                assunto: options.assunto,
                variaveis: options.variaveis || {},
            })

            if (response.sucesso) {
                return response.preview
            }

            throw new Error('Erro ao gerar preview')
        }
        catch (e: any) {
            erro.value = e.message || 'Erro ao gerar preview'
            return null
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Cria ou atualiza um template.
     */
    const saveTemplate = async (template: any): Promise<{
        sucesso: boolean
        template?: any
        erro?: string
    }> => {
        loading.value = true
        erro.value = null

        try {
            const response: any = await fetchComRetry('/api/email/templates', template)

            if (response.sucesso) {
                ultimaMensagem.value = response.mensagem
                return {
                    sucesso: true,
                    template: response.template,
                }
            }

            throw new Error(response.erro || 'Erro ao salvar template')
        }
        catch (e: any) {
            const mensagem = e.data?.data?.[0]?.mensagem || e.message || 'Erro ao salvar template'
            erro.value = mensagem
            return {
                sucesso: false,
                erro: mensagem,
            }
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Exclui um template.
     */
    const deleteTemplate = async (id: string): Promise<{
        sucesso: boolean
        erro?: string
    }> => {
        loading.value = true
        erro.value = null

        try {
            const token = await getAuthToken()

            const response: any = await $fetch('/api/email/templates', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: { id },
            })

            if (response.sucesso) {
                ultimaMensagem.value = response.mensagem
                return { sucesso: true }
            }

            throw new Error(response.erro || 'Erro ao excluir template')
        }
        catch (e: any) {
            const mensagem = e?.data?.statusMessage || e?.message || 'Erro ao excluir template'
            erro.value = mensagem
            return {
                sucesso: false,
                erro: mensagem,
            }
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Limpa mensagens de erro
     */
    const limparErro = () => {
        erro.value = null
    }

    /**
     * Limpa mensagem de sucesso
     */
    const limparMensagem = () => {
        ultimaMensagem.value = null
    }

    return {
        // State
        loading: readonly(loading),
        erro: readonly(erro),
        ultimaMensagem: readonly(ultimaMensagem),

        // Methods
        sendEmail,
        sendBulk,
        getTemplates,
        getPreview,
        saveTemplate,
        deleteTemplate,
        limparErro,
        limparMensagem,
    }
}
