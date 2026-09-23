<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="notifyTemplateRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="模版编码" prop="code">
        <el-input v-model="form.code" placeholder="模版编码"></el-input>
      </el-form-item>
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="form.name" placeholder="模板名称"></el-input>
      </el-form-item>
      <el-form-item label="发送人名称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="发送人名称"></el-input>
      </el-form-item>
      <el-form-item label="模版内容" prop="content">
        <el-input
            v-model="form.content"
            style="width: 100%"
            :rows="2"
            type="textarea"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <fast-select v-model="form.type" dict-type="notify_type" clearable placeholder="类型"></fast-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <fast-radio-group v-model="form.status" dict-type="notify_status"></fast-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注"></el-input>
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
import { getNotifyTemplateById, submitNotifyTemplate } from '@/api/message/notify-template'
import { MessageNotifyTemplate } from '@/types/api/message/notify-template'

const emit = defineEmits<{ (e: 'success'): void }>()
const notifyTemplateRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<MessageNotifyTemplate>({
  id: undefined,
  name: '',
  code: '',
  nickname: '',
  content: '',
  type: undefined,
  status: 1,
  remark: '',
  params: [],
  deptId: undefined
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加站内信模板"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改站内信模板"
  getNotifyTemplateById(id).then(response => {
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
    name: '',
    code: '',
    nickname: '',
    content: '',
    type: undefined,
    status: 1,
    remark: '',
    params: [],
    deptId: undefined
  }

  if (notifyTemplateRef.value) {
    notifyTemplateRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  notifyTemplateRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitNotifyTemplate(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
