// Plugin otimizado para carregar apenas os ícones necessários
export default defineNuxtPlugin(async (nuxtApp) => {
    // Lazy load apenas quando necessário
    if (process.client) {
        const { PhosphorIcons } = await import('@phosphor-icons/vue')
        nuxtApp.vueApp.use(PhosphorIcons)
    }
})