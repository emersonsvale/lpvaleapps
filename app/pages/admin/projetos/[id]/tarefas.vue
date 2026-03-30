<template>
  <div>
    <!-- Filtros rápidos -->
    <div class="mb-6 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div class="border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-4 lg:px-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
                Workspace
              </span>
              <h2 class="text-base font-semibold text-zinc-100">Filtros de tarefas</h2>
            </div>
            <p class="max-w-2xl text-sm text-zinc-500">
              Refine a visualizacao por responsavel, tipo, prioridade e periodo. A ordenacao padrao ja prioriza o prazo mais proximo.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
              :aria-expanded="String(filtrosExpandidos)"
              @click="filtrosExpandidos = !filtrosExpandidos"
            >
              <Minimize2 v-if="filtrosExpandidos" class="h-3.5 w-3.5" />
              <Maximize2 v-else class="h-3.5 w-3.5" />
              {{ filtrosExpandidos ? 'Minimizar' : 'Expandir' }}
            </button>

            <div class="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1">
              <button
                type="button"
                class="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                :class="modoVisualizacao === 'kanban' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800'"
                @click="modoVisualizacao = 'kanban'"
              >
                Kanban
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                :class="modoVisualizacao === 'lista' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800'"
                @click="modoVisualizacao = 'lista'"
              >
                Lista
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-zinc-300">
                {{ tarefasFiltradas.length }} tarefa(s) visiveis
              </span>
              <span class="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-zinc-400">
                {{ filtrosAtivosCount }} filtro(s) ativo(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filtrosExpandidos" class="grid gap-4 p-4 lg:p-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <label class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-3 md:col-span-2 2xl:col-span-1">
            <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Busca</span>
            <input
              v-model="filtroBusca"
              type="text"
              placeholder="Buscar por tarefa, codigo ou tag"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:outline-none"
            >
          </label>

          <label class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-3">
            <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Responsavel</span>
            <select
              v-model="filtroResponsavel"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option value="sem_responsavel">Sem responsavel</option>
              <option
                v-for="responsavel in responsavelFiltroOptions"
                :key="`filtro-responsavel-${responsavel}`"
                :value="responsavel"
              >
                {{ responsavel }}
              </option>
            </select>
          </label>

          <label class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-3">
            <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Tipo</span>
            <select
              v-model="filtroTipo"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none"
            >
              <option value="todos">Todos</option>
              <option v-for="opcao in tipoOptions" :key="`filtro-tipo-${opcao.value}`" :value="opcao.value">
                {{ opcao.label }}
              </option>
            </select>
          </label>

          <label class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-3">
            <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Prioridade</span>
            <select
              v-model="filtroPrioridade"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none"
            >
              <option value="todos">Todas</option>
              <option v-for="opcao in prioridadeOptions" :key="`filtro-prioridade-${opcao.value}`" :value="opcao.value">
                {{ opcao.label }}
              </option>
            </select>
          </label>

          <label class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-3">
            <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Data de inicio</span>
            <input
              v-model="filtroDataInicio"
              type="date"
              :max="filtroDataFim || undefined"
              @change="onFiltroDataInicioChange"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none"
            >
          </label>

          <label class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-3">
            <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Data de fim ate</span>
            <input
              v-model="filtroDataFim"
              type="date"
              :min="filtroDataInicio || undefined"
              :disabled="!filtroDataInicio"
              class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-600"
              @input="onFiltroDataFimInput"
              @change="onFiltroDataFimInput"
            >
          </label>
        </div>

        <aside class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-4">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Organizacao</p>
              <p class="mt-1 text-sm text-zinc-400">Defina como as tarefas devem ser exibidas.</p>
            </div>
            <span class="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Base
            </span>
          </div>

          <div class="space-y-3">
            <label class="block">
              <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Ordenar por</span>
              <select
                v-model="ordenacaoCampo"
                class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
                <option v-for="opcao in ordenacaoOptions" :key="`ordenacao-${opcao.value}`" :value="opcao.value">
                  {{ opcao.label }}
                </option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Direcao</span>
              <select
                v-model="ordenacaoDirecao"
                class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </label>

            <button
              type="button"
              class="w-full rounded-xl border border-zinc-700 px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900"
              @click="limparFiltros()"
            >
              Limpar filtros
            </button>
          </div>
        </aside>
      </div>
    </div>

    <!-- Kanban Board -->
    <div v-if="modoVisualizacao === 'kanban'" class="overflow-x-auto pb-4">
      <div class="flex items-start gap-4 min-w-max">
        <section
          v-for="coluna in colunas"
          :key="coluna.status"
          class="w-80 flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 h-[600px]"
          @dragover.prevent
          @drop="onDrop(coluna.status)"
        >
          <!-- Cabeçalho Coluna -->
          <header class="mb-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div 
                  class="w-2.5 h-2.5 rounded-full"
                  :class="{
                    'bg-purple-500': coluna.status === 'refinar',
                    'bg-orange-400': coluna.status === 'fazer',
                    'bg-blue-500': coluna.status === 'em_progresso',
                    'bg-yellow-400': coluna.status === 'sob_revisao',
                    'bg-emerald-500': coluna.status === 'concluido',
                  }"
                />
                <h3 class="text-sm font-semibold text-zinc-200">{{ coluna.titulo }}</h3>
              </div>
              <span class="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">{{ tarefasPorStatus[coluna.status]?.length || 0 }}</span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
              <div class="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-2">
                <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Inicio</span>
                <span class="mt-1 block font-medium text-zinc-100">{{ resumoStatus[coluna.status].inicio }}</span>
              </div>
              <div class="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-2">
                <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Fim</span>
                <span class="mt-1 block font-medium text-zinc-100">{{ resumoStatus[coluna.status].fim }}</span>
              </div>
              <div class="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-2">
                <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Horas</span>
                <span class="mt-1 block font-medium text-zinc-100">{{ resumoStatus[coluna.status].horas }}</span>
              </div>
              <div class="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-2">
                <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Progresso</span>
                <span class="mt-1 block font-medium text-zinc-100">{{ resumoStatus[coluna.status].progresso }}</span>
              </div>
            </div>
          </header>

          <!-- Itens -->
          <div class="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <article
              v-for="t in tarefasPorStatus[coluna.status]"
              :key="t.id"
              draggable="true"
              @dragstart="onDragStart(t.id)"
              @click="editarTarefa(t.id)"
              class="rounded-lg border border-zinc-800 bg-zinc-950 p-3 cursor-pointer hover:border-zinc-700 transition-colors group"
            >
              <div class="flex justify-between items-start gap-2 mb-2">
                <span class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{{ t.codigo || 'T-' + t.id }}</span>
                <span 
                  class="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium"
                  :class="{
                    'bg-red-500/10 text-red-400': t.prioridade === 'urgente',
                    'bg-orange-500/10 text-orange-400': t.prioridade === 'alta',
                    'bg-blue-500/10 text-blue-400': t.prioridade === 'media',
                    'bg-zinc-800 text-zinc-400': t.prioridade === 'baixa',
                  }"
                >{{ t.prioridade }}</span>
              </div>
              <p class="text-sm text-zinc-100 font-medium leading-snug mb-3">
                {{ t.titulo }}
              </p>

              <div v-if="t.tags?.length" class="mb-3 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in t.tags"
                  :key="`kanban-tag-${t.id}-${tag}`"
                  class="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] font-medium text-zinc-300"
                >
                  #{{ tag }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-xs text-zinc-500">
                <div class="flex items-center gap-2">
                  <span v-if="t.horas_estimadas" class="flex flex-col">
                    <span class="text-[10px]">Horas</span>
                    <span class="font-medium text-zinc-300">{{ getHorasExecutadasDisplay(t) }} / {{ formatHoras(t.horas_estimadas || 0) }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click.stop="toggleTimerTarefa(t)"
                    class="flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors hover:text-zinc-200"
                    :title="tarefaRodandoId === t.id ? 'Pausar' : 'Iniciar'"
                  >
                    <PhStopCircle v-if="tarefaRodandoId === t.id" :size="20" weight="fill" />
                    <PhPlayCircle v-else :size="20" weight="fill" />
                  </button>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click.stop="editarTarefa(t.id)" class="text-brand hover:underline">Editar</button>
                    <button @click.stop="excluirTarefa(t.id)" class="text-red-400 hover:underline">Excluir</button>
                  </div>
                </div>
              </div>
            </article>

            <div v-if="!tarefasPorStatus[coluna.status]?.length" class="h-10 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-600">
               Solte aqui
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Lista por Status -->
    <div v-else class="space-y-3">
      <section
        v-for="coluna in colunas"
        :key="`lista-${coluna.status}`"
        class="overflow-visible rounded-xl border border-zinc-800 bg-zinc-900/40"
        :class="statusBorderLeftClass[coluna.status]"
      >
        <header>
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-zinc-900/70"
            :aria-expanded="String(!isStatusReduzido(coluna.status))"
            @click="toggleStatusReducao(coluna.status)"
          >
            <div class="flex min-w-0 items-center gap-3">
              <ChevronRight v-if="isStatusReduzido(coluna.status)" class="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <ChevronDown v-else class="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full"
                :class="{
                  'bg-purple-500': coluna.status === 'refinar',
                  'bg-orange-400': coluna.status === 'fazer',
                  'bg-blue-500': coluna.status === 'em_progresso',
                  'bg-yellow-400': coluna.status === 'sob_revisao',
                  'bg-emerald-500': coluna.status === 'concluido',
                }"
              />
              <h3 class="truncate text-base font-semibold text-zinc-100">{{ coluna.titulo }}</h3>
              <span class="inline-flex min-w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs font-medium text-zinc-400">
                {{ tarefasPorStatus[coluna.status]?.length || 0 }}
              </span>
            </div>

            <span class="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {{ isStatusReduzido(coluna.status) ? 'Expandir' : 'Reduzir' }}
            </span>
          </button>
        </header>

        <div v-if="!isStatusReduzido(coluna.status)" class="border-t border-zinc-800">
          <div class="grid grid-cols-2 gap-2 px-3 py-3 md:grid-cols-4">
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
              <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Data inicio</span>
              <span class="mt-1 block text-sm font-medium text-zinc-100">{{ resumoStatus[coluna.status].inicio }}</span>
            </div>
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
              <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Data fim</span>
              <span class="mt-1 block text-sm font-medium text-zinc-100">{{ resumoStatus[coluna.status].fim }}</span>
            </div>
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
              <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Horas totais</span>
              <span class="mt-1 block text-sm font-medium text-zinc-100">{{ resumoStatus[coluna.status].horas }}</span>
            </div>
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
              <span class="block text-[10px] uppercase tracking-wider text-zinc-500">Progresso</span>
              <span class="mt-1 block text-sm font-medium text-zinc-100">{{ resumoStatus[coluna.status].progresso }}</span>
            </div>
          </div>

          <div class="overflow-x-auto overflow-y-visible">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-zinc-800 bg-zinc-950/50">
                  <th class="w-[4%] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-brand focus:ring-brand"
                      :checked="isStatusSelecionado(coluna.status)"
                      @change="toggleSelecaoStatus(coluna.status, ($event.target as HTMLInputElement).checked)"
                    >
                  </th>
                  <th class="w-[36%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tarefa</th>
                  <th class="w-[8%] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Resp.</th>
                  <th class="w-[14%] px-0 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                  <th class="w-[14%] px-0 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tipo</th>
                  <th class="w-[14%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Prazo</th>
                  <th class="w-[14%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Prazo Status</th>
                  <th class="w-[10%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Horas</th>
                  <th class="w-[8%] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Progresso</th>
                  <th class="w-[6%] px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Acoes</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="t in tarefasPorStatus[coluna.status]"
                  :key="`lista-row-${t.id}`"
                  @click="editarTarefa(t.id)"
                  class="border-b border-zinc-900 transition-colors"
                  :class="isTarefaSelecionada(t.id) ? 'bg-zinc-900/70' : 'hover:bg-zinc-900/50'"
                >
                  <td class="px-3 py-3 align-middle" @click.stop>
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-brand focus:ring-brand"
                      :checked="isTarefaSelecionada(t.id)"
                      @click.stop
                      @change="toggleSelecaoTarefa(t.id, ($event.target as HTMLInputElement).checked)"
                    >
                  </td>
                  <td class="px-4 py-3 align-middle">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">{{ t.codigo || `T-${t.id}` }}</span>
                        <span class="text-sm font-medium text-zinc-100">{{ t.titulo }}</span>
                      </div>
                      <div v-if="t.tags?.length" class="mt-2 flex flex-wrap gap-1.5">
                        <span
                          v-for="tag in t.tags"
                          :key="`lista-tag-${t.id}-${tag}`"
                          class="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] font-medium text-zinc-300"
                        >
                          #{{ tag }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-3 align-middle" @click.stop>
                    <div class="relative inline-flex" @click.stop>
                      <button
                        type="button"
                        :data-responsavel-id="t.id"
                        class="flex h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-700 text-[11px] font-semibold text-zinc-100 transition-colors hover:border-zinc-500 hover:bg-zinc-600"
                        :title="t.responsavel_texto || 'Selecionar responsavel'"
                        @click.stop="toggleResponsavelInline(t.id)"
                      >
                        <span v-if="salvandoResponsavelId === t.id" class="text-[10px] text-zinc-300">...</span>
                        <img
                          v-else-if="getResponsavelFotoUrl(t)"
                          :src="getResponsavelFotoUrl(t) || ''"
                          :alt="t.responsavel_texto || 'Responsavel'"
                          class="h-full w-full rounded-full object-cover"
                        >
                        <span v-else>{{ getResponsavelInitials(t.responsavel_texto) }}</span>
                      </button>
                    </div>
                  </td>
                  <td class="px-0 py-0 align-middle" @click.stop>
                    <select
                      :value="t.status"
                      class="h-12 w-full appearance-none border-x border-zinc-800 text-center text-sm font-semibold text-white focus:outline-none"
                      :class="statusCellClass[t.status]"
                      @click.stop
                      @change="alterarStatusInline(t, ($event.target as HTMLSelectElement).value as ProjetoTarefa['status'])"
                    >
                      <option v-for="opcao in statusOptions" :key="`status-${t.id}-${opcao.value}`" :value="opcao.value">
                        {{ opcao.label }}
                      </option>
                    </select>
                  </td>
                  <td class="px-0 py-0 align-middle" @click.stop>
                    <select
                      :value="t.tipo"
                      class="h-12 w-full appearance-none border-r border-zinc-800 text-center text-sm font-semibold text-white focus:outline-none"
                      :class="tipoCellClass[t.tipo]"
                      @click.stop
                      @change="alterarTipoInline(t, ($event.target as HTMLSelectElement).value as ProjetoTarefa['tipo'])"
                    >
                      <option v-for="opcao in tipoOptions" :key="`tipo-${t.id}-${opcao.value}`" :value="opcao.value">
                        {{ opcao.label }}
                      </option>
                    </select>
                  </td>
                  <td class="px-4 py-3 align-middle text-sm text-zinc-300">{{ formatPrazoRange(t) }}</td>
                  <td class="px-4 py-3 align-middle text-xs text-zinc-300">
                    <span
                      class="inline-flex rounded-md border px-2 py-1 text-[11px] font-medium"
                      :class="getPrazoStatusMeta(t).className"
                    >
                      {{ getPrazoStatusMeta(t).label }}
                    </span>
                  </td>
                  <td class="px-4 py-3 align-middle text-sm text-zinc-200" @click.stop>
                    <div class="flex items-center justify-between gap-2">
                      <span>
                        <span class="font-semibold text-brand">{{ getHorasExecutadasDisplay(t) }}</span>
                        <span class="text-zinc-400"> / {{ formatHoras(t.horas_estimadas || 0) }}</span>
                      </span>
                      <button
                        type="button"
                        class="flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors hover:text-zinc-200"
                        @click.stop
                        @click="toggleTimerTarefa(t)"
                      >
                        <PhStopCircle v-if="tarefaRodandoId === t.id" :size="20" weight="fill" />
                        <PhPlayCircle v-else :size="20" weight="fill" />
                      </button>
                    </div>
                  </td>
                  <td class="px-3 py-3 align-middle text-xs text-zinc-400">{{ formatProgresso(getTarefaProgresso(t)) }}</td>
                  <td class="px-3 py-3 align-middle text-right" @click.stop>
                    <div class="relative inline-flex" @click.stop>
                      <button
                        ref="menuBtnRefs"
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
                        title="Mais acoes"
                        :data-tarefa-id="t.id"
                        @click.stop="toggleMenuAcoes(t.id)"
                      >
                        ...
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="!tarefasPorStatus[coluna.status]?.length">
                  <td colspan="10" class="px-4 py-3 text-xs text-zinc-600">Nenhuma tarefa nesta etapa.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div v-if="!tarefasFiltradas.length" class="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
        Nenhuma tarefa encontrada para o filtro atual.
      </div>
    </div>

    <!-- Menu de ações flutuante (Teleport para escapar overflow) -->
    <Teleport to="body">
      <div
        v-if="menuAcoesAbertoId !== null"
        class="fixed inset-0 z-[9999]"
        @click="menuAcoesAbertoId = null"
      />
      <div
        v-if="menuAcoesAbertoId !== null"
        class="fixed z-[10000] min-w-[160px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl"
        :style="menuAcoesFloatingStyle"
      >
        <button
          type="button"
          class="block w-full px-3 py-2 text-left text-xs text-zinc-200 transition-colors hover:bg-zinc-900"
          @click="abrirEdicaoPeloMenu(menuAcoesAbertoId!)"
        >
          Editar tarefa
        </button>
        <button
          type="button"
          class="block w-full px-3 py-2 text-left text-xs text-red-300 transition-colors hover:bg-zinc-900"
          @click="excluirPeloMenu(menuAcoesAbertoId!)"
        >
          Excluir tarefa
        </button>
      </div>
    </Teleport>

    <!-- Seletor de responsável flutuante (Teleport para escapar overflow) -->
    <Teleport to="body">
      <div
        v-if="responsavelAbertoId !== null"
        class="fixed inset-0 z-[9999]"
        @click="responsavelAbertoId = null"
      />
      <div
        v-if="responsavelAbertoId !== null && responsavelTarefaAberta"
        class="fixed z-[10000] min-w-[220px] rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-2xl"
        :style="responsavelFloatingStyle"
        @click.stop
      >
        <label class="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-500">Responsavel</label>
        <select
          class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-brand focus:outline-none"
          :value="String(responsavelTarefaAberta.responsavel_equipe_id || '')"
          @change="alterarResponsavelInline(responsavelTarefaAberta!, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Sem responsavel</option>
          <option
            v-for="membro in equipeOptions"
            :key="`responsavel-inline-${responsavelTarefaAberta.id}-${membro.id}`"
            :value="String(membro.id)"
          >
            {{ membro.label }}
          </option>
        </select>

        <p class="mt-2 text-[11px] text-zinc-500">
          {{ responsavelTarefaAberta.responsavel_texto || 'Nenhum responsavel definido' }}
        </p>
      </div>
    </Teleport>

    <div
      v-if="modalEdicaoAberto"
      class="fixed inset-0 z-[10020] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <button type="button" class="absolute inset-0" aria-label="Fechar modal" @click="fecharModalEdicao" />

      <form class="relative flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111] shadow-[0_30px_120px_rgba(0,0,0,0.6)]" @submit.prevent="salvarEdicaoTarefa">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1 text-xs font-semibold text-zinc-200">
              {{ tarefaEmEdicao?.codigo || `T-${tarefaEditandoId}` }}
            </span>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClasses[formEdicao.status]">
              {{ statusLabels[formEdicao.status] }}
            </span>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="prioridadeBadgeClass[formEdicao.prioridade]">
              {{ prioridadeLabels[formEdicao.prioridade] }}
            </span>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="tipoBadgeClass[formEdicao.tipo]">
              {{ tipoLabels[formEdicao.tipo] }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span class="inline-flex items-center gap-1.5">
              <Calendar class="h-3.5 w-3.5" />
              {{ formatMetaDate(tarefaEmEdicao?.prazo_fim) }}
            </span>
            <span class="inline-flex items-center gap-2">
              <span
                v-if="tarefaEmEdicao"
                class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-semibold text-zinc-100"
              >
                <img
                  v-if="getResponsavelFotoUrl(tarefaEmEdicao)"
                  :src="getResponsavelFotoUrl(tarefaEmEdicao) || ''"
                  :alt="tarefaEmEdicao.responsavel_texto || 'Responsavel'"
                  class="h-full w-full object-cover"
                >
                <span v-else>{{ getResponsavelInitials(tarefaEmEdicao.responsavel_texto) }}</span>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <User class="h-3.5 w-3.5" />
                {{ tarefaEmEdicao?.responsavel_texto || 'Sem responsavel' }}
              </span>
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Timer class="h-3.5 w-3.5" />
              {{ formatMetaDateTime(tarefaEmEdicao?.updated_at) }}
            </span>
            <button
              type="button"
              class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
              @click="fecharModalEdicao"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div class="min-h-0 overflow-y-auto border-b border-zinc-800 p-6 xl:border-b-0 xl:border-r">
            <div class="space-y-6">
              <div>
                <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Titulo</label>
                <input
                  v-model="formEdicao.titulo"
                  type="text"
                  required
                  class="w-full border-0 bg-transparent px-0 text-3xl font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none"
                  placeholder="Nome da tarefa"
                >
              </div>

              <div>
                <div class="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <FileText class="h-4 w-4 text-zinc-500" />
                  <span>Descricao</span>
                </div>
                <textarea
                  v-model="formEdicao.descricao"
                  rows="7"
                  placeholder="Adicione uma descricao detalhada para esta tarefa..."
                  class="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
                />
              </div>

              <!-- Subtarefas -->
              <div>
                <div class="mb-2 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <label class="block text-sm font-medium text-zinc-300">Subtarefas</label>
                    <span v-if="subtarefasAtivas.length" class="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
                      {{ subtarefasConcluidas }}/{{ subtarefasAtivas.length }}
                    </span>
                  </div>
                </div>

                <div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div v-if="subtarefasAtivas.length" class="h-1 bg-zinc-800">
                    <div class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: `${subtarefasProgressoPct}%` }" />
                  </div>

                  <div v-if="subtarefasAtivas.length" class="divide-y divide-zinc-800/60">
                    <div
                      v-for="st in subtarefasAtivas"
                      :key="`subtarefa-${st.id}`"
                      class="group flex items-center gap-3 px-4 py-2.5"
                    >
                      <button
                        type="button"
                        class="flex-shrink-0 transition-colors"
                        :title="st.status === 'concluido' ? 'Reabrir' : 'Concluir'"
                        @click="toggleSubtarefaStatus(st)"
                      >
                        <PhCheckSquare v-if="st.status === 'concluido'" :size="18" weight="fill" class="text-emerald-400" />
                        <PhSquare v-else :size="18" class="text-zinc-500 hover:text-zinc-300" />
                      </button>
                      <span
                        class="flex-1 text-sm leading-snug"
                        :class="st.status === 'concluido' ? 'text-zinc-500 line-through' : 'text-zinc-200'"
                      >
                        {{ st.titulo }}
                      </span>
                      <button
                        type="button"
                        class="flex-shrink-0 text-zinc-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                        title="Excluir subtarefa"
                        @click="excluirSubtarefa(st.id)"
                      >
                        <PhTrash :size="14" />
                      </button>
                    </div>
                  </div>

                  <div
                    class="flex items-center gap-2 px-4 py-2.5"
                    :class="subtarefasAtivas.length ? 'border-t border-zinc-800/60' : ''"
                  >
                    <PhPlus :size="16" class="flex-shrink-0 text-zinc-600" />
                    <input
                      v-model="novaSubtarefaTitulo"
                      type="text"
                      placeholder="Adicionar subtarefa..."
                      class="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
                      :disabled="novaSubtarefaSalvando"
                      @keydown.enter.prevent="adicionarSubtarefa"
                    >
                    <button
                      v-if="novaSubtarefaTitulo.trim()"
                      type="button"
                      class="text-xs font-medium text-brand transition-opacity hover:opacity-80 disabled:opacity-50"
                      :disabled="novaSubtarefaSalvando"
                      @click="adicionarSubtarefa"
                    >
                      {{ novaSubtarefaSalvando ? '...' : 'Salvar' }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div class="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <GitBranch class="h-4 w-4 text-zinc-500" />
                    <span>Estrutura</span>
                  </div>
                  <div class="space-y-3">
                    <div>
                      <label class="mb-1 block text-[11px] uppercase tracking-wider text-zinc-500">Arvore</label>
                      <input
                        v-model="formEdicao.arvore"
                        type="text"
                        placeholder="Ex: Admin Web > Parceiro"
                        class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
                      >
                    </div>
                    <div>
                      <label class="mb-1 block text-[11px] uppercase tracking-wider text-zinc-500">Area</label>
                      <select
                        v-model="formEdicao.tipo"
                        class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
                      >
                        <option v-for="opcao in tipoOptions" :key="`modal-tipo-${opcao.value}`" :value="opcao.value">
                          {{ opcao.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div class="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <TrendingUp class="h-4 w-4 text-zinc-500" />
                    <span>Progresso</span>
                  </div>
                  <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                      <div class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3">
                        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Estimado</span>
                        <p class="mt-1 text-lg font-semibold text-zinc-100">{{ formatHoras(formEdicao.horas_estimadas) }}</p>
                      </div>
                      <div class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3">
                        <span class="text-[10px] uppercase tracking-wider text-zinc-500">Realizado</span>
                        <p class="mt-1 text-lg font-semibold text-zinc-100">{{ formatHoras(horasExecutadasEdicao) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-xs uppercase tracking-wider text-zinc-500">Tempo realizado / estimado</span>
                      <span class="text-sm font-semibold text-zinc-100">{{ progressoEdicaoCalculado }}%</span>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div class="h-full rounded-full bg-brand transition-all" :style="{ width: `${progressoEdicaoCalculado}%` }" />
                    </div>
                    <p class="text-xs text-zinc-500">O progresso e calculado automaticamente a partir do tempo estimado versus o tempo realizado.</p>
                  </div>
                </div>
              </div>

              <div>
                <div class="mb-2 flex items-center justify-between gap-3">
                  <label class="block text-sm font-medium text-zinc-300">Tags</label>
                  <span class="text-[11px] text-zinc-500">Reaproveite tags deste projeto</span>
                </div>

                <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-4">
                  <div v-if="formEdicao.tags.length" class="mb-3 flex flex-wrap gap-2">
                    <span
                      v-for="tag in formEdicao.tags"
                      :key="`edicao-tag-${tag}`"
                      class="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200"
                    >
                      <span>#{{ tag }}</span>
                      <button
                        type="button"
                        class="text-zinc-400 transition-colors hover:text-zinc-100"
                        @click="removerTagEdicao(tag)"
                      >
                        x
                      </button>
                    </span>
                  </div>

                  <div class="flex flex-col gap-2 sm:flex-row">
                    <input
                      v-model="edicaoTagInput"
                      type="text"
                      placeholder="Digite e pressione Enter ou use virgula"
                      class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
                      @keydown="onEdicaoTagKeydown"
                    >
                    <button
                      type="button"
                      class="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
                      @click="adicionarTagEdicao()"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div v-if="tagsSugestoesEdicao.length" class="mt-3 flex flex-wrap gap-2">
                    <button
                      v-for="tag in tagsSugestoesEdicao"
                      :key="`edicao-sugestao-${tag}`"
                      type="button"
                      class="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
                      @click="adicionarTagEdicao(tag)"
                    >
                      #{{ tag }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <aside class="min-h-0 overflow-y-auto bg-zinc-950/70 p-5">
            <div class="space-y-5">
              <section class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <h4 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Propriedades</h4>
                <div class="space-y-3">
                  <label class="block">
                    <span class="mb-1 block text-xs text-zinc-500">Status</span>
                    <select
                      v-model="formEdicao.status"
                      class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
                    >
                      <option v-for="opcao in statusOptions" :key="`modal-status-${opcao.value}`" :value="opcao.value">
                        {{ opcao.label }}
                      </option>
                    </select>
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-zinc-500">Prioridade</span>
                    <select
                      v-model="formEdicao.prioridade"
                      class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
                    >
                      <option v-for="opcao in prioridadeOptions" :key="`modal-prioridade-${opcao.value}`" :value="opcao.value">
                        {{ opcao.label }}
                      </option>
                    </select>
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-zinc-500">Responsavel</span>
                    <select
                      v-model="formEdicao.responsavel_equipe_id"
                      class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
                    >
                      <option value="">Sem responsavel</option>
                      <option
                        v-for="membro in equipeOptions"
                        :key="`modal-membro-${membro.id}`"
                        :value="String(membro.id)"
                      >
                        {{ membro.label }}
                      </option>
                    </select>
                  </label>

                  <div class="grid grid-cols-2 gap-3">
                    <label class="block">
                      <span class="mb-1 block text-xs text-zinc-500">Inicio</span>
                      <input
                        v-model="formEdicao.prazo_inicio"
                        type="date"
                        :max="formEdicao.prazo_fim || undefined"
                        class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
                        @change="onModalPrazoInicioChange"
                      >
                    </label>

                    <label class="block">
                      <span class="mb-1 block text-xs text-zinc-500">Prazo</span>
                      <input
                        v-model="formEdicao.prazo_fim"
                        type="date"
                        :min="formEdicao.prazo_inicio || undefined"
                        class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-700 focus:outline-none"
                        @input="onModalPrazoFimInput"
                        @change="onModalPrazoFimInput"
                      >
                    </label>
                  </div>
                </div>
              </section>

              <section class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div class="mb-3 flex items-center justify-between">
                  <h4 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Tempo</h4>
                  <button
                    v-if="tarefaEmEdicao"
                    type="button"
                    class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                    :class="tarefaRodandoId === tarefaEmEdicao.id
                      ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                      : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'"
                    :title="tarefaRodandoId === tarefaEmEdicao.id ? 'Parar cronometro' : 'Iniciar cronometro'"
                    @click.prevent="toggleTimerTarefa(tarefaEmEdicao)"
                  >
                    <PhStopCircle v-if="tarefaRodandoId === tarefaEmEdicao.id" :size="16" weight="fill" />
                    <PhPlayCircle v-else :size="16" weight="fill" />
                    {{ tarefaRodandoId === tarefaEmEdicao.id ? 'Parar' : 'Iniciar' }}
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <label class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 block">
                    <span class="text-[10px] uppercase tracking-wider text-zinc-500">Estimado</span>
                    <div class="mt-1 flex items-baseline gap-0.5">
                      <input
                        v-model.number="formEdicao.horas_estimadas"
                        type="number"
                        min="0"
                        step="0.5"
                        class="w-full bg-transparent text-2xl font-semibold text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      >
                      <span class="text-2xl font-semibold text-zinc-100 flex-shrink-0">h</span>
                    </div>
                  </label>
                  <div class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3">
                    <span class="text-[10px] uppercase tracking-wider text-zinc-500">Realizado</span>
                    <p class="mt-1 text-2xl font-semibold text-zinc-100">{{ tarefaEmEdicao ? getHorasExecutadasDisplay(tarefaEmEdicao) : '00:00:00' }}</p>
                  </div>
                </div>

                <div class="mt-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3">
                  <div class="flex items-center justify-between text-xs text-zinc-500">
                    <span>Uso da estimativa</span>
                    <span>{{ percentualUsoHoras }}%</span>
                  </div>
                  <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: `${percentualUsoHoras}%` }" />
                  </div>
                </div>
              </section>

              <section class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <h4 class="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Resumo</h4>
                <div class="space-y-2 text-sm text-zinc-300">
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-zinc-500">Criada em</span>
                    <span>{{ formatMetaDateTime(tarefaEmEdicao?.created_at) }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-zinc-500">Atualizada</span>
                    <span>{{ formatMetaDateTime(tarefaEmEdicao?.updated_at) }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-zinc-500">Janela</span>
                    <span>{{ formatPrazoRangeFromForm }}</span>
                  </div>
                </div>
              </section>

              <div class="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  class="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900"
                  @click="fecharModalEdicao"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="salvandoEdicao"
                  class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ salvandoEdicao ? 'Salvando...' : 'Salvar alteracoes' }}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace, ProjetoTarefa } from '~/composables/useProjetosWorkspace'
import { createLancamentoHora, fetchTarefasByProjetoId, updateTarefaStatus, deleteTarefa, updateTarefa, createTarefa, fetchEquipeMembros, normalizeProjetoTarefaTags } from '~/composables/useProjetosWorkspace'
import { PhPlayCircle, PhStopCircle, PhCheckSquare, PhSquare, PhTrash, PhPlus } from '@phosphor-icons/vue'
import { Minimize2, Maximize2, ChevronRight, ChevronDown, Calendar, User, Timer, X, FileText, GitBranch, TrendingUp } from 'lucide-vue-next'
import { formatHoursAsDuration } from '~/utils/duration'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const route = useRoute()
const { showConfirm, showAlert } = useUiFeedback()
const { user, loadSession } = useAuth()

await loadSession()

const { data: tarefas, pending, refresh } = await useAsyncData(
  `tarefas-proj-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id),
  {
    server: false,
    default: () => []
  }
)

const { data: equipeMembros, refresh: refreshEquipeMembros } = await useAsyncData(
  `admin-equipe-membros-tarefas-${props.projeto.id}`,
  () => fetchEquipeMembros(),
  {
    server: false,
    default: () => []
  }
)

const colunas = [
  { status: 'refinar', titulo: 'A Refinar' },
  { status: 'fazer', titulo: 'A Fazer' },
  { status: 'em_progresso', titulo: 'Em Progresso' },
  { status: 'sob_revisao', titulo: 'Sob Revisão' },
  { status: 'concluido', titulo: 'Concluído' }
] as const

const filtroBusca = ref('')
const filtroResponsavel = ref<'todos' | 'sem_responsavel' | string>('todos')
const filtroTipo = ref<ProjetoTarefa['tipo'] | 'todos'>('todos')
const filtroPrioridade = ref<ProjetoTarefa['prioridade'] | 'todos'>('todos')
const filtroDataInicio = ref('')
const filtroDataFim = ref('')
const modoVisualizacao = ref<'kanban' | 'lista'>('lista')
const filtrosExpandidos = ref(false)
type OrdenacaoCampo = 'ordem' | 'prazo' | 'horas_estimadas' | 'horas_executadas' | 'progresso' | 'titulo' | 'updated_at'
type OrdenacaoDirecao = 'asc' | 'desc'

const ordenacaoCampo = ref<OrdenacaoCampo>('prazo')
const ordenacaoDirecao = ref<OrdenacaoDirecao>('asc')
const statusReduzidos = ref<ProjetoTarefa['status'][]>([])
const tarefasSelecionadasIds = ref<number[]>([])
const dragId = ref<number | null>(null)
const menuAcoesAbertoId = ref<number | null>(null)
const menuAcoesPos = ref({ top: 0, left: 0 })
const responsavelAbertoId = ref<number | null>(null)
const responsavelPos = ref({ top: 0, left: 0 })
const salvandoResponsavelId = ref<number | null>(null)
const modalEdicaoAberto = ref(false)
const salvandoEdicao = ref(false)
const tarefaEditandoId = ref<number | null>(null)
const tarefaRodandoId = ref<number | null>(null)
const timerInicioMs = ref<number | null>(null)
const timerBaseSegundos = ref(0)
const tickMs = ref(Date.now())
let timerTickHandle: ReturnType<typeof setInterval> | null = null
const salvandoTimer = ref(false)
const workspaceTimer = useWorkspaceRunningTimerState()
const stopRequestHandledAt = ref<number | null>(null)

hydrateWorkspaceRunningTimerState()

const formEdicao = reactive({
  titulo: '',
  descricao: '',
  tags: [] as string[],
  status: 'refinar' as ProjetoTarefa['status'],
  tipo: 'funcionalidade' as ProjetoTarefa['tipo'],
  prioridade: 'media' as ProjetoTarefa['prioridade'],
  horas_estimadas: 0,
  progresso: 0,
  arvore: '',
  prazo_inicio: '',
  prazo_fim: '',
  responsavel_equipe_id: '',
})

const edicaoTagInput = ref('')
const novaSubtarefaTitulo = ref('')
const novaSubtarefaSalvando = ref(false)

function isTarefaPai(tarefa: ProjetoTarefa) {
  return tarefa.pai_id === null || tarefa.pai_id === undefined
}

const tarefasPrincipais = computed(() =>
  (tarefas.value || []).filter(isTarefaPai)
)

const subtarefasAtivas = computed(() =>
  (tarefas.value || []).filter((t) => t.pai_id === tarefaEditandoId.value)
)

const subtarefasConcluidas = computed(() =>
  subtarefasAtivas.value.filter((t) => t.status === 'concluido').length
)

const subtarefasProgressoPct = computed(() => {
  if (!subtarefasAtivas.value.length) return 0
  return Math.round((subtarefasConcluidas.value / subtarefasAtivas.value.length) * 100)
})

async function adicionarSubtarefa() {
  const titulo = novaSubtarefaTitulo.value.trim()
  if (!titulo || !tarefaEditandoId.value) return
  novaSubtarefaSalvando.value = true
  const { data, error } = await createTarefa({
    projeto_id: props.projeto.id,
    pai_id: tarefaEditandoId.value,
    titulo,
    status: 'fazer',
    tipo: 'funcionalidade',
    prioridade: 'media',
    horas_estimadas: 0,
  })
  novaSubtarefaSalvando.value = false
  if (error || !data) {
    showAlert('Erro ao criar subtarefa: ' + error, { title: 'Erro', type: 'error' })
    return
  }
  novaSubtarefaTitulo.value = ''
  tarefas.value = [...(tarefas.value || []), data]
}

async function toggleSubtarefaStatus(st: ProjetoTarefa) {
  const novoStatus: ProjetoTarefa['status'] = st.status === 'concluido' ? 'fazer' : 'concluido'
  tarefas.value = (tarefas.value || []).map((t) =>
    t.id === st.id ? { ...t, status: novoStatus } : t
  )
  await updateTarefaStatus(st.id, novoStatus)
}

async function excluirSubtarefa(id: number) {
  tarefas.value = (tarefas.value || []).filter((t) => t.id !== id)
  await deleteTarefa(id)
}

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

function getResponsavelEquipe(tarefa: ProjetoTarefa) {
  return getEquipeOptionById(tarefa.responsavel_equipe_id) || getEquipeOptionByNome(tarefa.responsavel_texto)
}

function getResponsavelFotoUrl(tarefa: ProjetoTarefa) {
  return getResponsavelEquipe(tarefa)?.foto || null
}

const responsavelFiltroOptions = computed(() => {
  const labels = new Map<string, string>()

  for (const option of equipeOptions.value) {
    const nome = option.nome.trim()
    if (!nome) continue
    labels.set(nome.toLocaleLowerCase('pt-BR'), nome)
  }

  for (const tarefa of tarefasPrincipais.value) {
    const nome = (tarefa.responsavel_texto || '').trim()
    if (!nome) continue
    const key = nome.toLocaleLowerCase('pt-BR')
    if (!labels.has(key)) {
      labels.set(key, nome)
    }
  }

  return Array.from(labels.values()).sort((left, right) => left.localeCompare(right, 'pt-BR'))
})

const membroEquipeLogado = computed(() => {
  const userId = user.value?.id || null
  if (!userId) return null

  return (equipeMembros.value || []).find((membro) => membro.uid === userId) || null
})

const ordenacaoOptions: Array<{ value: OrdenacaoCampo; label: string }> = [
  { value: 'ordem', label: 'Ordem atual' },
  { value: 'prazo', label: 'Prazo' },
  { value: 'horas_estimadas', label: 'Horas estimadas' },
  { value: 'horas_executadas', label: 'Horas executadas' },
  { value: 'progresso', label: 'Progresso' },
  { value: 'titulo', label: 'Titulo' },
  { value: 'updated_at', label: 'Ultima atualizacao' }
]

const filtrosAtivosCount = computed(() => {
  let total = 0
  if (filtroBusca.value.trim()) total += 1
  if (filtroResponsavel.value !== 'todos') total += 1
  if (filtroTipo.value !== 'todos') total += 1
  if (filtroPrioridade.value !== 'todos') total += 1
  if (filtroDataInicio.value) total += 1
  if (filtroDataFim.value) total += 1
  if (ordenacaoCampo.value !== 'prazo' || ordenacaoDirecao.value !== 'asc') total += 1
  return total
})

const statusLabels: Record<ProjetoTarefa['status'], string> = {
  refinar: 'A Refinar',
  fazer: 'A Fazer',
  em_progresso: 'Em Progresso',
  sob_revisao: 'Sob Revisao',
  concluido: 'Concluido'
}

const statusCellClass: Record<ProjetoTarefa['status'], string> = {
  refinar: 'bg-purple-600',
  fazer: 'bg-amber-500',
  em_progresso: 'bg-blue-600',
  sob_revisao: 'bg-orange-500',
  concluido: 'bg-emerald-600'
}

const statusOptions: Array<{ value: ProjetoTarefa['status']; label: string }> = [
  { value: 'refinar', label: 'Refinar' },
  { value: 'fazer', label: 'Fazer' },
  { value: 'em_progresso', label: 'Em Progresso' },
  { value: 'sob_revisao', label: 'Sob Revisao' },
  { value: 'concluido', label: 'Concluido' }
]

const prioridadeLabels: Record<ProjetoTarefa['prioridade'], string> = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente'
}

const prioridadeBadgeClass: Record<ProjetoTarefa['prioridade'], string> = {
  baixa: 'bg-zinc-800 text-zinc-300',
  media: 'bg-blue-500/15 text-blue-300',
  alta: 'bg-orange-500/15 text-orange-300',
  urgente: 'bg-red-500/15 text-red-300'
}

const prioridadeOptions: Array<{ value: ProjetoTarefa['prioridade']; label: string }> = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' }
]

const tipoLabels: Record<ProjetoTarefa['tipo'], string> = {
  funcionalidade: 'Funcionalidade',
  bug: 'Bug',
  melhoria: 'Melhoria',
  documentacao: 'Documentacao',
  design: 'Design'
}

const tipoCellClass: Record<ProjetoTarefa['tipo'], string> = {
  funcionalidade: 'bg-emerald-600',
  bug: 'bg-red-600',
  melhoria: 'bg-fuchsia-600',
  documentacao: 'bg-sky-600',
  design: 'bg-violet-600'
}

const tipoBadgeClass: Record<ProjetoTarefa['tipo'], string> = {
  funcionalidade: 'bg-emerald-500/15 text-emerald-300',
  bug: 'bg-red-500/15 text-red-300',
  melhoria: 'bg-fuchsia-500/15 text-fuchsia-300',
  documentacao: 'bg-sky-500/15 text-sky-300',
  design: 'bg-violet-500/15 text-violet-300'
}

const tipoOptions: Array<{ value: ProjetoTarefa['tipo']; label: string }> = [
  { value: 'funcionalidade', label: 'Funcionalidade' },
  { value: 'bug', label: 'Bug' },
  { value: 'melhoria', label: 'Refatura' },
  { value: 'documentacao', label: 'Documentacao' },
  { value: 'design', label: 'Design' }
]

const statusClasses: Record<ProjetoTarefa['status'], string> = {
  refinar: 'bg-purple-500/10 text-purple-300',
  fazer: 'bg-orange-500/10 text-orange-300',
  em_progresso: 'bg-blue-500/10 text-blue-300',
  sob_revisao: 'bg-yellow-500/10 text-yellow-300',
  concluido: 'bg-emerald-500/10 text-emerald-300'
}

const statusBorderLeftClass: Record<ProjetoTarefa['status'], string> = {
  refinar: 'border-l-2 border-l-purple-500/80',
  fazer: 'border-l-2 border-l-orange-400/80',
  em_progresso: 'border-l-2 border-l-blue-500/80',
  sob_revisao: 'border-l-2 border-l-yellow-400/80',
  concluido: 'border-l-2 border-l-emerald-500/80'
}

const tarefasFiltradas = computed(() => {
  const termo = filtroBusca.value.toLowerCase().trim()
  const inicioFiltroMs = getDayStartMs(filtroDataInicio.value)
  const fimFiltroMs = getDayEndMs(filtroDataFim.value)
  const currentTickMs = tickMs.value

  return [...tarefasPrincipais.value]
    .filter((tarefa) => {
      if (filtroTipo.value !== 'todos' && tarefa.tipo !== filtroTipo.value) return false
      if (filtroPrioridade.value !== 'todos' && tarefa.prioridade !== filtroPrioridade.value) return false

      const responsavelAtual = (tarefa.responsavel_texto || '').trim()
      if (filtroResponsavel.value === 'sem_responsavel' && responsavelAtual) return false
      if (filtroResponsavel.value !== 'todos' && filtroResponsavel.value !== 'sem_responsavel' && responsavelAtual !== filtroResponsavel.value) return false

      if (inicioFiltroMs !== null || fimFiltroMs !== null) {
        const inicioTarefaMs = getTaskBoundaryMs(tarefa, 'start')
        const fimTarefaMs = getTaskBoundaryMs(tarefa, 'end')

        if (inicioFiltroMs !== null && fimTarefaMs !== null && fimTarefaMs < inicioFiltroMs) return false
        if (inicioFiltroMs !== null && fimTarefaMs === null && inicioTarefaMs !== null && inicioTarefaMs < inicioFiltroMs) return false
        if (fimFiltroMs !== null && inicioTarefaMs !== null && inicioTarefaMs > fimFiltroMs) return false
        if (fimFiltroMs !== null && inicioTarefaMs === null && fimTarefaMs !== null && fimTarefaMs > fimFiltroMs) return false
        if (inicioFiltroMs !== null && fimFiltroMs !== null && inicioTarefaMs === null && fimTarefaMs === null) return false
      }

      if (!termo) return true

      const values = [
        tarefa.titulo,
        tarefa.codigo || '',
        tarefa.descricao || '',
        tarefa.arvore || '',
        tarefa.responsavel_texto || '',
        tarefa.tipo,
        tarefa.prioridade,
        ...normalizeProjetoTarefaTags(tarefa.tags)
      ].map(value => value.toLowerCase())

      return values.some(value => value.includes(termo))
    })
    .sort((left, right) => compareTarefas(left, right, currentTickMs))
})

const tagsDisponiveisProjeto = computed(() => {
  const uniqueTags = new Map<string, string>()

  for (const tarefa of tarefas.value || []) {
    for (const tag of normalizeProjetoTarefaTags(tarefa.tags)) {
      const key = tag.toLocaleLowerCase('pt-BR')
      if (!uniqueTags.has(key)) {
        uniqueTags.set(key, tag)
      }
    }
  }

  return Array.from(uniqueTags.values()).sort((left, right) => left.localeCompare(right, 'pt-BR'))
})

const tagsSugestoesEdicao = computed(() => {
  const selecionadas = new Set(formEdicao.tags.map(tag => tag.toLocaleLowerCase('pt-BR')))
  const termo = edicaoTagInput.value.trim().toLocaleLowerCase('pt-BR')

  return tagsDisponiveisProjeto.value
    .filter(tag => !selecionadas.has(tag.toLocaleLowerCase('pt-BR')))
    .filter(tag => !termo || tag.toLocaleLowerCase('pt-BR').includes(termo))
    .slice(0, 10)
})

const tarefaEmEdicao = computed(() => {
  if (!tarefaEditandoId.value) return null
  return (tarefas.value || []).find(tarefa => tarefa.id === tarefaEditandoId.value) || null
})

const percentualUsoHoras = computed(() => {
  const horasEstimadas = Math.max(0, Number(formEdicao.horas_estimadas || 0))
  const horasExecutadas = tarefaEmEdicao.value ? getHorasExecutadasValue(tarefaEmEdicao.value) : 0
  if (horasEstimadas <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((horasExecutadas / horasEstimadas) * 100)))
})

const horasExecutadasEdicao = computed(() => {
  return tarefaEmEdicao.value ? getHorasExecutadasValue(tarefaEmEdicao.value) : 0
})

const progressoEdicaoCalculado = computed(() => {
  return calculateProgressPercent(formEdicao.horas_estimadas, horasExecutadasEdicao.value)
})

const formatPrazoRangeFromForm = computed(() => {
  const tarefaPreview = {
    prazo_inicio: formEdicao.prazo_inicio || null,
    prazo_fim: formEdicao.prazo_fim || null
  } as ProjetoTarefa
  return formatPrazoRange(tarefaPreview)
})

function adicionarTagsAoArray(target: string[], rawValue: string) {
  const novasTags = normalizeProjetoTarefaTags(String(rawValue ?? '').split(','))
  if (!novasTags.length) return

  const existentes = new Set(target.map(tag => tag.toLocaleLowerCase('pt-BR')))

  for (const tag of novasTags) {
    const key = tag.toLocaleLowerCase('pt-BR')
    if (existentes.has(key)) continue
    existentes.add(key)
    target.push(tag)
  }
}

function adicionarTagEdicao(rawValue = edicaoTagInput.value) {
  adicionarTagsAoArray(formEdicao.tags, rawValue)
  edicaoTagInput.value = ''
}

function removerTagEdicao(tagToRemove: string) {
  formEdicao.tags = formEdicao.tags.filter(tag => tag !== tagToRemove)
}

function onEdicaoTagKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ',') return
  event.preventDefault()
  adicionarTagEdicao()
}

const tarefasPorStatus = computed(() => {
  const map = Object.fromEntries(colunas.map(c => [c.status, [] as ProjetoTarefa[]])) as Record<string, ProjetoTarefa[]>

  for (const t of tarefasFiltradas.value) {
    if (map[t.status]) {
      map[t.status].push(t)
    }
  }
  return map
})

const resumoStatus = computed(() => {
  const currentTickMs = tickMs.value

  const formatarDataResumo = (value: string | null | undefined) => {
    if (!value) return '--'

    const data = new Date(value)
    if (Number.isNaN(data.getTime())) return '--'

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data)
  }

  return Object.fromEntries(
    colunas.map((coluna) => {
      const itens = tarefasPorStatus.value[coluna.status] || []
      const inicios = itens
        .map(item => item.prazo_inicio)
        .filter((value): value is string => Boolean(value))
      const fins = itens
        .map(item => item.prazo_fim)
        .filter((value): value is string => Boolean(value))
      const horasEstimadas = itens.reduce((acc, item) => acc + Number(item.horas_estimadas || 0), 0)
      const horasExecutadas = itens.reduce((acc, item) => acc + getHorasExecutadasValueAt(item, currentTickMs), 0)
      const progressoMedio = itens.length
        ? Math.round(itens.reduce((acc, item) => acc + getTarefaProgressoAt(item, currentTickMs), 0) / itens.length)
        : 0

      return [
        coluna.status,
        {
          inicio: formatarDataResumo(inicios.sort()[0]),
          fim: formatarDataResumo(fins.sort().at(-1)),
          horas: `${formatHoras(horasExecutadas)} / ${formatHoras(horasEstimadas)}`,
          progresso: `${progressoMedio}%`
        }
      ]
    })
  ) as Record<ProjetoTarefa['status'], { inicio: string; fim: string; horas: string; progresso: string }>
})

function isTarefaSelecionada(id: number) {
  return tarefasSelecionadasIds.value.includes(id)
}

function toggleSelecaoTarefa(id: number, checked: boolean) {
  if (checked) {
    if (!tarefasSelecionadasIds.value.includes(id)) {
      tarefasSelecionadasIds.value = [...tarefasSelecionadasIds.value, id]
    }
    return
  }

  tarefasSelecionadasIds.value = tarefasSelecionadasIds.value.filter(itemId => itemId !== id)
}

function isStatusSelecionado(status: ProjetoTarefa['status']) {
  const ids = (tarefasPorStatus.value[status] || []).map(tarefa => tarefa.id)
  return ids.length > 0 && ids.every(id => tarefasSelecionadasIds.value.includes(id))
}

function isStatusReduzido(status: ProjetoTarefa['status']) {
  return statusReduzidos.value.includes(status)
}

function toggleStatusReducao(status: ProjetoTarefa['status']) {
  if (isStatusReduzido(status)) {
    statusReduzidos.value = statusReduzidos.value.filter(item => item !== status)
    return
  }

  statusReduzidos.value = [...statusReduzidos.value, status]
}

function expandirTodosStatus() {
  statusReduzidos.value = []
}

function reduzirTodosStatus() {
  statusReduzidos.value = colunas.map(coluna => coluna.status)
}

function toggleSelecaoStatus(status: ProjetoTarefa['status'], checked: boolean) {
  const idsStatus = (tarefasPorStatus.value[status] || []).map(tarefa => tarefa.id)
  if (!idsStatus.length) return

  if (checked) {
    const selecionadas = new Set(tarefasSelecionadasIds.value)
    for (const id of idsStatus) {
      selecionadas.add(id)
    }
    tarefasSelecionadasIds.value = Array.from(selecionadas)
    return
  }

  const idsStatusSet = new Set(idsStatus)
  tarefasSelecionadasIds.value = tarefasSelecionadasIds.value.filter(id => !idsStatusSet.has(id))
}

function formatHoras(value: number): string {
  return formatHoursAsDuration(value)
}

function getDayStartMs(value: string | null | undefined): number | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function getDayEndMs(value: string | null | undefined): number | null {
  if (!value) return null
  const date = new Date(`${value}T23:59:59.999`)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function getTaskBoundaryMs(tarefa: ProjetoTarefa, boundary: 'start' | 'end'): number | null {
  const primary = boundary === 'start' ? tarefa.prazo_inicio : tarefa.prazo_fim
  const fallback = boundary === 'start' ? tarefa.prazo_fim : tarefa.prazo_inicio
  const value = primary || fallback
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function compareNullableNumbers(left: number | null, right: number | null, direction: OrdenacaoDirecao) {
  if (left === null && right === null) return 0
  if (left === null) return 1
  if (right === null) return -1
  return direction === 'asc' ? left - right : right - left
}

function compareNullableStrings(left: string | null | undefined, right: string | null | undefined, direction: OrdenacaoDirecao) {
  const leftValue = (left || '').trim().toLocaleLowerCase('pt-BR')
  const rightValue = (right || '').trim().toLocaleLowerCase('pt-BR')

  if (!leftValue && !rightValue) return 0
  if (!leftValue) return 1
  if (!rightValue) return -1

  return direction === 'asc'
    ? leftValue.localeCompare(rightValue, 'pt-BR')
    : rightValue.localeCompare(leftValue, 'pt-BR')
}

function compareTarefas(left: ProjetoTarefa, right: ProjetoTarefa, currentTickMs: number) {
  const direction = ordenacaoDirecao.value

  switch (ordenacaoCampo.value) {
    case 'prazo': {
      const result = compareNullableNumbers(getTaskBoundaryMs(left, 'end'), getTaskBoundaryMs(right, 'end'), direction)
      if (result !== 0) return result
      break
    }
    case 'horas_estimadas': {
      const result = compareNullableNumbers(Number(left.horas_estimadas || 0), Number(right.horas_estimadas || 0), direction)
      if (result !== 0) return result
      break
    }
    case 'horas_executadas': {
      const result = compareNullableNumbers(getHorasExecutadasValueAt(left, currentTickMs), getHorasExecutadasValueAt(right, currentTickMs), direction)
      if (result !== 0) return result
      break
    }
    case 'progresso': {
      const result = compareNullableNumbers(getTarefaProgressoAt(left, currentTickMs), getTarefaProgressoAt(right, currentTickMs), direction)
      if (result !== 0) return result
      break
    }
    case 'titulo': {
      const result = compareNullableStrings(left.titulo, right.titulo, direction)
      if (result !== 0) return result
      break
    }
    case 'updated_at': {
      const result = compareNullableNumbers(
        left.updated_at ? new Date(left.updated_at).getTime() : null,
        right.updated_at ? new Date(right.updated_at).getTime() : null,
        direction
      )
      if (result !== 0) return result
      break
    }
    case 'ordem':
    default: {
      const result = compareNullableNumbers(Number(left.ordem_coluna || 0), Number(right.ordem_coluna || 0), direction)
      if (result !== 0) return result
      break
    }
  }

  const prazoFallback = compareNullableNumbers(getTaskBoundaryMs(left, 'end'), getTaskBoundaryMs(right, 'end'), 'asc')
  if (prazoFallback !== 0) return prazoFallback

  return compareNullableStrings(left.titulo, right.titulo, 'asc')
}

function limparFiltros() {
  filtroBusca.value = ''
  filtroResponsavel.value = 'todos'
  filtroTipo.value = 'todos'
  filtroPrioridade.value = 'todos'
  filtroDataInicio.value = ''
  filtroDataFim.value = ''
  ordenacaoCampo.value = 'prazo'
  ordenacaoDirecao.value = 'asc'
}

function onFiltroDataInicioChange() {
  if (filtroDataInicio.value && filtroDataFim.value && filtroDataFim.value < filtroDataInicio.value) {
    filtroDataFim.value = filtroDataInicio.value
  }
}

function onFiltroDataFimInput() {
  if (!filtroDataInicio.value) {
    filtroDataFim.value = ''
    showAlert('Selecione primeiro a data de inicio.', { title: 'Aviso', type: 'warning' })
    return
  }

  if (filtroDataFim.value && filtroDataFim.value < filtroDataInicio.value) {
    filtroDataFim.value = filtroDataInicio.value
    showAlert('A data de fim nao pode ser menor que a data de inicio.', { title: 'Aviso', type: 'warning' })
  }
}

function onModalPrazoInicioChange() {
  if (formEdicao.prazo_inicio && formEdicao.prazo_fim && formEdicao.prazo_fim < formEdicao.prazo_inicio) {
    formEdicao.prazo_fim = formEdicao.prazo_inicio
    showAlert('A data de fim deve ser maior ou igual a data de inicio.', { title: 'Aviso', type: 'warning' })
  }
}

function onModalPrazoFimInput() {
  if (!formEdicao.prazo_inicio || !formEdicao.prazo_fim) return

  if (formEdicao.prazo_fim < formEdicao.prazo_inicio) {
    formEdicao.prazo_fim = formEdicao.prazo_inicio
    showAlert('A data de fim deve ser maior ou igual a data de inicio.', { title: 'Aviso', type: 'warning' })
  }
}

watch([filtroDataInicio, filtroDataFim], ([inicio, fim], [inicioAnterior, fimAnterior]) => {
  if (!inicio || !fim || fim >= inicio) return

  if (inicio !== inicioAnterior) {
    filtroDataFim.value = inicio
    return
  }

  filtroDataFim.value = fimAnterior && fimAnterior >= inicio ? fimAnterior : inicio
  showAlert('A data de fim nao pode ser menor que a data de inicio.', { title: 'Aviso', type: 'warning' })
})

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return ''
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : ''
}

function capitalizeLabel(value: string) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatMetaDate(value: string | null | undefined): string {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date).replace('.', '')
}

function formatMetaDateTime(value: string | null | undefined): string {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date).replace(',', ' as')
}

function getResponsavelInitials(nome: string | null): string {
  if (!nome) return '-'
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '-'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
}

function formatPrazoRange(t: ProjetoTarefa): string {
  const toDate = (value: string | null) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d
  }

  const inicio = toDate(t.prazo_inicio)
  const fim = toDate(t.prazo_fim)

  const fmt = (d: Date | null) => d
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(d)
      .replace('.', '')
    : '--'

  if (!inicio && !fim) return '--'
  if (!inicio && fim) return fmt(fim)
  if (inicio && !fim) return fmt(inicio)
  return `${fmt(inicio)} -> ${fmt(fim)}`
}

type PrazoStatusMeta = {
  label: string
  className: string
}

function getPrazoStatusMeta(t: ProjetoTarefa): PrazoStatusMeta {
  if (t.status === 'concluido') {
    return {
      label: 'Concluido',
      className: 'border-zinc-700 bg-zinc-900/50 text-zinc-400'
    }
  }

  if (!t.prazo_fim) {
    return {
      label: 'Sem prazo',
      className: 'border-zinc-700 bg-zinc-900 text-zinc-300'
    }
  }

  const dataFim = new Date(`${toDateInputValue(t.prazo_fim)}T00:00:00`)
  if (Number.isNaN(dataFim.getTime())) {
    return {
      label: 'Sem prazo',
      className: 'border-zinc-700 bg-zinc-900 text-zinc-300'
    }
  }

  const hoje = new Date()
  const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const msPorDia = 1000 * 60 * 60 * 24
  const diffDias = Math.ceil((dataFim.getTime() - hojeInicio.getTime()) / msPorDia)

  if (diffDias < -3) {
    return {
      label: 'Atrasado com urgencia',
      className: 'border-rose-500/40 bg-rose-900/50 text-rose-200'
    }
  }

  if (diffDias < 0) {
    return {
      label: 'Atrasado',
      className: 'border-red-500/40 bg-red-900/50 text-red-200'
    }
  }

  if (diffDias <= 2) {
    return {
      label: 'Proximo de vencer',
      className: 'border-amber-500/40 bg-amber-900/50 text-amber-200'
    }
  }

  return {
    label: 'No prazo',
    className: 'border-emerald-500/40 bg-emerald-900/40 text-emerald-200'
  }
}

async function selecionarStatus(tarefa: ProjetoTarefa, novoStatus: ProjetoTarefa['status']) {
  if (tarefa.status === novoStatus) return

  const statusAnterior = tarefa.status
  tarefas.value = (tarefas.value || []).map((item) =>
    item.id === tarefa.id ? { ...item, status: novoStatus } : item
  )

  const { error } = await updateTarefaStatus(tarefa.id, novoStatus)
  if (error) {
    tarefas.value = (tarefas.value || []).map((item) =>
      item.id === tarefa.id ? { ...item, status: statusAnterior } : item
    )
    showAlert('Erro ao atualizar status: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  await refresh()
}

async function selecionarTipo(tarefa: ProjetoTarefa, novoTipo: ProjetoTarefa['tipo']) {
  if (tarefa.tipo === novoTipo) return

  const tipoAnterior = tarefa.tipo
  tarefas.value = (tarefas.value || []).map((item) =>
    item.id === tarefa.id ? { ...item, tipo: novoTipo } : item
  )

  const { error } = await updateTarefa(tarefa.id, { tipo: novoTipo })
  if (error) {
    tarefas.value = (tarefas.value || []).map((item) =>
      item.id === tarefa.id ? { ...item, tipo: tipoAnterior } : item
    )
    showAlert('Erro ao atualizar tipo: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  await refresh()
}

async function alterarStatusInline(tarefa: ProjetoTarefa, novoStatus: ProjetoTarefa['status']) {
  await selecionarStatus(tarefa, novoStatus)
}

async function alterarTipoInline(tarefa: ProjetoTarefa, novoTipo: ProjetoTarefa['tipo']) {
  await selecionarTipo(tarefa, novoTipo)
}

function updateResponsavelPos() {
  if (!responsavelAbertoId.value) return
  const btn = document.querySelector(`button[data-responsavel-id="${responsavelAbertoId.value}"]`) as HTMLElement | null
  if (btn) {
    const rect = btn.getBoundingClientRect()
    responsavelPos.value = {
      top: rect.bottom + 6,
      left: rect.left
    }
  }
}

function toggleResponsavelInline(id: number) {
  if (responsavelAbertoId.value === id) {
    responsavelAbertoId.value = null
    return
  }
  responsavelAbertoId.value = id
  nextTick(() => updateResponsavelPos())
}

async function alterarResponsavelInline(tarefa: ProjetoTarefa, novoResponsavel: string) {
  const equipeSelecionada = getEquipeOptionById(novoResponsavel)
  const responsavelEquipeId = equipeSelecionada?.id ?? null
  const responsavelNormalizado = equipeSelecionada?.nome || null
  const responsavelEquipeAnterior = tarefa.responsavel_equipe_id ?? null
  const responsavelAnterior = tarefa.responsavel_texto || null

  if (responsavelAnterior === responsavelNormalizado && responsavelEquipeAnterior === responsavelEquipeId) {
    responsavelAbertoId.value = null
    return
  }

  salvandoResponsavelId.value = tarefa.id
  tarefas.value = (tarefas.value || []).map((item) =>
    item.id === tarefa.id ? { ...item, responsavel_equipe_id: responsavelEquipeId, responsavel_texto: responsavelNormalizado } : item
  )

  const { error } = await updateTarefa(tarefa.id, {
    responsavel_equipe_id: responsavelEquipeId
  })

  salvandoResponsavelId.value = null

  if (error) {
    tarefas.value = (tarefas.value || []).map((item) =>
      item.id === tarefa.id ? { ...item, responsavel_equipe_id: responsavelEquipeAnterior, responsavel_texto: responsavelAnterior } : item
    )
    showAlert('Erro ao atualizar responsavel: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  responsavelAbertoId.value = null
  await refresh()
}

function formatPrazo(t: ProjetoTarefa): string {
  if (!t.prazo_inicio && !t.prazo_fim) return '-'

  const toDate = (value: string | null) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d
  }

  const inicio = toDate(t.prazo_inicio)
  const fim = toDate(t.prazo_fim)

  const fmt = (d: Date | null) => d
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
    : '-'

  if (!inicio && fim) return fmt(fim)
  if (inicio && !fim) return fmt(inicio)
  return `${fmt(inicio)} - ${fmt(fim)}`
}

function formatProgresso(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return `${Math.max(0, Math.min(100, Math.round(Number(value))))}%`
}

function calculateProgressPercent(horasEstimadas: number | null | undefined, horasExecutadas: number | null | undefined): number {
  const estimado = Math.max(0, Number(horasEstimadas || 0))
  const realizado = Math.max(0, Number(horasExecutadas || 0))

  if (estimado <= 0) {
    return realizado > 0 ? 100 : 0
  }

  return Math.max(0, Math.min(100, Math.round((realizado / estimado) * 100)))
}

function getTimerAutorTexto(fallback?: string | null) {
  const metadata = user.value?.user_metadata || {}
  const candidates = [
    metadata.nome,
    metadata.name,
    metadata.full_name,
    metadata.display_name,
    metadata.user_name,
    user.value?.email?.split('@')[0]?.replace(/[._-]+/g, ' '),
    fallback
  ]

  for (const candidate of candidates) {
    const normalized = String(candidate ?? '').trim()
    if (normalized) return normalized
  }

  return null
}

function getTimerAutorContext() {
  return {
    equipeId: membroEquipeLogado.value?.id ?? null,
    autorUid: user.value?.id ?? null,
  }
}

function getHorasExecutadasValueAt(t: ProjetoTarefa, currentTickMs: number): number {
  if (tarefaRodandoId.value !== t.id || !timerInicioMs.value) {
    return Number(t.horas_executadas || 0)
  }

  const elapsedSegundos = Math.floor((currentTickMs - timerInicioMs.value) / 1000)
  const totalSegundos = timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  return totalSegundos / 3600
}

function getHorasExecutadasValue(t: ProjetoTarefa): number {
  return getHorasExecutadasValueAt(t, tickMs.value)
}

function getTarefaProgressoAt(t: ProjetoTarefa, currentTickMs: number): number {
  return calculateProgressPercent(t.horas_estimadas, getHorasExecutadasValueAt(t, currentTickMs))
}

function getTarefaProgresso(t: ProjetoTarefa): number {
  return getTarefaProgressoAt(t, tickMs.value)
}

function getHorasExecutadasDisplay(t: ProjetoTarefa): string {
  return formatHoras(getHorasExecutadasValue(t))
}

function iniciarTickTimer() {
  if (timerTickHandle) return
  timerTickHandle = setInterval(() => {
    tickMs.value = Date.now()
    atualizarWorkspaceTimerEstado()
  }, 1000)
}

function pararTickTimer() {
  if (!timerTickHandle) return
  clearInterval(timerTickHandle)
  timerTickHandle = null
}

function atualizarWorkspaceTimerEstado() {
  if (!tarefaRodandoId.value || !timerInicioMs.value) return

  const tarefaAtual = (tarefas.value || []).find((t) => t.id === tarefaRodandoId.value)
  if (!tarefaAtual) return

  const elapsedSegundos = Math.floor((tickMs.value - timerInicioMs.value) / 1000)
  persistWorkspaceRunningTimerState({
    ...workspaceTimer.value,
    active: true,
    projetoId: props.projeto.id,
    tarefaId: tarefaAtual.id,
    tarefaCodigo: tarefaAtual.codigo || `T-${tarefaAtual.id}`,
    tarefaTitulo: tarefaAtual.titulo || '',
    startedAtMs: timerInicioMs.value,
    baseSegundos: timerBaseSegundos.value,
    elapsedSegundos: timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  })
}

function restaurarTimerDaWorkspace() {
  const timerAtivo = workspaceTimer.value

  if (!timerAtivo.active || timerAtivo.projetoId !== props.projeto.id || !timerAtivo.tarefaId || !timerAtivo.startedAtMs) {
    return
  }

  const tarefaAtual = (tarefas.value || []).find((t) => t.id === timerAtivo.tarefaId)
  if (!tarefaAtual) {
    return
  }

  if (tarefaRodandoId.value === tarefaAtual.id && timerInicioMs.value === timerAtivo.startedAtMs) {
    return
  }

  tarefaRodandoId.value = tarefaAtual.id
  timerBaseSegundos.value = Math.max(0, Math.floor(timerAtivo.baseSegundos || 0))
  timerInicioMs.value = timerAtivo.startedAtMs
  tickMs.value = Date.now()
  atualizarWorkspaceTimerEstado()
  iniciarTickTimer()
}

function aplicarLancamentoTimerLocal(id: number, horasSessao: number) {
  tarefas.value = (tarefas.value || []).map((tarefa) => {
    if (tarefa.id !== id) return tarefa

    const horasExecutadas = Number((Number(tarefa.horas_executadas || 0) + horasSessao).toFixed(4))
    return {
      ...tarefa,
      horas_executadas: horasExecutadas,
      progresso: calculateProgressPercent(tarefa.horas_estimadas, horasExecutadas)
    }
  })
}

async function registrarSessaoTimer(tarefa: ProjetoTarefa, duracaoSegundos: number, startedAtMs: number) {
  if (duracaoSegundos <= 0) {
    return true
  }

  const finalizadoEm = new Date()
  const iniciadoEm = new Date(startedAtMs)
  const horasSessao = Number((duracaoSegundos / 3600).toFixed(4))
  const autorContext = getTimerAutorContext()
  const { error } = await createLancamentoHora({
    projeto_id: tarefa.projeto_id,
    tarefa_id: tarefa.id,
    equipe_id: autorContext.equipeId,
    autor_uid: autorContext.autorUid,
    data: finalizadoEm.toISOString().slice(0, 10),
    descricao: `Cronometro: ${tarefa.codigo || `T-${tarefa.id}`} ${tarefa.titulo}`,
    horas: horasSessao,
    tipo: 'execucao',
    autor_texto: getTimerAutorTexto(tarefa.responsavel_texto),
    iniciado_em: iniciadoEm.toISOString(),
    finalizado_em: finalizadoEm.toISOString(),
    duracao_segundos: duracaoSegundos
  })

  if (error) {
    showAlert('Erro ao registrar sessão de tempo: ' + error, { title: 'Erro', type: 'error' })
    return false
  }

  aplicarLancamentoTimerLocal(tarefa.id, horasSessao)
  return true
}

async function pararTimerAtual() {
  if (!tarefaRodandoId.value || !timerInicioMs.value) return true
  if (salvandoTimer.value) return false

  salvandoTimer.value = true
  const elapsedSegundos = Math.max(Math.floor((Date.now() - timerInicioMs.value) / 1000), 0)
  const taskId = tarefaRodandoId.value
  const tarefaAtual = (tarefas.value || []).find((t) => t.id === taskId)

  const ok = tarefaAtual ? await registrarSessaoTimer(tarefaAtual, elapsedSegundos, timerInicioMs.value) : false
  salvandoTimer.value = false
  if (!ok) return false

  tarefaRodandoId.value = null
  timerInicioMs.value = null
  timerBaseSegundos.value = 0
  pararTickTimer()
  resetWorkspaceRunningTimerState()
  return true
}

async function toggleTimerTarefa(tarefa: ProjetoTarefa) {
  if (salvandoTimer.value) return

  if (tarefaRodandoId.value === tarefa.id) {
    const ok = await pararTimerAtual()
    if (ok) {
      showAlert('Cronometro pausado.', { title: 'Tempo', type: 'info', duration: 1800 })
    }
    return
  }

  if (tarefaRodandoId.value && tarefaRodandoId.value !== tarefa.id) {
    const ok = await pararTimerAtual()
    if (!ok) return
  }

  tarefaRodandoId.value = tarefa.id
  timerBaseSegundos.value = Math.floor(Number(tarefa.horas_executadas || 0) * 3600)
  timerInicioMs.value = Date.now()
  tickMs.value = Date.now()
  atualizarWorkspaceTimerEstado()
  iniciarTickTimer()
  showAlert('Cronometro iniciado para esta tarefa.', { title: 'Tempo', type: 'success', duration: 1800 })
}

watch(
  () => workspaceTimer.value.stopRequestAt,
  async (stopRequestAt) => {
    if (!stopRequestAt) return
    if (stopRequestHandledAt.value === stopRequestAt) return
    stopRequestHandledAt.value = stopRequestAt

    if (!workspaceTimer.value.active) return
    if (workspaceTimer.value.projetoId !== props.projeto.id) return

    await pararTimerAtual()
  }
)

watch(
  tarefas,
  () => {
    restaurarTimerDaWorkspace()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  pararTickTimer()
})

function onDragStart(id: number) {
  dragId.value = id
}

function fecharMenuAcoes() {
  menuAcoesAbertoId.value = null
}

function fecharSeletorResponsavel() {
  responsavelAbertoId.value = null
}

const menuAcoesFloatingStyle = computed(() => ({
  top: menuAcoesPos.value.top + 'px',
  left: menuAcoesPos.value.left + 'px'
}))

const responsavelFloatingStyle = computed(() => ({
  top: responsavelPos.value.top + 'px',
  left: responsavelPos.value.left + 'px'
}))

const responsavelTarefaAberta = computed(() => {
  if (!responsavelAbertoId.value) return null
  return tarefas.value.find(t => t.id === responsavelAbertoId.value) ?? null
})

function updateMenuAcoesPos() {
  if (!menuAcoesAbertoId.value) return
  const btn = document.querySelector(`button[data-tarefa-id="${menuAcoesAbertoId.value}"]`) as HTMLElement | null
  if (btn) {
    const rect = btn.getBoundingClientRect()
    menuAcoesPos.value = {
      top: rect.bottom + 6,
      left: rect.right - 160
    }
  }
}

function toggleMenuAcoes(id: number) {
  if (menuAcoesAbertoId.value === id) {
    menuAcoesAbertoId.value = null
    return
  }

  menuAcoesAbertoId.value = id
  nextTick(() => updateMenuAcoesPos())
}

async function abrirEdicaoPeloMenu(id: number) {
  fecharMenuAcoes()
  await editarTarefa(id)
}

async function excluirPeloMenu(id: number) {
  fecharMenuAcoes()
  await excluirTarefa(id)
}

async function onDrop(newStatus: string) {
  const id = dragId.value
  dragId.value = null
  if (!id) return

  const current = tarefas.value || []
  const idx = current.findIndex(x => x.id === id)
  if (idx === -1) return

  const tarefaAtual = current[idx]
  if (tarefaAtual.status === newStatus) return

  const oldStatus = tarefaAtual.status

  // Atualiza de forma imutavel para garantir reatividade imediata no computed
  tarefas.value = current.map((t) =>
    t.id === id ? { ...t, status: newStatus as ProjetoTarefa['status'] } : t
  )

  const { error } = await updateTarefaStatus(id, newStatus as ProjetoTarefa['status'])
  if (error) {
    tarefas.value = (tarefas.value || []).map((t) =>
      t.id === id ? { ...t, status: oldStatus } : t
    )
    alert('Erro ao mover tarefa: ' + error)
    return
  }

  await refresh()
}

async function editarTarefa(id: number) {
  if (!(equipeMembros.value || []).length) {
    await refreshEquipeMembros()
  }

  const tarefa = (tarefas.value || []).find((t) => t.id === id)
  if (!tarefa) {
    showAlert('Tarefa nao encontrada para edicao.', { title: 'Aviso', type: 'warning' })
    return
  }

  tarefaEditandoId.value = tarefa.id
  formEdicao.titulo = tarefa.titulo || ''
  formEdicao.descricao = tarefa.descricao || ''
  formEdicao.tags = normalizeProjetoTarefaTags(tarefa.tags)
  formEdicao.status = tarefa.status
  formEdicao.tipo = tarefa.tipo
  formEdicao.prioridade = tarefa.prioridade
  formEdicao.horas_estimadas = Number(tarefa.horas_estimadas) || 0
  formEdicao.progresso = calculateProgressPercent(tarefa.horas_estimadas, getHorasExecutadasValue(tarefa))
  formEdicao.arvore = tarefa.arvore || ''
  formEdicao.prazo_inicio = toDateInputValue(tarefa.prazo_inicio)
  formEdicao.prazo_fim = toDateInputValue(tarefa.prazo_fim)
  formEdicao.responsavel_equipe_id = tarefa.responsavel_equipe_id ? String(tarefa.responsavel_equipe_id) : ''
  edicaoTagInput.value = ''
  modalEdicaoAberto.value = true
}

async function abrirTarefaPelaQuery() {
  const tarefaId = Number(route.query.tarefa)
  if (!Number.isFinite(tarefaId) || tarefaId <= 0) return
  if (modalEdicaoAberto.value && tarefaEditandoId.value === tarefaId) return

  const tarefaExiste = (tarefas.value || []).some((t) => t.id === tarefaId)
  if (!tarefaExiste) return

  await editarTarefa(tarefaId)
}

function fecharModalEdicao() {
  if (salvandoEdicao.value) return
  modalEdicaoAberto.value = false
  tarefaEditandoId.value = null
  edicaoTagInput.value = ''
  novaSubtarefaTitulo.value = ''
}

async function salvarEdicaoTarefa() {
  if (!tarefaEditandoId.value) return
  if (!formEdicao.titulo.trim()) {
    showAlert('Informe um titulo para a tarefa.', { title: 'Aviso', type: 'warning' })
    return
  }
  if (formEdicao.prazo_inicio && formEdicao.prazo_fim && formEdicao.prazo_fim < formEdicao.prazo_inicio) {
    showAlert('A data de fim deve ser maior ou igual a data de inicio.', { title: 'Aviso', type: 'warning' })
    return
  }

  salvandoEdicao.value = true
  const id = tarefaEditandoId.value

  const payload = {
    titulo: formEdicao.titulo.trim(),
    descricao: formEdicao.descricao.trim() || null,
    tags: formEdicao.tags,
    status: formEdicao.status,
    tipo: formEdicao.tipo,
    prioridade: formEdicao.prioridade,
    horas_estimadas: Number(formEdicao.horas_estimadas) || 0,
    progresso: calculateProgressPercent(Number(formEdicao.horas_estimadas) || 0, tarefaEmEdicao.value ? getHorasExecutadasValue(tarefaEmEdicao.value) : 0),
    arvore: formEdicao.arvore.trim() || null,
    prazo_inicio: formEdicao.prazo_inicio || null,
    prazo_fim: formEdicao.prazo_fim || null,
    responsavel_equipe_id: parseEquipeSelectValue(formEdicao.responsavel_equipe_id),
  }

  const { error } = await updateTarefa(id, payload)
  if (error) {
    showAlert('Erro ao salvar tarefa: ' + error, { title: 'Erro', type: 'error' })
    salvandoEdicao.value = false
    return
  }

  tarefas.value = (tarefas.value || []).map((t) =>
    t.id === id ? { ...t, ...payload } : t
  )

  await refresh()
  salvandoEdicao.value = false
  fecharModalEdicao()
  showAlert('Tarefa atualizada com sucesso.', { title: 'Sucesso', type: 'success' })
}

async function excluirTarefa(id: number) {
  if (tarefaRodandoId.value === id) {
    const okStop = await pararTimerAtual()
    if (!okStop) return
  }

  const ok = await showConfirm({
    title: 'Excluir tarefa',
    message: 'Deseja realmente excluir esta tarefa? Esta ação não pode ser desfeita.',
    confirmLabel: 'Excluir tarefa',
    cancelLabel: 'Cancelar',
    danger: true,
  })
  if (!ok) return

  const { error } = await deleteTarefa(id)
  if (error) {
    showAlert('Erro ao excluir tarefa: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  refresh()
}

function handleDocumentClick() {
  fecharSeletorResponsavel()
  fecharMenuAcoes()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})

// Manter dropdowns flutuantes ancorados aos botões durante scroll
function addScrollListeners(handler: () => void) {
  const mainEl = document.querySelector('main')
  mainEl?.addEventListener('scroll', handler, { passive: true })
  window.addEventListener('scroll', handler, { passive: true })
}

function removeScrollListeners(handler: () => void) {
  const mainEl = document.querySelector('main')
  mainEl?.removeEventListener('scroll', handler)
  window.removeEventListener('scroll', handler)
}

watch(responsavelAbertoId, (val) => {
  if (val !== null) addScrollListeners(updateResponsavelPos)
  else removeScrollListeners(updateResponsavelPos)
})

watch(menuAcoesAbertoId, (val) => {
  if (val !== null) addScrollListeners(updateMenuAcoesPos)
  else removeScrollListeners(updateMenuAcoesPos)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3f3f46;
  border-radius: 10px;
}
</style>