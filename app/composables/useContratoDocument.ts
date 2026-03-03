import { marked } from 'marked'

// ─── Dados da empresa (Vale Apps) ──────────────────────────────────────────────
export const EMPRESA_DEFAULTS = {
    razaoSocial: 'Vale Solucoes Digitais LTDA',
    cnpj: '61.712.285/0001-88',
    emailSuporte: 'suporte@valeapps.com.br',
    canalAtendimento: 'WhatsApp / E-mail',
    bancoNome: '',
    bancoAgencia: '',
    bancoConta: '',
    chavePix: '',
    cidadeForo: 'Imperatriz',
    estadoForo: 'Maranhão',
}

// ─── Interface de dados do documento ───────────────────────────────────────────
export interface ContratoDocumentData {
    // Dados do contratante
    clienteRazaoSocial: string
    clienteEndereco: string
    clienteCep: string
    clienteCnpj: string

    // Termos do contrato
    prazoDias: number
    prazoGarantiaDias: number

    // Financeiro
    valorTotal: number
    condicoesPagamento: string
    valorHoraSuporte: number

    // Multas e penalidades
    multaAbsorcao: string
    percentualResilicao: string

    // Suporte
    emailSuporte: string
    canalAtendimento: string

    // Dados bancários (Vale Apps)
    bancoNome: string
    bancoAgencia: string
    bancoConta: string
    chavePix: string

    // Foro e assinatura
    cidadeForo: string
    estadoForo: string
    dataAssinatura: string
}

// ─── Valor por extenso (pt-BR) ────────────────────────────────────────────────
const UNIDADES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
const ESPECIAIS = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']

function numeroPorExtenso(n: number): string {
    if (n === 0) return 'zero'
    if (n < 0) return 'menos ' + numeroPorExtenso(-n)

    if (n >= 1_000_000_000) {
        const bilhoes = Math.floor(n / 1_000_000_000)
        const resto = n % 1_000_000_000
        let s = numeroPorExtenso(bilhoes) + (bilhoes === 1 ? ' bilhão' : ' bilhões')
        if (resto > 0) {
            s += (resto < 100 || resto % 1000 === 0) ? ' e ' : ', '
            s += numeroPorExtenso(resto)
        }
        return s
    }

    if (n >= 1_000_000) {
        const milhoes = Math.floor(n / 1_000_000)
        const resto = n % 1_000_000
        let s = numeroPorExtenso(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões')
        if (resto > 0) {
            s += (resto < 100 || resto % 1000 === 0) ? ' e ' : ', '
            s += numeroPorExtenso(resto)
        }
        return s
    }

    if (n >= 1000) {
        const milhares = Math.floor(n / 1000)
        const resto = n % 1000
        let s = milhares === 1 ? 'mil' : numeroPorExtenso(milhares) + ' mil'
        if (resto > 0) {
            s += (resto < 100 || resto % 100 === 0) ? ' e ' : ', '
            s += numeroPorExtenso(resto)
        }
        return s
    }

    if (n === 100) return 'cem'

    if (n >= 100) {
        const c = Math.floor(n / 100)
        const resto = n % 100
        let s = CENTENAS[c] ?? ''
        if (resto > 0) s += ' e ' + numeroPorExtenso(resto)
        return s
    }

    if (n >= 20) {
        const d = Math.floor(n / 10)
        const u = n % 10
        let s = DEZENAS[d] ?? ''
        if (u > 0) s += ' e ' + unidadeTexto(u)
        return s
    }

    if (n >= 10) return ESPECIAIS[n - 10] ?? ''

    return unidadeTexto(n)
}

function unidadeTexto(n: number): string {
    return UNIDADES[n] ?? ''
}

export function valorPorExtenso(valor: number): string {
    if (valor === 0) return 'zero reais'

    const inteiro = Math.floor(Math.abs(valor))
    const centavos = Math.round((Math.abs(valor) - inteiro) * 100)

    let resultado = ''

    if (inteiro > 0) {
        resultado = numeroPorExtenso(inteiro)
        resultado += inteiro === 1 ? ' real' : ' reais'
    }

    if (centavos > 0) {
        if (inteiro > 0) resultado += ' e '
        resultado += numeroPorExtenso(centavos)
        resultado += centavos === 1 ? ' centavo' : ' centavos'
    }

    return resultado
}

// ─── Formatar valores ──────────────────────────────────────────────────────────
function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarData(dateStr: string): string {
    if (!dateStr) return '________________________'
    try {
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(dateStr + 'T12:00:00'))
    } catch {
        return dateStr
    }
}

function placeholder(value: string | number | undefined | null, fallback = '________________________'): string {
    const str = String(value ?? '').trim()
    return str || fallback
}

