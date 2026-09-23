import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { useMenuNavApi } from '@/api/sys/menu'
import { generateRoutes } from '@/router'

/** 路由状态 */
interface RouterState {
	/** 菜单路由（用于渲染侧边栏/顶栏菜单） */
	menuRoutes: RouteRecordRaw[]
	/** 扁平化搜索菜单 */
	searchMenu: RouteRecordRaw[]
	/** 完整路由列表 */
	routes: RouteRecordRaw[]
}

export const useRouterStore = defineStore('routerStore', {
	state: (): RouterState => ({
		menuRoutes: [],
		searchMenu: [],
		routes: []
	}),
	actions: {
		/** 获取动态菜单路由 */
		async getMenuRoutes() {
			const { data } = await useMenuNavApi()
			const routes = generateRoutes(data || [])

			this.menuRoutes.push(...routes)

			return this.menuRoutes
		},
		/** 设置搜索菜单 */
		setSearchMenu(routers: RouteRecordRaw[]) {
			this.searchMenu = routers
		},
		/** 设置完整路由列表 */
		setRoutes(routers: RouteRecordRaw[]) {
			this.routes = routers
		}
	}
})
