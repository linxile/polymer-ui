<template>
  <el-dialog v-model="dialogVisible" title="日志详情" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="detailRef" :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="日志ID">
            <el-input v-model="form.id" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作人">
            <el-input v-model="form.realName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="模块名">
            <el-input v-model="form.module" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作名">
            <el-input v-model="form.name" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="请求URI">
            <el-input v-model="form.reqUri" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求方法">
            <el-input v-model="form.reqMethod" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作IP">
            <el-input v-model="form.ip" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录地点">
            <el-input v-model="form.address" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作类型">
            <fast-select v-model="form.operateType" dict-type="log_operate_type" disabled style="width: 100%"></fast-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行时长">
            <el-input v-model="form.duration" disabled>
              <template #append>ms</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-tag v-if="form.status === 0" type="danger">失败</el-tag>
            <el-tag v-else type="success">成功</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="User Agent">
        <el-input v-model="form.userAgent" disabled></el-input>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input v-model="form.reqParams" :rows="8" type="textarea" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SysLogOperate } from '@/types/api/sys/operate'

const detailRef = ref()
const dialogVisible = ref<boolean>(false)

const form = ref<SysLogOperate>({
  id: undefined,
  realName: '',
  module: '',
  name: '',
  reqUri: '',
  reqMethod: '',
  ip: '',
  address: '',
  operateType: undefined,
  duration: undefined,
  status: 0,
  userAgent: '',
  reqParams: ''
})

/** 打开弹窗 */
function open(row: SysLogOperate) {
  reset()
  form.value = { ...row }
  dialogVisible.value = true
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
  open
})

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    realName: '',
    module: '',
    name: '',
    reqUri: '',
    reqMethod: '',
    ip: '',
    address: '',
    operateType: undefined,
    duration: undefined,
    status: 0,
    userAgent: '',
    reqParams: ''
  }

  if (detailRef.value) {
    detailRef.value.resetFields()
  }
}
</script>
