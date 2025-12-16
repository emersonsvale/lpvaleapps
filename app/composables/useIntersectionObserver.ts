import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export const useIntersectionObserver = (
    target: Ref<HTMLElement | undefined>,
    callback: (isIntersecting: boolean) => void,
    options: IntersectionObserverInit = {}
) => {
    const isIntersecting = ref(false)
    let observer: IntersectionObserver | null = null

    const defaultOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
    }

    onMounted(() => {
        if (!target.value) return

        observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (entry) {
                isIntersecting.value = entry.isIntersecting
                callback(entry.isIntersecting)
            }
        }, defaultOptions)

        observer.observe(target.value)
    })

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
        }
    })

    return {
        isIntersecting
    }
}

// Hook otimizado para múltiplos elementos
export const useMultipleIntersectionObserver = (
    targets: Ref<HTMLElement[]>,
    callback: (index: number, isIntersecting: boolean) => void,
    options: IntersectionObserverInit = {}
) => {
    const intersectingStates = ref<boolean[]>([])
    let observer: IntersectionObserver | null = null

    const defaultOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
    }

    onMounted(() => {
        if (!targets.value.length) return

        intersectingStates.value = new Array(targets.value.length).fill(false)

        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = targets.value.indexOf(entry.target as HTMLElement)
                if (index !== -1) {
                    intersectingStates.value[index] = entry.isIntersecting
                    callback(index, entry.isIntersecting)
                }
            })
        }, defaultOptions)

        targets.value.forEach((target) => {
            if (target) observer?.observe(target)
        })
    })

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
        }
    })

    return {
        intersectingStates
    }
}