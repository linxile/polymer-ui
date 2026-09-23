<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="projectRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="项目名" prop="projectName">
        <el-input v-model="form.projectName" placeholder="项目名"></el-input>
      </el-form-item>
      <el-form-item label="项目标识" prop="projectCode">
        <el-input v-model="form.projectCode" placeholder="项目标识"></el-input>
      </el-form-item>
      <el-form-item label="项目包名" prop="projectPackage">
        <el-input v-model="form.projectPackage" placeholder="项目包名"></el-input>
      </el-form-item>
      <el-form-item label="项目路径" prop="projectPath">
        <el-input v-model="form.projectPath" placeholder="项目路径"></el-input>
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
import { getProjectById, submitProject } from '@/api/gen/project'
import { ProjectModify } from '@/types/api/gen/project'

const emit = defineEmits<{ (e: 'success'): void }>()
const projectRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<ProjectModify>({
  id: undefined,
  projectName: '',
  projectCode: '',
  projectPackage: '',
  projectPath: ''
})

const rules = {
  projectName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  projectCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  projectPackage: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  projectPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加项目变更"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改项目变更"
  getProjectById(id).then(response => {
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
    projectName: '',
    projectCode: '',
    projectPackage: '',
    projectPath: ''
  }

  if (projectRef.value) {
    projectRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  projectRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitProject(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
