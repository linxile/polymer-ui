<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-button v-auth="'sys:dict:save'" type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="dictDataList"
        border
        show-overflow-tooltip
        style="width: 100%"
        @sort-change="handleSortChange">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="dictValue" label="字典值" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictLabel" label="字典标签" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.labelClass" :type="scope.row.labelClass">
            {{ scope.row.dictLabel }}
          </el-tag>
          <span v-else>
            {{ scope.row.dictLabel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button
              v-auth="'sys:dict:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-auth="'sys:dict:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getDataList"
    />
    <!-- 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" :dict-type-id="dictTypeId" @success="getDataList"/>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './data-add-or-update.vue'
import { SysDictData, SysDictDataQuery } from '@/types/api/sys/dict-data'
import { deleteDictDatas, getDictDataPage } from '@/api/sys/dict-data'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  dictTypeId: {
    type: Number,
    required: true
  }
})

const queryRef = ref()

const dictDataList = ref<SysDictData[]>([])
const loading = ref<boolean>(true)
const total = ref<number>(0)
const order = ref<string>('')
const asc = ref<boolean>(false)

const queryParams = ref<SysDictDataQuery>({
  pageNo: 1,
  pageSize: 10,
  dictTypeId: props.dictTypeId
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

/** 查询字典数据列表 */
function getDataList() {
  loading.value = true
  getDictDataPage({
    ...queryParams.value,
    order: order.value,
    asc: asc.value
  } as any).then(response => {
    dictDataList.value = response.data?.list || []
    total.value = response.data?.total || 0
    loading.value = false
  })
}

/** 排序变化 */
function handleSortChange(data: any) {
  const { prop, order: sortOrder } = data
  if (prop && sortOrder) {
    order.value = prop
    asc.value = sortOrder === 'ascending'
  } else {
    order.value = ''
  }
  getDataList()
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: SysDictData) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row: SysDictData) {
  ElMessageBox.confirm('是否确认删除字典数据编号为"' + row.id + '"的数据项？').then(function() {
    return deleteDictDatas([row.id!])
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
