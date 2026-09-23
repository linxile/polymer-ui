<template>
  <el-radio-group :model-value="modelValue + ''" @change="handleChange">
    <el-radio
        v-for="data in dataList"
        :key="data.dictValue"
        :value="data.dictValue"
    >{{ data.dictLabel }}</el-radio>
  </el-radio-group>
</template>

<script setup lang="ts" name="FastRadioGroup">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { getDictDataList } from '@/utils/tool'
import type { SysDictDataItem } from '@/types/api/sys/dict-type'

interface IProps {
  /** 绑定值 */
  modelValue: number | string
  /** 字典类型 */
  dictType: string
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const appStore = useAppStore()

/** 字典数据列表（响应式，字典变化时自动更新） */
const dataList = computed<SysDictDataItem[]>(() => {
  return getDictDataList(appStore.dictList, props.dictType)
})

/** 值变化 */
function handleChange(value: string | number | boolean | undefined) {
  emit('update:modelValue', String(value ?? ''))
}
</script>
