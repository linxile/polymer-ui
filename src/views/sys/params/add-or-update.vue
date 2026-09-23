<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" :width="600" draggable @closed="handleClosed">
    <el-form ref="paramsRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="参数名称" prop="paramName">
        <el-input v-model="form.paramName" placeholder="参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数键" prop="paramKey">
        <el-input v-model="form.paramKey" placeholder="参数键"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="form.paramValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="系统参数" prop="paramType">
        <fast-radio-group v-model="form.paramType" dict-type="params_type"></fast-radio-group>
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
import { getParamsById, submitParams } from '@/api/sys/params'
import { SysParams } from '@/types/api/sys/params'

const emit = defineEmits<{ (e: 'success'): void }>()
const paramsRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysParams>({
  id: undefined,
  paramName: '',
  paramType: 0,
  paramKey: '',
  paramValue: '',
  remark: ''
})

const rules = {
  paramName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  paramType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  paramKey: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  paramValue: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加参数"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改参数"
  getParamsById(id).then(response => {
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
    paramName: '',
    paramType: 0,
    paramKey: '',
    paramValue: '',
    remark: ''
  }

  if (paramsRef.value) {
    paramsRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  paramsRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitParams(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
