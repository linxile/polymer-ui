<template>
  <el-dialog
      v-model="dialogVisible"
      title="邮件日志详情"
      :close-on-click-modal="false"
      draggable
      @closed="handleClosed"
  >
    <el-form ref="detailRef" :model="form" label-width="auto">
      <el-form-item label="接收邮箱地址">
        <el-input v-model="form.toMail" disabled></el-input>
      </el-form-item>
      <el-form-item label="发送邮箱地址">
        <el-input v-model="form.fromMail" disabled></el-input>
      </el-form-item>
      <el-form-item label="模板编码">
        <el-input v-model="form.templateCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="模版发送人名称">
        <el-input v-model="form.templateNickname" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮件标题">
        <el-input v-model="form.templateTitle" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮件内容">
        <WangEditor v-model="form.templateContent" disabled></WangEditor>
      </el-form-item>
      <el-form-item label="发送状态">
        <fast-select v-model="form.sendStatus" dict-type="mail_send_status" disabled style="width: 100%"></fast-select>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-input v-model="form.sendTime" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="form.sendException" label="发送异常">
        <el-input v-model="form.sendException" :rows="6" type="textarea" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WangEditor from '@/components/wang-editor/index.vue'
import { MessageMailLog } from '@/types/api/message/mail-log'

const detailRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<MessageMailLog>({
  toMail: '',
  fromMail: '',
  templateCode: '',
  templateNickname: '',
  templateTitle: '',
  templateContent: '',
  sendStatus: undefined,
  sendTime: '',
  sendException: ''
})

/** 打开弹窗 */
function open(row: MessageMailLog) {
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
    toMail: '',
    fromMail: '',
    templateCode: '',
    templateNickname: '',
    templateTitle: '',
    templateContent: '',
    sendStatus: undefined,
    sendTime: '',
    sendException: ''
  }

  if (detailRef.value) {
    detailRef.value.resetFields()
  }
}
</script>
