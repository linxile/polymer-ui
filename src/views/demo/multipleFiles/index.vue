<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'demo:multipleFiles:save'" type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'demo:multipleFiles:delete'" type="danger" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item v-auth="'demo:multipleFiles:import'">
        <DataImport
            ref="dataImportRef"
            import-url="/demo/multipleFiles/import"
            :accept="['xlsx', 'xls']"
            :max-size="2"
            :max-records="10000"
            business-name="多文件上传样例"
            business-type="multipleFiles"
            templateUrl="/demo/multipleFiles/exportTemplate"
            duplicate-fields-api="/demo/multipleFiles/uniqueFields"
            @success="handleImportSuccess"
            @error="handleImportError"
        />
      </el-form-item>
      <el-form-item>
        <el-button
            v-auth="'demo:multipleFiles:export'"
            type="success"
            @click="handleExport"
        >导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="multipleFilesList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button
              v-auth="'demo:multipleFiles:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
              v-auth="'demo:multipleFiles:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 新增/修改弹窗 -->
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>
  </el-card>
</template>

<script setup lang="ts" name="DemoMultipleFilesIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import DataImport from '@/components/upload/dataImport.vue'
import { DemoMultipleFiles, DemoMultipleFilesQuery } from '@/types/api/demo/multiple-files'
import { deleteMultipleFiles, getMultipleFilesPage } from '@/api/demo/multiple-files'
import { ElMessage, ElMessageBox } from 'element-plus'
import {exportFile} from "@/utils/useFileDownload";

const queryRef = ref()
const tableRef = ref()

const multipleFilesList = ref<DemoMultipleFiles[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<DemoMultipleFilesQuery>({
  pageNo: 1,
  pageSize: 10
})

// 弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()
const dataImportRef = ref()

/** 查询列表 */
function getDataList() {
  loading.value = true
  getMultipleFilesPage(queryParams.value).then(response => {
    multipleFilesList.value = response.data?.list || []
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
function handleSelectionChange(selection: DemoMultipleFiles[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: DemoMultipleFiles) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row?: DemoMultipleFiles) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteMultipleFiles(deleteIds)
  }).then((res) => {
    getDataList()
    ElMessage.success(`成功删除 ${res.data ?? deleteIds.length} 条数据`)
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  exportFile("demo/multipleFiles/export",
      queryParams.value,
      `user_${new Date().getTime()}.xlsx`)
}

/** 导入成功回调 */
function handleImportSuccess() {
  getDataList()
}

/** 导入失败回调 */
function handleImportError() {
  getDataList()
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
