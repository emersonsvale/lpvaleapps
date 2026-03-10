<template>
  <div>
    <button
      type="button"
      class="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors"
      :class="isSelected
        ? 'bg-zinc-800 text-zinc-100'
        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'"
      :style="{ paddingLeft: `${10 + level * 16}px` }"
      @click="$emit('select', node.record.id)"
    >
      <span
        v-if="node.kind === 'folder'"
        class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-zinc-500 transition-colors group-hover:text-zinc-300"
        @click.stop="$emit('toggle', node.record.id)"
      >
        <Icon :name="isExpanded ? 'ph:caret-down-bold' : 'ph:caret-right-bold'" class="h-3.5 w-3.5" />
      </span>
      <span v-else class="inline-flex h-4 w-4 shrink-0" />

      <Icon
        :name="node.kind === 'folder'
          ? (isExpanded ? 'ph:folder-open' : 'ph:folder')
          : 'ph:file-text'"
        class="h-4 w-4 shrink-0"
      />

      <span class="truncate">{{ node.record.titulo }}</span>
    </button>

    <div v-if="node.kind === 'folder' && isExpanded && node.children.length" class="mt-1 space-y-1">
      <AdminProjetoDocumentacaoTreeItem
        v-for="child in node.children"
        :key="child.record.id"
        :node="child"
        :selected-id="selectedId"
        :expanded-ids="expandedIds"
        :search-active="searchActive"
        :level="level + 1"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AdminProjetoDocumentacaoTreeItem' })

const props = withDefaults(defineProps<{
  node: {
    record: {
      id: number
      titulo: string
    }
    kind: 'page' | 'folder'
    children: Array<any>
  }
  selectedId: number | null
  expandedIds: number[]
  searchActive: boolean
  level?: number
}>(), {
  level: 0
})

defineEmits<{
  select: [id: number]
  toggle: [id: number]
}>()

const isSelected = computed(() => props.selectedId === props.node.record.id)
const isExpanded = computed(() => props.searchActive || props.expandedIds.includes(props.node.record.id))
</script>