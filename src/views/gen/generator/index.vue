<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.tableName"
            placeholder="表名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:table:import'" type="primary" @click="importHandle">导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:table:code'" type="success" :disabled="multiple" @click="downloadBatchHandle">生成代码</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:table:delete'" type="danger" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="tableList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="tableName" label="表名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="tableComment" label="表说明" header-align="center" align="center"></el-table-column>
      <el-table-column prop="className" label="类名" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="300">
        <template #default="scope">
          <el-button v-auth="'gen:table:update'" type="primary" link @click="editHandle(scope.row)">编辑</el-button>
          <el-button v-auth="'gen:table:preview'" type="primary" link @click="previewHandle(scope.row)">预览</el-button>
          <el-button v-auth="'gen:table:code'" type="primary" link @click="generatorHandle(scope.row)">生成代码</el-button>
          <el-button v-auth="'gen:table:delete'" type="primary" link @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-auth="'gen:table:sync'" type="primary" link @click="syncHandle(scope.row)">同步</el-button>
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

    <Import ref="importRef" @success="getDataList"></Import>
    <Preview ref="previewRef" @success="getDataList"></Preview>
    <Edit ref="editRef" @success="getDataList"></Edit>
    <Generator ref="generatorRef" @success="getDataList"></Generator>
  </el-card>
</template>

<script setup lang="ts" name="GenTableIndex">
import { onMounted, ref } from 'vue'
import Import from './import.vue'
import Edit from './edit.vue'
import Preview from './preview.vue'
import Generator from './generator.vue'
import { TableEntity } from '@/types/api/gen/table-entity'
import { GenQuery } from '@/types/api/gen/base-class'
import { deleteTables, getTablePage, syncTable } from '@/api/gen/table'
import { getDownloadUrl } from '@/api/gen/generator'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const tableList = ref<TableEntity[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<GenQuery>({
  pageNo: 1,
  pageSize: 10,
  tableName: undefined
})

// 弹窗引用
const importRef = ref<InstanceType<typeof Import>>()
const editRef = ref<InstanceType<typeof Edit>>()
const previewRef = ref<InstanceType<typeof Preview>>()
const generatorRef = ref<InstanceType<typeof Generator>>()

/** 查询表列表 */
function getDataList() {
  loading.value = true
  getTablePage(queryParams.value).then(response => {
    tableList.value = response.data?.list || []
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

/** 多选框选中数据 */
function handleSelectionChange(selection: TableEntity[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 导入按钮操作 */
function importHandle() {
  importRef.value?.open()
}

/** 编辑按钮操作 */
function editHandle(row: TableEntity) {
  editRef.value?.openWithData(row.id!)
}

/** 预览按钮操作 */
function previewHandle(row: TableEntity) {
  previewRef.value?.open(row.id!)
}

/** 生成代码按钮操作 */
function generatorHandle(row: TableEntity) {
  generatorRef.value?.openWithData(row.id!)
}

/** 批量生成代码（zip 下载） */
function downloadBatchHandle() {
  if (ids.value.length === 0) {
    ElMessage.warning('请选择生成代码的表')
    return
  }
  window.open(getDownloadUrl(ids.value), '_blank')
}

/** 删除按钮操作 */
function handleDelete(row?: TableEntity) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除表编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteTables(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 同步按钮操作 */
function syncHandle(row: TableEntity) {
  ElMessageBox.confirm(`确定同步数据表${row.tableName}吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    syncTable(row.id!).then(() => {
      ElMessage.success('同步成功')
    })
  }).catch(() => {})
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
