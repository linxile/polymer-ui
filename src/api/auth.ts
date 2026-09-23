// @/api/sys/auth.ts
import service from '@/utils/request'
import type { SysCaptcha, SysAccountLogin, SysMobileLogin, SysUserToken, AccessToken } from '@/types/api/auth'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/auth';

/**
 * 验证码
 */
export const useCaptchaApi = (): Promise<Result<SysCaptcha>> => {
	return service.get<Result<SysCaptcha>>(`${BASE_URL}/captcha`)
}

/**
 * 是否开启验证码
 */
export const useCaptchaEnabledApi = (): Promise<Result<boolean>> => {
	return service.get<Result<boolean>>(`${BASE_URL}/captcha/enabled`)
}

/**
 * 账号密码登录
 */
export const useAccountLoginApi = (data: SysAccountLogin): Promise<Result<SysUserToken>> => {
	return service.post<Result<SysUserToken>>(`${BASE_URL}/login`, data)
}

/**
 * 发送短信验证码
 * @param mobile 手机号
 */
export const useSendCodeApi = (mobile: string): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/send/code`, null, { params: { mobile } })
}

/**
 * 手机号登录
 */
export const useMobileLoginApi = (data: SysMobileLogin): Promise<Result<SysUserToken>> => {
	return service.post<Result<SysUserToken>>(`${BASE_URL}/mobile`, data)
}

/**
 * 退出
 */
export const useLogoutApi = (): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/logout`)
}

/**
 * 解锁屏幕
 * @param password 密码
 */
export const unlockScreen = (password: string): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/unlockScreen`, null, { params: { password } })
}

/**
 * 刷新 token
 * 仅用于响应拦截器中的 token 刷新，标识 skip-auth 避免循环
 * @param refreshToken 刷新令牌
 */
export const refreshTokenApi = (refreshToken: string): Promise<Result<AccessToken>> => {
	return service.post<Result<AccessToken>>(`${BASE_URL}/token`, null, {
		params: { refreshToken },
		headers: {
			'skip-auth': 'true'
		}
	})
}
