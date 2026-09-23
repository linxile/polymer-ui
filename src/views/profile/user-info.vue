<template>
  <el-form ref="userInfoRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item prop="avatar" label="用户头像">
      <UploadComponent
          v-model:file-list="avatarList"
          no-file-list
          only-image
          :accept="['jpg', 'png', 'jpeg']"
          :max-size="10"
          :max-count="1"
          @success="handleUploadSuccess"
          @error="handleUploadError"
      />
    </el-form-item>
    <el-form-item prop="gender" label="用户性别">
      <fast-radio-group v-model="form.gender" dict-type="user_gender"></fast-radio-group>
    </el-form-item>
    <el-form-item prop="mobile" label="手机号码">
      <el-input v-model="form.mobile" placeholder="手机号码"></el-input>
    </el-form-item>
    <el-form-item prop="email" label="用户邮箱">
      <el-input v-model="form.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="city" label="所在城市">
      <el-cascader
          v-model="form.city"
          :options="cityOptions"
          :props="cascaderProps"
          filterable
          clearable
          style="width: 100%"
          placeholder="请选择城市"
          @change="handleCityChange"
      />
    </el-form-item>
    <el-form-item prop="address" label="详细地址">
      <el-input v-model="form.address" placeholder="详细地址"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">{{ $t('confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { validatePassword } from '@/utils/validate'
import { useUserInfoSubmitApi } from '@/api/sys/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useCityTreeApi } from '@/api/sys/city'
import UploadComponent from '@/components/upload/index.vue'
import type { AttachmentUploadResult } from '@/types/api/common'
import {SysUser, SysUserBase} from '@/types/api/sys/user'

const userStore = useUserStore()
const uploadRef = ref<InstanceType<typeof UploadComponent>>()
const userInfoRef = ref()

// 城市选项数据
const cityOptions = ref<any[]>([])
// 级联选择器配置
const cascaderProps = {
  value: 'areaCode',
  label: 'name',
  children: 'children'
}
const isLoaded = ref(false)

const form = ref<SysUserBase>({
  avatar: userStore.user.avatar,
  mobile: userStore.user.mobile,
  email: userStore.user.email,
  gender: userStore.user.gender,
  address: userStore.user.address,
  city: userStore.user.city
})

/** 初始化（仅加载一次城市数据） */
function init() {
  if (isLoaded.value) return
  getCityList()
  isLoaded.value = true
}

/** 头像列表（computed 双向绑定） */
const avatarList = computed({
  get: () => {
    if (form.value.avatar) {
      return [{
        name: '头像.jpg',
        url: form.value.avatar,
        size: 20000,
        platform: 'MINIO'
      }]
    }
    return []
  },
  set: (newValue) => {
    if (newValue && newValue.length > 0) {
      form.value.avatar = newValue[0].url
    } else {
      form.value.avatar = ''
    }
  }
})

/** 上传成功回调 */
function handleUploadSuccess(result: AttachmentUploadResult): void {
  form.value.avatar = result.url
  uploadRef.value?.resetUploadStatus()
}

/** 上传失败回调 */
function handleUploadError(error: Error) {
  ElMessage.error(error.message || '上传失败')
}

/** 获取城市列表 */
function getCityList() {
  useCityTreeApi().then(res => {
    cityOptions.value = res.data || []
  }).catch(() => {
    cityOptions.value = []
  })
}

/** 城市选择变化 */
function handleCityChange(value: string[]) {
  form.value.city = value
}

const rules = {
  mobile: [{ required: true, validator: validatePassword, trigger: 'blur' }]
}

/** 提交按钮 */
function submitForm() {
  userInfoRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    useUserInfoSubmitApi(form.value).then(() => {
      // 更新状态管理
      userStore.user.avatar = form.value.avatar
      userStore.user.mobile = form.value.mobile
      userStore.user.email = form.value.email
      userStore.user.gender = form.value.gender
      userStore.user.address = form.value.address
      userStore.user.city = form.value.city

      ElMessage.success('修改成功')
    })
  })
}

defineExpose({
  init
})
</script>
