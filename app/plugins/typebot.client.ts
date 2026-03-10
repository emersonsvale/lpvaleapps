import { setPrefilledVariables, unmount } from '@typebot.io/js'
import type { BubbleProps } from '@typebot.io/js'
import Typebot from '@typebot.io/js/web'

let isTypebotInitialized = false
let hasRouteSync = false

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])

function toBoolean(value: unknown) {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return TRUE_VALUES.has(value.trim().toLowerCase())
    return false
}

function toNumber(value: unknown, fallback: number) {
    if (typeof value === 'number' && Number.isFinite(value)) return value

    if (typeof value === 'string') {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
    }

    return fallback
}

function getTrimmedString(value: unknown) {
    return typeof value === 'string' ? value.trim() : ''
}

function isAdminPath(path: string) {
    return path === '/admin' || path.startsWith('/admin/')
}

function resolveTypebotTarget(rawBotValue: unknown, rawApiHostValue: unknown) {
    const botValue = getTrimmedString(rawBotValue)
    const configuredApiHost = getTrimmedString(rawApiHostValue)

    if (!botValue) {
        return {
            typebotId: '',
            apiHost: configuredApiHost || undefined
        }
    }

    const fallbackApiHost = configuredApiHost || undefined

    try {
        const url = new URL(botValue)
        const segments = url.pathname.split('/').filter(Boolean)
        const typebotSegmentIndex = segments.findIndex(segment => segment === 'typebots' || segment === 'to')
        const typebotId = typebotSegmentIndex >= 0 && segments[typebotSegmentIndex + 1]
            ? segments[typebotSegmentIndex + 1]
            : segments.at(-1) ?? ''
        const apiHost = !configuredApiHost || configuredApiHost === 'https://typebot.io'
            ? url.origin
            : configuredApiHost

        return {
            typebotId,
            apiHost
        }
    } catch {
        return {
            typebotId: botValue
                .replace(/[?#].*$/, '')
                .split('/')
                .filter(Boolean)
                .at(-1) ?? '',
            apiHost: fallbackApiHost
        }
    }
}

function syncPrefilledContext() {
    setPrefilledVariables({
        'Current URL': window.location.href,
        'Page title': document.title,
        Source: 'valeapps.com.br'
    })
}

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const route = useRoute()

    const syncTypebotState = () => {
        const config = useRuntimeConfig().public
        const { typebotId, apiHost } = resolveTypebotTarget(config.typebotBot, config.typebotApiHost)

        if (!toBoolean(config.typebotEnabled) || !typebotId) {
            if (isTypebotInitialized) {
                unmount()
                isTypebotInitialized = false
            }
            return
        }

        if (isAdminPath(route.path)) {
            if (isTypebotInitialized) {
                unmount()
                isTypebotInitialized = false
            }
            return
        }

        if (isTypebotInitialized) {
            syncPrefilledContext()
            return
        }

        const previewMessage = typeof config.typebotPreviewMessage === 'string'
            ? config.typebotPreviewMessage.trim()
            : ''
        const previewAvatarUrl = typeof config.typebotPreviewAvatarUrl === 'string'
            ? config.typebotPreviewAvatarUrl.trim()
            : ''

        const bubbleConfig: BubbleProps = {
            typebot: typebotId,
            apiHost,
            previewMessage: previewMessage
                ? {
                    message: previewMessage,
                    autoShowDelay: toNumber(config.typebotPreviewAutoShowDelay, 8000),
                    avatarUrl: previewAvatarUrl || undefined
                }
                : undefined,
            theme: {
                placement: 'right',
                button: {
                    size: '56px',
                    backgroundColor: '#f5c542',
                    iconColor: '#050816'
                },
                previewMessage: {
                    backgroundColor: '#0f172a',
                    textColor: '#f8fafc',
                    closeButtonBackgroundColor: '#f5c542',
                    closeButtonIconColor: '#050816'
                },
                chatWindow: {
                    backgroundColor: '#050816',
                    maxWidth: '420px',
                    maxHeight: '720px'
                }
            }
        }

        Typebot.initBubble(bubbleConfig)
        syncPrefilledContext()
        isTypebotInitialized = true

        if ((window as typeof window & { Typebot?: { close?: () => void } }).Typebot?.close) {
            window.Typebot?.close?.()
        }
    }

    nuxtApp.hook('app:mounted', () => {
        syncTypebotState()

        if (hasRouteSync) {
            return
        }

        hasRouteSync = true

        router.afterEach(() => {
            window.requestAnimationFrame(syncTypebotState)
        })
    })
})