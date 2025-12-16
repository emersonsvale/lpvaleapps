<template>
  <div
    :class="cn(
      'flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black/40 bg-white/80 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-4 py-2 items-center justify-center space-x-4',
      className
    )"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center">
      <Logo className="h-3" />
    </NuxtLink>
    
    <NuxtLink
      v-for="(navItem, idx) in navItems"
      :key="`link-${idx}`"
      :to="navItem.link"
      :class="cn(
        'relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors'
      )"
    >
      <span class="block sm:hidden">
        <component :is="navItem.icon" v-if="navItem.icon" class="h-4 w-4" />
      </span>
      <span class="hidden sm:block text-sm">{{ navItem.name }}</span>
    </NuxtLink>
    
    <a 
      href="https://wa.me/5511969210065?text=Olá! Gostaria de saber mais sobre os serviços da Vale Apps."
      target="_blank"
      rel="noopener noreferrer"
      class="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
    >
      <span>Fale Conosco</span>
      <span class="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-brand to-transparent h-px" />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import Logo from '~/components/ui/Logo.vue'

interface NavItem {
  name: string
  link: string
  icon?: Component
}

interface Props {
  navItems: NavItem[]
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

// Utility function for class names (similar to clsx/cn)
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
</script>