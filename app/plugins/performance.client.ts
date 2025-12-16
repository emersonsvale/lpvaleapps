// Declarações de tipos para evitar erros TypeScript
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export default defineNuxtPlugin(() => {
    // Apenas executar no cliente
    if (typeof window === 'undefined') return

    // Monitoramento de Web Vitals
    const reportWebVitals = (metric: any) => {
        // Enviar métricas para analytics (opcional)
        if (window.gtag) {
            window.gtag('event', metric.name, {
                event_category: 'Web Vitals',
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.id,
                non_interaction: true,
            })
        }

        // Log para desenvolvimento
        console.log(`Web Vital ${metric.name}:`, metric.value)
    }

    // Lazy load web-vitals apenas quando necessário
    const loadWebVitals = async () => {
        try {
            const webVitals = await import('web-vitals')

            // Usar as funções corretas do web-vitals v4
            if (webVitals.onCLS) webVitals.onCLS(reportWebVitals)
            if (webVitals.onFID) webVitals.onFID(reportWebVitals)
            if (webVitals.onFCP) webVitals.onFCP(reportWebVitals)
            if (webVitals.onLCP) webVitals.onLCP(reportWebVitals)
            if (webVitals.onTTFB) webVitals.onTTFB(reportWebVitals)
        } catch (error) {
            // Silently fail if web-vitals is not available
            console.warn('Web Vitals library not available:', error)
        }
    }

    // Otimizações de performance
    const optimizePerformance = () => {
        // Preload de recursos críticos baseado na interação do usuário
        const preloadCriticalResources = () => {
            const criticalImages = [
                '/LogoValeAapps.png',
                'https://framerusercontent.com/images/PYGY312hsQiQ9amSP5A6phSgc.png'
            ]

            criticalImages.forEach(src => {
                const link = document.createElement('link')
                link.rel = 'preload'
                link.as = 'image'
                link.href = src
                document.head.appendChild(link)
            })
        }

        // Executar após o primeiro scroll ou interação
        let hasInteracted = false
        const handleFirstInteraction = () => {
            if (!hasInteracted) {
                hasInteracted = true
                preloadCriticalResources()
                document.removeEventListener('scroll', handleFirstInteraction)
                document.removeEventListener('click', handleFirstInteraction)
                document.removeEventListener('touchstart', handleFirstInteraction)
            }
        }

        document.addEventListener('scroll', handleFirstInteraction, { passive: true })
        document.addEventListener('click', handleFirstInteraction, { passive: true })
        document.addEventListener('touchstart', handleFirstInteraction, { passive: true })

        // Timeout fallback
        setTimeout(handleFirstInteraction, 3000)
    }

    // Executar otimizações após o load
    if (document.readyState === 'complete') {
        optimizePerformance()
        loadWebVitals()
    } else {
        window.addEventListener('load', () => {
            optimizePerformance()
            loadWebVitals()
        })
    }
})