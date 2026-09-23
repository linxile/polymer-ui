<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="fieldTypeRef" :model="form" :rules="rules" label-width="120px" @keyup.enter="submitForm()">
      <el-form-item label="字段类型" prop="columnType">
        <el-input v-model="form.columnType" placeholder="字段类型"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="attrType">
        <el-input v-model="form.attrType" placeholder="属性类型"></el-input>
      </el-form-item>
      <el-form-item label="属性包名" prop="packageName">
        <el-input v-model="form.packageName" placeholder="属性包名"></el-input>
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
import { getFieldTypeById, submitFieldType } from '@/api/gen/field-type'
import { FieldType } from '@/types/api/gen/field-type'

const emit = defineEmits<{ (e: 'success'): void }>()
const fieldTypeRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<FieldType>({
  id: undefined,
  columnType: '',
  attrType: '',
  packageName: ''
})

const rules = {
  columnType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  attrType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加字段类型"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改字段类型"
  getFieldTypeById(id).then(response => {
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
    columnType: '',
    attrType: '',
    packageName: ''
  }

  if (fieldTypeRef.value) {
    fieldTypeRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  fieldTypeRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitFieldType(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
