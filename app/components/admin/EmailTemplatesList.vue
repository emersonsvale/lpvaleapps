<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Templates de Email</h1>
        <p class="mt-1 text-sm text-gray-500">Gerenciar e customizar templates de email</p>
      </div>
      <button
        @click="criarNovoTemplate"
        class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
      >
        <span>+</span>
        Novo Template
      </button>
    </div>

    <!-- Status -->
    <div v-if="erro" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ erro }}
    </div>

    <!-- Tabela de Templates -->
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-gray-500">Carregando templates...</div>
      </div>

      <div v-else-if="templates.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center">
          <p class="text-gray-500">Nenhum template disponivel</p>
          <button
            @click="criarNovoTemplate"
            class="mt-4 text-sm text-purple-600 hover:underline"
          >
            Criar primeiro template
          </button>
        </div>
      </div>

      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-700">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-700">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-700">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-700">Criado</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase text-gray-700">Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="template in templates"
            :key="template.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ template.nome }}</div>
              <div class="text-xs text-gray-500">{{ template.slug }}</div>
            </td>
            <td class="px-6 py-4">
              <span
                :style="{
                  backgroundColor: getTipoColor(template.tipo) + '20',
                  color: getTipoColor(template.tipo),
                }"
                class="inline-block rounded-full px-3 py-1 text-xs font-medium"
              >
                {{ template.tipo }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="template.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                class="inline-block rounded-full px-3 py-1 text-xs font-medium"
              >
                {{ template.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatarData(template.criado_em) }}
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center gap-2">
                <button
                  @click="editarTemplate(template)"
                  class="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 transition"
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  @click="previewTemplate(template)"
                  class="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-green-600 hover:bg-green-50 transition"
                  title="Preview"
                >
                  Ver
                </button>
                <button
                  @click="testarTemplate(template)"
                  class="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-purple-600 hover:bg-purple-50 transition"
                  title="Testar envio"
                >
                  Enviar
                </button>
                <button
                  @click="duplicarTemplate(template)"
                  class="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-yellow-600 hover:bg-yellow-50 transition"
                  title="Duplicar"
                >
                  Duplicar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const emails = useEmail()
const loading = ref(true)
const erro = ref<string | null>(null)
const templates = ref<any[]>([])

const tiposCorMap: Record<string, string> = {
  boas_vindas: '#667eea',
  proposta: '#10b981',
  leads: '#f59e0b',
  newsletter: '#8b5cf6',
  admin: '#ef4444',
  relatorio: '#06b6d4',
}

const getTipoColor = (tipo: string): string => {
  return tiposCorMap[tipo] || '#6b7280'
}

const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const carregarTemplates = async () => {
  loading.value = true
  erro.value = null

  try {
    templates.value = await emails.getTemplates()
  }
  catch (e: any) {
    erro.value = 'Erro ao carregar templates'
  }
  finally {
    loading.value = false
  }
}

const criarNovoTemplate = () => {
  navigateTo('/admin/emails/new')
}

const editarTemplate = (template: any) => {
  navigateTo(`/admin/emails/${template.id}`)
}

const previewTemplate = (template: any) => {
  navigateTo(`/admin/emails/${template.id}/preview`)
}

const testarTemplate = (template: any) => {
  navigateTo(`/admin/emails/${template.id}/test`)
}

const duplicarTemplate = async (template: any) => {
  // TODO: Implementar duplicacao
  alert('Duplicacao em desenvolvimento')
}

onMounted(carregarTemplates)
</script>

<style scoped></style>
