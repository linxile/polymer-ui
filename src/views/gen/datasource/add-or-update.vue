<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="datasourceRef" :model="form" :rules="rules" label-width="120px" @keyup.enter="submitForm()">
      <el-form-item label="连接名" prop="connName">
        <el-input v-model="form.connName" placeholder="连接名"></el-input>
      </el-form-item>
      <el-form-item prop="dbType" label="数据库类型">
        <el-select v-model="form.dbType" clearable placeholder="数据库类型" style="width: 100%">
          <el-option value="MySQL" label="MySQL"></el-option>
          <el-option value="Oracle" label="Oracle"></el-option>
          <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
          <el-option value="SQLServer" label="SQLServer"></el-option>
          <el-option value="DM" label="达梦8"></el-option>
          <el-option value="KingBase" label="人大金仓"></el-option>
          <el-option value="Clickhouse" label="Clickhouse"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库URL" prop="connUrl">
        <el-input v-model="form.connUrl" placeholder="数据库URL"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" type="password" show-password placeholder="密码"></el-input>
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
import { getDatasourceById, submitDatasource } from '@/api/gen/datasource'
import { Datasource } from '@/types/api/gen/datasource'
import { decrypt, encrypt } from '@/utils/tool'

const emit = defineEmits<{ (e: 'success'): void }>()
const datasourceRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<Datasource>({
  id: undefined,
  dbType: '',
  connName: '',
  connUrl: '',
  username: '',
  password: ''
})

const rules = {
  dbType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  connName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  connUrl: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加数据源"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改数据源"
  getDatasourceById(id).then(response => {
    const data = response.data!
    // 密码解密后回显
    if (data.password) {
      data.password = decrypt(data.password)
    }
    form.value = data
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
    dbType: '',
    connName: '',
    connUrl: '',
    username: '',
    password: ''
  }

  if (datasourceRef.value) {
    datasourceRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  datasourceRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      // 密码加密后提交
      submitDatasource({ ...form.value, password: encrypt(form.value.password!) }).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
