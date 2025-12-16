<template>
  <button
    :class="buttonClass"
    v-bind="$attrs"
  >
    <slot />
    <span 
      v-if="withGradient && variant === 'primary'" 
      class="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-brand to-transparent h-px" 
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-black hover:bg-brand/90 rounded-lg font-semibold',
        secondary: 'border border-neutral-200 dark:border-white/[0.2] text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900',
        ghost: 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-500 dark:hover:text-neutral-400',
        destructive: 'bg-red-500 text-white hover:bg-red-600 rounded-lg',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5',
        lg: 'px-6 py-3',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  withGradient?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'default',
  className: '',
  withGradient: false
})

const buttonClass = computed(() => {
  return buttonVariants({ 
    variant: props.variant, 
    size: props.size,
    class: props.className
  })
})
</script>