import { Resend } from 'resend'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseServer } from '~~/server/utils/supabase'

export interface EmailVariables {
    [key: string]: string | number | boolean | null
}

export interface EmailTemplate {
    id: number
    nome: string
    slug: string
    tipo: string
    assunto: string
    conteudo_html: string
    conteudo_texto?: string
    variaveis_suportadas: string[]
    ativo: boolean
}

export interface SendEmailOptions {
    templateId?: number
    templateSlug?: string
    para: string
    paraNome?: string
    assunto?: string
    conteudo?: string
    variaveis?: EmailVariables
    usuarioId?: string
    metadados?: Record<string, unknown>
}

export interface EmailLogEntry {
    id: number
    template_id?: number
    para_email: string
    para_nome?: string
    assunto: string
    conteudo_html?: string
    conteudo_texto?: string
    status: 'pending' | 'sending' | 'sent' | 'failed' | 'bounced'
    resend_message_id?: string
    erro_mensagem?: string
    usuario_id?: string
    criado_em: string
    enviado_em?: string
    variaveis?: Record<string, unknown>
}

/**
 * Servico principal de envio de emails com Resend.
 * Integracao com Supabase para templates e logs.
 */
export class EmailService {
    private resend: Resend
    private supabase: SupabaseClient | null
    private config: any

    constructor(apiKey: string, supabase?: SupabaseClient, config?: any) {
        this.resend = new Resend(apiKey)
        this.supabase = supabase || null
        this.config = config || {}
    }

    /**
     * Separa e interpola variaveis em uma string.
     * Ex: "Ola {{ nome }}" com {nome: "Joao"} => "Ola Joao"
     */
    private interpolateVariables(texto: string, variaveis?: EmailVariables): string {
        if (!variaveis || !texto) return texto

        let resultado = texto
        Object.entries(variaveis).forEach(([chave, valor]) => {
            const regex = new RegExp(`{{\\s*${chave}\\s*}}`, 'g')
            resultado = resultado.replace(regex, String(valor || ''))
        })
        return resultado
    }

