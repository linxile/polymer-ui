<template>
  <div style="border: 1px solid #ccc; z-index: 100">
    <!-- 工具栏 -->
    <Toolbar :editor="editorRef" :mode="mode" style="border-bottom: 1px solid #ccc" />
    <!-- 编辑器 -->
    <Editor
        :model-value="modelValue || ''"
        :style="style"
        :disabled="disabled"
        :default-config="editorConfig"
        :mode="mode"
        @on-created="handleCreated"
        @on-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor'
import { ElMessage } from 'element-plus'
import FileUrlUtils from '@/utils/fileUrlUtils'
import {uploadAttachmentSimplify} from '@/utils/useFileUpload'

interface IProps {
  /** 绑定值（HTML 字符串） */
  modelValue: string
  /** 编辑器模式 */
  mode?: string
  /** 占位提示 */
  placeholder?: string
  /** 编辑器样式 */
  style?: string
  /** 是否禁用 */
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  mode: 'default',
  placeholder: '',
  style: 'height: 400px;',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 编辑器实例，使用 undefined 而不是 null
const editorRef = shallowRef<IDomEditor>()

type InsertFnType = (url: string, alt: string, href: string) => void

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  readOnly: props.disabled,
  MENU_CONF: {
    uploadImage: {
      // 自定义上传
      async customUpload(file: File, insertFn: InsertFnType) {
        try {
          // 直接传递 File 对象
          const result = await uploadAttachmentSimplify(file)
          // 获取完整 URL
          const url = await FileUrlUtils.getFullUrl(result.url || '')
          insertFn(url, result.name || '', result.url || '')
        } catch (error) {
          ElMessage.error('图片上传失败，请重试')
        }
      }
    }
  }
}

/** 编辑器创建完成 */
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
}

/** 编辑器 change 事件触发 */
function handleChange(editor: IDomEditor) {
  const html = editor.getHtml()
  emit('update:modelValue', html || '')
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) {
    return
  }
  editor.destroy()
  editorRef.value = undefined
})
</script>
