<template>
  <el-dialog v-model="dialogVisible" title="发送短信测试" :close-on-click-modal="false" :width="500" @closed="handleClosed">
    <el-form ref="sendRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="平台类型" prop="platform">
        <fast-select v-model="form.platform" dict-type="sms_platform" placeholder="平台类型" style="width: 100%" disabled></fast-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item v-if="form.platform == 0 || form.platform == 2" label="参数Key" prop="paramKey">
        <el-input v-model="form.paramKey" placeholder="参数Key"></el-input>
      </el-form-item>
      <el-form-item label="参数Value" prop="paramValue">
        <el-input v-model="form.paramValue" placeholder="参数Value"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">发送</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { sendSms } from '@/api/message/sms-platform'
import { MessageSmsSend } from '@/types/api/message/sms-platform'

const emit = defineEmits<{ (e: 'success'): void }>()
const sendRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<MessageSmsSend>({
  id: undefined,
  platform: 0,
  paramKey: '',
  paramValue: '',
  mobile: ''
})

const rules = {
  mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗 */
function open(row: any) {
  reset()
  form.value.id = row.id
  form.value.platform = row.platform
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
    id: undefined,
    platform: 0,
    paramKey: '',
    paramValue: '',
    mobile: ''
  }

  if (sendRef.value) {
    sendRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  sendRef.value.validate((valid: boolean) => {
    if (valid) {
      sendSms(form.value).then(() => {
        ElMessage.success('发送成功')
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
