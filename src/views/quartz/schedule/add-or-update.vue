<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="scheduleRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobName">
            <el-input v-model="form.jobName" placeholder="任务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务组名" prop="jobGroup">
            <fast-select v-model="form.jobGroup" dict-type="schedule_group" placeholder="任务组名" style="width: 100%"></fast-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="bean名称" prop="beanName">
            <el-input v-model="form.beanName" placeholder="spring bean名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方法名称" prop="method">
            <el-input v-model="form.method" placeholder="方法名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方法参数" prop="params">
            <el-input v-model="form.params" placeholder="方法参数"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="cron表达式" prop="cronExpression">
            <el-input v-model="form.cronExpression" placeholder="cron表达式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否并发" prop="concurrent">
            <el-radio-group v-model="form.concurrent">
              <el-radio-button :value="1" label="允许" />
              <el-radio-button :value="0" label="禁止" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { getScheduleById, submitSchedule } from '@/api/quartz/schedule'
import { ScheduleJob } from '@/types/api/quartz/schedule'

const emit = defineEmits<{ (e: 'success'): void }>()
const scheduleRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<ScheduleJob>({
  id: undefined,
  jobName: '',
  jobGroup: '',
  beanName: '',
  method: '',
  params: '',
  cronExpression: '',
  status: 0,
  concurrent: 1,
  remark: ''
})

const rules = {
  jobName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  jobGroup: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  beanName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  method: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  cronExpression: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加定时任务"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改定时任务"
  getScheduleById(id).then(response => {
    form.value = response.data!
    dialogVisible.value = true
  })
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
  open,
  openWithData
})

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    jobName: '',
    jobGroup: '',
    beanName: '',
    method: '',
    params: '',
    cronExpression: '',
    status: 0,
    concurrent: 1,
    remark: ''
  }

  if (scheduleRef.value) {
    scheduleRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  scheduleRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitSchedule(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
