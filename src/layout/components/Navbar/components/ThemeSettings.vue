<template>
  <div>
    <svg-icon icon="icon-ellipsis-v" @click="themeSettingsHandle"></svg-icon>
  </div>
</template>

<script setup lang="ts" name="ThemeSettings">
import emits from '@/utils/emits'

/** 打开主题设置抽屉 */
function themeSettingsHandle() {
  emits.emit('openThemeSettings')
}
</script>
