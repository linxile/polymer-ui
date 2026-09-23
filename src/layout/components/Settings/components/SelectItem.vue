<template>
  <div class="settings-select">
    <span>{{ title }}</span>
    <el-select :model-value="modelValue" size="default" style="width: 100px" :disabled="disabled" @change="handleChange">
      <el-option
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts" name="SettingsSelect">
/** 下拉选项 */
interface SelectOption {
  /** 选项标签 */
  label: string
  /** 选项值 */
  value: string | number | boolean
}

interface IProps {
  /** 绑定值 */
  modelValue: string
  /** 标题 */
  title: string
  /** 选项列表 */
  options: SelectOption[]
  /** 是否禁用 */
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  options: () => [],
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change'): void
}>()

/** 值变化 */
function handleChange(val: string | number | boolean) {
  emit('update:modelValue', String(val))
  emit('change')
}
</script>

<style lang="scss" scoped>
.settings-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-primary);
}
</style>
