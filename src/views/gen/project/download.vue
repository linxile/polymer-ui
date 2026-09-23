<template>
  <el-dialog v-model="dialogVisible" title="源码下载" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="downloadRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名" prop="projectName">
            <el-input v-model="form.projectName" placeholder="项目名" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目路径" prop="projectPath">
            <el-input v-model="form.projectPath" placeholder="项目路径" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目标识" prop="projectCode">
            <el-input v-model="form.projectCode" placeholder="项目标识" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目包名" prop="projectPackage">
            <el-input v-model="form.projectPackage" placeholder="项目包名" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider>变更后的信息</el-divider>

      <el-form-item label="项目名" prop="modifyProjectName">
        <el-input v-model="form.modifyProjectName" placeholder="项目名"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目标识" prop="modifyProjectCode">
            <el-input v-model="form.modifyProjectCode" placeholder="项目标识"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目包名" prop="modifyProjectPackage">
            <el-input v-model="form.modifyProjectPackage" placeholder="项目包名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排除文件" prop="exclusions">
            <el-input v-model="form.exclusions" placeholder="排除文件"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变更文件" prop="modifySuffix">
            <el-input v-model="form.modifySuffix" placeholder="变更文件"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">下载</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { getProjectById, getProjectDownloadUrl, submitProject } from '@/api/gen/project'
import { ProjectModify } from '@/types/api/gen/project'

const emit = defineEmits<{ (e: 'success'): void }>()
const downloadRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<ProjectModify>({
  id: undefined,
  projectName: '',
  projectCode: '',
  projectPackage: '',
  projectPath: '',
  modifyProjectName: '',
  modifyProjectCode: '',
  modifyProjectPackage: '',
  exclusions: '',
  modifySuffix: ''
})

const rules = {
  modifyProjectName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  modifyProjectCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  modifyProjectPackage: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  exclusions: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  modifySuffix: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗 */
function openWithData(id: number) {
  reset()
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
  openWithData
})

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    projectName: '',
    projectCode: '',
    projectPackage: '',
    projectPath: '',
    modifyProjectName: '',
    modifyProjectCode: '',
    modifyProjectPackage: '',
    exclusions: '',
    modifySuffix: ''
  }

  if (downloadRef.value) {
    downloadRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  downloadRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }

    // 先保存变更信息
    await submitProject(form.value)

    // 触发下载
    window.open(getProjectDownloadUrl(form.value.id!), '_blank')

    ElMessage.success('操作成功')
    dialogVisible.value = false
    emit('success')
  })
}
</script>
