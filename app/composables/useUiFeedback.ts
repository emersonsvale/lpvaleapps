type FeedbackToastType = 'info' | 'success' | 'warning' | 'error'

interface FeedbackToast {
    id: number
    title: string
    message: string
    type: FeedbackToastType
    duration: number
}

interface FeedbackConfirmState {
    title: string
    message: string
    confirmLabel: string
    cancelLabel: string
    danger: boolean
}

interface ShowAlertOptions {
    title?: string
    type?: FeedbackToastType
    duration?: number
}

interface ShowConfirmOptions {
    title?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
}

let toastSequence = 0
let confirmResolver: ((value: boolean) => void) | null = null

export function useUiFeedback() {
    const toasts = useState<FeedbackToast[]>('ui-feedback-toasts', () => [])
    const confirmState = useState<FeedbackConfirmState | null>('ui-feedback-confirm', () => null)

    function removeToast(id: number) {
        toasts.value = toasts.value.filter(toast => toast.id !== id)
    }

    function showAlert(message: string, options: ShowAlertOptions = {}) {
        const id = ++toastSequence
        const toast: FeedbackToast = {
            id,
            title: options.title || 'Aviso',
            message,
            type: options.type || 'info',
            duration: options.duration ?? 4200,
        }

        toasts.value = [...toasts.value, toast]

        if (import.meta.client && toast.duration > 0) {
            window.setTimeout(() => removeToast(id), toast.duration)
        }
    }

    function showConfirm(options: ShowConfirmOptions): Promise<boolean> {
        if (confirmResolver) {
            confirmResolver(false)
            confirmResolver = null
        }

        confirmState.value = {
            title: options.title || 'Confirmar ação',
            message: options.message,
            confirmLabel: options.confirmLabel || 'Confirmar',
            cancelLabel: options.cancelLabel || 'Cancelar',
            danger: options.danger ?? false,
        }

        return new Promise<boolean>((resolve) => {
            confirmResolver = resolve
        })
    }

    function resolveConfirm(confirmed: boolean) {
        const resolver = confirmResolver
        confirmResolver = null
        confirmState.value = null
        resolver?.(confirmed)
    }

    return {
        toasts,
        confirmState,
        showAlert,
        showConfirm,
        removeToast,
        resolveConfirm,
    }
}
