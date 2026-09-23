<template>
  <component :is="LayoutComponents[layout]"></component>
  <Settings></Settings>
</template>

<script setup lang="ts" name="LayoutIndex">
import { computed } from 'vue'
import type { Component } from 'vue'
import { useAppStore } from '@/store/modules/app'
import Settings from '@/layout/components/Settings/index.vue'
import Vertical from '@/layout/components/Theme/Vertical.vue'
import Columns from '@/layout/components/Theme/Columns.vue'
import Transverse from '@/layout/components/Theme/Transverse.vue'

/** 布局类型 */
type LayoutKey = 'vertical' | 'columns' | 'transverse'

/** 布局组件映射 */
const LayoutComponents: Record<LayoutKey, Component> = {
  vertical: Vertical,
  columns: Columns,
  transverse: Transverse
}

const appStore = useAppStore()

/** 当前布局 */
const layout = computed<LayoutKey>(() => appStore.theme.layout as LayoutKey)
</script>
