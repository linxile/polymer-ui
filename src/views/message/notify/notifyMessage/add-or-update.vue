<template>
  <el-dialog v-model="dialogVisible" title="站内信详情" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="notifyMessageRef" :model="form" label-width="100px">
      <el-form-item label="用户id">
        <el-input v-model="form.userId" disabled></el-input>
      </el-form-item>
      <el-form-item label="模板编码">
        <el-input v-model="form.templateCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="发送人">
        <el-input v-model="form.sender" disabled></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content" disabled></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <fast-select v-model="form.type" dict-type="notify_type" disabled style="width: 100%"></fast-select>
      </el-form-item>
      <el-form-item label="是否已读">
        <el-tag v-if="form.readStatus" type="success">已读</el-tag>
        <el-tag v-else type="info">未读</el-tag>
      </el-form-item>
      <el-form-item label="阅读时间">
        <el-input v-model="form.readTime" disabled></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageNotifyMessage } from '@/types/api/message/notify-message'

const notifyMessageRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<MessageNotifyMessage>({
  id: undefined,
  userId: undefined,
  userType: undefined,
  title: '',
  templateCode: '',
  sender: '',
  content: '',
  type: undefined,
  senderAvatar: '',
  readStatus: false,
  readTime: '',
  deptId: undefined
})

/** 打开弹窗 */
function open(row: MessageNotifyMessage) {
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
    userId: undefined,
    userType: undefined,
    title: '',
    templateCode: '',
    sender: '',
    content: '',
    type: undefined,
    senderAvatar: '',
    readStatus: false,
    readTime: '',
    deptId: undefined
  }

  if (notifyMessageRef.value) {
    notifyMessageRef.value.resetFields()
  }
}
</script>
