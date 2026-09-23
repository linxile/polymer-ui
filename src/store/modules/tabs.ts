import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded, RouteRecordName } from 'vue-router'

/** 标签页项：路由对象 + title */
export type TabView = RouteLocationNormalizedLoaded & { title?: string }

/** 标签页状态 */
interface TabsState {
	/** 访问过的页面标签 */
	visitedViews: TabView[]
	/** 需要 keep-alive 缓存的组件名称列表 */
	cachedViews: (RouteRecordName | null | undefined)[]
}

export const useTabsStore = defineStore('tabsStore', {
	state: (): TabsState => ({
		visitedViews: [],
		cachedViews: []
	}),
	actions: {
		/** 添加标签页 */
		addView(view: RouteLocationNormalizedLoaded) {
			if (this.visitedViews.some(item => item.path === view.path)) {
				return
			}
			this.visitedViews.push({
				...view,
				title: (view.meta?.title as string) || 'unknown'
			})
		},

		/** 添加缓存视图（仅当 meta.cache 为 true 时） */
		addCachedView(view: RouteLocationNormalizedLoaded) {
			if (!view.name) {
				return
			}
			if (this.cachedViews.includes(view.name)) {
				return
			}
			if (view.meta?.cache) {
				this.cachedViews.push(view.name)
			}
		},

		/** 删除标签页（同时删除对应缓存） */
		delView(view: RouteLocationNormalizedLoaded) {
			for (const [i, item] of this.visitedViews.entries()) {
				if (item.path === view.path) {
					this.visitedViews.splice(i, 1)
					break
				}
			}
			this.delCachedView(view)
		},

		/** 删除缓存视图 */
		delCachedView(view: RouteLocationNormalizedLoaded): Promise<(RouteRecordName | null | undefined)[]> {
			return new Promise(resolve => {
				if (view.name) {
					const index = this.cachedViews.indexOf(view.name)
					if (index > -1) {
						this.cachedViews.splice(index, 1)
					}
				}
				resolve([...this.cachedViews])
			})
		},

		/** 关闭其他标签页（保留固定标签和当前标签） */
		delOthersViews(view: RouteLocationNormalizedLoaded) {
			this.visitedViews = this.visitedViews.filter(
				item => item.meta?.affix || item.path === view.path
			)
			if (view.name) {
				const index = this.cachedViews.indexOf(view.name)
				if (index > -1) {
					this.cachedViews = this.cachedViews.slice(index, index + 1)
				} else {
					this.cachedViews = []
				}
			} else {
				this.cachedViews = []
			}
		},

		/** 关闭全部标签页（仅保留固定标签） */
		delAllViews() {
			this.visitedViews = this.visitedViews.filter(item => item.meta?.affix)
			this.cachedViews = []
		}
	}
})
