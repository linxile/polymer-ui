<template>
  <div :class="{ 'hidden': hidden }" class="pagination-container">
    <el-pagination
        :background="background"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts" name="Pagination">
import { computed } from 'vue'
import { scrollTo } from '@/utils/scroll-to'

interface IProps {
  /** 总条数 */
  total: number
  /** 当前页码 */
  page?: number
  /** 每页条数 */
  limit?: number
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 页码按钮的数量 */
  pagerCount?: number
  /** 分页布局 */
  layout?: string
  /** 是否使用背景色 */
  background?: boolean
  /** 翻页后是否滚动到顶部 */
  autoScroll?: boolean
  /** 是否隐藏 */
  hidden?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  page: 1,
  limit: 20,
  pageSizes: () => [10, 20, 30, 50],
  // 移动端页码按钮的数量默认值 5
  pagerCount: () => (document.body.clientWidth < 992 ? 5 : 7),
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  autoScroll: true,
  hidden: false
})

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:limit', value: number): void
  (e: 'pagination', value: { page: number; limit: number }): void
}>()

const currentPage = computed<number>({
  get() {
    return props.page
  },
  set(val: number) {
    emit('update:page', val)
  }
})

const pageSize = computed<number>({
  get() {
    return props.limit
  },
  set(val: number) {
    emit('update:limit', val)
  }
})

/** 每页条数变化 */
function handleSizeChange(val: number) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

/** 当前页码变化 */
function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
}
.pagination-container.hidden {
  display: none;
}
</style>
