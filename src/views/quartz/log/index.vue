<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.jobId"
            placeholder="任务ID"
            clearable
        ></el-input>
      </el-form-item>
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
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="logList"
        border
        style="width: 100%"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="jobId"
          label="任务ID"
          header-align="center"
          align="center"
          width="100"
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
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">失败</el-tag>
          <el-tag v-else type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="times"
          label="时长（毫秒）"
          header-align="center"
          align="center"
          width="120"
      ></el-table-column>
      <el-table-column
          prop="createTime"
          label="执行时间"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="80"
      >
        <template #default="scope">
          <el-button
              v-auth="'schedule:log'"
              type="primary"
              link
              @click="detailHandle(scope.row)"
          >详情</el-button
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
  </el-card>

  <detail ref="detailRef"></detail>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Detail from './detail.vue'
import { ScheduleJobLog, ScheduleJobLogQuery } from '@/types/api/quartz/schedule-log'
import { getScheduleLogPage } from '@/api/quartz/schedule-log'

const queryRef = ref()

const logList = ref<ScheduleJobLog[]>([])
const loading = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<ScheduleJobLogQuery>({
  pageNo: 1,
  pageSize: 10,
  jobId: undefined,
  jobName: undefined,
  jobGroup: undefined
})

// 详情弹窗引用
const detailRef = ref<InstanceType<typeof Detail>>()

/** 查询定时任务日志列表 */
function getDataList() {
  loading.value = true
  getScheduleLogPage(queryParams.value).then(response => {
    logList.value = response.data?.list || []
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

/** 详情按钮操作 */
function detailHandle(row: ScheduleJobLog) {
  detailRef.value?.open(row)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
