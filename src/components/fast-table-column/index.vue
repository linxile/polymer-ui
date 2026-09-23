<template>
  <el-table-column
      :prop="prop"
      :label="label"
      :header-align="headerAlign"
      :align="align"
      :width="width"
      :min-width="minWidth"
      :class-name="className">
    <template #default="scope">
      <span v-html="getDictLabelList(dictType, scope.row[prop])"></span>
    </template>
  </el-table-column>
</template>

<script setup lang="ts" name="FastTableColumn">
import { getDictLabelList } from '@/utils/tool'

interface IProps {
  /** 字段名 */
  prop: string
  /** 列标题 */
  label: string
  /** 字典类型 */
  dictType: string
  /** 表头对齐方式 */
  headerAlign?: string
  /** 内容对齐方式 */
  align?: string
  /** 列宽度 */
  width?: string
  /** 列最小宽度 */
  minWidth?: string
  /** 自定义类名 */
  className?: string
}

const props = withDefaults(defineProps<IProps>(), {
  headerAlign: 'center',
  align: 'center',
  width: '',
  minWidth: '',
  className: ''
})
</script>
