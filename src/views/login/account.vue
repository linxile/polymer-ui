<template>
  <el-form ref="loginFormRef" :model="form" :rules="rules" @keyup.enter="onLogin">
    <el-form-item prop="username">
      <el-input v-model="form.username" :prefix-icon="User" :placeholder="$t('app.username')"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" :prefix-icon="Lock" show-password :placeholder="$t('app.password')"></el-input>
    </el-form-item>
    <el-form-item v-if="captchaVisible" prop="captcha" class="login-captcha">
      <el-input
          class="my-input-group"
          v-model="form.captcha"
          :placeholder="$t('app.captcha')"
          :prefix-icon="Key"
      >
        <template #append>
          <el-image class="image-captcha" :src="captchaBase64" @click="onCaptcha" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-button">
      <el-button type="primary" @click="onLogin">{{ $t('app.signIn') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useCaptchaApi, useCaptchaEnabledApi } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import constant from '@/utils/constant'
import type { SysAccountLogin } from '@/types/api/auth'

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const loginFormRef = ref()
const captchaBase64 = ref<string>('')
const captchaVisible = ref<boolean>(false)

const form = ref<SysAccountLogin>({
  username: constant.env.PROD ? '' : 'admin',
  password: constant.env.PROD ? '' : 'admin',
  key: '',
  captcha: ''
})

const rules = {
  username: [{ required: true, message: t('required'), trigger: 'blur' }],
  password: [{ required: true, message: t('required'), trigger: 'blur' }],
  captcha: [{ required: true, message: t('required'), trigger: 'blur' }]
}

/** 是否开启验证码 */
async function onCaptchaEnabled() {
  const { data } = await useCaptchaEnabledApi()
  captchaVisible.value = !!data
  if (data) {
    await onCaptcha()
  }
}

/** 获取验证码 */
async function onCaptcha() {
  const { data } = await useCaptchaApi()
  form.value.key = data?.key
  captchaBase64.value = data?.image || ''
}

/** 登录 */
function onLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 用户登录
    userStore
        .accountLoginAction(form.value)
        .then(() => {
          router.push({ path: '/home' })
        })
        .catch(() => {
          if (captchaVisible.value) {
            onCaptcha()
          }
        })
  })
}

// 页面初始化
onMounted(() => {
  onCaptchaEnabled()
})
</script>

<style lang="scss" scoped>
.login-captcha {
  :deep(.el-input) {
    width: 100%;
  }
}
.image-captcha {
  width: 150px;
  height: 40px;
  margin: 0;
  cursor: pointer;
}
.login-button {
  :deep(.el-button--primary) {
    margin-top: 10px;
    width: 100%;
    height: 40px;
    font-size: 18px;
    letter-spacing: 8px;
  }
}
.my-input-group :deep(.el-input-group__append),
.my-input-group :deep(.el-input-group__prepend) {
  padding: 0 1px;
}
</style>
