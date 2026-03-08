export interface WorkspaceRunningTimerState {
    active: boolean
    projetoId: number | null
    tarefaId: number | null
    tarefaCodigo: string
    tarefaTitulo: string
    startedAtMs: number | null
    baseSegundos: number
    elapsedSegundos: number
    stopRequestAt: number | null
}

const WORKSPACE_RUNNING_TIMER_STORAGE_KEY = 'vale-apps.workspace-running-timer'

function initialWorkspaceRunningTimerState(): WorkspaceRunningTimerState {
    return {
        active: false,
        projetoId: null,
        tarefaId: null,
        tarefaCodigo: '',
        tarefaTitulo: '',
        startedAtMs: null,
        baseSegundos: 0,
        elapsedSegundos: 0,
        stopRequestAt: null
    }
}

function sanitizeWorkspaceRunningTimerState(value: unknown): WorkspaceRunningTimerState {
    const initial = initialWorkspaceRunningTimerState()

    if (!value || typeof value !== 'object') {
        return initial
    }

    const parsed = value as Partial<WorkspaceRunningTimerState>
    const toNullableNumber = (input: unknown) => typeof input === 'number' && Number.isFinite(input) ? input : null
    const toNumber = (input: unknown, fallback = 0) => typeof input === 'number' && Number.isFinite(input) ? input : fallback

    return {
        active: parsed.active === true,
        projetoId: toNullableNumber(parsed.projetoId),
        tarefaId: toNullableNumber(parsed.tarefaId),
        tarefaCodigo: typeof parsed.tarefaCodigo === 'string' ? parsed.tarefaCodigo : '',
        tarefaTitulo: typeof parsed.tarefaTitulo === 'string' ? parsed.tarefaTitulo : '',
        startedAtMs: toNullableNumber(parsed.startedAtMs),
        baseSegundos: toNumber(parsed.baseSegundos),
        elapsedSegundos: toNumber(parsed.elapsedSegundos),
        stopRequestAt: toNullableNumber(parsed.stopRequestAt)
    }
}

export function useWorkspaceRunningTimerState() {
    return useState<WorkspaceRunningTimerState>('workspace-running-timer', initialWorkspaceRunningTimerState)
}

export function hydrateWorkspaceRunningTimerState() {
    const state = useWorkspaceRunningTimerState()

    if (!import.meta.client) {
        return state
    }

    try {
        const raw = window.localStorage.getItem(WORKSPACE_RUNNING_TIMER_STORAGE_KEY)
        if (!raw) {
            state.value = initialWorkspaceRunningTimerState()
            return state
        }

        state.value = sanitizeWorkspaceRunningTimerState(JSON.parse(raw))
    } catch {
        state.value = initialWorkspaceRunningTimerState()
        window.localStorage.removeItem(WORKSPACE_RUNNING_TIMER_STORAGE_KEY)
    }

    return state
}

export function persistWorkspaceRunningTimerState(nextState?: WorkspaceRunningTimerState) {
    const state = useWorkspaceRunningTimerState()

    if (nextState) {
        state.value = nextState
    }

    if (!import.meta.client) {
        return state
    }

    if (!state.value.active) {
        window.localStorage.removeItem(WORKSPACE_RUNNING_TIMER_STORAGE_KEY)
        return state
    }

    window.localStorage.setItem(WORKSPACE_RUNNING_TIMER_STORAGE_KEY, JSON.stringify(state.value))
    return state
}

export function resetWorkspaceRunningTimerState() {
    persistWorkspaceRunningTimerState(initialWorkspaceRunningTimerState())
}

export function getWorkspaceRunningTimerElapsedSegundos(state: WorkspaceRunningTimerState): number {
    if (!state.active) {
        return Math.max(0, Math.floor(state.elapsedSegundos || 0))
    }

    if (!state.startedAtMs) {
        return Math.max(0, Math.floor(state.baseSegundos || state.elapsedSegundos || 0))
    }

    const elapsedSegundos = Math.floor((Date.now() - state.startedAtMs) / 1000)
    return Math.max(0, Math.floor(state.baseSegundos || 0) + Math.max(elapsedSegundos, 0))
}

export function formatWorkspaceTimerClock(totalSegundos: number): string {
    const safe = Math.max(0, Math.floor(totalSegundos || 0))
    const horas = Math.floor(safe / 3600)
    const minutos = Math.floor((safe % 3600) / 60)
    const segundos = safe % 60

    const hh = String(horas).padStart(2, '0')
    const mm = String(minutos).padStart(2, '0')
    const ss = String(segundos).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
}
