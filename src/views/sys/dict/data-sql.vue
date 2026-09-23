<template>
  <el-table
      v-loading="loading"
      :data="dictSqlList"
      border
      show-overflow-tooltip
      style="width: 100%"
  >
    <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
    ></el-table-column>
    <el-table-column
        prop="dictValue"
        label="字典值"
        header-align="center"
        align="center"
    ></el-table-column>
    <el-table-column
        prop="dictLabel"
        label="字典标签"
        header-align="center"
        align="center"
    ></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SysDictDataItem } from '@/types/api/sys/dict-type'
import { getDictSqlData } from '@/api/sys/dict-type'

const props = defineProps({
  dictTypeId: {
    type: Number,
    required: true
  }
})

const dictSqlList = ref<SysDictDataItem[]>([])
const loading = ref<boolean>(true)

/** 查询动态SQL数据 */
function getDataList() {
  loading.value = true
  getDictSqlData(props.dictTypeId).then(response => {
    dictSqlList.value = response.data?.list || []
    loading.value = false
  })
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
