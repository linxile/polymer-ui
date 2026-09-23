import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import type { TabView } from '@/store/modules/tabs'

/**
 * 关闭单个标签页
 * @param router 路由实例
 * @param tab 待关闭的标签页
 */
export function closeTab(router: Router, tab: TabView): void {
	const tabsStore = useTabsStore()
	if (tab.meta?.affix) {
		return
	}

	tabsStore.delView(tab)
	toLastView(router, tabsStore.visitedViews, tab)
}

/**
 * 关闭其他标签页（保留当前标签和固定标签）
 * @param router 路由实例
 * @param tab 当前标签页
 */
export function closeOthersTabs(router: Router, tab: RouteLocationNormalizedLoaded): void {
	const tabsStore = useTabsStore()

	router.push(tab.fullPath)
	tabsStore.delOthersViews(tab)
}

/**
 * 关闭全部标签页（保留固定标签）
 * @param router 路由实例
 * @param tab 当前标签页
 */
export function closeAllTabs(router: Router, tab: RouteLocationNormalizedLoaded): void {
	const tabsStore = useTabsStore()

	tabsStore.delAllViews()
	toLastView(router, tabsStore.visitedViews, tab)
}

/**
 * 跳转到最后一个标签页
 * @param router 路由实例
 * @param visitedViews 已访问的标签页列表
 * @param view 当前标签页
 */
export function toLastView(
	router: Router,
	visitedViews: TabView[],
	view: RouteLocationNormalizedLoaded
): void {
	const latestView = visitedViews.slice(-1)[0]
	if (latestView) {
		router.push(latestView.fullPath)
	} else {
		if (view.name === 'Home') {
			router.replace({ path: '/redirect' + view.fullPath })
		} else {
			router.push('/')
		}
	}
}
