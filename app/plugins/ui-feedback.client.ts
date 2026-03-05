function inferToastType(message: string): 'info' | 'success' | 'warning' | 'error' {
    const text = message.toLowerCase()
    if (text.includes('erro') || text.includes('falh')) return 'error'
    if (text.includes('sucesso') || text.includes('criad') || text.includes('atualizad') || text.includes('removid')) return 'success'
    if (text.includes('aten') || text.includes('permita') || text.includes('obrigat')) return 'warning'
    return 'info'
}

export default defineNuxtPlugin(() => {
    const { showAlert } = useUiFeedback()

    const nativeAlert = window.alert.bind(window)

    window.alert = (message?: unknown) => {
        const normalized = typeof message === 'string' ? message : String(message ?? '')

        if (!normalized.trim()) {
            nativeAlert('')
            return
        }

        showAlert(normalized, {
            title: 'Notificacao',
            type: inferToastType(normalized),
        })
    }
})
