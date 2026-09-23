<template>
  <el-card v-loading="loading">
    <iframe :src="url" class="iframe" @load="load"></iframe>
  </el-card>
</template>

<script setup lang="ts" name="Iframe">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { replaceLinkParam } from '@/utils/tool'

const route = useRoute()

/** iframe 地址 */
const url = ref<string>('')
/** 加载状态 */
const loading = ref<boolean>(false)

/** 初始化 iframe 地址 */
function initUrl(currentRoute: RouteLocationNormalizedLoaded) {
  loading.value = true

  const { meta, query } = currentRoute
  // 优先使用 query.url，否则使用 meta.url
  if (query.url) {
    url.value = String(query.url)
  } else {
    url.value = replaceLinkParam((meta.url as string) || '')
  }
}

/** iframe 加载完成 */
function load() {
  loading.value = false
}

// 监听路由变化
watch(
    () => route,
    value => {
      if (value.path === '/iframe') {
        initUrl(value)
      }
    },
    { deep: true }
)

// 组件挂载时初始化
onMounted(() => {
  initUrl(route)
})
</script>

<style lang="scss" scoped>
.iframe {
  min-height: calc(100vh - 70px - var(--theme-header-height));
  width: 100%;
  border: 0;
}
</style>
