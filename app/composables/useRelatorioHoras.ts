import { EMPRESA_DEFAULTS } from '~/composables/useContratoDocument'

export interface RelatorioHorasData {
  projetoNome: string
  clienteNome: string | null
  periodoInicio: string
  periodoFim: string
  horasPrevistas: number
  horasExecutadas: number
  saldoHoras: number
  percentualConsumo: number
  horasNoPeriodo: number
  itens: RelatorioHorasItem[]
}

export interface RelatorioHorasItem {
  codigo: string
  titulo: string
  responsavel: string | null
  status: string
  horasEstimadas: number
  horasExecutadas: number
  percentualConsumo: number
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fmtHoras(value: number): string {
  return Number((value || 0).toFixed(2)).toString()
}

function fmtPercent(value: number): string {
  return Math.max(0, Math.round(value)) + '%'
}

function fmtDateBR(dateStr: string): string {
  if (!dateStr) return '--'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return parts[2] + '/' + parts[1] + '/' + parts[0]
}

function buildCSS(): string {
  return [
    '* { box-sizing: border-box; margin: 0; padding: 0; }',
    'body { font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 10pt; line-height: 1.5; color: #1a1a2e; background: #fff; max-width: 900px; margin: 0 auto; padding: 40px 36px; }',

    '.report-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 28px; }',
    '.report-header-left h1 { font-size: 20pt; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }',
    '.report-header-left .subtitle { font-size: 10pt; color: #666; }',
    '.report-header-right { text-align: right; font-size: 9pt; color: #555; }',
    '.report-header-right .empresa { font-weight: 700; font-size: 10pt; color: #1a1a2e; }',

    '.periodo-badge { display: inline-block; background: #f0f4ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px 20px; font-size: 11pt; font-weight: 600; color: #3730a3; margin-bottom: 24px; }',

    '.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }',
    '.kpi-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: center; }',
    '.kpi-card .kpi-label { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 6px; font-weight: 600; }',
    '.kpi-card .kpi-value { font-size: 18pt; font-weight: 700; color: #1a1a2e; }',
    '.kpi-card .kpi-sub { font-size: 8pt; color: #94a3b8; margin-top: 2px; }',
    '.kpi-card.accent { background: #f0f4ff; border-color: #c7d2fe; }',
    '.kpi-card.accent .kpi-value { color: #3730a3; }',
    '.kpi-card.success .kpi-value { color: #059669; }',
    '.kpi-card.danger .kpi-value { color: #dc2626; }',

    '.progress-section { margin-bottom: 28px; }',
    '.progress-bar-container { background: #e2e8f0; border-radius: 8px; height: 18px; overflow: hidden; margin-bottom: 6px; }',
    '.progress-bar-fill { height: 100%; border-radius: 8px; background: linear-gradient(90deg, #3730a3, #6366f1); }',
    '.progress-bar-fill.over { background: linear-gradient(90deg, #dc2626, #ef4444); }',
    '.progress-label { display: flex; justify-content: space-between; font-size: 8pt; color: #64748b; }',

    '.status-summary { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }',
    '.status-chip { display: inline-block; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; padding: 4px 12px; font-size: 8pt; font-weight: 600; color: #475569; }',

    '.section-title { font-size: 12pt; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }',

    'table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 9pt; }',
    'th { background: #1a1a2e; color: #fff; font-weight: 600; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; padding: 10px 10px; text-align: left; }',
    'th.num { text-align: right; }',
    'td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }',
    'td.num { text-align: right; font-variant-numeric: tabular-nums; }',
    'td.bold { font-weight: 700; }',
    '.row-even { background: #f8fafc; }',
    '.code { display: inline-block; background: #e2e8f0; border-radius: 4px; padding: 1px 6px; font-size: 7.5pt; font-weight: 600; color: #475569; margin-right: 4px; }',
    '.status-badge { display: inline-block; background: #f0f4ff; border-radius: 4px; padding: 2px 8px; font-size: 8pt; font-weight: 600; color: #3730a3; }',

    '.totals-row { background: #f0f4ff; font-weight: 700; }',
    '.totals-row td { border-bottom: 2px solid #1a1a2e; padding: 10px; }',

    '.report-footer { border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }',

    '.toolbar { position: fixed; top: 0; left: 0; right: 0; background: #1a1a2e; color: #fff; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,.3); font-family: "Segoe UI", Arial, sans-serif; font-size: 10pt; }',
    '.toolbar-title { font-weight: 600; font-size: 11pt; }',
    '.toolbar-actions { display: flex; gap: 8px; }',
    '.toolbar button { padding: 8px 18px; border: none; border-radius: 6px; font-size: 10pt; font-weight: 600; cursor: pointer; transition: opacity .2s; }',
    '.toolbar button:hover { opacity: .85; }',
    '.btn-pdf { background: #e63946; color: #fff; }',
    '.btn-close { background: #444; color: #fff; }',
    '.content-wrapper { margin-top: 60px; }',

    '@media print { .toolbar { display: none !important; } .content-wrapper { margin-top: 0; } body { padding: 0; } @page { size: A4 landscape; margin: 1.5cm; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } .kpi-grid { page-break-inside: avoid; } .progress-section { page-break-inside: avoid; } }',
  ].join('\n')
}

export function generateRelatorioHorasHTML(data: RelatorioHorasData): string {
  const periodoLabel = fmtDateBR(data.periodoInicio) + ' a ' + fmtDateBR(data.periodoFim)
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date())

