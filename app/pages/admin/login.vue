<template>
  <div class="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-brand font-semibold">Vale Apps</NuxtLink>
        <p class="text-zinc-500 text-sm mt-1">Área restrita</p>
      </div>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-zinc-400 mb-1">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-brand/50 focus:border-brand"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-zinc-400 mb-1">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-brand/50 focus:border-brand"
            placeholder="••••••••"
          />
        </div>
        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 rounded-lg bg-brand text-black font-medium hover:opacity-90 disabled:opacity-50"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { signIn, loadSession } = useAuth()

onMounted(async () => {
  await loadSession()
  const supabase = useSupabase()
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) await navigateTo('/admin')
  }
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const { error: err } = await signIn(email.value, password.value)
    if (err) {
      error.value = err
      return
    }
    await navigateTo('/admin')
  } finally {
    loading.value = false
  }
}
</script>
