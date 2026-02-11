<template>
  <div class="w-full max-w-3xl mx-auto rounded-lg border bg-white shadow-sm">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap gap-2 border-b px-3 py-2 bg-gray-50">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="buttonClass(editor.isActive('bold'))"
      >
        <span class="font-bold">B</span>
      </button>

      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="buttonClass(editor.isActive('italic'))"
      >
        <span class="italic">I</span>
      </button>

      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="buttonClass(editor.isActive('strike'))"
      >
        <span class="line-through">S</span>
      </button>

      <button
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="buttonClass(editor.isActive('code'))"
      >
        <span>&lt;/&gt;</span>
      </button>

      <button
        @click="editor.chain().focus().setParagraph().run()"
        :class="buttonClass(editor.isActive('paragraph'))"
      >
        P
      </button>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="buttonClass(editor.isActive('heading', { level: 1 }))"
      >
        H1
      </button>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="buttonClass(editor.isActive('heading', { level: 2 }))"
      >
        H2
      </button>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="buttonClass(editor.isActive('heading', { level: 3 }))"
      >
        H3
      </button>

      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="buttonClass(editor.isActive('bulletList'))"
      >
        • List
      </button>

      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="buttonClass(editor.isActive('orderedList'))"
      >
        1. List
      </button>

      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="buttonClass(editor.isActive('blockquote'))"
      >
        “ Quote
      </button>

      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        class="px-2 py-1 rounded border hover:bg-gray-100 text-gray-700 disabled:opacity-40"
      >
        ↺ Undo
      </button>

      <button
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="px-2 py-1 rounded border hover:bg-gray-100 text-gray-700 disabled:opacity-40"
      >
        ↻ Redo
      </button>
    </div>

    <!-- Editor -->
    <EditorContent
      :editor="editor"
      class="p-3 min-h-[200px] rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors"
      placeholder="Tulis sesuatu..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  modelValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// Watch perubahan dari luar
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val || '')
    }
  }
)

const buttonClass = (active: boolean) => [
  'px-2 py-1 rounded border text-sm transition',
  active
    ? 'bg-blue-500 text-white border-blue-500'
    : 'text-gray-700 border-gray-200 hover:bg-gray-100'
]

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.ProseMirror p {
  margin: 0.5rem 0;
}

.ProseMirror:focus {
  outline: none !important;
  box-shadow: none !important; /* hilangkan shadow fokus */
  border-color: #d1d5db; /* border netral */
}
</style>
