<template>
  <div>
    <!-- <v-md-editor :model-value="modelValue" :height="height" @change="handleChange"></v-md-editor> -->
  </div>
</template>

<script setup lang="ts" name="MdEditor">
import VMdEditor from '@kangc/v-md-editor'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// highlight
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, {
  Hljs: hljs
})

interface IProps {
  /** 绑定值 */
  modelValue: string
  /** 编辑器高度 */
  height?: string
}

withDefaults(defineProps<IProps>(), {
  height: '400px'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/** 编辑器 change 事件触发 */
function handleChange(text: string) {
  emit('update:modelValue', text)
}
</script>
