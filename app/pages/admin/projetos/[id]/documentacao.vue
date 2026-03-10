<template>
  <section class="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
    <div class="grid min-h-[70vh] grid-cols-1 lg:grid-cols-[280px,1fr]">
      <aside class="border-b border-zinc-800 bg-zinc-950/90 lg:border-b-0 lg:border-r">
        <div class="border-b border-zinc-800 px-4 py-4">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Páginas</p>
              <p class="mt-1 text-sm text-zinc-300">{{ documentosOrdenados.length }} itens</p>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
                title="Nova pasta"
                @click="criarRegistro('folder')"
              >
                <PhFolderSimplePlus :size="16" />
              </button>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
                title="Nova página"
                @click="criarRegistro('page')"
              >
                <PhFilePlus :size="16" />
              </button>
            </div>
          </div>

          <label class="relative block">
            <PhMagnifyingGlass :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              v-model="busca"
              type="text"
              placeholder="Buscar páginas..."
              class="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-9 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
            >
          </label>
        </div>

        <div class="max-h-[65vh] overflow-y-auto p-3 custom-scrollbar">
          <div v-if="pending" class="px-3 py-8 text-center text-sm text-zinc-500">
            Carregando documentação...
          </div>

          <div v-else-if="documentosLista.length" class="space-y-1.5">
            <div
              v-for="item in documentosLista"
              :key="item.doc.id"
              class="flex items-center gap-1"
              :style="{ paddingLeft: `${item.depth * 16}px` }"
            >
              <button
                v-if="item.childCount"
                type="button"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-100"
                :aria-expanded="item.expanded"
                :title="item.expanded ? 'Minimizar pasta' : 'Expandir pasta'"
                @click="togglePasta(item.doc.id)"
              >
                <PhCaretRight
                  :size="14"
                  class="transition-transform duration-150"
                  :class="item.expanded ? 'rotate-90' : ''"
                />
              </button>
              <span v-else class="block h-8 w-8 shrink-0" />

              <button
                type="button"
                class="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
                :class="item.doc.id === documentoSelecionadoId
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100'"
                @click="selecionarDocumento(item.doc.id)"
              >
                <component :is="getKind(item.doc) === 'folder' ? PhFolder : PhFileText" :size="16" class="shrink-0" />
                <span class="truncate">{{ getDocumentTitle(item.doc) }}</span>
              </button>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center px-4 py-10 text-center text-sm text-zinc-500">
            <PhFiles :size="40" class="mb-3 opacity-50" />
            <p v-if="busca">Nenhum resultado encontrado.</p>
            <template v-else>
              <p>Nenhum documento criado.</p>
              <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
                  @click="criarRegistro('folder')"
                >
                  Nova pasta
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-white"
                  @click="criarRegistro('page')"
                >
                  Criar primeira página
                </button>
              </div>
            </template>
          </div>
        </div>
      </aside>

      <div class="flex min-h-[70vh] flex-col">
        <div v-if="erroOperacao" class="border-b border-red-500/20 bg-red-500/10 px-6 py-4 text-sm text-red-300">
          {{ erroOperacao }}
        </div>

        <template v-if="documentoSelecionado">
          <header class="border-b border-zinc-800 px-6 py-5">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="mb-2 flex items-center gap-2 text-xs text-zinc-500">
                  <span>{{ getKind(documentoSelecionado) === 'folder' ? 'Pasta do projeto' : 'Página do projeto' }}</span>
                  <span>•</span>
                  <span>{{ salvando ? 'Salvando...' : dirty ? 'Alterações pendentes' : 'Sem alterações pendentes' }}</span>
                </div>

                <input
                  v-model="draftTitulo"
                  type="text"
                  class="w-full bg-transparent text-3xl font-semibold tracking-[-0.03em] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                  :placeholder="getKind(documentoSelecionado) === 'folder' ? 'Nova pasta' : 'Nova página'"
                  @input="dirty = true"
                >
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 hover:border-red-400/50 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="salvando"
                  @click="excluirDocumentoSelecionado"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
                  @click="criarRegistro('page')"
                >
                  Nova página
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="salvando || !dirty"
                  @click="salvarDocumentoSelecionado"
                >
                  {{ salvando ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </div>
          </header>

          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div v-if="getKind(documentoSelecionado) === 'folder'" class="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6">
              <div class="flex flex-wrap items-start justify-between gap-6">
                <div class="max-w-2xl">
                  <div class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-500">
                    <PhFolderOpen :size="28" />
                  </div>
                  <h2 class="text-2xl font-semibold text-zinc-100">Conteúdo desta pasta</h2>
                  <p class="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
                    Veja um resumo rápido dos documentos pertencentes a esta pasta e crie novos itens quando precisar expandir a documentação.
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <div class="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Itens nesta pasta</p>
                    <p class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-100">{{ documentosDaPastaSelecionada.length }}</p>
                  </div>
                  <div class="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Última atualização</p>
                    <p class="mt-2 text-sm font-medium text-zinc-200">{{ formatarResumoData(ultimaAtualizacaoPastaSelecionada) }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
                  @click="criarRegistro('folder')"
                >
                  Nova pasta
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
                  @click="criarRegistro('page')"
                >
                  Nova página
                </button>
              </div>

              <div v-if="documentosDaPastaSelecionada.length" class="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <button
                  v-for="doc in documentosDaPastaSelecionada"
                  :key="doc.id"
                  type="button"
                  class="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-950"
                  @click="selecionarDocumento(doc.id)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/70 text-zinc-400">
                      <component :is="getKind(doc) === 'folder' ? PhFolder : PhFileText" :size="18" />
                    </div>
                    <span class="rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {{ getKind(doc) === 'folder' ? 'Pasta' : 'Página' }}
                    </span>
                  </div>

                  <h3 class="mt-4 line-clamp-2 text-base font-semibold text-zinc-100">{{ getDocumentTitle(doc) }}</h3>
                  <p class="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">{{ getPreviewDocumento(doc) }}</p>
                  <p class="mt-4 text-xs text-zinc-600">Atualizado em {{ formatarResumoData(doc.updated_at) }}</p>
                </button>
              </div>

              <div v-else class="mt-8 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/45 px-6 py-10 text-center">
                <p class="text-sm font-medium text-zinc-300">Esta pasta ainda não possui documentos internos.</p>
                <p class="mt-2 text-sm leading-6 text-zinc-500">
                  Crie uma página ou subpasta para começar a organizar o conteúdo relacionado a este assunto.
                </p>
              </div>
            </div>

            <div v-else class="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-4">
              <ClientOnly>
                <AdminRichTextEditor v-model="draftConteudo" />
                <template #fallback>
                  <div class="min-h-[320px] rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-500">
                    Inicializando editor...
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </template>

        <div v-else class="flex h-full min-h-[70vh] flex-col items-center justify-center px-8 text-center text-zinc-500">
          <div class="max-w-2xl rounded-[28px] border border-zinc-800 bg-zinc-900/40 px-8 py-10 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-zinc-800/80 text-zinc-300">
              <PhBookOpenText :size="36" />
            </div>
            <h2 class="text-3xl font-semibold tracking-[-0.04em] text-zinc-100">Documentação do Projeto</h2>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Crie páginas para organizar documentação comercial, técnica e operacional deste projeto.
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                class="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
                @click="criarRegistro('folder')"
              >
                Nova pasta
              </button>
              <button
                type="button"
                class="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
                @click="criarRegistro('page')"
              >
                Nova página
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  PhBookOpenText,
  PhCaretRight,
  PhFilePlus,
  PhFiles,
  PhFileText,
  PhFolder,
  PhFolderOpen,
  PhFolderSimplePlus,
  PhMagnifyingGlass
} from '@phosphor-icons/vue'
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const client = useSupabase()
const { showAlert, showConfirm } = useUiFeedback()

type ProjetoDocKind = 'page' | 'folder'

type ProjetoDocRecord = {
  id: number
  projeto_id: number
  parent_id: number | null
  titulo: string
  slug: string | null
  conteudo_json: Record<string, any> | null
  conteudo_markdown: string | null
  ordem: number | null
  created_at: string
  updated_at: string
}

type ProjetoDocTreeNode = {
  doc: ProjetoDocRecord
  children: ProjetoDocTreeNode[]
}

type DocumentoListaItem = {
  doc: ProjetoDocRecord
  depth: number
  childCount: number
  expanded: boolean
}

const busca = ref('')
const erroOperacao = ref('')
const documentoSelecionadoId = ref<number | null>(null)
const draftTitulo = ref('')
const draftConteudo = ref('<p></p>')
const dirty = ref(false)
const salvando = ref(false)
const pastasExpandidas = ref<number[]>([])

const { data: documentosData, pending } = await useAsyncData(
  `docs-projeto-${props.projeto.id}`,
  async () => {
    if (!client) {
      erroOperacao.value = 'Supabase não está configurado neste ambiente.'
      showAlert(erroOperacao.value, {
        title: 'Documentação',
        type: 'error'
      })
      return []
    }

    const { data, error } = await client
      .from('projetos_docs')
      .select('*')
      .eq('projeto_id', props.projeto.id)
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      erroOperacao.value = `Não foi possível carregar a documentação: ${error.message}`
      showAlert(erroOperacao.value, {
        title: 'Falha ao carregar',
        type: 'error'
      })
      return []
    }

    erroOperacao.value = ''
    return (data || []) as ProjetoDocRecord[]
  },
  {
    server: false,
    default: () => []
  }
)

const documentos = computed(() => documentosData.value || [])

const documentosOrdenados = computed(() => {
  return [...documentos.value].sort((left, right) => {
    const kindDiff = Number(getKind(left) === 'page') - Number(getKind(right) === 'page')
    if (kindDiff !== 0) return kindDiff
    const ordemDiff = (left.ordem ?? 0) - (right.ordem ?? 0)
    if (ordemDiff !== 0) return ordemDiff
    return left.titulo.localeCompare(right.titulo, 'pt-BR')
  })
})

const documentosDaPastaSelecionada = computed(() => {
  if (!documentoSelecionado.value || getKind(documentoSelecionado.value) !== 'folder') {
    return []
  }

  return documentosOrdenados.value.filter(doc => doc.parent_id === documentoSelecionado.value?.id)
})

const ultimaAtualizacaoPastaSelecionada = computed(() => {
  if (!documentosDaPastaSelecionada.value.length) return null

  return documentosDaPastaSelecionada.value.reduce<string | null>((latest, doc) => {
    if (!latest) return doc.updated_at
    return new Date(doc.updated_at).getTime() > new Date(latest).getTime() ? doc.updated_at : latest
  }, null)
})

const documentosArvore = computed<ProjetoDocTreeNode[]>(() => {
  const nodes = new Map<number, ProjetoDocTreeNode>()
  const roots: ProjetoDocTreeNode[] = []

  for (const doc of documentosOrdenados.value) {
    nodes.set(doc.id, { doc, children: [] })
  }

  for (const doc of documentosOrdenados.value) {
    const node = nodes.get(doc.id)
    if (!node) continue

    if (doc.parent_id != null) {
      const parent = nodes.get(doc.parent_id)
      if (parent) {
        parent.children.push(node)
        continue
      }
    }

    roots.push(node)
  }

  return roots
})

const documentosArvoreFiltrada = computed<ProjetoDocTreeNode[]>(() => {
  const termo = busca.value.trim().toLocaleLowerCase('pt-BR')
  if (!termo) return documentosArvore.value

  const filterNodes = (nodes: ProjetoDocTreeNode[]): ProjetoDocTreeNode[] => {
    return nodes.flatMap((node) => {
      const children = filterNodes(node.children)
      const matches = getDocumentTitle(node.doc).toLocaleLowerCase('pt-BR').includes(termo)

      if (!matches && !children.length) {
        return []
      }

      return [{ ...node, children }]
    })
  }

  return filterNodes(documentosArvore.value)
})

const documentosLista = computed<DocumentoListaItem[]>(() => {
  const forceExpanded = Boolean(busca.value.trim())
  const expandedSet = new Set(pastasExpandidas.value)
  const items: DocumentoListaItem[] = []

  const walk = (nodes: ProjetoDocTreeNode[], depth = 0) => {
    for (const node of nodes) {
      const expanded = forceExpanded || expandedSet.has(node.doc.id)

      items.push({
        doc: node.doc,
        depth,
        childCount: node.children.length,
        expanded
      })

      if (node.children.length && expanded) {
        walk(node.children, depth + 1)
      }
    }
  }

  walk(documentosArvoreFiltrada.value)
  return items
})

const documentoSelecionado = computed(() => {
  if (documentoSelecionadoId.value == null) return null
  return documentos.value.find(doc => doc.id === documentoSelecionadoId.value) || null
})

watch(documentos, (docs, previousDocs) => {
  const nextFolderIds = docs.filter(doc => getKind(doc) === 'folder').map(doc => doc.id)
  const previousFolderIds = new Set((previousDocs || []).filter(doc => getKind(doc) === 'folder').map(doc => doc.id))
  const expandedSet = new Set(pastasExpandidas.value.filter(id => nextFolderIds.includes(id)))

  if (!previousDocs?.length && nextFolderIds.length && !pastasExpandidas.value.length) {
    nextFolderIds.forEach(id => expandedSet.add(id))
  }

  nextFolderIds.forEach((id) => {
    if (!previousFolderIds.has(id)) {
      expandedSet.add(id)
    }
  })

  pastasExpandidas.value = [...expandedSet]

  if (!docs.length) {
    documentoSelecionadoId.value = null
    draftTitulo.value = ''
    draftConteudo.value = '<p></p>'
    dirty.value = false
    return
  }

  if (documentoSelecionadoId.value && docs.some(doc => doc.id === documentoSelecionadoId.value)) {
    return
  }

  selecionarDocumento(docs[0].id)
}, { immediate: true })

function getKind(doc: ProjetoDocRecord): ProjetoDocKind {
  return doc.conteudo_json?.kind === 'folder' ? 'folder' : 'page'
}

function getDocumentTitle(doc: ProjetoDocRecord) {
  return doc.titulo || (getKind(doc) === 'folder' ? 'Nova pasta' : 'Nova página')
}

function getPreviewDocumento(doc: ProjetoDocRecord) {
  if (getKind(doc) === 'folder') {
    const totalInternos = documentos.value.filter(item => item.parent_id === doc.id).length
    return totalInternos
      ? `${totalInternos} item(ns) organizados dentro desta pasta.`
      : 'Pasta pronta para receber páginas e subpastas.'
  }

  const plainText = String(doc.conteudo_markdown || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return plainText || 'Página criada, aguardando conteúdo descritivo.'
}

function formatarResumoData(value: string | null) {
  if (!value) return '--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'

  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()

  if (sameDay) {
    return `Hoje, ${new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)}`
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function slugify(value: string) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function selecionarDocumento(id: number) {
  const doc = documentos.value.find(item => item.id === id)
  if (!doc) return

  expandirAscendentes(doc.id)
  documentoSelecionadoId.value = doc.id
  draftTitulo.value = doc.titulo
  draftConteudo.value = doc.conteudo_markdown || '<p></p>'
  dirty.value = false
  erroOperacao.value = ''
}

function getParentIdParaCriacao() {
  if (!documentoSelecionado.value) return null
  return getKind(documentoSelecionado.value) === 'folder'
    ? documentoSelecionado.value.id
    : (documentoSelecionado.value.parent_id ?? null)
}

function expandirAscendentes(id: number) {
  const expandedSet = new Set(pastasExpandidas.value)
  let current = documentos.value.find(doc => doc.id === id) || null

  while (current?.parent_id != null) {
    expandedSet.add(current.parent_id)
    current = documentos.value.find(doc => doc.id === current?.parent_id) || null
  }

  pastasExpandidas.value = [...expandedSet]
}

function togglePasta(id: number) {
  const expandedSet = new Set(pastasExpandidas.value)
  if (expandedSet.has(id)) {
    expandedSet.delete(id)
  } else {
    expandedSet.add(id)
  }
  pastasExpandidas.value = [...expandedSet]
}

function getProximaOrdem(parentId: number | null) {
  const siblings = documentos.value.filter(doc => (doc.parent_id ?? null) === parentId)
  return siblings.length ? Math.max(...siblings.map(doc => doc.ordem ?? 0)) + 1 : 0
}

async function criarRegistro(kind: ProjetoDocKind) {
  if (!client) {
    erroOperacao.value = 'Supabase não está configurado neste ambiente.'
    showAlert(erroOperacao.value, {
      title: 'Documentação',
      type: 'error'
    })
    return
  }

  erroOperacao.value = ''

  const parentId = getParentIdParaCriacao()
  const titulo = kind === 'folder' ? 'Nova pasta' : 'Nova página'
  const payload = {
    projeto_id: props.projeto.id,
    parent_id: parentId,
    titulo,
    slug: slugify(titulo),
    ordem: getProximaOrdem(parentId),
    conteudo_markdown: kind === 'page' ? '<p></p>' : null,
    conteudo_json: {
      kind,
      content: kind === 'page' ? { type: 'doc', content: [{ type: 'paragraph' }] } : null
    }
  }

  const { data, error } = await client
    .from('projetos_docs')
    .insert(payload)
    .select('*')
    .single()

  if (error || !data) {
    erroOperacao.value = `Não foi possível criar ${kind === 'folder' ? 'a pasta' : 'a página'}: ${error?.message || 'erro desconhecido'}`
    showAlert(erroOperacao.value, {
      title: 'Falha ao criar',
      type: 'error'
    })
    return
  }

  documentosData.value = [...documentos.value, data as ProjetoDocRecord]
  selecionarDocumento(data.id)
  showAlert(`${kind === 'folder' ? 'Pasta' : 'Página'} criada com sucesso.`, {
    title: 'Documentação',
    type: 'success'
  })
}

async function salvarDocumentoSelecionado() {
  if (!client || !documentoSelecionado.value) return
  if (!dirty.value) return

  salvando.value = true
  erroOperacao.value = ''

  const titulo = draftTitulo.value.trim() || (getKind(documentoSelecionado.value) === 'folder' ? 'Nova pasta' : 'Nova página')
  const kind = getKind(documentoSelecionado.value)

  const { data, error } = await client
    .from('projetos_docs')
    .update({
      titulo,
      slug: slugify(titulo),
      conteudo_markdown: kind === 'page' ? draftConteudo.value : null,
      conteudo_json: {
        ...(documentoSelecionado.value.conteudo_json || {}),
        kind,
        content: kind === 'page' ? documentoSelecionado.value.conteudo_json?.content ?? null : null
      }
    })
    .eq('id', documentoSelecionado.value.id)
    .select('*')
    .single()

  salvando.value = false

  if (error || !data) {
    erroOperacao.value = `Não foi possível salvar este documento: ${error?.message || 'erro desconhecido'}`
    showAlert(erroOperacao.value, {
      title: 'Falha ao salvar',
      type: 'error'
    })
    return
  }

  documentosData.value = documentos.value.map(doc => doc.id === data.id ? data as ProjetoDocRecord : doc)
  selecionarDocumento(data.id)
  showAlert('Documento salvo com sucesso.', {
    title: 'Documentação',
    type: 'success'
  })
}

function collectDescendantIds(parentId: number): number[] {
  const children = documentos.value.filter(doc => doc.parent_id === parentId)
  const descendantIds = children.flatMap(child => collectDescendantIds(child.id))
  return [parentId, ...descendantIds]
}

async function excluirDocumentoSelecionado() {
  if (!client || !documentoSelecionado.value || salvando.value) return

  const selecionado = documentoSelecionado.value
  const idsParaExcluir = collectDescendantIds(selecionado.id)
  const totalRelacionados = idsParaExcluir.length - 1
  const ehPasta = getKind(selecionado) === 'folder'

  const mensagem = ehPasta && totalRelacionados > 0
    ? `Excluir esta pasta e ${totalRelacionados} item(ns) interno(s)?`
    : `Excluir ${ehPasta ? 'esta pasta' : 'esta página'}?`

  const confirmou = await showConfirm({
    title: ehPasta ? 'Excluir pasta' : 'Excluir página',
    message: mensagem,
    confirmLabel: ehPasta ? 'Excluir pasta' : 'Excluir página',
    cancelLabel: 'Cancelar',
    danger: true,
  })

  if (!confirmou) {
    return
  }

  salvando.value = true
  erroOperacao.value = ''

  const { error } = await client
    .from('projetos_docs')
    .delete()
    .in('id', idsParaExcluir)

  salvando.value = false

  if (error) {
    erroOperacao.value = `Não foi possível excluir este documento: ${error.message}`
    showAlert(erroOperacao.value, {
      title: 'Falha ao excluir',
      type: 'error'
    })
    return
  }

  const restantes = documentos.value.filter(doc => !idsParaExcluir.includes(doc.id))
  documentosData.value = restantes

  if (!restantes.length) {
    documentoSelecionadoId.value = null
    draftTitulo.value = ''
    draftConteudo.value = '<p></p>'
    dirty.value = false
    return
  }

  const proximo = restantes.find(doc => doc.parent_id === selecionado.parent_id) || restantes[0]
  selecionarDocumento(proximo.id)
  showAlert(`${ehPasta ? 'Pasta' : 'Página'} excluída com sucesso.`, {
    title: 'Documentação',
    type: 'success'
  })
}

watch([draftTitulo, draftConteudo], () => {
  if (!documentoSelecionado.value) return

  const tituloMudou = draftTitulo.value !== documentoSelecionado.value.titulo
  const conteudoMudou = draftConteudo.value !== (documentoSelecionado.value.conteudo_markdown || '<p></p>')
  dirty.value = tituloMudou || (getKind(documentoSelecionado.value) === 'page' && conteudoMudou)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(39 39 42);
}
</style>
