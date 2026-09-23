import { i18n } from '@/i18n'

/** Element Plus 表单校验回调 */
type ValidateCallback = (error?: Error) => void

/**
 * 是否外链
 * @param path 链接地址
 */
export function isExternalLink(path: string): boolean {
	return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 校验邮箱
 */
export function validateEmail(_rule: unknown, value: unknown, callback: ValidateCallback): void {
	const reg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (typeof value === 'string' && reg.test(value)) {
		callback()
	} else {
		callback(new Error(i18n.global.t('error.email')))
	}
}

/**
 * 校验密码（长度不少于 4 位）
 */
export function validatePassword(_rule: unknown, value: unknown, callback: ValidateCallback): void {
	if (typeof value !== 'string' || value.length < 4) {
		callback(new Error(i18n.global.t('error.password', { len: 4 })))
	} else {
		callback()
	}
}

/** 手机号正则 */
export const mobileRegExp = /^1[3456789]\d{9}$/

/**
 * 校验手机号
 */
export function validateMobile(_rule: unknown, value: unknown, callback: ValidateCallback): void {
	if (typeof value === 'string' && mobileRegExp.test(value)) {
		callback()
	} else {
		callback(new Error('手机号格式不正确'))
	}
}
