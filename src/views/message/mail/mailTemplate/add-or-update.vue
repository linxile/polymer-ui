<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="mailTemplateRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="form.name" placeholder="模板名称"></el-input>
      </el-form-item>
      <el-form-item label="模板编码" prop="code">
        <el-input v-model="form.code" placeholder="模板编码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱账号" prop="accountId">
        <el-select v-model="form.accountId" placeholder="邮箱账号" style="width: 100%">
          <el-option
              v-for="item in mailAccountList"
              :key="item.id"
              :label="item.mail"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送人名称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="发送人名称"></el-input>
      </el-form-item>
      <el-form-item label="主题" prop="subject">
        <el-input v-model="form.subject" placeholder="主题"></el-input>
      </el-form-item>
      <el-form-item label="模板标题" prop="title">
        <el-input v-model="form.title" placeholder="模板标题"></el-input>
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <WangEditor v-model="form.content" placeholder="请输入..."></WangEditor>
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <fast-radio-group v-model="form.status" dict-type="user_status"></fast-radio-group>
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
import WangEditor from '@/components/wang-editor/index.vue'
import { getMailTemplateById, submitMailTemplate } from '@/api/message/mail-template'
import { useMailAccountListApi } from '@/api/message/mail-account'
import { MessageMailTemplate } from '@/types/api/message/mail-template'

const emit = defineEmits<{ (e: 'success'): void }>()
const mailTemplateRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const mailAccountList = ref<any[]>([])

const form = ref<MessageMailTemplate>({
  id: undefined,
  name: '',
  code: '',
  accountId: undefined,
  nickname: '',
  subject: '',
  title: '',
  content: '',
  status: 1,
  remark: '',
  deptId: undefined,
  params: []
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  accountId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  subject: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加邮件模板"
  dialogVisible.value = true
  getMailAccountList()
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改邮件模板"
  getMailAccountList()
  getMailTemplateById(id).then(response => {
    form.value = response.data!
    dialogVisible.value = true
  })
}

/** 获取邮箱账号列表 */
function getMailAccountList() {
  useMailAccountListApi().then(res => {
    mailAccountList.value = res.data || []
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
    accountId: undefined,
    nickname: '',
    subject: '',
    title: '',
    content: '',
    status: 1,
    remark: '',
    deptId: undefined,
    params: []
  }

  if (mailTemplateRef.value) {
    mailTemplateRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  mailTemplateRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitMailTemplate(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
