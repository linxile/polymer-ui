<template>
  <div class="navbar-search">
    <svg-icon icon="icon-search" @click="openSearch"></svg-icon>
    <el-dialog v-model="visible" :width="280" :destroy-on-close="true" :modal="false" fullscreen :show-close="false">
      <el-autocomplete
          ref="menuAutocompleteRef"
          v-model="menuValue"
          size="large"
          :prefix-icon="Search"
          :fetch-suggestions="menuSearch"
          placeholder="菜单搜索"
          @select="handleSelect"
          @blur="handleBlur"
      >
        <template #default="{ item }">
          <svg-icon :icon="item.meta.icon" />
          {{ item.meta.title }}
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="NavbarSearch">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useRouterStore } from '@/store/modules/router'

/** 搜索菜单项 */
interface SearchMenuItem {
  /** 路由路径 */
  path: string
  /** 菜单元信息 */
  meta: {
    /** 菜单标题 */
    title: string
    /** 菜单图标 */
    icon?: string
    [key: string]: any
  }
  [key: string]: any
}

/** fetch-suggestions 的回调类型 */
type FetchSuggestionsCallback = (results: SearchMenuItem[]) => void

const routerStore = useRouterStore()
const router = useRouter()
const menuAutocompleteRef = ref()
const visible = ref<boolean>(false)
const menuValue = ref<string>('')

/** 获取菜单列表 */
const menuList = routerStore.searchMenu

/** 打开搜索框 */
function openSearch() {
  visible.value = true

  nextTick(() => {
    setTimeout(() => {
      menuAutocompleteRef.value.focus()
    })
  })
}

/** 菜单搜索 */
function menuSearch(queryString: string, cb: FetchSuggestionsCallback) {
  const results = queryString
      ? menuList.filter(createFilter(queryString))
      : menuList
  cb(results)
}

/** 创建过滤函数 */
function createFilter(queryString: string) {
  return (item: SearchMenuItem) => {
    const query = queryString.toLowerCase()
    return (
        item.path.toLowerCase().indexOf(query) > -1 ||
        item.meta.title.toLowerCase().indexOf(query) > -1
    )
  }
}

/** 选中菜单项 */
function handleSelect(item: SearchMenuItem) {
  router.push(item.path)
  visible.value = false
}

/** 失焦关闭搜索 */
function handleBlur() {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.navbar-search {
  :deep(.el-dialog) {
    box-shadow: unset !important;
    border-radius: 0 !important;
    background: rgba(0, 0, 0, 0.5);
  }
  :deep(.el-autocomplete) {
    width: 560px;
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
