<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="dictTypeRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="dictType" label="字典类型">
        <el-input v-model="form.dictType" placeholder="字典类型"></el-input>
      </el-form-item>
      <el-form-item prop="dictName" label="字典名称">
        <el-input v-model="form.dictName" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="form.sort" controls-position="right" :min="0" aria-label="排序"></el-input-number>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="form.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="数据来源" prop="dictSource">
        <el-radio-group v-model="form.dictSource">
          <el-radio-button :value="0" label="字典数据" />
          <el-radio-button :value="1" label="动态SQL" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.dictSource === 1" prop="dictSql" label="动态SQL">
        <el-input
            v-model="form.dictSql"
            type="textarea"
            placeholder="如：select id as dictValue, name as dictLabel, 'info' as labelClass from sys_role where deleted = 0"
        ></el-input>
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
import { getDictTypeById, submitDictType } from '@/api/sys/dict-type'
import { SysDictType } from '@/types/api/sys/dict-type'

const emit = defineEmits<{ (e: 'success'): void }>()
const dictTypeRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysDictType>({
  id: undefined,
  dictType: '',
  dictName: '',
  sort: 0,
  dictSource: 0,
  dictSql: '',
  remark: ''
})

const rules = {
  dictType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  dictName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  dictSource: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  dictSql: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加字典类型"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改字典类型"
  getDictTypeById(id).then(response => {
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
    dictType: '',
    dictName: '',
    sort: 0,
    dictSource: 0,
    dictSql: '',
    remark: ''
  }

  if (dictTypeRef.value) {
    dictTypeRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  dictTypeRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitDictType(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
