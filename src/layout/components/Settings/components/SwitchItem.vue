<template>
  <div class="settings-switch">
    <span>{{ title }}</span>
    <el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange"></el-switch>
  </div>
</template>

<script setup lang="ts" name="SettingsSwitch">
interface IProps {
  /** 绑定值 */
  modelValue: boolean
  /** 标题 */
  title: string
  /** 是否禁用 */
  disabled?: boolean
}

withDefaults(defineProps<IProps>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change'): void
}>()

/** 值变化 */
function handleChange(val: boolean) {
  emit('update:modelValue', val)
  emit('change')
}
</script>

<style lang="scss" scoped>
.settings-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  color: var(--el-text-color-primary);
}
</style>
