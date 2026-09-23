<template>
  <el-form ref="passwordRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item prop="password" :label="$t('profile.oldPassword')">
      <el-input v-model="form.password" type="password" show-password></el-input>
    </el-form-item>
    <el-form-item prop="newPassword" :label="$t('profile.newPassword')">
      <el-input v-model="form.newPassword" type="password" show-password></el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword" :label="$t('profile.confirmPassword')">
      <el-input v-model="form.confirmPassword" type="password" show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">{{ $t('confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { validatePassword } from '@/utils/validate'
import { updatePasswordApi } from '@/api/sys/user'
import { ElMessage } from 'element-plus'
import type { SysUserPassword } from '@/types/api/sys/user'

const { t } = useI18n()
const passwordRef = ref()

const form = ref<SysUserPassword>({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (form.value.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  password: [{ required: true, message: t('required'), trigger: 'blur' }],
  newPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: t('required'), trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
}

/** 提交按钮 */
function submitForm() {
  passwordRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    updatePasswordApi(form.value).then((res) => {
      ElMessage.success(res?.data || '修改成功')
    })
  })
}
</script>
