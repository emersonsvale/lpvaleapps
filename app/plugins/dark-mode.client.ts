export default defineNuxtPlugin(() => {
  if (typeof document !== 'undefined') {
    // Garantir que a classe dark seja aplicada no HTML
    document.documentElement.classList.add('dark')
    
    // Observar mudanças no HTML para garantir que a classe seja mantida
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark')
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})
