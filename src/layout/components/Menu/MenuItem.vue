<template>
  <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
    <template #title>
      <svg-icon v-if="showIcon" :icon="menu.meta?.icon"></svg-icon>
      <span>{{ menu.meta?.title }}</span>
    </template>
    <menu-item v-for="sub in menu.children" :key="sub.path" :menu="sub"></menu-item>
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path" @click="handleClickMenu(menu)">
    <svg-icon v-if="showIcon" :icon="menu.meta?.icon"></svg-icon>
    <template #title>
      {{ menu.meta?.title }}
    </template>
  </el-menu-item>
</template>

<script setup lang="ts" name="MenuItem">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { isExternalLink, replaceLinkParam } from '@/utils/tool'
import { useAppStore } from '@/store/modules/app'

/** 菜单项 */
interface MenuItem {
  /** 路由路径 */
  path: string
  /** 菜单元信息 */
  meta?: {
    /** 菜单标题 */
    title?: string
    /** 菜单图标 */
    icon?: string
    /** 是否新开页面 */
    newOpen?: boolean
    /** 外链地址 */
    url?: string
    [key: string]: any
  }
  /** 子菜单 */
  children?: MenuItem[]
}

interface IProps {
  /** 菜单项数据 */
  menu: MenuItem
}

defineProps<IProps>()

const appStore = useAppStore()
const router = useRouter()

/** 是否显示图标（columns 布局不显示） */
const showIcon = computed<boolean>(() => {
  return appStore.theme.layout !== 'columns'
})

/** 菜单点击事件 */
function handleClickMenu(menu: MenuItem) {
  // 不是新开页面，则直接切换路由
  if (!menu.meta?.newOpen) {
    router.push(menu.path)
    return
  }

  // 新开页面逻辑
  if (menu.meta.url && isExternalLink(menu.meta.url)) {
    // 外链
    window.open(replaceLinkParam(menu.meta.url), '_blank')
  } else {
    // 内部组件
    window.open('#' + menu.meta?.url, '_blank')
  }
}
</script>
