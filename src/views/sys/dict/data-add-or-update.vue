<template>
  <el-dialog v-model="dialogVisible" :title="title" :width="600" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="dictDataRef" :model="form" :rules="rules" label-width="80px" @keyup.enter="submitForm()">
      <el-form-item prop="dictValue" label="字典值">
        <el-input v-model="form.dictValue" placeholder="字典值"></el-input>
      </el-form-item>
      <el-form-item prop="dictLabel" label="字典标签">
        <el-input v-model="form.dictLabel" placeholder="字典标签"></el-input>
      </el-form-item>
      <el-form-item prop="labelClass" label="标签样式">
        <el-select v-model="form.labelClass" style="width: 100%" clearable>
          <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <el-tag style="width: 100%" :type="item.value || 'info'">{{ item.label }}</el-tag>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="form.sort" controls-position="right" :min="0" aria-label="排序"></el-input-number>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
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
import { getDictDataById, submitDictData } from '@/api/sys/dict-data'
import { SysDictData } from '@/types/api/sys/dict-data'

const props = defineProps({
  dictTypeId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{ (e: 'success'): void }>()
const dictDataRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysDictData>({
  id: undefined,
  dictTypeId: props.dictTypeId,
  dictLabel: '',
  dictValue: '',
  labelClass: '',
  sort: 0,
  remark: ''
})

const tagOptions = [
  { value: 'primary', label: 'primary' },
  { value: 'success', label: 'success' },
  { value: 'info', label: 'info' },
  { value: 'warning', label: 'warning' },
  { value: 'danger', label: 'danger' }
] as const

const rules = {
  dictLabel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  dictValue: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加字典数据"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改字典数据"
  getDictDataById(id).then(response => {
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
    dictTypeId: props.dictTypeId,
    dictLabel: '',
    dictValue: '',
    labelClass: '',
    sort: 0,
    remark: ''
  }

  if (dictDataRef.value) {
    dictDataRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  dictDataRef.value.validate((valid: boolean) => {
    if (valid) {
      // 确保带上 dictTypeId
      form.value.dictTypeId = props.dictTypeId

      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitDictData(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
