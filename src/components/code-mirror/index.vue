<template>
  <div style="width: 100%">
    <codemirror
        v-model="codes"
        placeholder="Code goes here..."
        :style="{ height: height + 'px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
        @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts" name="CodeMirror">
import { ref, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { EditorView } from '@codemirror/view'

interface IProps {
  /** 绑定值 */
  modelValue?: string
  /** 编辑器高度（px） */
  height?: number
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  height: 400
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const codes = ref<string>('')
const extensions = [javascript()]

/** Codemirror EditorView 实例 */
const view = shallowRef<EditorView>()

/** 监听 modelValue 变化，同步到内部 codes */
watch(
    () => props.modelValue,
    val => {
      codes.value = val || ''
    },
    { immediate: true }
)

/** 编辑器就绪 */
function handleReady(payload: { view: EditorView }) {
  view.value = payload.view
}

/** 内容变化 */
function handleChange(value: string) {
  emit('update:modelValue', value)
}
</script>
