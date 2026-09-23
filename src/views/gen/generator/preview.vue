<template>
  <el-drawer v-model="dialogVisible" title="代码预览" :size="1200" :with-header="false">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane
          v-for="(item, key) in previewData"
          :key="key"
          :label="item.fileName"
          :name="String(key)"
      >
        <code-mirror v-model="item.content" :height="680"></code-mirror>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElLoading } from 'element-plus'
import { usePreviewApi } from '@/api/gen/generator'
import { Preview } from '@/types/api/gen/generator'
import CodeMirror from '@/components/code-mirror/index.vue'

const dialogVisible = ref<boolean>(false)
const activeName = ref<string>('0')
const previewData = ref<Preview[]>([])

/** 打开弹窗 */
async function open(tableId: number) {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  try {
    const res = await usePreviewApi(tableId)
    previewData.value = res.data || []
    activeName.value = '0'
    dialogVisible.value = true
  } finally {
    loadingInstance.close()
  }
}

/** 对外暴露方法 */
defineExpose({
  open
})
</script>
