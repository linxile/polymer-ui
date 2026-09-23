<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.dictType"
            placeholder="字典类型"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.dictName"
            placeholder="字典名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:dict:save'" type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:dict:update'" type="success" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:dict:delete'" type="danger" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:dict:refreshTransCache'" @click="refreshTransCache">刷新缓存</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="dictTypeList"
        border
        show-overflow-tooltip
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="dictType" label="字典类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictName" label="字典名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictSource" label="数据来源" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.dictSource === 0">字典数据</span>
          <span v-else>动态SQL</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="220">
        <template #default="scope">
          <el-button
              v-if="scope.row.dictSource === 0"
              v-auth="'sys:dict:page'"
              type="primary"
              link
              @click="showDictDataHandle(scope.row)"
          >字典配置</el-button
          >
          <el-button
              v-if="scope.row.dictSource === 1"
              v-auth="'sys:dict:page'"
              type="primary"
              link
              @click="showDataSqlHandle(scope.row)"
          >动态数据</el-button
          >
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
    <AddOrUpdate ref="addOrUpdateRef" @success="getDataList"/>

    <!-- 动态数据 -->
    <el-drawer
        v-if="dataSqlVisible"
        v-model="dataSqlVisible"
        :title="dataSqlTitle"
        :size="800"
        :close-on-press-escape="false"
    >
      <data-sql v-if="dictTypeId !== undefined" :dict-type-id="dictTypeId"></data-sql>
    </el-drawer>

    <!-- 字典配置 -->
    <el-drawer
        v-if="dictDataVisible"
        v-model="dictDataVisible"
        :title="dictDataTitle"
        :size="800"
        :close-on-press-escape="false"
    >
      <dict-data v-if="dictTypeId !== undefined" :dict-type-id="dictTypeId"></dict-data>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="SysDictType">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './type-add-or-update.vue'
import DataSql from './data-sql.vue'
import DictData from './data.vue'
import { SysDictType, SysDictTypeQuery } from '@/types/api/sys/dict-type'
import { deleteDictTypes, getDictTypePage, refreshTransCache } from '@/api/sys/dict-type'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const dictTypeList = ref<SysDictType[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const single = ref<boolean>(true)
const multiple = ref<boolean>(true)
const total = ref<number>(0)
const order = ref<string>('')
const asc = ref<boolean>(false)

const queryParams = ref<SysDictTypeQuery>({
  pageNo: 1,
  pageSize: 10,
  dictType: undefined,
  dictName: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

// 字典配置抽屉
const dictDataVisible = ref(false)
const dictDataTitle = ref('')
// 动态数据抽屉
const dataSqlVisible = ref(false)
const dataSqlTitle = ref('')
// 共用的字典类型 ID
const dictTypeId = ref<number>()

/** 查询字典类型列表 */
function getDataList() {
  loading.value = true
  getDictTypePage({
    ...queryParams.value,
    order: order.value,
    asc: asc.value
  } as any).then(response => {
    dictTypeList.value = response.data?.list || []
    total.value = response.data?.total || 0
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1
  getDataList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryRef.value.resetFields()
  handleQuery()
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

/** 多选框选中数据 */
function handleSelectionChange(selection: SysDictType[]) {
  ids.value = selection.map(item => item.id!)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row?: SysDictType) {
  const id = row?.id || ids.value[0]
  addOrUpdateRef.value?.openWithData(id)
}

/** 删除按钮操作 */
function handleDelete(row?: SysDictType) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  ElMessageBox.confirm('是否确认删除字典类型编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteDictTypes(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 打开字典配置抽屉 */
function showDictDataHandle(row: SysDictType) {
  dictDataVisible.value = true
  dictTypeId.value = row.id
  dictDataTitle.value = "字典配置 - " + row.dictType
}

/** 打开动态数据抽屉 */
function showDataSqlHandle(row: SysDictType) {
  dataSqlVisible.value = true
  dictTypeId.value = row.id
  dataSqlTitle.value = "动态数据 - " + row.dictType
}

/** 刷新字典翻译缓存 */
function refreshTransCacheHandle() {
  refreshTransCache().then(() => {
    ElMessage.success('刷新缓存成功')
  })
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
