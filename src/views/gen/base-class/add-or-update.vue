<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="baseClassRef" :model="form" :rules="rules" label-width="120px" @keyup.enter="submitForm()">
      <el-form-item label="基类编码" prop="code">
        <el-input v-model="form.code" placeholder="基类编码"></el-input>
      </el-form-item>
      <el-form-item label="基类包名" prop="packageName">
        <el-input v-model="form.packageName" placeholder="基类包名"></el-input>
      </el-form-item>
      <el-form-item label="基类字段" prop="fields">
        <el-input v-model="form.fields" placeholder="基类字段，多个字段，用英文逗号分隔"></el-input>
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
import { getBaseClassById, submitBaseClass } from '@/api/gen/base-class'
import { BaseClass } from '@/types/api/gen/base-class'

const emit = defineEmits<{ (e: 'success'): void }>()
const baseClassRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<BaseClass>({
  id: undefined,
  packageName: '',
  code: '',
  fields: '',
  remark: ''
})

const rules = {
  packageName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fields: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加基类"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改基类"
  getBaseClassById(id).then(response => {
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
    packageName: '',
    code: '',
    fields: '',
    remark: ''
  }

  if (baseClassRef.value) {
    baseClassRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  baseClassRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitBaseClass(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
