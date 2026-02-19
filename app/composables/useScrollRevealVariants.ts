/**
 * Variantes reutilizáveis para animações de surgimento no scroll (visible-once).
 * Use com v-motion :initial e :visible-once para deixar o app mais dinâmico.
 */

const transitionBase = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 0.5
}

const transitionSlow = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 22,
  mass: 0.6
}

/** Surgir de baixo com fade (padrão para blocos de texto) */
export function useRevealFadeUp(options?: { y?: number; duration?: number }) {
  const y = options?.y ?? 28
  return {
    initial: { opacity: 0, y },
    visibleOnce: {
      opacity: 1,
      y: 0,
      transition: { ...transitionBase, delay: 0 }
    }
  }
}

/** Surgir com fade simples (sem movimento) */
export function useRevealFade(options?: { duration?: number }) {
  return {
    initial: { opacity: 0 },
    visibleOnce: {
      opacity: 1,
      transition: { ...transitionBase, delay: 0 }
    }
  }
}

/** Surgir de baixo com delay escalonado (para listas/cards) */
export function useRevealFadeUpStagger(baseDelay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    visibleOnce: {
      opacity: 1,
      y: 0,
      transition: { ...transitionSlow, delay: baseDelay }
    }
  }
}

/** Surgir da esquerda (para colunas em grid) */
export function useRevealFromLeft() {
  return {
    initial: { opacity: 0, x: -24 },
    visibleOnce: {
      opacity: 1,
      x: 0,
      transition: { ...transitionBase, delay: 0 }
    }
  }
}

/** Surgir da direita (para colunas em grid) */
export function useRevealFromRight() {
  return {
    initial: { opacity: 0, x: 24 },
    visibleOnce: {
      opacity: 1,
      x: 0,
      transition: { ...transitionBase, delay: 0 }
    }
  }
}

/** Preset para títulos de seção */
export const sectionTitleReveal = {
  initial: { opacity: 0, y: 24 },
  visibleOnce: {
    opacity: 1,
    y: 0,
    transition: { ...transitionBase, delay: 0 }
  }
}

/** Preset para subtítulo/descrição */
export const sectionSubtitleReveal = {
  initial: { opacity: 0, y: 20 },
  visibleOnce: {
    opacity: 1,
    y: 0,
    transition: { ...transitionBase, delay: 80 }
  }
}
