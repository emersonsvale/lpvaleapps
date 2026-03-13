<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <!-- Avatar -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 class="text-base font-semibold text-zinc-100 mb-4">Foto de perfil</h2>
      <div class="flex items-center gap-6">
        <div class="relative group">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
            <img
              v-if="avatarPreview || profile?.avatar_url"
              :src="avatarPreview || profile?.avatar_url || ''"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <PhUserCircle v-else class="w-12 h-12 text-zinc-500" />
          </div>
          <button
            type="button"
            class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            @click="($refs.avatarInput as HTMLInputElement).click()"
          >
            <PhCamera class="w-6 h-6 text-white" />
          </button>
        </div>
        <div>
          <button
            type="button"
            class="px-4 py-2 text-sm rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
            @click="($refs.avatarInput as HTMLInputElement).click()"
          >
            Alterar foto
          </button>
          <p class="text-xs text-zinc-500 mt-1">JPG, PNG ou WebP. Máx 5MB.</p>
        </div>
        <input
          ref="avatarInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="handleAvatarChange"
        />
      </div>
      <p v-if="avatarUploading" class="text-sm text-zinc-400 mt-3">Enviando...</p>
      <p v-if="avatarError" class="text-sm text-red-400 mt-3">{{ avatarError }}</p>
    </section>

    <!-- Dados pessoais -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 class="text-base font-semibold text-zinc-100 mb-4">Dados pessoais</h2>
      <form class="space-y-4" @submit.prevent="handleSaveProfile">
        <div>
          <label for="nome" class="block text-sm text-zinc-400 mb-1">Nome completo</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label for="cargo" class="block text-sm text-zinc-400 mb-1">Cargo</label>
          <input
            id="cargo"
            v-model="form.cargo"
            type="text"
            disabled
            readonly
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-2.5 text-sm text-zinc-400 outline-none"
            placeholder="Cargo definido pela equipe administrativa"
          />
          <p class="mt-1 text-xs text-zinc-500">Esse campo é gerenciado internamente e não pode ser alterado pelo usuário.</p>
        </div>
        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="profileSaving"
            class="px-5 py-2.5 text-sm font-medium rounded-lg bg-brand text-white hover:bg-brand/90 disabled:opacity-50 transition-colors"
          >
            {{ profileSaving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
          <span v-if="profileSuccess" class="text-sm text-emerald-400">Salvo com sucesso!</span>
          <span v-if="profileError" class="text-sm text-red-400">{{ profileError }}</span>
        </div>
      </form>
    </section>

    <!-- E-mail -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 class="text-base font-semibold text-zinc-100 mb-4">E-mail</h2>
      <form class="space-y-4" @submit.prevent="handleUpdateEmail">
        <div>
          <label for="email" class="block text-sm text-zinc-400 mb-1">E-mail atual</label>
          <input
            id="email"
            :value="user?.email"
            type="email"
            disabled
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-2.5 text-sm text-zinc-400 outline-none"
          />
        </div>
        <div>
          <label for="newEmail" class="block text-sm text-zinc-400 mb-1">Novo e-mail</label>
          <input
            id="newEmail"
            v-model="emailForm.newEmail"
            type="email"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            placeholder="novo@email.com"
          />
        </div>
        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="emailSaving || !emailForm.newEmail"
            class="px-5 py-2.5 text-sm font-medium rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {{ emailSaving ? 'Atualizando...' : 'Atualizar e-mail' }}
          </button>
          <span v-if="emailSuccess" class="text-sm text-emerald-400">Verifique seu novo e-mail para confirmar.</span>
          <span v-if="emailError" class="text-sm text-red-400">{{ emailError }}</span>
        </div>
      </form>
    </section>

    <!-- Senha -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 class="text-base font-semibold text-zinc-100 mb-4">Alterar senha</h2>
      <form class="space-y-4" @submit.prevent="handleUpdatePassword">
        <div>
          <label for="newPassword" class="block text-sm text-zinc-400 mb-1">Nova senha</label>
          <input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm text-zinc-400 mb-1">Confirmar nova senha</label>
          <input
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            placeholder="Repita a nova senha"
          />
        </div>
        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="passwordSaving || !passwordForm.newPassword || !passwordForm.confirmPassword"
            class="px-5 py-2.5 text-sm font-medium rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {{ passwordSaving ? 'Atualizando...' : 'Atualizar senha' }}
          </button>
          <span v-if="passwordSuccess" class="text-sm text-emerald-400">Senha atualizada!</span>
          <span v-if="passwordError" class="text-sm text-red-400">{{ passwordError }}</span>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PhUserCircle, PhCamera } from '@phosphor-icons/vue'

definePageMeta({ layout: 'admin' })

const { user } = useAuth()
const { profile, loadProfile, updateProfile, updateEmail, updatePassword, uploadAvatar } = useProfile()

// Profile form
const form = reactive({ nome: '', cargo: '' })
const profileSaving = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')

// Avatar
const avatarPreview = ref<string | null>(null)
const avatarUploading = ref(false)
const avatarError = ref('')

// Email form
const emailForm = reactive({ newEmail: '' })
const emailSaving = ref(false)
const emailSuccess = ref(false)
const emailError = ref('')

// Password form
const passwordForm = reactive({ newPassword: '', confirmPassword: '' })
const passwordSaving = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')

onMounted(async () => {
  await loadProfile()
  if (profile.value) {
    form.nome = profile.value.nome
    form.cargo = profile.value.cargo
  }
})

async function handleSaveProfile() {
  profileSaving.value = true
  profileSuccess.value = false
  profileError.value = ''
  const { error } = await updateProfile({
    nome: form.nome
  })
  profileSaving.value = false
  if (error) {
    profileError.value = error
  } else {
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  }
}

async function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarError.value = ''
  avatarUploading.value = true

  // Preview local
  avatarPreview.value = URL.createObjectURL(file)

  const { error } = await uploadAvatar(file)
  avatarUploading.value = false
  if (error) {
    avatarError.value = error
    avatarPreview.value = null
  }
}

async function handleUpdateEmail() {
  emailSaving.value = true
  emailSuccess.value = false
  emailError.value = ''
  const { error } = await updateEmail(emailForm.newEmail)
  emailSaving.value = false
  if (error) {
    emailError.value = error
  } else {
    emailSuccess.value = true
    emailForm.newEmail = ''
  }
}

async function handleUpdatePassword() {
  passwordError.value = ''
  passwordSuccess.value = false

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'As senhas não coincidem'
    return
  }

  passwordSaving.value = true
  const { error } = await updatePassword(passwordForm.newPassword)
  passwordSaving.value = false
  if (error) {
    passwordError.value = error
  } else {
    passwordSuccess.value = true
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    setTimeout(() => { passwordSuccess.value = false }, 3000)
  }
}
</script>
