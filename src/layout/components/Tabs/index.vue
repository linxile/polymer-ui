<template>
  <div class="tabs-container">
    <div class="tabs-item">
      <el-tabs v-model="activeTabName" :class="tabsStyleClass" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
            v-for="tab in tabsStore.visitedViews"
            :key="tab.path"
            :label="tab.title"
            :name="tab.path"
            :closable="!isAffix(tab)"
        >
          <template #label>
            <el-dropdown
                :id="tab.path"
                ref="dropdownRef"
                trigger="contextmenu"
                placement="bottom-end"
                @visible-change="handleChange($event, tab)"
                @command="onClose"
            >
              <span>{{ tab.title }}</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Close" command="close">{{ $t('app.close') }}</el-dropdown-item>
                  <el-dropdown-item :icon="CircleClose" command="closeOthers">{{ $t('app.closeOthers') }}</el-dropdown-item>
                  <el-dropdown-item :icon="CircleCloseFilled" command="closeAll">{{ $t('app.closeAll') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dropdown class="tabs-action" trigger="click" placement="bottom-end" @command="onClose">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Close" command="close">{{ $t('app.close') }}</el-dropdown-item>
          <el-dropdown-item :icon="CircleClose" command="closeOthers">{{ $t('app.closeOthers') }}</el-dropdown-item>
          <el-dropdown-item :icon="CircleCloseFilled" command="closeAll">{{ $t('app.closeAll') }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <el-icon><arrow-down /></el-icon>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="NavbarTabs">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalizedLoaded } from 'vue-router'
import { ArrowDown, CircleClose, CircleCloseFilled, Close } from '@element-plus/icons-vue'
import { closeAllTabs, closeOthersTabs, closeTab } from '@/utils/tabs'
import { useAppStore } from '@/store/modules/app'
import { useRouterStore } from '@/store/modules/router'
import { useTabsStore } from '@/store/modules/tabs'

/** 页签项 */
interface TabItem {
  /** 完整路径 */
  fullPath: string
  /** 路由路径 */
  path: string
  /** 路由名 */
  name?: string
  /** 标题 */
  title?: string
  /** 菜单元信息 */
  meta?: {
    /** 是否固定 */
    affix?: boolean
    /** 标题 */
    title?: string
    [key: string]: any
  }
  /** 子路由 */
  children?: TabItem[]
}

/** 关闭命令 */
type CloseCommand = 'close' | 'closeOthers' | 'closeAll'

const appStore = useAppStore()
const routerStore = useRouterStore()
const tabsStore = useTabsStore()
const route = useRoute()
const router = useRouter()

/** 当前激活的页签 */
const activeTabName = ref<string>(route.path)

/** 页签风格类名 */
const tabsStyleClass = computed<string>(() => 'tabs-item-' + appStore.theme.tabsStyle)

/** 右键菜单 ref 列表 */
const dropdownRef = ref<any[]>()

/** 是否固定页签 */
function isAffix(tab: TabItem): boolean {
  return !!tab.meta?.affix
}

/** 初始化固定页签 */
function initTabs() {
  const affixTabs = getAffixTabs(routerStore.routes as unknown as RouteRecordRaw[])
  for (const tab of affixTabs) {
    // 需要有 tab 名称
    if (tab.name) {
      tabsStore.addView(tab as any)
    }
  }
}

/** 获取需要固定的页签 */
function getAffixTabs(routes: RouteRecordRaw[]): TabItem[] {
  let tabs: TabItem[] = []
  routes.forEach(item => {
    if (item.meta && item.meta.affix) {
      tabs.push({
        fullPath: item.path,
        path: item.path,
        name: item.name as string,
        meta: { ...item.meta }
      })
    }
    if (item.children) {
      const tempTabs = getAffixTabs(item.children)
      if (tempTabs.length >= 1) {
        tabs = [...tabs, ...tempTabs]
      }
    }
  })
  return tabs
}

/** 添加页签 */
function addTab() {
  tabsStore.addView(route)
  tabsStore.addCachedView(route)
  activeTabName.value = route.path
}

/** 页签被选中 */
function tabClick(tab: any) {
  const name = tab.props.name
  if (name) {
    router.push(name)
  }
}

/** 关闭页签 */
function tabRemove(path: string) {
  const tab = tabsStore.visitedViews.find((item: any) => item.path === path)
  if (tab) {
    closeTab(router, tab)
  }
}

/** 下拉菜单命令 */
function onClose(type: CloseCommand) {
  switch (type) {
    case 'close':
      closeTab(router, route)
      break
    case 'closeOthers':
      closeOthersTabs(router, route)
      break
    case 'closeAll':
      closeAllTabs(router, route)
      break
  }
}

/** 保证右键标签页只会弹出当前一个下拉框 */
function handleChange(visible: boolean, tab: TabItem) {
  if (!visible) {
    return
  }
  dropdownRef.value?.forEach(item => {
    if (item.id === tab.path) {
      return
    }
    item.handleClose()
  })
}

// 监听路由变化，添加页签
watch(route, () => {
  if (route.name) {
    addTab()
  }
})

// 组件挂载时初始化
onMounted(() => {
  initTabs()
  addTab()
})
</script>

<style lang="scss" scoped>
	.tabs-container {
		display: flex;
		position: relative;
		z-index: 6;
		height: 40px;
		background-color: #fff;
	.tabs-item {
		transition: left 0.3s;
		flex-grow: 1;
		overflow: hidden;
	::v-deep(.el-tabs__nav-prev) {
		padding: 0 10px;
		border-right: var(--el-border-color-extra-light) 1px solid;
	}
	::v-deep(.el-tabs__nav-next) {
		padding: 0 10px;
		border-left: var(--el-border-color-extra-light) 1px solid;
	}
	::v-deep(.is-scrollable) {
		padding: 0 32px;
	}
	::v-deep(.el-tabs__active-bar) {
		height: 0;
	}
	::v-deep(.el-tabs__item) {
	.is-icon-close {
		transition: none !important;
	&:hover {
		 color: var(--el-color-primary-light-9);
		 background-color: var(--el-color-primary);
		 border-radius: 50%;
	 }
	}
	}
	}
	}
	.tabs-item-style-1 {
	::v-deep(.el-tabs__item) {
		padding: 0 15px !important;
		border-right: var(--el-border-color-extra-light) 1px solid;
		user-select: none;
		color: #8c8c8c;
	&:hover {
		 color: #444;
		 background: rgba(0, 0, 0, 0.02);
	 }
	&.is-active {
	.el-dropdown {
		color: var(--el-color-primary) !important;
	}
	color: var(--el-color-primary);
	background-color: var(--el-color-primary-light-9);
	border-bottom: var(--el-border-color-light) 2px solid;
	&:before {
		 background-color: var(--el-color-primary);
	 }
	}
	&:before {
		 content: '';
		 width: 9px;
		 height: 9px;
		 margin-right: 8px;
		 display: inline-block;
		 background-color: #ddd;
		 border-radius: 50%;
	 }
	}
	}
	.tabs-item-style-2 {
	::v-deep(.el-tabs__item) {
		padding: 0 15px !important;
		border-right: none;
		user-select: none;
		color: #8c8c8c;
	//display: inline-block;

	&:hover {
		 color: #444;
		 background: rgba(0, 0, 0, 0.02);
		 border-bottom: var(--el-color-primary) 2px solid;
	 }

	&.is-active {
	.el-dropdown {
		color: var(--el-color-primary) !important;
	}
	color: var(--el-color-primary) !important;
	background-color: var(--el-color-primary-light-9) !important;
	border-bottom: var(--el-color-primary) 2px solid;
	&:before {
		 background-color: var(--el-color-primary);
	 }
	}
	}
	}
	.tabs-action {
		height: 40px;
		line-height: 40px;
		box-sizing: border-box;
		padding: 0 12px;
		align-items: center;
		cursor: pointer;
		color: #666;
		border-left: var(--el-border-color-extra-light) 1px solid;
		border-bottom: var(--el-border-color-light) 2px solid;
	}
</style>
