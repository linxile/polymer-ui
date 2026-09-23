<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item>
        <el-button v-auth="'sys:dept:save'" type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="toggleExpandAll()">
          <template v-if="!isExpandAll">
            全部展开&nbsp;<el-icon><ArrowDown /></el-icon>
          </template>
          <template v-else>
            全部收起&nbsp;<el-icon><ArrowUp /></el-icon>
          </template>
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :default-expand-all="isExpandAll"
        :data="deptList"
        row-key="id"
        border
        style="width: 100%"
    >
      <el-table-column prop="name" label="名称" header-align="center"></el-table-column>
      <fast-table-column prop="type" label="部门类型" dict-type="dept_type" header-align="center"></fast-table-column>
      <el-table-column prop="leaderName" label="负责人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="160">
        <template #default="scope">
          <el-button
              v-auth="'sys:dept:save'"
              type="primary"
              link
              @click="handleAdd(scope.row)"
          >新增</el-button
          >
          <el-button
              v-auth="'sys:dept:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-auth="'sys:dept:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { SysDept } from '@/types/api/sys/dept'
import { deleteDept, useDeptListApi } from '@/api/sys/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

const deptList = ref<SysDept[]>([])
const loading = ref<boolean>(true)

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

// 是否展开，默认全部折叠
const isExpandAll = ref(false)
// 是否重新渲染表格状态
const refreshTable = ref(true)

/** 查询部门列表 */
function getDataList() {
  loading.value = true
  useDeptListApi().then(response => {
    deptList.value = response.data || []
    loading.value = false
  })
}

/** 新增按钮操作 */
function handleAdd(row?: SysDept) {
  addOrUpdateRef.value?.open(row)
}

/** 修改按钮操作 */
function handleUpdate(row: SysDept) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row: SysDept) {
  ElMessageBox.confirm('是否确认删除部门编号为"' + row.id + '"的数据项？').then(function() {
    return deleteDept(row.id!)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 切换 展开和折叠 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
