import { ref } from 'vue'

// Cache para bibliotecas já carregadas
const libraryCache = new Map<string, any>()
const loadingPromises = new Map<string, Promise<any>>()

export const useLazyLibrary = <T = any>(
    libraryName: string,
    importFn: () => Promise<T>
) => {
    const isLoaded = ref(false)
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    const library = ref<T | null>(null)

    const loadLibrary = async (): Promise<T | null> => {
        // Se já está carregada, retorna do cache
        if (libraryCache.has(libraryName)) {
            library.value = libraryCache.get(libraryName)
            isLoaded.value = true
            return library.value
        }

        // Se já está carregando, aguarda a promise existente
        if (loadingPromises.has(libraryName)) {
            try {
                const result = await loadingPromises.get(libraryName)
                library.value = result
                isLoaded.value = true
                return result
            } catch (err) {
                error.value = err as Error
                return null
            }
        }

        // Inicia o carregamento
        isLoading.value = true
        error.value = null

        const loadPromise = importFn()
        loadingPromises.set(libraryName, loadPromise)

        try {
            const result = await loadPromise
            libraryCache.set(libraryName, result)
            library.value = result
            isLoaded.value = true
            isLoading.value = false
            loadingPromises.delete(libraryName)
            return result
        } catch (err) {
            error.value = err as Error
            isLoading.value = false
            loadingPromises.delete(libraryName)
            console.warn(`Failed to load library ${libraryName}:`, err)
            return null
        }
    }

    return {
        library,
        isLoaded,
        isLoading,
        error,
        loadLibrary
    }
}

// Helpers específicos para bibliotecas comuns
export const useGSAP = () => {
    return useLazyLibrary('gsap', () => import('gsap/index.js'))
}

export const useOGL = () => {
    return useLazyLibrary('ogl', () => import('ogl'))
}

export const useThree = () => {
    return useLazyLibrary('three', () => import('three'))
}