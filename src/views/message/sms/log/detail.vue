<template>
  <el-dialog v-model="dialogVisible" title="日志详情" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="detailRef" :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="日志ID">
            <el-input v-model="form.id" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台ID">
            <el-input v-model="form.platformId" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="平台类型">
            <fast-select v-model="form.platform" dict-type="sms_platform" disabled style="width: 100%"></fast-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input v-model="form.mobile" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-tag v-if="form.status === 0" type="danger">失败</el-tag>
            <el-tag v-else type="success">成功</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送时间">
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="参数">
        <el-input v-model="form.params" disabled></el-input>
      </el-form-item>
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
import { MessageSmsLog } from '@/types/api/message/sms-log'

const detailRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<MessageSmsLog>({
  id: undefined,
  platformId: undefined,
  platform: undefined,
  mobile: '',
  status: 0,
  params: '',
  error: '',
  createTime: ''
})

/** 打开弹窗 */
function open(row: MessageSmsLog) {
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
    id: undefined,
    platformId: undefined,
    platform: undefined,
    mobile: '',
    status: 0,
    params: '',
    error: '',
    createTime: ''
  }

  if (detailRef.value) {
    detailRef.value.resetFields()
  }
}
</script>
