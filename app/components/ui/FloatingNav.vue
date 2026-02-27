<template>
  <div
    :class="cn(
      'flex max-w-fit fixed inset-x-0 mx-auto border border-transparent dark:border-white/[0.08] rounded-full dark:bg-black/60 bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] z-[5000] pr-2 pl-4 py-2 items-center justify-center space-x-1 sm:space-x-3 transition-all duration-500',
      isScrolled ? 'top-4' : 'top-8',
      className
    )"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center mr-1 sm:mr-2" @click.prevent="scrollToTop">
      <Logo className="h-3.5" />
    </NuxtLink>

    <!-- Separator -->
    <div class="w-px h-4 bg-white/10 hidden sm:block"></div>
    
    <NuxtLink
      v-for="(navItem, idx) in navItems"
      :key="`link-${idx}`"
      :to="navItem.link"
      :class="cn(
        'relative items-center flex space-x-1 px-3 py-1.5 rounded-full transition-all duration-300',
        isActiveItem(navItem.link)
          ? 'text-brand bg-brand/10' 
          : 'dark:text-neutral-400 text-neutral-500 dark:hover:text-neutral-200 hover:text-neutral-700 hover:bg-white/5'
      )"
      @click.prevent="handleNavClick(navItem.link)"
    >
      <span class="block sm:hidden">
        <component :is="navItem.icon" v-if="navItem.icon" class="h-4 w-4" />
      </span>
      <span class="hidden sm:block text-sm font-medium">{{ navItem.name }}</span>
    </NuxtLink>
    
    <a 
      href="https://wa.me/5511969210065?text=Olá! Gostaria de saber mais sobre os serviços da Vale Apps."
      target="_blank"
      rel="noopener noreferrer"
      class="relative text-sm font-semibold bg-brand text-black px-4 py-2 rounded-full hover:bg-brand/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,192,0,0.25)] flex items-center gap-1.5"
    >
      <PhWhatsappLogo :size="16" weight="bold" />
      <span class="hidden sm:inline">Fale Conosco</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Component } from 'vue'
import { PhWhatsappLogo } from '@phosphor-icons/vue'
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

const activeSection = ref('')
const isScrolled = ref(false)

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const router = useRouter()
const route = useRoute()

const isHashLink = (link: string) => link.startsWith('#')
const getHashFromLink = (link: string) => {
  if (link.startsWith('#')) return link
  const hashIndex = link.indexOf('#')
  return hashIndex >= 0 ? link.slice(hashIndex) : ''
}
const getPathFromLink = (link: string) => {
  if (link.startsWith('#')) return '/'
  const hashIndex = link.indexOf('#')
  return hashIndex >= 0 ? link.slice(0, hashIndex) || '/' : link
}

const isActiveItem = (link: string) => {
  const hash = getHashFromLink(link)
  if (hash) {
    return route.path === '/' && activeSection.value === hash
  }

  const path = getPathFromLink(link)
  return route.path === path || route.path.startsWith(path + '/')
}

const handleNavClick = (link: string) => {
  const hash = getHashFromLink(link)
  const path = getPathFromLink(link)

  if (hash) {
    const id = hash.replace('#', '')
    const samePage = route.path === path
    const el = samePage ? document.getElementById(id) : null

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    router.push(`${path}${hash}`)
    return
  }

  router.push(path)
}

const updateActiveSection = () => {
  isScrolled.value = window.scrollY > 50

  const sections = props.navItems
    .map(item => {
      const hash = getHashFromLink(item.link)
      if (!hash || route.path !== '/') return null
      return {
        id: hash,
        el: document.getElementById(hash.replace('#', ''))
      }
    })
    .filter((section): section is { id: string; el: HTMLElement } => !!section?.el)

  const scrollPos = window.scrollY + window.innerHeight / 3
  let currentSection = ''

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.el && section.el.offsetTop <= scrollPos) {
      currentSection = section.id
      break
    }
  }

  activeSection.value = currentSection
}

let scrollListener: (() => void) | null = null

onMounted(() => {
  updateActiveSection()
  scrollListener = () => requestAnimationFrame(updateActiveSection)
  window.addEventListener('scroll', scrollListener, { passive: true })
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
  }
})
</script>