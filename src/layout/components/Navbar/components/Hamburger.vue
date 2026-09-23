<template>
  <div @click="handleClick">
    <svg-icon :icon="icon"></svg-icon>
  </div>
</template>

<script setup lang="ts" name="Hamburger">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const screenWidth = ref<number>(0)

/** 侧边栏图标 */
const icon = computed<string>(() => (appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent'))

/** 点击切换侧边栏 */
function handleClick() {
  appStore.setSidebarOpened()
}

/** 窗口大小变化处理 */
function handleResize() {
  screenWidth.value = document.body.clientWidth
}

/** 监听窗口大小变化 */
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

/** 组件卸载时移除监听 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

/** 监听屏幕宽度变化，自动收起/展开侧边栏 */
watch(screenWidth, (value: number, oldValue: number) => {
  if (oldValue > value && value < 1000) {
    appStore.setSidebarStatus(false)
  } else if (oldValue < value && value > 1000) {
    appStore.setSidebarStatus(true)
  }
})
</script>
