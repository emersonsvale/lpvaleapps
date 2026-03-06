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

export function useWorkspaceRunningTimerState() {
    return useState<WorkspaceRunningTimerState>('workspace-running-timer', initialWorkspaceRunningTimerState)
}

export function resetWorkspaceRunningTimerState() {
    const state = useWorkspaceRunningTimerState()
    state.value = initialWorkspaceRunningTimerState()
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
