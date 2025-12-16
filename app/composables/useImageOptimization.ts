export const useImageOptimization = () => {
    const optimizeImageUrl = (url: string, width?: number, height?: number, quality = 80) => {
        // Se a URL já contém parâmetros de otimização, retorna como está
        if (url.includes('width=') || url.includes('height=')) {
            return url
        }

        // Para URLs do Framer, adiciona parâmetros de otimização
        if (url.includes('framerusercontent.com')) {
            const params = new URLSearchParams()
            if (width) params.set('width', width.toString())
            if (height) params.set('height', height.toString())
            params.set('quality', quality.toString())

            return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
        }

        return url
    }

    const createImageSrcSet = (baseUrl: string, sizes: number[]) => {
        return sizes
            .map(size => `${optimizeImageUrl(baseUrl, size)} ${size}w`)
            .join(', ')
    }

    const getOptimalImageSize = (containerWidth: number) => {
        // Retorna o tamanho ideal baseado no container e densidade de pixels
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
        return Math.ceil(containerWidth * dpr)
    }

    return {
        optimizeImageUrl,
        createImageSrcSet,
        getOptimalImageSize
    }
}