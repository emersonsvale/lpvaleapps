import { open, setPrefilledVariables } from '@typebot.io/js'

interface OpenTypebotOptions {
    source?: string
    message?: string
}

export function useTypebot() {
    const config = useRuntimeConfig().public
    const route = useRoute()

    const isTypebotEnabled = computed(() => Boolean(config.typebotEnabled && config.typebotBot))
    const isAdminRoute = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'))

    const openTypebot = (options: OpenTypebotOptions = {}) => {
        if (!import.meta.client || !isTypebotEnabled.value || isAdminRoute.value) {
            return
        }

        const variables: Record<string, string> = {
            'Current URL': window.location.href,
            'Page title': document.title,
            Source: 'valeapps.com.br'
        }

        if (options.source) {
            variables['Lead source'] = options.source
        }

        if (options.message) {
            variables['CTA context'] = options.message
        }

        setPrefilledVariables(variables)
        window.requestAnimationFrame(() => open())
    }

    return {
        isTypebotEnabled,
        isAdminRoute,
        openTypebot
    }
}