    private escapeHtml(texto: string): string {
        return texto
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    private formatarConteudoHtml(conteudo: string): string {
        if (!conteudo || !conteudo.trim()) {
            return '<p>Conteúdo vazio</p>'
        }

        const temHtml = /<\/?[a-z][\s\S]*>/i.test(conteudo)
        if (temHtml) {
            return conteudo
        }

        const textoSeguro = this.escapeHtml(conteudo)
        const paragrafos = textoSeguro
            .split(/\n{2,}/g)
            .map(paragrafo => paragrafo.trim())
            .filter(paragrafo => paragrafo.length > 0)

        if (paragrafos.length === 0) {
            return '<p></p>'
        }

        return paragrafos
            .map(paragrafo => `<p>${paragrafo.replace(/\n/g, '<br />')}</p>`)
            .join('')
    }

    /**
     * Extrai variaveis necessarias de um template (ex: ["nome", "email"]).
     */
    private extrairVariaveisNecessarias(template: string): string[] {
        const regex = /{{\\s*(\w+)\\s*}}/g
        const matches = [...template.matchAll(regex)]
        return [...new Set(matches.map(m => m[1]))]
    }

    /**
     * Busca template do banco de dados.
     */
    private async getTemplate(idOuSlug: number | string): Promise<EmailTemplate | null> {
        if (!this.supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        const coluna = typeof idOuSlug === 'number' ? 'id' : 'slug'
        const { data, error } = await this.supabase
            .from('email_templates')
            .select('*')
            .eq(coluna, idOuSlug)
            .single()

        if (error) {
            console.error('[EmailService] Erro ao buscar template:', error.message)
            return null
        }

        return data
    }

    /**
     * Registra log de envio no banco de dados.
     */
    private async logEmail(entry: Partial<EmailLogEntry>): Promise<number | null> {
        if (!this.supabase) return null

        const { data, error } = await this.supabase
            .from('email_logs')
            .insert([entry])
            .select('id')
            .single()

        if (error) {
            console.error('[EmailService] Erro ao registrar log:', error.message)
            return null
        }

        return data?.id || null
    }

    /**
     * Atualiza status de um log de email.
     */
    private async updateLogStatus(
        logId: number,
        status: string,
        resendMessageId?: string,
        erro?: string,
    ): Promise<void> {
        if (!this.supabase) return

        const update: any = {
            status,
        }

        if (resendMessageId) {
            update.resend_message_id = resendMessageId
            update.enviado_em = new Date().toISOString()
        }

        if (erro) {
            update.erro_mensagem = erro
        }

        const { error } = await this.supabase
            .from('email_logs')
            .update(update)
            .eq('id', logId)

        if (error) {
            console.error('[EmailService] Erro ao atualizar log:', error.message)
        }
    }

    /**
     * Envia um email com template ou conteudo customizado.
     */
    async sendEmail(options: SendEmailOptions): Promise<{
        success: boolean
        logId?: number
        messageId?: string
        error?: string
    }> {
        try {
            // Validacao basica
            if (!options.para) {
                throw new Error('Email destinatario (para) e obrigatorio')
            }

            let template: EmailTemplate | null = null
            let assunto = options.assunto || ''
            let conteudoHtml = options.conteudo || ''
            let conteudoTexto = ''

            // 1. Se e via template, buscar do BD
            if (options.templateId || options.templateSlug) {
                const idOuSlug = options.templateId || options.templateSlug
                template = await this.getTemplate(idOuSlug as string | number)

                if (!template) {
                    throw new Error(`Template nao encontrado: ${idOuSlug}`)
                }

                if (!template.ativo) {
                    throw new Error(`Template inativo: ${template.nome}`)
                }

                assunto = template.assunto
                conteudoHtml = template.conteudo_html
                conteudoTexto = template.conteudo_texto || ''
            }

            // 2. Interpolar variaveis
            const variaveis = options.variaveis || {}
            assunto = this.interpolateVariables(assunto, variaveis)
            conteudoHtml = this.interpolateVariables(conteudoHtml, variaveis)
            conteudoTexto = this.interpolateVariables(conteudoTexto, variaveis)
            conteudoHtml = this.formatarConteudoHtml(conteudoHtml)

            // 3. Criar log ANTES do envio
            const logId = await this.logEmail({
                template_id: template?.id,
                para_email: options.para,
                para_nome: options.paraNome,
                assunto,
                conteudo_html: conteudoHtml,
                conteudo_texto: conteudoTexto,
                status: 'pending',
                usuario_id: options.usuarioId,
                variaveis: variaveis as any,
            })

            // 4. Enviar via Resend
            if (logId) {
                await this.updateLogStatus(logId, 'sending')
            }

            const response = await this.resend.emails.send({
                from: this.config.senderEmail || 'noreply@valeapps.com.br',
                to: options.para,
                subject: assunto,
                html: conteudoHtml,
                text: conteudoTexto,
                replyTo: this.config.supportEmail || 'contato@valeapps.com.br',
            })

            if (response.error) {
                if (logId) {
                    await this.updateLogStatus(logId, 'failed', undefined, response.error.message)
                }
                return {
                    success: false,
                    logId: logId ?? undefined,
                    error: response.error.message,
                }
            }

            // 5. Atualizar log com sucesso
            if (logId) {
                await this.updateLogStatus(logId, 'sent', response.data?.id)
            }

            return {
                success: true,
                logId: logId ?? undefined,
                messageId: response.data?.id,
            }
        }
        catch (erro: any) {
            console.error('[EmailService] Erro ao enviar email:', erro.message)
            return {
                success: false,
                error: erro.message,
            }
        }
    }

    /**
     * Envia email para multiplos destinatarios.
     */
    async sendBulk(
        destinatarios: Array<{ email: string; nome?: string; variaveis?: EmailVariables }>,
        templateIdOuSlug: number | string,
        usuarioId?: string,
    ): Promise<{
        total: number
        sucesso: number
        erros: number
        resultados: Array<{ email: string; logId?: number; erro?: string }>
    }> {
        const resultados = []
        let sucesso = 0
        let erros = 0

        for (const dest of destinatarios) {
            try {
                const resultado = await this.sendEmail({
                    templateSlug: typeof templateIdOuSlug === 'string' ? templateIdOuSlug : undefined,
                    templateId: typeof templateIdOuSlug === 'number' ? templateIdOuSlug : undefined,
                    para: dest.email,
                    paraNome: dest.nome,
                    variaveis: dest.variaveis,
                    usuarioId,
                })

                resultados.push({
                    email: dest.email,
                    logId: resultado.logId,
                    erro: resultado.error,
                })

                if (resultado.success) sucesso++
                else erros++
            }
            catch (erro: any) {
                resultados.push({
                    email: dest.email,
                    erro: erro.message,
                })
                erros++
            }
        }

        return {
            total: destinatarios.length,
            sucesso,
            erros,
            resultados,
        }
    }

    /**
     * Obtem historico de logs para analise.
     */
    async getLogs(filtros?: {
        templateId?: number
        status?: string
        para?: string
        dias?: number
    }): Promise<EmailLogEntry[]> {
        if (!this.supabase) return []

        let query = this.supabase.from('email_logs').select('*')

        if (filtros?.templateId) {
            query = query.eq('template_id', filtros.templateId)
        }

        if (filtros?.status) {
            query = query.eq('status', filtros.status)
        }

        if (filtros?.para) {
            query = query.ilike('para_email', `%${filtros.para}%`)
        }

        if (filtros?.dias) {
            const dataLimite = new Date()
            dataLimite.setDate(dataLimite.getDate() - filtros.dias)
            query = query.gte('criado_em', dataLimite.toISOString())
        }

        query = query.order('criado_em', { ascending: false })

        const { data, error } = await query

        if (error) {
            console.error('[EmailService] Erro ao buscar logs:', error.message)
            return []
        }

        return data || []
    }

    /**
     * Retry de emails falhados.
     */
    async retryFailedEmails(maxRetries: number = 3): Promise<{
        tentadas: number
        sucesso: number
        erros: number
    }> {
        if (!this.supabase) return { tentadas: 0, sucesso: 0, erros: 0 }

        const { data, error } = await this.supabase
            .from('email_logs')
            .select('*')
            .eq('status', 'failed')
            .lt('tentativas', maxRetries)
            .is('proxima_tentativa_em', null)

        if (error) {
            console.error('[EmailService] Erro ao buscar failed emails:', error.message)
            return { tentadas: 0, sucesso: 0, erros: 0 }
        }

        let sucesso = 0
        let erros = 0

        for (const log of data || []) {
            try {
                const resultado = await this.sendEmail({
                    templateId: log.template_id,
                    para: log.para_email,
                    paraNome: log.para_nome,
                    variaveis: log.variaveis,
                })

                if (resultado.success) sucesso++
                else erros++
            }
            catch {
                erros++
            }
        }

        return {
            tentadas: (data || []).length,
            sucesso,
            erros,
        }
    }
}

/**
 * Factory para criar instancia de EmailService com context do servidor.
 */
export async function createEmailService(event: any): Promise<EmailService> {
    const config = useRuntimeConfig(event)
    const supabase = useSupabaseServer()

    if (!config.resendApiKey) {
        throw new Error('NUXT_RESEND_API_KEY nao esta configurada')
    }

    return new EmailService(config.resendApiKey, supabase || undefined, {
        senderEmail: config.public.senderEmail,
        supportEmail: config.public.supportEmail,
        adminEmail: config.public.adminEmail,
    })
}
