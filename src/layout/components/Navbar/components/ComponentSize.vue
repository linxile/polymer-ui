<template>
  <el-dropdown trigger="click" @command="componentSizeChange">
    <svg-icon icon="icon-font-size"></svg-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="large" :disabled="componentSize === 'large'">{{ $t('app.large') }}</el-dropdown-item>
        <el-dropdown-item command="default" :disabled="componentSize === 'default'">{{ $t('app.default') }}</el-dropdown-item>
        <el-dropdown-item command="small" :disabled="componentSize === 'small'">{{ $t('app.small') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="ComponentSize">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

/** 组件大小 */
type ComponentSize = 'large' | 'default' | 'small'

const appStore = useAppStore()

/** 当前组件大小 */
const componentSize = computed<ComponentSize>(() => appStore.componentSize as ComponentSize)

/** 组件大小切换 */
function componentSizeChange(size: ComponentSize) {
  appStore.setComponentSize(size)
}
</script>
