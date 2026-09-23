import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import cache from '@/utils/cache'
import {
	encryptBase64,
	encryptWithAes,
	generateAesKey,
	decryptWithAes,
	decryptBase64
} from '@/utils/crypto'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { refreshWebSocketToken } from '@/utils/websocket'

/** 加密请求头 key */
const encryptHeader = 'encrypt-key'

// axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 60000,
	headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// ==================== 请求拦截器 ====================
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const userStore = useUserStore()

		// 设置 token
		if (userStore?.token) {
			config.headers.Authorization = userStore.token
		}

		// 设置语言
		config.headers['Accept-Language'] = cache.getLanguage()

		// 追加时间戳，防止 GET 请求缓存
		if (config.method?.toUpperCase() === 'GET' && config.responseType !== 'blob') {
			config.params = { ...config.params, t: Date.now() }
		}

		// FormData 不处理数据格式
		if (config.data instanceof FormData) {
			return config
		}

		// 是否需要防止数据重复提交
		const isRepeatSubmit = (config.headers as any)?.repeatSubmit === false
		if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
			const requestObj = {
				url: config.url,
				data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
				time: Date.now()
			}
			const sessionObj = cache.getRequestObj()
			if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
				cache.setRequestObj(requestObj)
			} else {
				const sUrl = sessionObj.url
				const sData = sessionObj.data
				const sTime = sessionObj.time
				const interval = 500 // 间隔时间(ms)，小于此时间视为重复提交
				if (sData === requestObj.data && requestObj.time - sTime < interval && sUrl === requestObj.url) {
					const message = '数据正在处理，请勿重复提交'
					console.warn(`[${sUrl}]: ${message}`)
					return Promise.reject(new Error(message))
				}
				cache.setRequestObj(requestObj)
			}
		}

		// 是否需要加密
		const isEncrypt = (config.headers as any)?.isEncrypt === 'true'
		if (import.meta.env.VITE_APP_ENCRYPT === 'true') {
			if (isEncrypt && (config.method === 'post' || config.method === 'put')) {
				// 生成一个 AES 密钥
				const aesKey = generateAesKey()
				config.headers[encryptHeader] = encrypt(encryptBase64(aesKey))
				config.data = typeof config.data === 'object'
					? encryptWithAes(JSON.stringify(config.data), aesKey)
					: encryptWithAes(config.data, aesKey)
			}
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// ==================== 响应拦截器 ====================

/** 是否正在刷新 token */
let isRefreshToken = false
/** 待重试的请求队列 */
let requests: (() => void)[] = []

/**
 * 刷新 token
 * @param refreshToken 刷新令牌
 */
function getRefreshToken(refreshToken: string) {
	return service.post('/sys/auth/token', null, { params: { refreshToken } })
}

service.interceptors.response.use(
	async (response: AxiosResponse) => {
		// 响应体 AES 解密
		if (import.meta.env.VITE_APP_ENCRYPT === 'true') {
			const keyStr = response.headers[encryptHeader] as string | undefined
			if (keyStr) {
				const data = response.data
				// 请求体 AES 解密
				const base64Str = decrypt(keyStr)
				// base64 解码，得到请求头的 AES 密钥
				const aesKey = decryptBase64(base64Str)
				// aesKey 解码 data
				const decryptData = decryptWithAes(data, aesKey)
				// 将结果（JSON 字符串）转为 JSON
				response.data = JSON.parse(decryptData)
			}
		}

		const userStore = useUserStore()

		if (response.status !== 200) {
			return Promise.reject(new Error(response.statusText || 'Error'))
		}

		const res = response.data

		// Blob 直接返回
		if (Object.prototype.toString.call(res) === '[object Blob]') {
			return response
		}

		// 响应成功
		if (res.code === 0) {
			return res
		}

		// refreshToken 失效，跳转到登录页
		if (res.code === 406) {
			return handleAuthorized()
		}

		// 没有权限，如：未登录、token 过期
		if (res.code === 401) {
			const config = response.config
			if (!isRefreshToken) {
				isRefreshToken = true

				// 不存在 refreshToken，重新登录
				const refreshToken = cache.getRefreshToken()
				if (!refreshToken) {
					return handleAuthorized()
				}

				try {
					const { data } = await getRefreshToken(refreshToken)
					// 设置新 token
					userStore.setToken(data?.access_token)
					// 刷新 WebSocket 连接
					refreshWebSocketToken(data?.access_token)
					config.headers.Authorization = data?.access_token
					requests.forEach(cb => cb())
					requests = []
					return service(config)
				} catch (e) {
					// 刷新失败
					requests.forEach(cb => cb())
					return handleAuthorized()
				} finally {
					requests = []
					isRefreshToken = false
				}
			} else {
				// 多个请求同时 401 的情况，加入队列等待刷新完成后重试
				return new Promise(resolve => {
					requests.push(() => {
						config.headers.Authorization = userStore.token
						resolve(service(config))
					})
				})
			}
		}

		// 错误提示
		ElMessage.error(res.msg)
		return Promise.reject(new Error(res.msg || 'Error'))
	},
	error => {
		ElMessage.error(error.message)
		return Promise.reject(error)
	}
)

/**
 * 处理未授权（登录超时）
 */
function handleAuthorized(): Promise<never> {
	ElMessageBox.confirm('登录超时，请重新登录', '提示', {
		showCancelButton: false,
		closeOnClickModal: false,
		showClose: false,
		confirmButtonText: '重新登录',
		type: 'warning'
	}).then(() => {
		const userStore = useUserStore()
		userStore.setToken(null)
		userStore.setRefreshToken(null)
		location.reload()
	})
	return Promise.reject(new Error('登录超时，请重新登录'))
}

// 导出 axios 实例
export default service
