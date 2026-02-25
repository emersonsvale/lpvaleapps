/**
 * Default email templates in HTML.
 * These are used as fallback templates when the DB has no data.
 * Each template supports variables via {{ key }}.
 */

export const defaultTemplates = {
    /**
     * Template: Welcome email for new client
     */
    bemVindas: {
        nome: 'Boas-vindas - Cliente',
        slug: 'boas-vindas-cliente',
        tipo: 'boas_vindas',
        assunto: 'Bem-vindo a Vale Apps!',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 40px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo a Vale Apps</h1>
    </div>
    <div class="content">
      <p>Ola <strong>{{ nome }}</strong>!</p>
      <p>Obrigado por se cadastrar na Vale Apps. Estamos felizes em ter voce conosco!</p>
      
      <p>A Vale Apps e sua parceira em solucoes digitais sob medida com:</p>
      <ul>
        <li>Desenvolvimento de aplicativos web e mobile</li>
        <li>Integracao de IA e automacao</li>
        <li>Consultoria tecnica especializada</li>
        <li>Suporte continuo para seu negocio</li>
      </ul>

      <p>Nos proximos dias, voce recebera informacoes sobre como comecar. Enquanto isso, confira nossos servicos:</p>
      
      <a href="https://valeapps.com.br" class="button">Explorar Vale Apps</a>

      <p>Se tiver duvidas, entre em contato conosco!</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Vale Apps. Todos os direitos reservados.</p>
      <p>Contato: {{ email_suporte }}</p>
    </div>
  </div>
</body>
</html>
    `,
        texto: 'Bem-vindo a Vale Apps, {{ nome }}! Obrigado por se cadastrar. Visite https://valeapps.com.br para conhecer nossos servicos.',
        variaveis: ['{{ nome }}', '{{ email }}', '{{ empresa }}', '{{ email_suporte }}'],
    },

    /**
     * Template: Proposal confirmation
     */
    proposta: {
        nome: 'Confirmacao de Proposta',
        slug: 'confirmacao-proposta',
        tipo: 'proposta',
        assunto: 'Proposta {{ numero_proposta }} - Vale Apps',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
    .info-label { color: #666; font-size: 12px; text-transform: uppercase; }
    .info-value { font-size: 18px; font-weight: bold; color: #333; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Proposta Recebida</h1>
      <p>Sua proposta foi enviada com sucesso</p>
    </div>
    <div class="content">
      <p>Ola <strong>{{ nome_cliente }}</strong>,</p>
      <p>Obrigado por sua proposta! Recebemos com sucesso os dados e ja estamos analisando.</p>

      <div class="info-box">
        <div class="info-label">Numero da Proposta</div>
        <div class="info-value">{{ numero_proposta }}</div>
      </div>

      <div class="info-box">
        <div class="info-label">Valor</div>
        <div class="info-value">{{ valor }}</div>
      </div>

      <div class="info-box">
        <div class="info-label">Data</div>
        <div class="info-value">{{ data_proposta }}</div>
      </div>

      <p><strong>Proximos Passos:</strong></p>
      <ol>
        <li>Nossa equipe analisara sua proposta dentro de 24 horas uteis</li>
        <li>Voce recebera um contato com feedback e proximas etapas</li>
        <li>Estaremos disponiveis para esclarecer duvidas</li>
      </ol>

      <p>Qualquer duvida, entre em contato conosco pelo email ou telefone abaixo.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Vale Apps. Todos os direitos reservados.</p>
      <p>Email: {{ email_suporte }} | Tel: {{ telefone_suporte }}</p>
    </div>
  </div>
</body>
</html>
    `,
        texto: 'Proposta {{ numero_proposta }} recebida. Valor: {{ valor }}. Data: {{ data_proposta }}.',
        variaveis: ['{{ nome_cliente }}', '{{ numero_proposta }}', '{{ valor }}', '{{ data_proposta }}', '{{ email_suporte }}', '{{ telefone_suporte }}'],
    },

    /**
     * Template: Lead follow-up
     */
    leads: {
        nome: 'Follow-up Leads',
        slug: 'follow-up-leads',
        tipo: 'leads',
        assunto: 'Ficamos de olho no seu interesse, {{ nome }}',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #667eea; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Continuamos aqui para ajudar</h1>
      <p>{{ nome }}, vamos conversar sobre {{ servico }}?</p>
    </div>
    <div class="content">
      <p>Ola <strong>{{ nome }}</strong>,</p>
      <p>Ha alguns dias voce se interessou por nossa solucao de {{ servico }}. Queremos saber como podemos ajudar seu negocio!</p>

      <p><strong>Por que trabalhar com Vale Apps?</strong></p>
      
      <div class="feature">
        <strong>Solucoes Personalizadas</strong><br/>
        Cada projeto e unico. Desenvolvemos sob medida para seu negocio.
      </div>

      <div class="feature">
        <strong>Entrega Rapida</strong><br/>
        Implementacao agil com resultados em semanas, nao meses.
      </div>

      <div class="feature">
        <strong>Suporte Continuo</strong><br/>
        Voce nao esta sozinho. Estamos aqui antes, durante e depois.
      </div>

      <p>Gostaria de conversar sobre como podemos transformar sua {{ servico }}?</p>
      
      <a href="https://valeapps.com.br#contato" class="button">Agendar Conversa</a>

      <p>Sem compromisso. So uma conversa amigavel.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Vale Apps. Todos os direitos reservados.</p>
      <p>Email: {{ email_suporte }}</p>
    </div>
  </div>
</body>
</html>
    `,
        texto: '{{ nome }}, continuamos interessados em ajudar com {{ servico }}. Vamos conversar?',
        variaveis: ['{{ nome }}', '{{ servico }}', '{{ dias_contato }}', '{{ email_suporte }}'],
    },

    /**
     * Template: Default newsletter
     */
    newsletter: {
        nome: 'Newsletter Padrao',
        slug: 'newsletter-padrao',
        tipo: 'newsletter',
        assunto: 'Newsletter Vale Apps - {{ mes }}',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Newsletter Vale Apps</h1>
      <p>{{ mes }} de {{ ano }}</p>
    </div>
    <div class="content">
      <p>Ola! Confira as novidades da Vale Apps este {{ mes }}:</p>

      <h2>{{ titulo_principal }}</h2>
      <p>{{ conteudo_principal }}</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

      <p>{{ conteudo_secundario }}</p>

      <p>Obrigado por acompanhar Vale Apps!</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Vale Apps. Todos os direitos reservados.</p>
      <p><a href="https://valeapps.com.br#unsubscribe" style="color: #667eea; text-decoration: none;">Cancelar inscricao</a></p>
    </div>
  </div>
</body>
</html>
    `,
        texto: 'Newsletter Vale Apps - {{ mes }} de {{ ano }}\n\n{{ conteudo_principal }}',
        variaveis: ['{{ mes }}', '{{ ano }}', '{{ titulo_principal }}', '{{ conteudo_principal }}', '{{ conteudo_secundario }}'],
    },

    /**
     * Template: Admin notification
     */
    admin: {
        nome: 'Notificacao Admin - Nova Proposta',
        slug: 'notificacao-admin-proposta',
        tipo: 'admin',
        assunto: '[ADMIN] Nova proposta: {{ numero_proposta }}',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: monospace; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .info { background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
    .button { display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="alert">
      <strong>NOVA PROPOSTA RECEBIDA</strong>
    </div>

    <h2>Detalhes da Proposta</h2>
    
    <div class="info">
      <strong>Numero:</strong> {{ numero_proposta }}<br/>
      <strong>Cliente:</strong> {{ nome_cliente }}<br/>
      <strong>Email:</strong> {{ email_cliente }}<br/>
      <strong>Status:</strong> {{ status }}
    </div>

    <div class="info">
      <strong>Valor:</strong> {{ valor }}<br/>
      <strong>Servico:</strong> {{ servico }}<br/>
      <strong>Criada em:</strong> {{ data_criacao }}
    </div>

    <p><strong>Descricao da Proposta:</strong></p>
    <pre>{{ descricao }}</pre>

    <a href="https://valeapps.com.br/admin/propostas/{{ numero_proposta }}" class="button">Abrir Proposta</a>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    <p style="font-size: 12px; color: #666;">Mensagem automatica do sistema. Nao responda este email.</p>
  </div>
</body>
</html>
    `,
        texto: 'NOVA PROPOSTA: {{ numero_proposta }} - {{ nome_cliente }} - {{ valor }}',
        variaveis: ['{{ numero_proposta }}', '{{ nome_cliente }}', '{{ email_cliente }}', '{{ valor }}', '{{ status }}', '{{ servico }}', '{{ data_criacao }}', '{{ descricao }}'],
    },

    /**
     * Template: Monthly report
     */
    relatorio: {
        nome: 'Relatorio Mensal',
        slug: 'relatorio-mensal',
        tipo: 'relatorio',
        assunto: 'Seu Relatorio de {{ mes }} - Vale Apps',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .stat { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; display: inline-block; width: calc(50% - 10px); margin-right: 10px; }
    .stat-label { color: #666; font-size: 12px; }
    .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Relatorio - {{ mes }} de {{ ano }}</h1>
    </div>
    <div class="content">
      <p>Ola,</p>
      <p>Aqui esta seu relatorio mensal de atividades:</p>

      <div class="stat">
        <div class="stat-label">Total Propostas</div>
        <div class="stat-value">{{ total_propostas }}</div>
      </div>

      <div class="stat">
        <div class="stat-label">Total Clientes</div>
        <div class="stat-value">{{ total_clientes }}</div>
      </div>

      <div class="stat">
        <div class="stat-label">Revenue</div>
        <div class="stat-value">{{ total_revenue }}</div>
      </div>

      <div class="stat">
        <div class="stat-label">Taxa Conversao</div>
        <div class="stat-value">{{ taxa_conversao }}%</div>
      </div>

      <p style="clear: both; margin-top: 20px;"><strong>Destaques do mes:</strong></p>
      <p>{{ destaques }}</p>

      <p><strong>Proximos passos:</strong></p>
      <ul>
        <li>Revisar propostas em aberto</li>
        <li>Seguir up com leads prioritarios</li>
        <li>Planejar acoes para proximo mes</li>
      </ul>

      <p>Qualquer duvida sobre os dados, entre em contato com nosso time de suporte.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Vale Apps. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
    `,
        texto: 'Relatorio {{ mes }}/{{ ano }}: {{ total_propostas }} propostas, {{ total_clientes }} clientes, {{ total_revenue }} em revenue.',
        variaveis: ['{{ mes }}', '{{ ano }}', '{{ total_propostas }}', '{{ total_clientes }}', '{{ total_revenue }}', '{{ taxa_conversao }}', '{{ destaques }}'],
    },
}

export type TemplateType = keyof typeof defaultTemplates

/**
 * Obtem um template padrao pelo tipo.
 */
export function getDefaultTemplate(tipo: TemplateType) {
    return defaultTemplates[tipo]
}

/**
 * Lista todos os templates padrao disponiveis.
 */
export function listDefaultTemplates() {
    return Object.entries(defaultTemplates).map(([key, template]) => ({
        key,
        nome: template.nome,
        slug: template.slug,
        tipo: template.tipo,
    }))
}
