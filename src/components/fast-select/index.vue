<template>
  <el-select
      :model-value="stringValue"
      :placeholder="placeholder"
      :clearable="clearable"
      @change="handleChange">
    <el-option
        v-for="data in dataList"
        :key="data.dictValue"
        :label="data.dictLabel"
        :value="data.dictValue">
      {{ data.dictLabel }}
    </el-option>
  </el-select>
</template>

<script setup lang="ts" name="FastSelect">
import { computed } from 'vue'
import { getDictDataList } from '@/utils/tool'
import { useAppStore } from '@/store/modules/app'
import type { SysDictDataItem } from '@/types/api/sys/dict-type'

interface IProps {
  /** 绑定值 */
  modelValue?: number | string
  /** 字典类型 */
  dictType: string
  /** 是否可清空 */
  clearable?: boolean
  /** 占位提示 */
  placeholder?: string
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  clearable: false,
  placeholder: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const appStore = useAppStore()

/** 字典数据列表（响应式，字典变化时自动更新） */
const dataList = computed<SysDictDataItem[]>(() => {
  return getDictDataList(appStore.dictList, props.dictType)
})

/** 将传入的值转为字符串类型，确保与 dictValue 匹配 */
const stringValue = computed<string>(() => {
  return props.modelValue !== undefined && props.modelValue !== null
      ? String(props.modelValue)
      : ''
})

/** 值变化 */
function handleChange(value: string | number | boolean | undefined) {
  emit('update:modelValue', String(value ?? ''))
}
</script>
