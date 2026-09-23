<template>
  <el-dialog v-model="dialogVisible" title="日志详情" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="detailRef" :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务ID">
            <el-input v-model="form.jobId" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称">
            <el-input v-model="form.jobName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务组名">
            <fast-select v-model="form.jobGroup" dict-type="schedule_group" disabled style="width: 100%"></fast-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="bean名称">
            <el-input v-model="form.beanName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方法名称">
            <el-input v-model="form.method" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方法参数">
            <el-input v-model="form.params" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行时间">
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行时长">
            <el-tag type="danger">{{ form.times }}ms</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务状态">
            <el-tag v-if="form.status === 0" type="danger">失败</el-tag>
            <el-tag v-else type="success">成功</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.status === 0" label="错误信息">
        <el-input v-model="form.error" :rows="12" type="textarea" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ScheduleJobLog } from '@/types/api/quartz/schedule-log'

const detailRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<ScheduleJobLog>({
  jobId: undefined,
  jobName: '',
  jobGroup: '',
  beanName: '',
  method: '',
  params: '',
  error: '',
  times: 0,
  status: 0,
  createTime: ''
})

/** 打开弹窗 */
function open(row: ScheduleJobLog) {
  reset()
  form.value = { ...row }
  dialogVisible.value = true
}

/** 关闭弹窗 */
function cancel() {
  dialogVisible.value = false
}

/** 弹窗关闭后重置表单 */
function handleClosed() {
  reset()
}

/** 对外暴露方法 */
defineExpose({
  open
})

/** 表单重置 */
function reset() {
  form.value = {
    jobId: undefined,
    jobName: '',
    jobGroup: '',
    beanName: '',
    method: '',
    params: '',
    error: '',
    times: 0,
    status: 0,
    createTime: ''
  }

  if (detailRef.value) {
    detailRef.value.resetFields()
  }
}
</script>