// ─── Template do contrato (Markdown) ───────────────────────────────────────────
function getContratoTemplate(data: ContratoDocumentData): string {
    const clienteRazaoSocial = placeholder(data.clienteRazaoSocial)
    const clienteEndereco = placeholder(data.clienteEndereco)
    const clienteCep = placeholder(data.clienteCep, '________')
    const clienteCnpj = placeholder(data.clienteCnpj, '______________')
    const prazoDias = data.prazoDias || 120
    const prazoGarantiaDias = data.prazoGarantiaDias || 90
    const emailSuporte = placeholder(data.emailSuporte, EMPRESA_DEFAULTS.emailSuporte)
    const canalAtendimento = placeholder(data.canalAtendimento, EMPRESA_DEFAULTS.canalAtendimento)
    const valorTotalFormatado = formatarMoeda(data.valorTotal || 0)
    const valorExtenso = valorPorExtenso(data.valorTotal || 0)
    const condicoesPagamento = placeholder(data.condicoesPagamento)
    const valorHoraSuporte = data.valorHoraSuporte ? formatarMoeda(data.valorHoraSuporte) : 'R$ ________'
    const multaAbsorcao = placeholder(data.multaAbsorcao, '100.000,00')
    const percentualResilicao = placeholder(data.percentualResilicao, '80%')
    const razaoSocialEmpresa = EMPRESA_DEFAULTS.razaoSocial
    const cnpjEmpresa = EMPRESA_DEFAULTS.cnpj
    const bancoNome = placeholder(data.bancoNome || EMPRESA_DEFAULTS.bancoNome)
    const bancoAgencia = placeholder(data.bancoAgencia || EMPRESA_DEFAULTS.bancoAgencia)
    const bancoConta = placeholder(data.bancoConta || EMPRESA_DEFAULTS.bancoConta)
    const chavePix = placeholder(data.chavePix || EMPRESA_DEFAULTS.chavePix)
    const cidadeForo = placeholder(data.cidadeForo || EMPRESA_DEFAULTS.cidadeForo, 'Imperatriz')
    const estadoForo = placeholder(data.estadoForo || EMPRESA_DEFAULTS.estadoForo, 'Maranhão')
    const cidadeDataAssinatura = data.dataAssinatura
        ? `${cidadeForo}, ${formatarData(data.dataAssinatura)}`
        : '________________________'

    return `# Contrato de Prestação de Serviços de Programação

**DEFINIÇÃO:** Esse contrato visa documentar e regular a prestação de serviços de configuração ou programação de software, site, e/ou aplicativo híbrido, assim como, sua devida manutenção mensal, pela CONTRATADA, conforme escopo declarado e aceito previamente pela CONTRATANTE, contendo todas as informações acerca da metodologia de trabalho, do cronograma de atividades, dos recursos necessários para a execução do serviço, bem como as descrições das condições de pagamento e prazos definidos.

Pelo presente instrumento particular celebrado por, e entre as partes, de um lado,

**a) Vale Solucoes Digitais LTDA** com sede na Rua Tupinambá, São José do Egito - CEP 65901-110, na Cidade de Imperatriz, Estado de Maranhão, inscrita no Cadastro Nacional de Pessoa Jurídica do Ministério da Fazenda ("CNPJ/MF") sob o nº 61.712.285/0001-88, doravante denominada ("CONTRATADA");

e de outro lado,

**b) ${clienteRazaoSocial}**, com sede na ${clienteEndereco}, CEP ${clienteCep}, inscrita no CNPJ/MF sob o nº ${clienteCnpj}, aqui representada na forma de seu contrato social, doravante denominada ("CONTRATANTE");

CONTRATADA e CONTRATANTE referidas individualmente como "PARTE" ou conjuntamente como "PARTES".

---

#### 1\\. DO OBJETO

O presente contrato tem por objetivo estabelecer as condições de contratação para a prestação de serviços de elaboração, configuração e/ou programação de software, site ou aplicativo híbrido, doravante denominado "PRODUTO", que deverá ser entregue de forma oficial e funcional à CONTRATANTE, dentro do prazo e condições estabelecidas no presente instrumento.

**1.1. ESCOPO DO PRODUTO** Faz parte do escopo deste projeto, o entendimento do "problema/ideia" por parte da CONTRATADA, através de informações cedidas pela CONTRATANTE, que deverá ser registrado em documento nomeado "Briefing", para validação entre as PARTES, e deverá ser anexado ao presente instrumento na sessão ANEXO 1. A Proposta comercial PDF, bem como as negociações por e-mail e whatsapp, também são parte integrante deste contrato, para o balizamento do que foi inicialmente entendido, acordado, discutido, proposto e posteriormente melhor detalhado no Anexo 1. Importante consignar que o ANEXO 1 será aprovado pelo CONTRATANTE previamente à sua inclusão. O protótipo, e os artefatos de arquitetura completos, tal desenvolvimento, serão produzidos posteriormente à assinatura do presente instrumento, e também passarão por aprovação do CONTRATANTE, compondo o PRODUTO FINAL.

- **1.1.1.** O referido PRODUTO objeto deste contrato, poderá estar baseado em plataformas SaaS, Bubble, Flutter Flow e/ou qualquer outra que se faça necessária para atender funcionalidades e/ou infraestrutura do projeto a ser desenvolvido, desde que anuídas pela CONTRATANTE, e cuja contratação é de responsabilidade da própria CONTRATANTE, podendo essa ser realizada pela CONTRATADA por conta e ordem da primeira nomeada, sendo certo que nessa hipótese ficará a CONTRATANTE responsável por reembolsar a CONTRATADA por tais custos, incluindo, mas não limitando-se, aos impostos incidentes sobre tal operação.
- **1.1.1.1.** Ficará a cargo da CONTRATADA, mediante prévia avaliação de parte da CONTRATANTE, se a contratação dos serviços da plataforma SaaS se dará de forma direta pela CONTRATANTE ou indiretamente pela CONTRATADA em atuação por conta e ordem dessa.
- **1.1.1.2.** Considerando que os serviços prestados pelas plataformas SaaS são de responsabilidade de terceiros, fica desde já consignado que a CONTRATADA não possui qualquer ingerência ou responsabilidade por quaisquer alterações políticas contratuais dos serviços em comento.
- **1.1.2.** A CONTRATANTE será responsável por assumir todos os custos gerados pela plataforma SaaS, inclusive pela sua transferência de titularidade, no imediato momento após a entrega do PRODUTO.

**1.2. PRAZO DE ENTREGA E RESPONSABILIDADE CIVIL**

- **1.2.1** O prazo de entrega do referido PRODUTO será de até **${prazoDias}** dias úteis, após o pagamento da primeira parcela e assinatura do contrato pelas partes.
- **1.2.1.1** A entrega poderá ser postergada por até 60 (sessenta) dias, desde que: (i) devidamente justificada, (ii) informado com antecedência mínima de 10 (DEZ dias) do término do prazo disposto no item 1.2.1; e, (iii) anuída pela CONTRATANTE, considerando problemáticas de ambas partes, e ajustes à conclusão do PRODUTO, necessários ao longo da execução do projeto.
- **1.2.2** O Produto será considerado entregue à CONTRATANTE imediatamente após o envio e-mail tendo como "assunto" o título de "Entrega de Propriedade" conterá os seguintes documentos: (i) Arquitetura do Projeto aprovada; (ii) Credenciais de Acesso; e, (iii) Documentação de Arquitetura, (vi) Protótipo aprovado e arquivos de dados produzidos pela CONTRATADA.
  - a) A CONTRATANTE terá até 10 (dez) dias corridos da formalização da entrega para dar sua anuência, ou rejeitar de forma formal, justificando o motivo da rejeição.
  - b) O não cumprimento do prazo acima exposto ensejará na anuência compulsória.
- **1.2.2.1** Os referidos documentos descritos no item 1.2.2 serão suficientemente aptos a permitir o gozo integral do PRODUTO pela CONTRATANTE, sendo certo que a partir dessa data qualquer alteração que se faça necessária, a pedido da CONTRATANTE à CONTRATADA, deverá ser autorizada mediante acesso da CONTRATANTE.
- **1.2.3** A tradição exercida pela CONTRATADA em favor da CONTRATANTE, nos termos do artigo 1.267, do Código Civil, implica em eximi-la de toda e qualquer responsabilidade por danos causados a terceiros, seja de ordem de propriedade intelectual ou qualquer outra forma de má gestão por parte da CONTRATANTE e seus indicados, assim como, não podendo a CONTRATADA se responsabilizar por implementações realizadas por terceiros alheios ao seu conhecimento ou gerenciamento.

**1.3 GARANTIA PARA DEFEITOS DE FABRICAÇÃO (BUGS)**

- **1.3.1 Garantia:** A CONTRATADA concede à CONTRATANTE uma garantia de **${prazoGarantiaDias}** dias, a contar da data da entrega final do sistema, para a correção de defeitos de fabricação (bugs) que venham a ser identificados no sistema entregue.
- **1.3.2 Definição de Bug:** Para os efeitos desta cláusula, considera-se bug qualquer erro ou falha no funcionamento do sistema que tenha origem no código-fonte ou na arquitetura desenvolvida pela CONTRATADA, e que impeça ou prejudique o funcionamento normal das funcionalidades especificadas no contrato base ou em documentos de escopo acordados, e que não haja evidência de funcionamento anterior.
  - **1.3.2.2 Não são considerados bugs:**
    - a) Problemas decorrentes de mal uso, alterações não autorizadas no sistema ou falhas causadas por terceiros;
    - b) Incidentes ocasionados por ambientes tecnológicos externos, como falhas de servidores, redes, integrações de sistemas ou serviços de terceiros;
    - c) Melhorias ou alterações de funcionalidade solicitadas após a entrega final do sistema.
- **1.3.3 SLAs (Service Level Agreement) de Atendimento para Chamados de Bugs** A CONTRATADA se compromete a atender e resolver os chamados relacionados a bugs dentro dos seguintes prazos estimados, a depender da gravidade do incidente:

| Prioridade do Bug | Definição | Tempo Estimado de Resposta | Tempo Estimado de Resolução |
| :---- | :---- | :---- | :---- |
| **Prioridade Crítica** | Bugs que causam a indisponibilidade total do sistema ou de funcionalidades críticas. | Até 1 hora | Até 8 horas úteis |
| **Prioridade Alta** | Bugs que afetam significativamente o uso do sistema, mas sem causar total indisponibilidade. | Até 2 horas | Até 16 horas úteis |
| **Prioridade Média** | Bugs que impactam funcionalidades não essenciais ou que apresentam soluções alternativas temporárias. | Até 4 horas | Até 48 horas úteis |
| **Prioridade Baixa** | Bugs que não afetam diretamente o funcionamento principal do sistema e podem ser corrigidos com atualizações futuras. | Até 8 horas | Até 10 dias úteis |

**1.4. Regramento de Abertura de Chamados de Bugs**

- **1.4.1.** A CONTRATANTE deverá reportar os bugs à CONTRATADA por meio dos canais de atendimento estabelecidos, seja por e-mail para o endereço **${emailSuporte}** ou pelo aplicativo **${canalAtendimento}**, utilizando o formulário de abertura de chamados específico para reportar bugs.
- **1.4.2.** O chamado deverá conter:
  - a) Descrição detalhada do bug: Especificando os comportamentos inesperados, os passos para reproduzir o erro e as funcionalidades afetadas;
  - b) Impacto no sistema: Indicar se o bug afeta toda a operação ou apenas partes específicas do sistema, para fins de classificação de prioridade;
  - c) Anexos: Sempre que possível, anexar logs, prints de tela ou outros documentos que possam ajudar a CONTRATADA a diagnosticar o problema com mais precisão.
- **1.4.3.** A CONTRATADA compromete-se a classificar o bug de acordo com as prioridades estabelecidas na Cláusula 3, e a fornecer à CONTRATANTE uma previsão do tempo estimado para a resolução, conforme o SLA aplicável.
- **1.4.4.** Chamados de bugs que não cumprirem os requisitos mínimos para abertura ou que não se enquadrem na definição de bug poderão ser rejeitados ou reclassificados pela CONTRATADA, com a devida justificativa fornecida à CONTRATANTE.
- **1.4.5.** A garantia se limita à correção dos bugs sem custo adicional para a CONTRATANTE dentro do prazo acordado. Após o término do período de garantia, a correção de bugs será cobrada conforme os termos do contrato principal ou secundário em vigor, caso haja.
  - **1.4.5.1.** A não existência de um contrato de sustentação/Suporte, ensejará em um custo de **${valorHoraSuporte}/hora**, com atendimento em caráter emergencial.
- **1.4.6.** O regime de atendimento da CONTRATADA à CONTRATANTE será em horário comercial 8x5xNBD (next business day ou próximo dia útil), de segunda à sexta feira, das 9:00 hs às 18:00hs.

---

#### 2\\. DA PROPRIEDADE INTELECTUAL

Todo e qualquer produto, desenvolvimento de Software, documento, modelo de negócios ou solução técnica, criados em função deste Contrato e de Ordens de Solicitação de Serviço, bem como os direitos sobre as modificações destinadas a atualizações tecnológicas, incorporação de facilidades ou adequações às novas necessidades, assim como, derivações que vierem a ser feitas no "Software" ou quaisquer outros produtos desenvolvidos pela CONTRATADA por força do presente Contrato e Ordens de Solicitação de Serviço serão de propriedade exclusiva da CONTRATANTE, que deles disporá para incorporação ao seu patrimônio e/ou para comercialização futura, nada sendo devido à CONTRATADA, a qualquer título, além do preço dos serviços ajustados nas respectivas Ordens de Solicitação de Serviço. A CONTRATADA deverá dar ciência para seus empregados e prepostos, de que todos os direitos de propriedade relativos ao serviço prestado pertencem à CONTRATANTE, evitando, desta forma, qualquer demanda questionando a propriedade do programa/invenção/material. A CONTRATANTE poderá registrar nos órgãos competentes a obra intelectual resultante dos Serviços prestados em decorrência deste Contrato como de sua propriedade, obrigando-se a CONTRATADA a fornecer toda a documentação necessária para os registros mencionados, caso necessário. A CONTRATADA compromete-se a não infringir quaisquer direitos relativos a marcas, patentes, segredo industrial ou, ainda, direito de propriedade, de representação e autoral, responsabilizando-se perante as partes ou eventuais terceiros interessados pelas obrigações assumidas neste subitem.

---

#### 3\\. CONFIDENCIALIDADE

- **3.1.** Para os fins deste instrumento, serão consideradas como confidenciais todas e quaisquer informações fornecidas pela CONTRATANTE à CONTRATADA no passado, associadas ao objeto deste Contrato, ou a partir desta data, além de todas e quaisquer informações e dados analisados pelo CONTRATADA durante a prestação dos Serviços ("Informações Confidenciais").
- **3.2.** Todas as informações e documentos relacionados neste Contrato ou adquiridos no curso de sua execução, revelados pela CONTRATANTE, serão considerados Informações Confidenciais, sendo de exclusivo uso e/ou propriedade da CONTRATANTE, devendo ser protegidos pela CONTRATADA.
- **3.3.** A CONTRATADA obriga-se a:
  - 3.3.1. Manter confidencialidade sobre todas as Informações Confidenciais e não transmiti-las ou revelá-las a terceiros;
  - 3.3.2. Não divulgar, revelar ou dispor de qualquer uma das Informações Confidenciais, no território brasileiro ou no exterior, cumprindo-lhes adotar cautelas e precauções adequadas no sentido de impedir o uso indevido por qualquer pessoa que por qualquer razão tenha acesso às Informações Confidenciais;
  - 3.3.3. Não utilizar as Informações Confidenciais para outra finalidade que não esteja exclusivamente relacionada com a execução dos Serviços ora contratados;
  - 3.3.4. Comunicar à CONTRATANTE, de imediato e antes de qualquer divulgação, caso, por determinação judicial ou ordem de atendimento obrigatório determinado por autoridade administrativa competente, ou por autoridade governamental, tenha que revelar as Informações Confidenciais;
  - 3.3.5. Abster-se da prática de qualquer ato que possa caracterizar violação de quaisquer um dos termos e condições do presente Contrato.
- **3.4.** A CONTRATADA estará autorizada a divulgar as Informações confidenciais apenas nos seguintes casos:
  - 3.4.1. Por força de estrita e competente determinação legal, regulatória, governamental ou judicial, observado o disposto no item 3.3;
  - 3.4.2. Se as informações vierem a se tornar de conhecimento público ou tenham sido obtidas de terceiros sem que, no entanto, tenha a qualquer momento havido violação à obrigação de sigilo e confidencialidade.
- **3.5.** O fornecimento das Informações Confidenciais não implica renúncia, cessão a qualquer título, autorização de uso, alienação ou transferência de nenhum direito, já obtido ou potencial, associado a tais informações, que permanecem como propriedade da CONTRATANTE.
- **3.6.** As obrigações referentes à confidencialidade e preservação de segredo, contidas nesta cláusula, sobreviverão ao término deste Contrato por um período de 5 (cinco) anos.
- **3.7.** Caso a CONTRATADA descumpra as obrigações de confidencialidade aqui contidas, a CONTRATANTE buscará indenização através de ação judicial cabível para ressarcimento dos danos em que comprovada e efetivamente incorrer.

---

#### 4\\. OBRIGAÇÕES DA CONTRATADA

- **4.1.** Entregar um PRODUTO que atenda plenamente os requisitos presentes no documento Briefing, Prototipo aprovado e Artefato de arquitetura com regras de negócios aprovado, dentro dos prazos e condições acordadas entre as PARTES, de forma funcional e utilizável pelos clientes ou colaboradores da CONTRATANTE;
- **4.2.** Fornecer duas sessões de treinamento operacional da solução de 2h de duração para a equipe a ser definida pela CONTRATANTE;
- **4.3.** Alertar e informar a CONTRATANTE de forma imediata, por e-mail ou outro canal de comunicação que esteja sendo utilizado, toda e qualquer pendência e/ou falta por parte da mesma, que prejudique ou venha prejudicar a boa execução das tarefas da CONTRATADA.

---

#### 5\\. OBRIGAÇÕES DA CONTRATANTE

- **5.1.** Fornecer à CONTRATADA, todas as informações e elementos necessários ao entendimento e elaboração do documento Briefing e do PRODUTO objeto deste contrato, de forma detalhada, clara e que permita ao time da CONTRATADA o correto entendimento do que pretende receber, bem como, acessos e credenciais para consultas ou interações sistêmicas e às informações necessárias e pertinentes ao correto desenvolvimento do PRODUTO, em tempo razoável e no melhor esforço, para que não haja atrasos na execução das tarefas da CONTRATADA;
  - **5.1.1** Toda e qualquer comunicação que implique no impedimento do desenvolvimento do PRODUTO acarretará na suspensão de fruição do prazo da cláusula 1.2.1, até que esta seja dirimida entre a CONTRATANTE e a CONTRATADA.
  - **5.1.2** Caso os impedimentos ao desenvolvimento do PRODUTO somem, ao longo do prazo disposto na cláusula 1.2.1, mais de 30 (trinta) dias, poderá gerar uma majoração diária, a partir do 31º dia subsequente.
  - **5.1.2.1** O custo do dia excedente será equivalente ao valor total do CONTRATO, dividido pelo prazo da cláusula 1.2.1.
- **5.2.** Alertar e informar a CONTRATADA de forma imediata, por e-mail, toda e qualquer pendência e/ou falta por parte da mesma, que prejudique ou venha prejudicar a boa execução das tarefas da CONTRATANTE;
- **5.3.** O não cumprimento da cláusula 5.1 e 5.2 supracitadas, poderá incorrer em alterações de prazos e valores do presente instrumento, em benefício da CONTRATADA;
- **5.4.** Em caso de mora por parte da CONTRATANTE no tocante à responsabilidade imposta pelo item 1.1.2, justamente em não assumir a contratação da plataforma SaaS, no imediato momento após a entrega do PRODUTO, acarretará no arquivamento provisório deste, junto a plataforma SaaS, sendo certo que os custos possivelmente arcados pela CONTRATADA deverão ser adimplidos até seu exaurimento.
  - **5.4.1** O desarquivamento do PRODUTO será executado a pedido da CONTRATANTE à CONTRATADA quando requerido, desde que os custos pendentes à época do seu arquivamento estejam devidamente quitados.

---

#### 6\\. DOS VALORES

- **6.1.** Para o cumprimento das obrigações legais e contratuais listadas nas cláusulas 1 e 4, a CONTRATANTE pagará a CONTRATADA, mediante emissão de Nota Fiscal pela CONTRATADA, conforme a natureza do objeto deste Contrato, os seguintes valores:
  - **6.1.1 ${valorTotalFormatado} (${valorExtenso})**, a ser pago da seguinte forma: **${condicoesPagamento}**. O saldo residual deverá ser quitado na entrega final do PRODUTO, conforme descrito na cláusula 1;
  - **6.1.1.1.** A nota fiscal referente ao custo do PRODUTO será emitida, integralmente, após autorização de faturamento da CONTRATANTE.
  - **6.1.2.** A forma de pagamento de remuneração dos serviços prestados será feita por qualquer título admitidos no direito;
- **6.2.** Os valores mencionados na cláusula 6.1 já incluem todos os tributos, impostos e contribuições incidentes sobre os itens ofertados e/ou serviços prestados, aplicáveis segundo as alíquotas definidas pela legislação vigente.

---

#### 7\\. FORMA DE PAGAMENTO

- **7.1.** O pagamento/quitação dos valores descritos na cláusula 6.1, deverá ser feito, em conta corrente da CONTRATADA, detalhada abaixo:
  - **RAZÃO SOCIAL:** ${razaoSocialEmpresa}
  - **CNPJ:** ${cnpjEmpresa}
  - **BANCO:** ${bancoNome}
  - **AGÊNCIA:** ${bancoAgencia}
  - **CONTA CORRENTE:** ${bancoConta}
  - **CHAVE PIX:** ${chavePix}

---

#### 8\\. MULTA E ATRASOS

- **8.1** O não cumprimento dos prazos de quitação por parte da CONTRATANTE, estabelecidos na cláusula 6, incorrerá em multa de 5% (cinco por cento) sobre o valor total da parcela em atraso, mais mora diária de 0,0333%, sobre o valor da parcela em atraso, conforme a legislação vigente, além de desobrigar a CONTRATADA de toda e qualquer responsabilidade firmada no presente instrumento, após o décimo quinto dia de atraso, até que as pendências sejam plenamente quitadas.
- **8.2** O não cumprimento por parte da CONTRATADA dos prazos de entrega repactuados conforme cláusula 1.2.1.1, bem como o não cumprimento de conformidade do produto com o Protótipo e com o artefato de arquitetura com regras de negócios, aprovados previamente pela CONTRATANTE, incorrerá na penalidade de multa de 5% (cinco por cento) do saldo já quitado, mais mora diária de 0,0333%, sobre o valor total já quitado pela CONTRATANTE, até o limite de 20% do valor total do disposto na cláusula 6.

---

#### 9\\. ESCOPO NEGATIVO

- **9.1.** Considera-se fora do escopo ora dimensionado para o projeto proposto os seguintes casos de serviços, que requerem avaliação de orçamento complementar para sua execução:
  - (i) Prazos superiores aos períodos e semanas apresentados;
  - (ii) Atrasos por Parte da CONTRATANTE, após notificado pela CONTRATADA do prejuízo no envio de informações e/ou execução de tarefas que apenas esses podem realizar;
  - (iii) Solicitação de novos escopos após a validação do documento Briefing, bem como atividades que não forem usuais e pertinentes ao objeto deste Contrato;
  - (iv) atividades de criação de processos e/ou execução de regras de negócios fora do escopo contratado;
  - (v) Atuação física/presencial fora do município sede da CONTRATADA, viagens, estadias e despesas, que sejam solicitados pela CONTRATANTE;
  - (vi) Todos os casos fora do escopo do documento Briefing, devem ser tratados como novas requisições da Contratante, que podem ser solicitadas à CONTRATADA, que deverá analisar e considerar tais solicitações como uma contratação adicional, passível de ser aceita ou recusada por ambas as PARTES.

---

#### 10\\. DA ABSORÇÃO DOS PROFISSIONAIS

Fica vetada a contratação de qualquer profissional ou prestador de serviços da CONTRATADA pela CONTRATANTE, ativos ou desvinculados da CONTRATADA, dentro do prazo de até 12 (doze) meses, contados da data de assinatura do presente instrumento, sem a sua compulsória anuência, sob pena de multa de **R$ ${multaAbsorcao}**, aplicável por profissional absorvido.

---

#### 11\\. DA VIGÊNCIA

A Vigência deste Contrato e seus anexos, é de 12 (doze) meses, podendo ser renovado caso haja interesse, formal e por escrito, das partes.

---

#### 12\\. DA RESILIÇÃO E RESCISÃO

- **12.1. RESILIÇÃO:** Havendo interesse em sua resilição, a parte interessada notificará a parte contrária, por escrito, com antecedência mínima de 30 (trinta) dias, para que, de comum acordo, resolva o vínculo comercial, ressalvados os direitos até então constituídos em favor dos interessados.
  - **12.1.1** Em caso de resilição motivada por interesse da CONTRATANTE, essa incorrerá em multa de **${percentualResilicao}** do valor contratado no item 6.1, descontados os valores já quitados, além da desobrigação da CONTRATADA de entregar qualquer artefato até então por ela produzido.
  - **12.1.2** Em caso de resilição motivada por parte da CONTRATADA, essa incorrerá em multa de 100% dos valores até então quitados, relativos ao valor bruto descrito no item 6.1, e a desobrigação de entrega de todo e qualquer artefato até então por ela produzido.
- **12.2. RESCISÃO:** O presente Contrato poderá ser considerado rescindido de pleno direito nos casos abaixo listados:
  - (i) Na ocorrência de inadimplência superior a 30 (trinta) dias corridos;
  - (ii) Na ocorrência de não cumprimento de prazos por uma das PARTES, desde que a parte infratora já tenha sido notificada pelo denunciante por e-mail, e não tenha se manifestado a respeito com proposta de solução por prazo superior a 30 (trinta) dias corridos da notificação, por e-mail e/ou mensagens de texto ou áudio via whatsapp, Slack, ou outra plataforma em que a CONTRATANTE tenha estabelecido comunicação com a CONTRATADA;
  - (iii) Por extinção de qualquer das partes, decretação de concordata ou falência; decurso natural do prazo, caso não seja renovado automaticamente; denúncia manifestada expressamente pela parte interessada à parte infratora, com antecedência mínima de 10 (dez) dias, nos casos em que não for respeitada, pela parte infratora, qualquer uma das cláusulas anteriores.

---

#### 13\\. DISPOSIÇÕES GERAIS

- **13.1.** Esse ACORDO será vinculante e obrigará as PARTES, seus sucessores e cessionários autorizados.
- **13.2.** O CONTRATANTE autoriza a CONTRATADA, a título gratuito, a exibir sua marca, e menção do case fruto do objeto deste Contrato, desde que não contenha dados sensíveis do CONTRATANTE, em mídias, impressas ou digitais, tais como: sites; redes sociais; folders; outdoors; televisão; e etc., por prazo indeterminado, com intuito exclusivo de divulgação ao público em geral e/ou para uso interno da CONTRATADA, demonstrando que a CONTRATANTE é cliente e utilizou os serviços oferecidos pela CONTRATADA.
- **13.3.** As Partes reconhecem não existir qualquer vínculo de natureza trabalhista e/ou de subordinação jurídica e econômica na presente prestação de serviços entre as Partes, bem como entre eventuais prestadores de serviços terceirizados da CONTRATADA com a CONTRATANTE, assumindo a CONTRATADA integral responsabilidade de toda a mão de obra por ela contratada para execução do objeto do presente Contrato.
- **13.4.** A CONTRATADA fica responsável pelo pagamento de todos os impostos e taxas na prestação dos serviços objeto deste Contrato, forma da legislação vigente, bem como, garantir a desconstituição de qualquer vínculo trabalhista que venha a ser remotamente postulado em face da CONTRATANTE, pela equipe designado da CONTRATADA.
- **13.21.** Fica desde já eleito o Foro da Comarca de **${cidadeForo}**, Estado de **${estadoForo}**, para dirimir eventuais questões oriundas do Acordo, renunciando as PARTES a qualquer outro, por mais privilegiado que seja.

E, por estarem assim acordados, assinam o presente Contrato através de plataforma digital ou fisicamente, juntamente com suas testemunhas.

**${cidadeDataAssinatura}**

---

**${razaoSocialEmpresa}** (CONTRATADA)

---

**${clienteRazaoSocial}** (CONTRATANTE)

**TESTEMUNHAS:**

1. Nome: ________________________ | e-mail: ________________________
2. Nome: ________________________ | e-mail: ________________________

---

**ANEXO 1** *(Anexar aqui o Briefing / Escopo do Projeto validado com o cliente)*
`
}

