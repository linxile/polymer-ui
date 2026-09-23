<template>
  <el-dropdown class="avatar-container" trigger="hover">
    <div class="avatar-wrapper">
      <el-avatar shape="circle" :size="30" :src="previewUrl"></el-avatar>
      <span>{{ userStore.user.realName }}</span>
      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <router-link to="/profile">
          <el-dropdown-item> {{ $t('router.profile') }} </el-dropdown-item>
        </router-link>
        <el-dropdown-item @click="lockScreen">
          <span>锁定屏幕</span>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout"> {{ $t('app.signOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="NavbarUser">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import useLockStore from '@/store/modules/lock'
import FileUrlUtils from '@/utils/fileUrlUtils'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const lockStore = useLockStore()

/** 头像预览地址 */
const previewUrl = ref<string>('')

/** 获取头像完整 URL */
async function fetchPreviewUrl() {
  const avatar = userStore.user.avatar
  previewUrl.value = avatar ? await FileUrlUtils.getFullUrl(avatar) : ''
}

/** 锁定屏幕 */
function lockScreen() {
  const currentPath = route.fullPath
  lockStore.lockScreen(currentPath)
  router.push({ path: '/lock' })
}

/** 退出登录 */
function logout() {
  userStore.logoutAction().then(() => {
    // 刷新页面
    location.reload()
  })
}

// 监听头像变化，同步更新预览地址
watch(() => userStore.user.avatar, fetchPreviewUrl)

// 组件挂载时初始化
onMounted(fetchPreviewUrl)
</script>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: var(--theme-header-height);

  .avatar-wrapper {
    display: flex;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;
    padding: 0 8px;
    color: var(--theme-header-text-color);

    span {
      margin-left: 6px;
    }
  }
}
</style>
