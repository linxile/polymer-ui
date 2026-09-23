<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.jobName"
            placeholder="任务名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.jobGroup"
            dict-type="schedule_group"
            clearable
            placeholder="任务组名"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.status"
            dict-type="schedule_status"
            clearable
            placeholder="任务状态"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'schedule:save'" type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'schedule:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'schedule:log'" @click="logHandle">日志</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="scheduleList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="id"
          label="id"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="jobName"
          label="任务名称"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="jobGroup"
          label="任务组名"
          dict-type="schedule_group"
      ></fast-table-column>
      <el-table-column prop="beanName" label="执行方法">
        <template #default="scope">
          {{ scope.row.beanName }}.{{ scope.row.method }}()
        </template>
      </el-table-column>
      <el-table-column
          prop="cronExpression"
          label="Cron表达式"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="status"
          label="状态"
          dict-type="schedule_status"
      ></fast-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="220"
      >
        <template #default="scope">
          <el-button
              v-auth="'schedule:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-if="scope.row.status === 0"
              v-auth="'schedule:update'"
              type="primary"
              link
              @click="statusHandle(scope.row, 1)"
          >恢复</el-button
          >
          <el-button
              v-if="scope.row.status === 1"
              v-auth="'schedule:update'"
              type="primary"
              link
              @click="statusHandle(scope.row, 0)"
          >暂停</el-button
          >
          <el-button
              v-auth="'schedule:run'"
              type="primary"
              link
              @click="runHandle(scope.row)"
          >执行</el-button
          >
          <el-button
              v-auth="'schedule:delete'"
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

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>

    <!-- 日志 -->
    <el-drawer
        v-if="logVisible"
        v-model="logVisible"
        title="任务日志"
        :size="1200"
        :close-on-press-escape="false"
    >
      <log />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="QuartzScheduleIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import Log from '../log/index.vue'
import { ScheduleJob, ScheduleJobQuery } from '@/types/api/quartz/schedule'
import { changeScheduleStatus, deleteSchedules, getSchedulePage, runSchedule } from '@/api/quartz/schedule'
import { ElMessage, ElMessageBox } from 'element-plus/es'

const queryRef = ref()
const tableRef = ref()

const scheduleList = ref<ScheduleJob[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<ScheduleJobQuery>({
  pageNo: 1,
  pageSize: 10,
  jobName: undefined,
  jobGroup: undefined,
  status: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

const logVisible = ref(false)

/** 查询定时任务列表 */
function getDataList() {
  loading.value = true
  getSchedulePage(queryParams.value).then(response => {
    scheduleList.value = response.data?.list || []
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
function handleSelectionChange(selection: ScheduleJob[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: ScheduleJob) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row?: ScheduleJob) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除任务编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteSchedules(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 立即执行 */
function runHandle(row: ScheduleJob) {
  ElMessageBox.confirm("确定进行立即执行操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(() => {
        runSchedule(row).then(() => {
          ElMessage.success("操作成功")
        })
      })
      .catch(() => {})
}

/** 修改状态 */
function statusHandle(row: ScheduleJob, status: 0 | 1) {
  const opt = status === 0 ? "暂停" : "恢复"
  ElMessageBox.confirm(`确定进行${opt}操作?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(() => {
        row.status = status
        changeScheduleStatus(row).then(() => {
          ElMessage.success("操作成功")
        })
      })
      .catch(() => {})
}

/** 打开日志抽屉 */
function logHandle() {
  logVisible.value = true
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
