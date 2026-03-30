<template>
  <div class="mt-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm transition-colors"
          :class="escala === 'dia' ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'"
          @click="escala = 'dia'"
        >
          Dia
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm transition-colors"
          :class="escala === 'semana' ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'"
          @click="escala = 'semana'"
        >
          Semana
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="p-1.5 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Ir para hoje"
          @click="scrollParaHoje"
        >
          <Icon name="ph:calendar-blank-duotone" class="w-4 h-4" />
        </button>
        <span class="text-xs text-zinc-500">
          {{ labelPeriodo }}
        </span>
      </div>
    </div>

    <!-- Gantt -->
    <div
      v-if="tarefasComDatas.length"
      class="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900"
    >
      <div class="flex">
        <!-- Coluna fixa: tarefas -->
        <div class="flex-shrink-0 border-r border-zinc-800" :style="{ width: SIDEBAR_WIDTH + 'px' }">
          <!-- Header da sidebar -->
          <div class="h-[52px] border-b border-zinc-800 px-4 flex items-center">
            <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Tarefa</span>
          </div>
          <!-- Linhas das tarefas -->
          <div
            v-for="tarefa in tarefasComDatas"
            :key="'sidebar-' + tarefa.id"
            class="h-[40px] border-b border-zinc-800/50 px-4 flex items-center gap-2 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
            @click="abrirTarefa(tarefa.id)"
          >
            <span
              class="w-2 h-2 rounded-full flex-shrink-0"
              :class="corStatus(tarefa.status)"
            />
            <span class="text-sm text-zinc-200 truncate flex-1 hover:text-white" :title="tarefa.titulo">
              {{ tarefa.titulo }}
            </span>
            <img
              v-if="getResponsavelFotoUrl(tarefa)"
              :src="getResponsavelFotoUrl(tarefa) || ''"
              :alt="tarefa.responsavel_texto || 'Responsavel'"
              class="h-5 w-5 rounded-full object-cover flex-shrink-0 overflow-hidden opacity-0 transition-opacity group-hover:opacity-100"
            >
            <span
              v-else-if="tarefa.responsavel_texto"
              v-if="tarefa.responsavel_texto"
              class="text-[10px] font-medium text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {{ iniciais(tarefa.responsavel_texto) }}
            </span>
          </div>
        </div>

        <!-- Área do gráfico com scroll horizontal -->
        <div ref="timelineRef" class="flex-1 overflow-x-auto scrollbar-thin">
          <!-- Header do timeline -->
          <div :style="{ width: timelineWidth + 'px' }">
            <!-- Meses / Semanas -->
            <div class="h-[26px] border-b border-zinc-800/50 flex">
              <div
                v-for="(grupo, gIdx) in headerGrupos"
                :key="'g-' + gIdx"
                class="border-r border-zinc-800/30 flex items-center justify-center"
                :style="{ width: grupo.largura + 'px' }"
              >
                <span class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{{ grupo.label }}</span>
              </div>
            </div>
            <!-- Dias / Sub-headers -->
            <div class="h-[26px] border-b border-zinc-800 flex">
              <div
                v-for="(col, idx) in colunas"
                :key="'col-' + idx"
                class="border-r border-zinc-800/20 flex items-center justify-center"
                :class="{
                  'bg-zinc-800/20': col.isWeekend,
                  'bg-blue-500/5': col.isToday
                }"
                :style="{ width: COL_WIDTH + 'px' }"
              >
                <span class="text-[10px] text-zinc-600" :class="{ 'text-blue-400/70': col.isToday }">
                  {{ col.label }}
                </span>
              </div>
            </div>

            <!-- Linhas das barras -->
            <div class="relative">
              <!-- Grid vertical (fundo) -->
              <div class="absolute inset-0 flex pointer-events-none">
                <div
                  v-for="(col, idx) in colunas"
                  :key="'bg-' + idx"
                  class="border-r border-zinc-800/10 h-full"
                  :class="{
                    'bg-zinc-800/10': col.isWeekend,
                    'bg-blue-500/5': col.isToday
                  }"
                  :style="{ width: COL_WIDTH + 'px', flexShrink: 0 }"
                />
              </div>

              <!-- Linha de hoje -->
              <div
                v-if="todayOffset !== null"
                class="absolute top-0 bottom-0 w-px bg-blue-500/40 z-10 pointer-events-none"
                :style="{ left: todayOffset + 'px' }"
              />

              <!-- Barras das tarefas -->
              <div
                v-for="tarefa in tarefasComDatas"
                :key="'bar-' + tarefa.id"
                class="h-[40px] border-b border-zinc-800/50 relative flex items-center"
              >
                <div
                  class="absolute h-[22px] rounded-md flex items-center text-[10px] font-medium select-none transition-colors"
                  :class="[
                    corBarra(tarefa.status),
                    drag.tarefaId === tarefa.id ? 'brightness-125 z-20 shadow-lg shadow-black/30' : 'hover:brightness-110',
                    drag.tarefaId === tarefa.id ? '' : 'cursor-grab'
                  ]"
                  :style="barraStyleComDrag(tarefa)"
                  :title="barraTooltip(tarefa)"
                  @mousedown.prevent="onBarMouseDown($event, tarefa, 'move')"
                >
                  <!-- Handle esquerdo (resize inicio) -->
                  <div
                    class="absolute left-0 top-0 bottom-0 w-[6px] cursor-ew-resize z-10 rounded-l-md hover:bg-white/10"
                    @mousedown.prevent.stop="onBarMouseDown($event, tarefa, 'resize-start')"
                  />
                  <!-- Conteúdo -->
                  <span v-if="barraLarguraComDrag(tarefa) > 60" class="truncate px-2 text-white/90 pointer-events-none w-full text-center">
                    {{ tarefa.titulo }}
                  </span>
                  <!-- Handle direito (resize fim) -->
                  <div
                    class="absolute right-0 top-0 bottom-0 w-[6px] cursor-ew-resize z-10 rounded-r-md hover:bg-white/10"
                    @mousedown.prevent.stop="onBarMouseDown($event, tarefa, 'resize-end')"
                  />
                </div>

                <!-- Tooltip flutuante durante drag -->
                <div
                  v-if="drag.tarefaId === tarefa.id"
                  class="absolute z-30 -top-7 px-2 py-0.5 rounded bg-zinc-700 text-[10px] text-zinc-200 whitespace-nowrap pointer-events-none shadow-lg"
                  :style="{ left: dragTooltipLeft(tarefa) + 'px' }"
                >
                  {{ formatDate(getDragDates(tarefa).inicio) }} → {{ formatDate(getDragDates(tarefa).fim) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Salvando indicator -->
    <Transition name="fade">
      <div
        v-if="salvando"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg shadow-xl"
      >
        <div class="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        Salvando...
      </div>
    </Transition>

    <!-- Empty state -->
    <div
      v-if="!tarefasComDatas.length"
      class="flex flex-col h-[50vh] items-center justify-center p-12 text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl"
    >
      <Icon name="ph:chart-bar-duotone" class="w-14 h-14 opacity-40 mb-4" />
      <h2 class="text-lg font-semibold text-zinc-200 mb-2">Nenhuma tarefa com datas</h2>
      <p class="text-sm max-w-sm text-center">
        Para visualizar o Gantt, adicione datas de inicio e fim nas tarefas do projeto.
      </p>
    </div>

    <!-- Modal de edição da tarefa -->
    <div
      v-if="modalAberto && tarefaEditando"
      class="fixed inset-0 z-[10020] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <button type="button" class="absolute inset-0" aria-label="Fechar modal" @click="fecharModal" />

      <form
        class="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111] shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
        @submit.prevent="salvarEdicao"
      >
        <!-- Header -->
        <div class="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
          <div class="flex items-center gap-2">
            <span class="rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1 text-xs font-semibold text-zinc-200">
              {{ tarefaEditando.codigo || `T-${tarefaEditando.id}` }}
            </span>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusBadgeClass[formModal.status]">
              {{ statusLabels[formModal.status] }}
            </span>
            <span
              class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-semibold text-zinc-100"
              :title="tarefaEditando.responsavel_texto || 'Sem responsavel'"
            >
              <img
                v-if="getResponsavelFotoUrl(tarefaEditando)"
                :src="getResponsavelFotoUrl(tarefaEditando) || ''"
                :alt="tarefaEditando.responsavel_texto || 'Responsavel'"
                class="h-full w-full object-cover"
              >
              <span v-else>{{ iniciais(tarefaEditando.responsavel_texto || '') }}</span>
            </span>
          </div>
          <button
            type="button"
            class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
            @click="fecharModal"
          >
            <Icon name="ph:x-bold" class="h-4 w-4" />
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="min-h-0 flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Titulo</label>
            <input
              v-model="formModal.titulo"
              type="text"
              required
              class="w-full border-0 bg-transparent px-0 text-2xl font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none"
              placeholder="Nome da tarefa"
            >
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Descricao</label>
            <textarea
              v-model="formModal.descricao"
              rows="4"
              placeholder="Descricao da tarefa..."
              class="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Status</label>
              <select
                v-model="formModal.status"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
              >
                <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Prioridade</label>
              <select
                v-model="formModal.prioridade"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Data inicio</label>
              <input
                v-model="formModal.prazo_inicio"
                type="date"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
              >
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Data fim</label>
              <input
                v-model="formModal.prazo_fim"
                type="date"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
              >
            </div>
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Responsavel</label>
            <select
              v-model="formModal.responsavel_equipe_id"
              class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
            >
              <option value="">Sem responsavel</option>
              <option v-for="membro in equipeOptions" :key="membro.id" :value="String(membro.id)">
                {{ membro.label }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Horas estimadas</label>
              <input
                v-model.number="formModal.horas_estimadas"
                type="number"
                min="0"
                step="0.5"
                class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
              >
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Horas executadas</label>
              <div class="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-400">
                {{ formatHoursAsDuration(tarefaEditando.horas_executadas || 0) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 border-t border-zinc-800 px-5 py-4">
          <button
            type="button"
            class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            @click="fecharModal"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="salvandoModal"
            class="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ salvandoModal ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Legenda -->
    <div v-if="tarefasComDatas.length" class="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-zinc-500" />
        <span>Refinar / Fazer</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-500" />
        <span>Em Progresso</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <span>Sob Revisao</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span>Concluido</span>
      </div>
      <div class="flex items-center gap-1 ml-auto">
        <div class="w-px h-3 bg-blue-500/60" />
        <span>Hoje</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="ph:arrows-horizontal-duotone" class="w-3 h-3" />
        <span>Arraste as barras para mover ou redimensione pelas bordas</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchEquipeMembros, fetchTarefasByProjetoId, filterProjetoTarefasPrincipais, updateTarefa, type ProjetoTarefa } from '~/composables/useProjetosWorkspace'
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace'
import { formatHoursAsDuration } from '~/utils/duration'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const emit = defineEmits<{ refresh: [] }>()

const SIDEBAR_WIDTH = 280
const escala = ref<'dia' | 'semana'>('semana')
const timelineRef = ref<HTMLElement | null>(null)
const salvando = ref(false)

const COL_WIDTH = computed(() => escala.value === 'dia' ? 32 : 40)

// Fetch tarefas
const { data: todasTarefas, refresh: refreshTarefas } = await useAsyncData(
  `gantt-tarefas-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id),
  { server: false, default: () => [] }
)

const { data: equipeMembros } = await useAsyncData(
  `gantt-equipe-${props.projeto.id}`,
  () => fetchEquipeMembros(),
  { server: false, default: () => [] }
)

const tarefasPrincipais = computed(() => filterProjetoTarefasPrincipais(todasTarefas.value))

const equipeOptions = computed(() => {
  return (equipeMembros.value || [])
    .filter((membro) => Boolean(membro.nome))
    .map((membro) => {
      const nome = (membro.nome || '').trim()
      const cargo = (membro.cargo || '').trim()
      return {
        id: membro.id,
        nome,
        foto: membro.foto || null,
        label: cargo ? `${nome} (${cargo})` : nome
      }
    })
})

function parseEquipeSelectValue(value: string | number | null | undefined): number | null {
  const normalized = String(value ?? '').trim()
  if (!normalized) return null

  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function getEquipeOptionById(value: string | number | null | undefined) {
  const equipeId = parseEquipeSelectValue(value)
  if (!equipeId) return null
  return equipeOptions.value.find((membro) => membro.id === equipeId) || null
}

function getEquipeOptionByNome(nome: string | null | undefined) {
  const normalized = String(nome || '').trim().toLocaleLowerCase('pt-BR')
  if (!normalized) return null
  return equipeOptions.value.find((membro) => membro.nome.toLocaleLowerCase('pt-BR') === normalized) || null
}

function getResponsavelFotoUrl(tarefa: ProjetoTarefa) {
  const membro = getEquipeOptionById(tarefa.responsavel_equipe_id) || getEquipeOptionByNome(tarefa.responsavel_texto)
  return membro?.foto || null
}

// Filtrar tarefas que possuem ao menos prazo_inicio e prazo_fim
const tarefasComDatas = computed(() => {
  return tarefasPrincipais.value
    .filter(t => t.prazo_inicio && t.prazo_fim)
    .sort((a, b) => {
      const da = a.prazo_inicio!
      const db = b.prazo_inicio!
      if (da !== db) return da < db ? -1 : 1
      return (a.prazo_fim || '') < (b.prazo_fim || '') ? -1 : 1
    })
})

// ==========================================
// DRAG & DROP
// ==========================================

type DragMode = 'move' | 'resize-start' | 'resize-end'

const drag = reactive<{
  tarefaId: number | null
  mode: DragMode | null
  startX: number
  deltaX: number
  originalInicio: string
  originalFim: string
}>({
  tarefaId: null,
  mode: null,
  startX: 0,
  deltaX: 0,
  originalInicio: '',
  originalFim: ''
})

function pixelsToDays(px: number): number {
  return Math.round(px / COL_WIDTH.value)
}

function addDaysToStr(dateStr: string, days: number): string {
  const d = parseDate(dateStr)
  d.setDate(d.getDate() + days)
  return dateToStr(d)
}

function getDragDates(tarefa: ProjetoTarefa): { inicio: string; fim: string } {
  if (drag.tarefaId !== tarefa.id || !drag.mode) {
    return { inicio: tarefa.prazo_inicio!, fim: tarefa.prazo_fim! }
  }

  const daysDelta = pixelsToDays(drag.deltaX)

  if (drag.mode === 'move') {
    return {
      inicio: addDaysToStr(drag.originalInicio, daysDelta),
      fim: addDaysToStr(drag.originalFim, daysDelta)
    }
  }

  if (drag.mode === 'resize-start') {
    const novoInicio = addDaysToStr(drag.originalInicio, daysDelta)
    // Nao permitir inicio depois do fim
    if (novoInicio > drag.originalFim) {
      return { inicio: drag.originalFim, fim: drag.originalFim }
    }
    return { inicio: novoInicio, fim: drag.originalFim }
  }

  // resize-end
  const novoFim = addDaysToStr(drag.originalFim, daysDelta)
  // Nao permitir fim antes do inicio
  if (novoFim < drag.originalInicio) {
    return { inicio: drag.originalInicio, fim: drag.originalInicio }
  }
  return { inicio: drag.originalInicio, fim: novoFim }
}

function barraStyleComDrag(tarefa: ProjetoTarefa) {
  const { start } = timelineRange.value
  const dates = getDragDates(tarefa)
  const tStart = parseDate(dates.inicio)
  const tEnd = parseDate(dates.fim)

  const offsetDias = Math.floor((tStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const duracaoDias = Math.max(1, Math.ceil((tEnd.getTime() - tStart.getTime()) / (1000 * 60 * 60 * 24)) + 1)

  const left = offsetDias * COL_WIDTH.value
  const width = duracaoDias * COL_WIDTH.value - 4

  return {
    left: left + 2 + 'px',
    width: Math.max(width, 8) + 'px'
  }
}

function barraLarguraComDrag(tarefa: ProjetoTarefa): number {
  const dates = getDragDates(tarefa)
  const tStart = parseDate(dates.inicio)
  const tEnd = parseDate(dates.fim)
  const duracaoDias = Math.max(1, Math.ceil((tEnd.getTime() - tStart.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  return duracaoDias * COL_WIDTH.value - 4
}

function barraTooltip(tarefa: ProjetoTarefa): string {
  const dates = getDragDates(tarefa)
  return `${tarefa.titulo} (${formatDate(dates.inicio)} → ${formatDate(dates.fim)})`
}

function dragTooltipLeft(tarefa: ProjetoTarefa): number {
  const { start } = timelineRange.value
  const dates = getDragDates(tarefa)
  const tStart = parseDate(dates.inicio)
  const tEnd = parseDate(dates.fim)

  const offsetDias = Math.floor((tStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const duracaoDias = Math.max(1, Math.ceil((tEnd.getTime() - tStart.getTime()) / (1000 * 60 * 60 * 24)) + 1)

  return offsetDias * COL_WIDTH.value + (duracaoDias * COL_WIDTH.value) / 2 - 40
}

function onBarMouseDown(event: MouseEvent, tarefa: ProjetoTarefa, mode: DragMode) {
  drag.tarefaId = tarefa.id
  drag.mode = mode
  drag.startX = event.clientX
  drag.deltaX = 0
  drag.originalInicio = tarefa.prazo_inicio!
  drag.originalFim = tarefa.prazo_fim!

  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.body.style.cursor = mode === 'move' ? 'grabbing' : 'ew-resize'
  document.body.style.userSelect = 'none'
}

function onDragMove(event: MouseEvent) {
  if (!drag.tarefaId) return
  drag.deltaX = event.clientX - drag.startX
}

async function onDragEnd() {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''

  if (!drag.tarefaId || !drag.mode) return

  const daysDelta = pixelsToDays(drag.deltaX)

  // Se nao moveu nada, abre modal da tarefa
  if (daysDelta === 0) {
    const tarefaId = drag.tarefaId
    resetDrag()
    abrirTarefa(tarefaId)
    return
  }

  const tarefa = tarefasComDatas.value.find(t => t.id === drag.tarefaId)
  if (!tarefa) {
    resetDrag()
    return
  }

  const { inicio, fim } = getDragDates(tarefa)

  // Validar: inicio <= fim
  if (inicio > fim) {
    resetDrag()
    return
  }

  // Atualizar localmente para feedback imediato
  tarefa.prazo_inicio = inicio
  tarefa.prazo_fim = fim

  const tarefaId = drag.tarefaId
  resetDrag()

  // Persistir no banco
  salvando.value = true
  const { error } = await updateTarefa(tarefaId, {
    prazo_inicio: inicio,
    prazo_fim: fim
  })
  salvando.value = false

  if (error) {
    console.warn('[Gantt] Erro ao salvar:', error)
    // Reverter buscando dados atualizados
    await refreshTarefas()
  }
}

function resetDrag() {
  drag.tarefaId = null
  drag.mode = null
  drag.startX = 0
  drag.deltaX = 0
  drag.originalInicio = ''
  drag.originalFim = ''
}

// ==========================================
// TIMELINE CALCULATIONS
// ==========================================

// Calcular o range total do timeline
const timelineRange = computed(() => {
  const tarefas = tarefasComDatas.value
  if (!tarefas.length) return { start: new Date(), end: new Date(), days: 0 }

  let minDate = tarefas[0].prazo_inicio as string
  let maxDate = tarefas[0].prazo_fim as string

  for (const t of tarefas) {
    if (t.prazo_inicio! < minDate) minDate = t.prazo_inicio!
    if (t.prazo_fim! > maxDate) maxDate = t.prazo_fim!
  }

  // Incluir data do projeto se disponivel
  if (props.projeto.data_inicio && props.projeto.data_inicio < minDate) minDate = props.projeto.data_inicio
  if (props.projeto.data_fim_prevista && props.projeto.data_fim_prevista > maxDate) maxDate = props.projeto.data_fim_prevista

  const start = parseDate(minDate)
  const end = parseDate(maxDate)

  // Adicionar margem de 3 dias antes e 7 dias depois
  start.setDate(start.getDate() - 3)
  end.setDate(end.getDate() + 7)

  // Alinhar ao inicio da semana (segunda)
  const dayOfWeek = start.getDay()
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  start.setDate(start.getDate() - diff)

  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return { start, end, days: Math.max(days, 14) }
})

// Colunas do header
const colunas = computed(() => {
  const { start, days } = timelineRange.value
  const hoje = todayStr()
  const cols: Array<{ label: string; date: Date; dateStr: string; isWeekend: boolean; isToday: boolean }> = []

  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const iso = dateToStr(d)
    const dow = d.getDay()

    if (escala.value === 'semana') {
      cols.push({
        label: abrevDia(dow),
        date: d,
        dateStr: iso,
        isWeekend: dow === 0 || dow === 6,
        isToday: iso === hoje
      })
    } else {
      cols.push({
        label: String(d.getDate()),
        date: d,
        dateStr: iso,
        isWeekend: dow === 0 || dow === 6,
        isToday: iso === hoje
      })
    }
  }

  return cols
})

// Grupos do header (meses ou semanas)
const headerGrupos = computed(() => {
  const cols = colunas.value
  if (!cols.length) return []

  const grupos: Array<{ label: string; largura: number }> = []
  let currentLabel = ''
  let currentWidth = 0

  for (const col of cols) {
    const label = escala.value === 'semana'
      ? formatMesAno(col.date)
      : formatSemana(col.date)

    if (label !== currentLabel) {
      if (currentLabel) {
        grupos.push({ label: currentLabel, largura: currentWidth })
      }
      currentLabel = label
      currentWidth = COL_WIDTH.value
    } else {
      currentWidth += COL_WIDTH.value
    }
  }

  if (currentLabel) {
    grupos.push({ label: currentLabel, largura: currentWidth })
  }

  return grupos
})

const timelineWidth = computed(() => colunas.value.length * COL_WIDTH.value)

// Posicao da linha "hoje"
const todayOffset = computed(() => {
  const hoje = todayStr()
  const idx = colunas.value.findIndex(c => c.dateStr === hoje)
  if (idx === -1) return null
  return idx * COL_WIDTH.value + COL_WIDTH.value / 2
})

// Label do periodo
const labelPeriodo = computed(() => {
  const { start, end } = timelineRange.value
  return `${formatDateShort(start)} — ${formatDateShort(end)}`
})

// ==========================================
// CORES
// ==========================================

function corStatus(status: ProjetoTarefa['status']) {
  switch (status) {
    case 'em_progresso': return 'bg-blue-500'
    case 'sob_revisao': return 'bg-amber-500'
    case 'concluido': return 'bg-emerald-500'
    default: return 'bg-zinc-500'
  }
}

function corBarra(status: ProjetoTarefa['status']) {
  switch (status) {
    case 'em_progresso': return 'bg-blue-600/80'
    case 'sob_revisao': return 'bg-amber-600/80'
    case 'concluido': return 'bg-emerald-600/80'
    default: return 'bg-zinc-600/80'
  }
}

// ==========================================
// HELPERS
// ==========================================

function parseDate(str: string): Date {
  const parts = str.split('-').map(Number)
  return new Date(parts[0]!, parts[1]! - 1, parts[2]!)
}

function dateToStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayStr(): string {
  return dateToStr(new Date())
}

function formatDate(str: string): string {
  const d = parseDate(str)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatMesAno(d: Date): string {
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

function formatSemana(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function abrevDia(dow: number): string {
  const dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const
  return dias[dow] ?? 'D'
}

function iniciais(nome: string): string {
  return nome.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

// ==========================================
// MODAL DE EDIÇÃO
// ==========================================

const modalAberto = ref(false)
const salvandoModal = ref(false)
const tarefaEditando = ref<ProjetoTarefa | null>(null)

const statusLabels: Record<ProjetoTarefa['status'], string> = {
  refinar: 'A Refinar',
  fazer: 'A Fazer',
  em_progresso: 'Em Progresso',
  sob_revisao: 'Sob Revisao',
  concluido: 'Concluido'
}

const statusBadgeClass: Record<ProjetoTarefa['status'], string> = {
  refinar: 'bg-zinc-700 text-zinc-200',
  fazer: 'bg-zinc-600 text-zinc-100',
  em_progresso: 'bg-blue-500/20 text-blue-400',
  sob_revisao: 'bg-amber-500/20 text-amber-400',
  concluido: 'bg-emerald-500/20 text-emerald-400'
}

const formModal = reactive({
  titulo: '',
  descricao: '',
  status: 'refinar' as ProjetoTarefa['status'],
  prioridade: 'media' as ProjetoTarefa['prioridade'],
  prazo_inicio: '',
  prazo_fim: '',
  responsavel_equipe_id: '',
  horas_estimadas: 0,
})

function abrirTarefa(tarefaId: number) {
  const tarefa = (todasTarefas.value || []).find(t => t.id === tarefaId)
  if (!tarefa) return

  tarefaEditando.value = tarefa
  formModal.titulo = tarefa.titulo || ''
  formModal.descricao = tarefa.descricao || ''
  formModal.status = tarefa.status
  formModal.prioridade = tarefa.prioridade
  formModal.prazo_inicio = tarefa.prazo_inicio || ''
  formModal.prazo_fim = tarefa.prazo_fim || ''
  formModal.responsavel_equipe_id = tarefa.responsavel_equipe_id ? String(tarefa.responsavel_equipe_id) : ''
  formModal.horas_estimadas = Number(tarefa.horas_estimadas) || 0
  modalAberto.value = true
}

function fecharModal() {
  if (salvandoModal.value) return
  modalAberto.value = false
  tarefaEditando.value = null
}

async function salvarEdicao() {
  if (!tarefaEditando.value) return
  if (!formModal.titulo.trim()) return
  if (formModal.prazo_inicio && formModal.prazo_fim && formModal.prazo_fim < formModal.prazo_inicio) return

  salvandoModal.value = true

  const { error } = await updateTarefa(tarefaEditando.value.id, {
    titulo: formModal.titulo.trim(),
    descricao: formModal.descricao.trim() || null,
    status: formModal.status,
    prioridade: formModal.prioridade,
    prazo_inicio: formModal.prazo_inicio || null,
    prazo_fim: formModal.prazo_fim || null,
    responsavel_equipe_id: parseEquipeSelectValue(formModal.responsavel_equipe_id),
    horas_estimadas: Number(formModal.horas_estimadas) || 0,
  })

  salvandoModal.value = false

  if (error) {
    console.warn('[Gantt] Erro ao salvar tarefa:', error)
    return
  }

  await refreshTarefas()
  fecharModal()
}

// Scroll para hoje
function scrollParaHoje() {
  if (!timelineRef.value || todayOffset.value === null) return
  const containerWidth = timelineRef.value.clientWidth
  timelineRef.value.scrollLeft = todayOffset.value - containerWidth / 2
}

// Cleanup listeners on unmount
onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

onMounted(() => {
  nextTick(() => {
    scrollParaHoje()
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