// ─── CSS do documento ──────────────────────────────────────────────────────────
const DOCUMENT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.7;
    color: #1a1a1a;
    background: #fff;
    max-width: 820px;
    margin: 0 auto;
    padding: 48px 40px;
  }
  h1 {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 18pt;
    text-align: center;
    margin-bottom: 28px;
    color: #111;
    line-height: 1.3;
  }
  h4 {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 13pt;
    margin-top: 28px;
    margin-bottom: 12px;
    color: #111;
    page-break-after: avoid;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
  }
  ul, ol {
    margin-left: 24px;
    margin-bottom: 10px;
  }
  li {
    margin-bottom: 6px;
    text-align: justify;
  }
  li ul, li ol { margin-top: 4px; }
  strong { color: #000; }
  hr {
    border: none;
    border-top: 2px solid #333;
    margin: 32px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 10pt;
  }
  th, td {
    border: 1px solid #555;
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #f0f0f0;
    font-weight: bold;
    font-family: 'Arial', sans-serif;
    font-size: 9pt;
  }
  .toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #1a1a2e;
    color: #fff;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
  }
  .toolbar-title { font-weight: 600; font-size: 11pt; }
  .toolbar-actions { display: flex; gap: 8px; }
  .toolbar button {
    padding: 8px 18px;
    border: none;
    border-radius: 6px;
    font-size: 10pt;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .2s;
  }
  .toolbar button:hover { opacity: .85; }
  .btn-pdf { background: #e63946; color: #fff; }
  .btn-word { background: #2a6ce0; color: #fff; }
  .btn-close { background: #444; color: #fff; }
  .content-wrapper { margin-top: 60px; }
  @media print {
    .toolbar { display: none !important; }
    .content-wrapper { margin-top: 0; }
    body { padding: 0; }
    @page {
      size: A4;
      margin: 2cm 2cm;
    }
    h4 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
  }
`

// ─── Gerar HTML completo ───────────────────────────────────────────────────────
export function generateContratoHTML(data: ContratoDocumentData): string {
    const markdownTemplate = getContratoTemplate(data)
    const htmlContent = marked.parse(markdownTemplate) as string

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Contrato de Prestação de Serviços - ${data.clienteRazaoSocial || 'Vale Apps'}</title>
  <style>${DOCUMENT_CSS}</style>
</head>
<body>
  <div class="toolbar">
    <span class="toolbar-title">Contrato de Prestação de Serviços</span>
    <div class="toolbar-actions">
      <button class="btn-pdf" onclick="window.print()">Imprimir / PDF</button>
      <button class="btn-close" onclick="window.close()">Fechar</button>
    </div>
  </div>
  <div class="content-wrapper">
    ${htmlContent}
  </div>
</body>
</html>`
}

// ─── Gerar HTML para Word ──────────────────────────────────────────────────────
export function generateContratoWordHTML(data: ContratoDocumentData): string {
    const markdownTemplate = getContratoTemplate(data)
    const htmlContent = marked.parse(markdownTemplate) as string

    return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
    }
    h1 { font-size: 16pt; text-align: center; margin-bottom: 20px; }
    h4 { font-size: 13pt; margin-top: 20px; margin-bottom: 10px; }
    p { margin-bottom: 8px; text-align: justify; }
    ul, ol { margin-left: 20px; }
    li { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #000; padding: 6px 8px; font-size: 10pt; }
    th { background: #e8e8e8; font-weight: bold; }
    hr { border: none; border-top: 1px solid #000; margin: 24px 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`
}

// ─── Download Word (.doc) ──────────────────────────────────────────────────────
export function downloadContratoAsWord(data: ContratoDocumentData, filename?: string) {
    const html = generateContratoWordHTML(data)
    const nomeArquivo = filename || `Contrato_${(data.clienteRazaoSocial || 'cliente').replace(/[^a-zA-Z0-9]/g, '_')}`
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nomeArquivo}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// ─── Abrir preview / imprimir ──────────────────────────────────────────────────
export function openContratoPreview(data: ContratoDocumentData) {
    const html = generateContratoHTML(data)
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
        alert('Permita pop-ups para visualizar o contrato.')
        return
    }
    printWindow.document.write(html)
    printWindow.document.close()
}

// ─── Mapear proposta para dados do documento ───────────────────────────────────
export function mapPropostaToDocumentData(proposta: {
    nome_cliente?: string | null
    email_cliente?: string | null
    telefone_cliente?: string | null
    valor_final?: number | null
    prazo_dias?: number | null
    suporte_dias?: number | null
    forma_pagamento?: Array<{ descricao: string; percentual: number; valor: number }> | null
    nome_proejeto?: string | null
}): Partial<ContratoDocumentData> {
    const data: Partial<ContratoDocumentData> = {}

    if (proposta.nome_cliente) data.clienteRazaoSocial = proposta.nome_cliente
    if (proposta.valor_final) data.valorTotal = proposta.valor_final
    if (proposta.prazo_dias) data.prazoDias = proposta.prazo_dias
    if (proposta.suporte_dias) data.prazoGarantiaDias = proposta.suporte_dias

    // Formatar condições de pagamento a partir da forma_pagamento
    if (proposta.forma_pagamento?.length) {
        data.condicoesPagamento = proposta.forma_pagamento
            .map(fp => {
                const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fp.valor)
                return `${fp.descricao}: ${valor} (${fp.percentual}%)`
            })
            .join('; ')
    }

    return data
}

// ─── Valores padrão do formulário ──────────────────────────────────────────────
export function getDefaultDocumentData(): ContratoDocumentData {
    return {
        clienteRazaoSocial: '',
        clienteEndereco: '',
        clienteCep: '',
        clienteCnpj: '',
        prazoDias: 120,
        prazoGarantiaDias: 90,
        valorTotal: 0,
        condicoesPagamento: '',
        valorHoraSuporte: 0,
        multaAbsorcao: '100.000,00',
        percentualResilicao: '80%',
        emailSuporte: EMPRESA_DEFAULTS.emailSuporte,
        canalAtendimento: EMPRESA_DEFAULTS.canalAtendimento,
        bancoNome: EMPRESA_DEFAULTS.bancoNome,
        bancoAgencia: EMPRESA_DEFAULTS.bancoAgencia,
        bancoConta: EMPRESA_DEFAULTS.bancoConta,
        chavePix: EMPRESA_DEFAULTS.chavePix,
        cidadeForo: EMPRESA_DEFAULTS.cidadeForo,
        estadoForo: EMPRESA_DEFAULTS.estadoForo,
        dataAssinatura: '',
    }
}
