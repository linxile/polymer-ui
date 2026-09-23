<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="mailAccountRef" :model="form" :rules="rules" label-width="auto" @keyup.enter="submitForm()">
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="form.mail" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="SMTP 服务器域名" prop="host">
        <el-input v-model="form.host" placeholder="SMTP 服务器域名"></el-input>
      </el-form-item>
      <el-form-item label="SMTP 服务器端口" prop="port">
        <el-input-number v-model="form.port" :min="0" :max="65535" controls-position="right" style="width: 100%" />
      </el-form-item>
      <el-form-item label="协议" prop="protocol">
        <el-input v-model="form.protocol" placeholder="协议"></el-input>
      </el-form-item>
      <el-form-item label="是否开启SSL" prop="sslEnable">
        <el-switch v-model="form.sslEnable" inline-prompt active-text="开" inactive-text="关" />
      </el-form-item>
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
import { getMailAccountById, submitMailAccount } from '@/api/message/mail-account'
import { MessageMailAccount } from '@/types/api/message/mail-account'

const emit = defineEmits<{ (e: 'success'): void }>()
const mailAccountRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<MessageMailAccount>({
  id: undefined,
  mail: '',
  username: '',
  password: '',
  host: '',
  port: undefined,
  protocol: '',
  sslEnable: false,
  deptId: undefined
})

const rules = {
  mail: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  host: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  port: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  protocol: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加邮箱账号"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改邮箱账号"
  getMailAccountById(id).then(response => {
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
    mail: '',
    username: '',
    password: '',
    host: '',
    port: undefined,
    protocol: '',
    sslEnable: false,
    deptId: undefined
  }

  if (mailAccountRef.value) {
    mailAccountRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  mailAccountRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitMailAccount(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
