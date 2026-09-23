<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="smsPlatformRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="平台类型" prop="platform">
        <fast-select v-model="form.platform" dict-type="sms_platform" placeholder="平台类型" style="width: 100%"></fast-select>
      </el-form-item>
      <el-form-item v-if="form.platform == 3" label="接入地址" prop="url">
        <el-input v-model="form.url" placeholder="APP接入地址"></el-input>
      </el-form-item>
      <el-form-item v-if="form.platform == 1" label="AppId" prop="appId">
        <el-input v-model="form.appId" placeholder="AppId"></el-input>
      </el-form-item>
      <el-form-item v-if="form.platform != 2" label="短信签名" prop="signName">
        <el-input v-model="form.signName" placeholder="短信签名"></el-input>
      </el-form-item>
      <el-form-item label="短信模板" prop="templateId">
        <el-input v-model="form.templateId" placeholder="短信模板"></el-input>
      </el-form-item>
      <el-form-item label="AccessKey" prop="accessKey">
        <el-input v-model="form.accessKey" placeholder="AccessKey"></el-input>
      </el-form-item>
      <el-form-item label="SecretKey" prop="secretKey">
        <el-input v-model="form.secretKey" placeholder="SecretKey"></el-input>
      </el-form-item>
      <el-form-item v-if="form.platform == 1" label="SenderId" prop="senderId">
        <el-input v-model="form.senderId" placeholder="国际短信必填"></el-input>
      </el-form-item>
      <el-form-item v-if="form.platform == 3" label="通道号" prop="senderId">
        <el-input v-model="form.senderId" placeholder="通道号必填"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <fast-radio-group v-model="form.status" dict-type="enable_disable"></fast-radio-group>
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
import { getSmsPlatformById, submitSmsPlatform } from '@/api/message/sms-platform'
import { MessageSmsPlatform } from '@/types/api/message/sms-platform'

const emit = defineEmits<{ (e: 'success'): void }>()
const smsPlatformRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<MessageSmsPlatform>({
  id: undefined,
  platform: 0,
  signName: '',
  templateId: '',
  appId: '',
  senderId: '',
  url: '',
  accessKey: '',
  secretKey: '',
  status: 0
})

const rules = {
  platform: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  appId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  signName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  templateId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  accessKey: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  secretKey: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加短信平台"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改短信平台"
  getSmsPlatformById(id).then(response => {
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
    platform: 0,
    signName: '',
    templateId: '',
    appId: '',
    senderId: '',
    url: '',
    accessKey: '',
    secretKey: '',
    status: 0
  }

  if (smsPlatformRef.value) {
    smsPlatformRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  smsPlatformRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitSmsPlatform(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