  // Status summary
  const statusCount: Record<string, number> = {}
  for (const item of data.itens) {
    statusCount[item.status] = (statusCount[item.status] || 0) + 1
  }
  const statusChips = Object.entries(statusCount)
    .map(([label, count]) => '<span class="status-chip">' + esc(label) + ': ' + count + '</span>')
    .join('')

  // Table rows
  const totalEstimadas = data.itens.reduce((a, i) => a + i.horasEstimadas, 0)
  const rows = data.itens.map((item, idx) => {
    const cls = idx % 2 === 0 ? ' class="row-even"' : ''
    return '<tr' + cls + '>'
      + '<td><span class="code">' + esc(item.codigo) + '</span> ' + esc(item.titulo) + '</td>'
      + '<td>' + esc(item.responsavel || '-') + '</td>'
      + '<td><span class="status-badge">' + esc(item.status) + '</span></td>'
      + '<td class="num">' + fmtHoras(item.horasEstimadas) + 'h</td>'
      + '<td class="num bold">' + fmtHoras(item.horasExecutadas) + 'h</td>'
      + '<td class="num">' + fmtPercent(item.percentualConsumo) + '</td>'
      + '</tr>'
  }).join('\n')

  const totalPercentConsumo = totalEstimadas > 0
    ? (data.horasNoPeriodo / totalEstimadas) * 100
    : 0

  const totalsRow = '<tr class="totals-row">'
    + '<td colspan="3"><strong>TOTAL</strong></td>'
    + '<td class="num">' + fmtHoras(totalEstimadas) + 'h</td>'
    + '<td class="num">' + fmtHoras(data.horasNoPeriodo) + 'h</td>'
    + '<td class="num">' + fmtPercent(totalPercentConsumo) + '</td>'
    + '</tr>'

  const saldoClass = data.saldoHoras < 0 ? 'danger' : 'success'
  const saldoSub = data.saldoHoras >= 0 ? 'Disponivel' : 'Excedido'
  const progressClass = data.percentualConsumo > 100 ? 'over' : ''
  const progressWidth = Math.min(data.percentualConsumo, 100)

  const subtitleParts = [esc(data.projetoNome)]
  if (data.clienteNome) subtitleParts.push(esc(data.clienteNome))

  const parts: string[] = []

  // DOCTYPE + head
  parts.push('<!DOCTYPE html>')
  parts.push('<html lang="pt-BR">')
  parts.push('<head>')
  parts.push('<meta charset="UTF-8"/>')
  parts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
  parts.push('<title>Relatorio de Horas - ' + esc(data.projetoNome) + '</title>')
  parts.push('<style>' + buildCSS() + '</style>')
  parts.push('</head>')
  parts.push('<body>')

  // Toolbar
  parts.push('<div class="toolbar">')
  parts.push('<span class="toolbar-title">Relatorio de Horas - ' + esc(data.projetoNome) + '</span>')
  parts.push('<div class="toolbar-actions">')
  parts.push('<button class="btn-pdf" onclick="window.print()">Imprimir / Salvar PDF</button>')
  parts.push('<button class="btn-close" onclick="window.close()">Fechar</button>')
  parts.push('</div></div>')

