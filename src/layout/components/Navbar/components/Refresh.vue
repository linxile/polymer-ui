<template>
  <svg-icon icon="icon-reload" @click="refresh"></svg-icon>
</template>

<script setup lang="ts" name="Refresh">
import { nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'

const tabsStore = useTabsStore()
const router = useRouter()
const route = useRoute()

/** 刷新当前页面 */
async function refresh() {
  await tabsStore.delCachedView(route)
  await nextTick()
  try {
    await router.replace({ path: '/redirect' + route.path })
  } catch (err) {
    console.warn(err)
  }
}
</script>
