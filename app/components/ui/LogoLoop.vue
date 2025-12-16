<template>
  <div class="relative overflow-hidden">
    <div class="flex animate-loop-scroll">
      <!-- Primeira instância dos logos -->
      <div class="flex min-w-full shrink-0 items-center justify-around gap-8">
        <div v-for="logo in logos" :key="`first-${logo.name}`" class="flex items-center justify-center">
          <img
            :src="logo.src"
            :alt="`${logo.name} Logo`"
            class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 dark:invert"
            :class="logo.class"
          />
        </div>
      </div>
      <!-- Segunda instância dos logos para loop contínuo -->
      <div class="flex min-w-full shrink-0 items-center justify-around gap-8">
        <div v-for="logo in logos" :key="`second-${logo.name}`" class="flex items-center justify-center">
          <img
            :src="logo.src"
            :alt="`${logo.name} Logo`"
            class="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 dark:invert"
            :class="logo.class"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const logos = [
  {
    name: 'GitHub',
    src: 'https://cdn.simpleicons.org/github/181717',
    class: ''
  },
  {
    name: 'Flutter',
    src: 'https://cdn.simpleicons.org/flutter/02569B',
    class: 'dark:invert-0'
  },
  {
    name: 'Supabase',
    src: 'https://cdn.simpleicons.org/supabase/3FCF8E',
    class: 'dark:invert-0'
  },
  {
    name: 'Vue',
    src: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
    class: 'dark:invert-0'
  },
  {
    name: 'Nuxt',
    src: 'https://cdn.simpleicons.org/nuxt/00DC82',
    class: 'dark:invert-0'
  },
  {
    name: 'OpenAI Gym',
    src: 'https://cdn.simpleicons.org/openaigym/0081A5',
    class: 'dark:invert-0'
  },
  {
    name: 'Cloudflare',
    src: 'https://cdn.simpleicons.org/cloudflare/F38020',
    class: 'dark:invert-0'
  },
  {
    name: 'Google Play',
    src: 'https://cdn.simpleicons.org/googleplay/414141',
    class: 'dark:invert-0'
  },
  {
    name: 'Apple',
    src: 'https://cdn.simpleicons.org/apple/000000',
    class: ''
  },
  {
    name: 'Stripe',
    src: 'https://cdn.simpleicons.org/stripe/008CDD',
    class: 'dark:invert-0'
  },
  {
    name: 'Node.js',
    src: 'https://cdn.simpleicons.org/nodedotjs/339933',
    class: 'dark:invert-0'
  }
]
</script>

<style scoped>
@keyframes loop-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-loop-scroll {
  animation: loop-scroll 20s linear infinite;
}

.animate-loop-scroll:hover {
  animation-play-state: paused;
}
</style>