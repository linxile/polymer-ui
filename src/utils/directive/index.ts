import type { App } from 'vue'
import { auth } from './auth'

/**
 * 注册全局自定义指令
 * @param app Vue 应用实例
 */
export function directive(app: App) {
	// 权限指令
	auth(app)
}