  // Content
  parts.push('<div class="content-wrapper">')

  // Header
  parts.push('<div class="report-header">')
  parts.push('<div class="report-header-left">')
  parts.push('<h1>Relatorio de Horas</h1>')
  parts.push('<div class="subtitle">' + subtitleParts.join(' &mdash; ') + '</div>')
  parts.push('</div>')
  parts.push('<div class="report-header-right">')
  parts.push('<div class="empresa">' + esc(EMPRESA_DEFAULTS.razaoSocial) + '</div>')
  parts.push('<div>CNPJ: ' + EMPRESA_DEFAULTS.cnpj + '</div>')
  parts.push('<div>Gerado em: ' + geradoEm + '</div>')
  parts.push('</div></div>')

  // Periodo
  parts.push('<div class="periodo-badge">Periodo: ' + periodoLabel + '</div>')

  // KPIs
  parts.push('<div class="kpi-grid">')
  parts.push('<div class="kpi-card accent"><div class="kpi-label">Horas Previstas</div><div class="kpi-value">' + fmtHoras(data.horasPrevistas) + 'h</div><div class="kpi-sub">Contratadas no projeto</div></div>')
  parts.push('<div class="kpi-card"><div class="kpi-label">Horas Executadas</div><div class="kpi-value">' + fmtHoras(data.horasExecutadas) + 'h</div><div class="kpi-sub">Total acumulado</div></div>')
  parts.push('<div class="kpi-card ' + saldoClass + '"><div class="kpi-label">Saldo de Horas</div><div class="kpi-value">' + fmtHoras(data.saldoHoras) + 'h</div><div class="kpi-sub">' + saldoSub + '</div></div>')
  parts.push('<div class="kpi-card accent"><div class="kpi-label">Horas no Periodo</div><div class="kpi-value">' + fmtHoras(data.horasNoPeriodo) + 'h</div><div class="kpi-sub">' + data.itens.length + ' tarefa(s) ativa(s)</div></div>')
  parts.push('</div>')

  // Progress bar
  parts.push('<div class="progress-section">')
  parts.push('<h3 class="section-title">Consumo de Horas do Projeto</h3>')
  parts.push('<div class="progress-bar-container"><div class="progress-bar-fill ' + progressClass + '" style="width: ' + progressWidth + '%"></div></div>')
  parts.push('<div class="progress-label">')
  parts.push('<span>' + fmtHoras(data.horasExecutadas) + 'h executadas</span>')
  parts.push('<span>' + data.percentualConsumo + '% consumido</span>')
  parts.push('<span>' + fmtHoras(data.horasPrevistas) + 'h previstas</span>')
  parts.push('</div></div>')

  // Status chips
  if (statusChips) {
    parts.push('<div class="status-summary">' + statusChips + '</div>')
  }

  // Table
  parts.push('<h3 class="section-title">Detalhamento por Tarefa</h3>')
  if (data.itens.length) {
    parts.push('<table><thead><tr>')
    parts.push('<th style="width:35%">Tarefa</th><th>Responsavel</th><th>Status</th><th class="num">Estimadas</th><th class="num">Executadas</th><th class="num">Consumo</th>')
    parts.push('</tr></thead><tbody>')
    parts.push(rows)
    parts.push(totalsRow)
    parts.push('</tbody></table>')
  } else {
    parts.push('<p style="color:#94a3b8;text-align:center;padding:24px;">Nenhuma tarefa com atividade no periodo selecionado.</p>')
  }

  // Footer
  parts.push('<div class="report-footer">')
  parts.push('<span>' + esc(EMPRESA_DEFAULTS.razaoSocial) + ' - CNPJ: ' + EMPRESA_DEFAULTS.cnpj + '</span>')
  parts.push('<span>Documento gerado automaticamente em ' + geradoEm + '</span>')
  parts.push('</div>')

  parts.push('</div>') // content-wrapper
  parts.push('</body></html>')

  return parts.join('\n')
}

export function openRelatorioHoras(data: RelatorioHorasData) {
  const html = generateRelatorioHorasHTML(data)
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Permita pop-ups para visualizar o relatorio.')
    return
  }
  printWindow.document.write(html)
  printWindow.document.close()
}
