<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/70 p-2">
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('paragraph') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="setParagraph"
      >
        P
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('heading', { level: 1 }) ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="setHeading(1)"
      >
        H1
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('heading', { level: 2 }) ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="setHeading(2)"
      >
        H2
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('heading', { level: 3 }) ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="setHeading(3)"
      >
        H3
      </button>

      <span class="h-5 w-px bg-zinc-700" />

      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800 font-bold"
        :class="isActive('bold') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="toggleBold"
      >
        B
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800 italic"
        :class="isActive('italic') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="toggleItalic"
      >
        I
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800 underline"
        :class="isActive('underline') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="toggleUnderline"
      >
        U
      </button>

      <span class="h-5 w-px bg-zinc-700" />

      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('bulletList') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="toggleBulletList"
      >
        • Lista
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('orderedList') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="toggleOrderedList"
      >
        1. Lista
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        :class="isActive('blockquote') ? 'bg-zinc-800 text-brand border-brand/50' : ''"
        @click="toggleBlockquote"
      >
        Citação
      </button>

      <span class="h-5 w-px bg-zinc-700" />

      <label class="flex items-center gap-1 px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200">
        Cor
        <input
          type="color"
          class="h-5 w-7 bg-transparent border-0 p-0"
          :value="currentColor"
          @input="setColor($event)"
        >
      </label>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        @click="clearColor"
      >
        Limpar cor
      </button>

      <span class="h-5 w-px bg-zinc-700" />

      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        @click="undo"
      >
        Desfazer
      </button>
      <button
        type="button"
        class="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
        @click="redo"
      >
        Refazer
      </button>
    </div>

    <div class="rounded-lg border border-zinc-700 bg-zinc-900">
      <EditorContent v-if="editor" :editor="editor" class="rich-editor" />
      <div v-else class="min-h-[180px] p-3 text-zinc-500 text-sm">Carregando editor...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Digite mais detalhes da proposta...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue || '<p></p>',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    TextStyle,
    Color,
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'min-h-[220px] max-h-[420px] overflow-auto p-3 text-zinc-100 focus:outline-none',
    },
  },
  onUpdate: ({ editor: instance }) => {
    emit('update:modelValue', instance.getHTML())
  },
})

const hasEditor = computed(() => !!editor.value)
const currentColor = ref('#f4f4f5')

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    const current = editor.value.getHTML()
    if (value !== current) {
      editor.value.commands.setContent(value || '<p></p>', { emitUpdate: false })
    }
  }
)

function isActive(name: string, attrs?: Record<string, unknown>) {
  if (!editor.value) return false
  return editor.value.isActive(name, attrs)
}

function setHeading(level: 1 | 2 | 3) {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

function setParagraph() {
  editor.value?.chain().focus().setParagraph().run()
}

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run()
}

function toggleUnderline() {
  editor.value?.chain().focus().toggleUnderline().run()
}

function toggleBulletList() {
  editor.value?.chain().focus().toggleBulletList().run()
}

function toggleOrderedList() {
  editor.value?.chain().focus().toggleOrderedList().run()
}

function toggleBlockquote() {
  editor.value?.chain().focus().toggleBlockquote().run()
}

function setColor(event: Event) {
  const target = event.target as HTMLInputElement
  const color = target.value
  currentColor.value = color
  editor.value?.chain().focus().setColor(color).run()
}

function clearColor() {
  editor.value?.chain().focus().unsetColor().run()
}

function undo() {
  editor.value?.chain().focus().undo().run()
}

function redo() {
  editor.value?.chain().focus().redo().run()
}
</script>

<style scoped>
.rich-editor :deep(h1) {
  font-size: 1.5rem;
  line-height: 1.9rem;
  font-weight: 600;
  margin: 0.65rem 0;
}

.rich-editor :deep(h2) {
  font-size: 1.25rem;
  line-height: 1.6rem;
  font-weight: 600;
  margin: 0.6rem 0;
}

.rich-editor :deep(h3) {
  font-size: 1.1rem;
  line-height: 1.45rem;
  font-weight: 600;
  margin: 0.55rem 0;
}

.rich-editor :deep(p) {
  margin: 0.45rem 0;
}

.rich-editor :deep(ul),
.rich-editor :deep(ol) {
  margin: 0.45rem 0;
  padding-left: 1.25rem;
}

.rich-editor :deep(ul) {
  list-style: disc;
}

.rich-editor :deep(ol) {
  list-style: decimal;
}

.rich-editor :deep(blockquote) {
  border-left: 2px solid rgb(63 63 70);
  padding-left: 0.8rem;
  color: rgb(161 161 170);
  margin: 0.5rem 0;
}
</style>
