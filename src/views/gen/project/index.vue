<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.projectName"
            placeholder="项目名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:project:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:project:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="projectList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="projectName" label="项目名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="projectCode" label="项目标识" header-align="center" align="center"></el-table-column>
      <el-table-column prop="projectPackage" label="项目包名" show-overflow-tooltip header-align="center" align="center"></el-table-column>
      <el-table-column prop="projectPath" label="项目路径" show-overflow-tooltip header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
        <template #default="scope">
          <el-button
              v-auth="'gen:project:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
              v-auth="'gen:project:update'"
              type="primary"
              link
              @click="downloadHandle(scope.row)"
          >源码下载</el-button>
          <el-button
              v-auth="'gen:project:delete'"
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

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>
    <!-- 源码下载 -->
    <download ref="downloadRef" @success="getDataList"></download>
  </el-card>
</template>

<script setup lang="ts" name="ProjectModifyIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import Download from './download.vue'
import { ProjectModify } from '@/types/api/gen/project'
import { GenQuery } from '@/types/api/gen/base-class'
import { deleteProjects, getProjectPage } from '@/api/gen/project'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const projectList = ref<ProjectModify[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<GenQuery>({
  pageNo: 1,
  pageSize: 10,
  projectName: undefined
})

// 弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()
const downloadRef = ref<InstanceType<typeof Download>>()

/** 查询项目变更列表 */
function getDataList() {
  loading.value = true
  getProjectPage(queryParams.value).then(response => {
    projectList.value = response.data?.list || []
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
function handleSelectionChange(selection: ProjectModify[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: ProjectModify) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 源码下载按钮操作 */
function downloadHandle(row: ProjectModify) {
  downloadRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row?: ProjectModify) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除项目变更编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteProjects(deleteIds)
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
