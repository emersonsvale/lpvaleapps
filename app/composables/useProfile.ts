export interface UserProfile {
  id: number
  uid: string | null
  nome: string
  cargo: string
  avatar_url: string | null
  email: string | null
  created_at: string | null
}

interface EquipeProfileRow {
  id: number
  uid: string | null
  nome: string | null
  cargo: string | null
  foto: string | null
  email: string | null
  created_at: string | null
}

const profileState = reactive<{
  profile: UserProfile | null
  loading: boolean
}>({
  profile: null,
  loading: false
})

export function useProfile() {
  const supabase = useSupabase()
  const { user, loadSession } = useAuth()

  function mapEquipeProfile(row: EquipeProfileRow): UserProfile {
    return {
      id: row.id,
      uid: row.uid,
      nome: row.nome ?? '',
      cargo: row.cargo ?? '',
      avatar_url: row.foto ?? null,
      email: row.email ?? null,
      created_at: row.created_at ?? null
    }
  }

  async function findProfileRow(): Promise<EquipeProfileRow | null> {
    if (!supabase || !user.value) return null

    const { data: byUid, error: uidError } = await supabase
      .from('equipe')
      .select('id, uid, nome, cargo, foto, email, created_at')
      .eq('uid', user.value.id)
      .maybeSingle()

    if (uidError) throw uidError
    if (byUid) return byUid as EquipeProfileRow

    if (!user.value.email) return null

    const { data: byEmail, error: emailError } = await supabase
      .from('equipe')
      .select('id, uid, nome, cargo, foto, email, created_at')
      .eq('email', user.value.email)
      .maybeSingle()

    if (emailError) throw emailError
    if (!byEmail) return null

    const profileByEmail = byEmail as EquipeProfileRow

    if (profileByEmail.uid === user.value.id) {
      return profileByEmail
    }

    const { data: linkedProfile, error: linkError } = await supabase
      .from('equipe')
      .update({ uid: user.value.id, email: user.value.email })
      .eq('id', profileByEmail.id)
      .select('id, uid, nome, cargo, foto, email, created_at')
      .single()

    if (linkError) throw linkError

    return linkedProfile as EquipeProfileRow
  }

  async function loadProfile() {
    if (!supabase) return
    profileState.loading = true
    try {
      if (!user.value) {
        await loadSession()
      }

      if (!user.value) {
        profileState.profile = null
        return
      }

      const data = await findProfileRow()

      if (data) {
        profileState.profile = mapEquipeProfile(data)
      } else {
        profileState.profile = null
      }
    } finally {
      profileState.loading = false
    }
  }

  async function updateProfile(updates: Partial<Pick<UserProfile, 'nome'>>) {
    if (!supabase || !user.value) return { error: 'Não autenticado' }

    const currentRow = await findProfileRow()

    if (!currentRow) {
      return { error: 'Perfil não encontrado na tabela equipe' }
    }

    const payload = {
      ...(updates.nome !== undefined ? { nome: updates.nome } : {})
    }

    const { error } = await supabase
      .from('equipe')
      .update(payload)
      .eq('id', currentRow.id)

    if (error) return { error: error.message }
    if (profileState.profile) {
      Object.assign(profileState.profile, payload)
    }
    return { error: null }
  }

  async function updateEmail(newEmail: string) {
    if (!supabase || !user.value) return { error: 'Supabase não configurado' }
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) return { error: error.message }

    const profileId = profileState.profile?.id
    if (profileId) {
      const { error: profileError } = await supabase
        .from('equipe')
        .update({ email: newEmail })
        .eq('id', profileId)

      if (profileError) return { error: profileError.message }
    }

    if (profileState.profile) {
      profileState.profile.email = newEmail
    }

    return { error: null }
  }

  async function updatePassword(newPassword: string) {
    if (!supabase) return { error: 'Supabase não configurado' }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function uploadAvatar(file: File): Promise<{ url: string | null; error: string | null }> {
    if (!supabase || !user.value) return { url: null, error: 'Não autenticado' }

    const ext = file.name.split('.').pop()
    const path = `${user.value.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) return { url: null, error: uploadError.message }

    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${publicUrl.publicUrl}?t=${Date.now()}`

    const profileId = profileState.profile?.id
    if (!profileId) {
      return { url: null, error: 'Perfil não encontrado na tabela equipe' }
    }

    const { error: profileError } = await supabase
      .from('equipe')
      .update({ foto: publicUrl.publicUrl })
      .eq('id', profileId)

    if (profileError) return { url: null, error: profileError.message }

    if (profileState.profile) {
      profileState.profile.avatar_url = url
    }

    return { url, error: null }
  }

  return {
    profile: computed(() => profileState.profile),
    loading: computed(() => profileState.loading),
    loadProfile,
    updateProfile,
    updateEmail,
    updatePassword,
    uploadAvatar
  }
}
