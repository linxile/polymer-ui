import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useRouterStore } from '@/store/modules/router'
import { i18n } from '@/i18n'
import { isExternalLink, pathToCamel } from '@/utils/tool'

NProgress.configure({ showSpinner: false })

/** 常量路由（无需权限） */
const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/redirect',
		component: () => import('../layout/index.vue'),
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('../layout/components/Router/Redirect.vue')
			}
		]
	},
	{
		path: '/iframe/:query?',
		component: () => import('../layout/components/Router/Iframe.vue')
	},
	{
		path: '/login',
		component: () => import('../views/login/index.vue')
	},
	{
		path: '/lock',
		component: () => import('../views/lock.vue')
	},
	{
		path: '/404',
		component: () => import('../views/404.vue')
	}
]

/** 异步路由（需权限，登录后动态添加） */
const asyncRoutes: RouteRecordRaw = {
	path: '/',
	component: () => import('../layout/index.vue'),
	redirect: '/home',
	children: [
		{
			path: '/home',
			name: 'Home',
			component: () => import('../views/home.vue'),
			meta: {
				title: i18n.global.t('router.home'),
				affix: true
			}
		},
		{
			path: '/profile',
			name: 'ProfileIndex',
			component: () => import('../views/profile/index.vue'),
			meta: {
				title: i18n.global.t('router.profile'),
				cache: true
			}
		},
		{
			path: 'notifyMssage',
			component: () => import('@/views/message/notify/notifyMessage/index.vue'),
			name: 'MyNotifyMessage',
			meta: {
				canTo: true,
				hidden: true,
				noTagsView: false,
				title: '站内信消息'
			}
		}
	]
}

/** 404 兜底路由 */
export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

export const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes
})

/** 白名单列表（无需登录即可访问） */
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
	NProgress.start()

	const appStore = useAppStore()
	const userStore = useUserStore()
	const routerStore = useRouterStore()

	// token 存在的情况
	if (userStore.token) {
		if (to.path === '/login') {
			next('/home')
			return
		}

		// 用户信息不存在，则重新拉取
		if (!userStore.user.id) {
			try {
				await userStore.getUserInfoAction()
				await userStore.getAuthorityListAction()
				await appStore.getDictListAction()
			} catch (error) {
				// 请求异常，则跳转到登录页
				userStore.setToken('')
				next('/login')
				return Promise.reject(error)
			}

			// 动态菜单 + 常量菜单
			const menuRoutes = await routerStore.getMenuRoutes()

			// 获取扁平化路由，将多级路由转换成一级路由
			const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])

			// 添加菜单路由
			asyncRoutes.children?.push(...keepAliveRoutes)
			router.addRoute(asyncRoutes)

			// 错误路由
			router.addRoute(errorRoute)

			// 保存路由数据
			routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

			// 搜索菜单需要使用
			routerStore.setSearchMenu(keepAliveRoutes)

			next({ ...to, replace: true })
		} else {
			next()
		}
	} else {
		// 没有 token 的情况下，可以进入白名单
		if (whiteList.indexOf(to.path) > -1) {
			next()
		} else {
			next('/login')
		}
	}
})

// 路由加载后
router.afterEach(() => {
	NProgress.done()
})

/**
 * 获取扁平化路由，将多级路由转换成一级路由
 * @param routes 路由列表
 * @param breadcrumb 面包屑（会被修改，用于收集路径上的标题）
 */
export function getKeepAliveRoutes(routes: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] {
	const routerList: RouteRecordRaw[] = []

	routes.forEach((item: any) => {
		if (item.meta?.title) {
			breadcrumb.push(item.meta.title)
		}

		if (item.children && item.children.length > 0) {
			routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
		} else {
			item.meta.breadcrumb.push(...breadcrumb)
			routerList.push(item)
		}

		breadcrumb.pop()
	})

	return routerList
}

// 加载 vue 组件
const layoutModules = import.meta.glob('/src/views/**/*.vue')

/**
 * 根据路径，动态获取 vue 组件
 * @param path 组件相对路径（不含 .vue 后缀）
 */
function getDynamicComponent(path: string): (() => Promise<any>) | undefined {
	return layoutModules[`/src/views/${path}.vue`] as (() => Promise<any>) | undefined
}

/**
 * 根据菜单列表，生成路由数据
 * @param menuList 菜单列表（后端返回）
 */
export function generateRoutes(menuList: any[]): RouteRecordRaw[] {
	const routerList: RouteRecordRaw[] = []

	menuList.forEach(menu => {
		let component
		let path: string

		if (menu.children && menu.children.length > 0) {
			component = () => import('@/layout/index.vue')
			path = '/p/' + menu.id
		} else {
			// 判断是否 iframe
			if (isIframeUrl(menu)) {
				component = () => import('@/layout/components/Router/Iframe.vue')
				path = '/iframe/' + menu.id
			} else {
				component = getDynamicComponent(menu.url)
				path = '/' + menu.url
			}
		}

		const route: RouteRecordRaw = {
			path,
			name: pathToCamel(path),
			component,
			children: [],
			meta: {
				title: menu.name,
				icon: menu.icon && menu.icon !== 'null' && menu.icon !== 'undefined' ? menu.icon : '',
				id: '' + menu.id,
				url: menu.url,
				cache: true,
				newOpen: menu.openStyle === 1,
				breadcrumb: []
			}
		}

		// 有子菜单的情况
		if (menu.children && menu.children.length > 0) {
			route.children?.push(...generateRoutes(menu.children))
		}

		routerList.push(route)
	})

	return routerList
}

/**
 * 判断是否 iframe
 * @param menu 菜单项
 */
function isIframeUrl(menu: any): boolean {
	// 如果是新页面打开，则不用 iframe
	if (menu.openStyle === 1) {
		return false
	}

	// 是否外部链接
	return isExternalLink(menu.url)
}
