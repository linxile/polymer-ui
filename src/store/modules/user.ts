// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { useAccountLoginApi, useMobileLoginApi, useLogoutApi } from '@/api/auth'
import { useUserInfoApi } from '@/api/sys/user'
import cache from '@/utils/cache'
import { useAuthorityListApi } from '@/api/sys/menu'
import { closeWebSocket } from '@/utils/websocket'
import type { SysUser } from '@/types/api/sys/user'
import type { SysAccountLogin, SysMobileLogin } from '@/types/api/auth'

/** 用户状态 */
interface UserState {
	/** 用户信息 */
	user: SysUser
	/** 权限列表 */
	authorityList: string[]
	/** 访问 token */
	token: string | null
	/** 刷新 token */
	refreshToken: string | null
}

/** 创建默认用户信息 */
function createDefaultUser(): SysUser {
	return {
		id: undefined,
		superAdmin: 0,
		username: '',
		realName: '',
		gender: 0,
		mobile: '',
		email: '',
		avatar: '',
		provinceCode: '',
		cityCode: '',
		districtCode: '',
		address: '',
		city: [],
		deptName: '',
		postNameList: [],
		roleNameList: [],
		createTime: ''
	}
}

export const useUserStore = defineStore('userStore', {
	state: (): UserState => ({
		// 用户信息
		user: createDefaultUser(),
		// 权限列表
		authorityList: [],
		// 访问 token
		token: cache.getToken() as string | null,
		// 刷新 token
		refreshToken: cache.getRefreshToken() as string | null
	}),
	actions: {
		/** 设置用户信息 */
		setUser(val: SysUser) {
			this.user = val
		},

		/** 设置访问 token */
		setToken(val: string | null | undefined) {
			this.token = val ?? null
			cache.setToken(val ?? null)
		},

		/** 设置刷新 token */
		setRefreshToken(val: string | null | undefined) {
			this.refreshToken = val ?? null
			cache.setRefreshToken(val ?? null)
		},

		/** 账号密码登录 */
		async accountLoginAction(loginForm: SysAccountLogin) {
			const { data } = await useAccountLoginApi(loginForm)
			this.setToken(data?.access_token)
			this.setRefreshToken(data?.refresh_token)
		},

		/** 手机号登录 */
		async mobileLoginAction(loginForm: SysMobileLogin) {
			const { data } = await useMobileLoginApi(loginForm)
			this.setToken(data?.access_token)
			this.setRefreshToken(data?.refresh_token)
		},

		/** 获取用户信息 */
		async getUserInfoAction() {
			const { data } = await useUserInfoApi()
			if (data) {
				this.setUser(data)
			}
		},

		/** 获取权限列表 */
		async getAuthorityListAction() {
			const { data } = await useAuthorityListApi()
			this.authorityList = data ?? []
		},

		/** 用户退出 */
		async logoutAction() {
			await useLogoutApi()

			// 移除 token
			this.setToken(null)
			this.setRefreshToken(null)
			// 关闭 WebSocket 连接
			closeWebSocket()
		}
	}
})
