import constant from '@/utils/constant'
import { useAppStore } from '@/store/modules/app'
import { AES, lib, enc, mode, pad } from 'crypto-js'
import type { SysDict, SysDictDataItem } from '@/types/api/sys/dict-type'

/**
 * 把路径转换成驼峰命名
 * @param path 路径，如 '/sys/user'
 * @returns 驼峰命名，如 'SysUser'
 */
export function pathToCamel(path: string): string {
	return path.replace(/\/(\w)/g, (_all, letter) => letter.toUpperCase())
}

/**
 * 是否外链
 * @param url 链接地址
 */
export function isExternalLink(url: string): boolean {
	return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

/**
 * 替换外链参数
 * @param url 链接地址，可能包含 {{apiUrl}} 占位符
 */
export function replaceLinkParam(url: string): string {
	return url.replace('{{apiUrl}}', constant.apiUrl)
}

/**
 * 转换文件大小格式
 * @param size 文件大小（字节）
 */
export function convertSizeFormat(size: number): string {
	if (!size || size <= 0) {
		return '0 Bytes'
	}
	const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
	const index = Math.floor(Math.log(size) / Math.log(1024))
	const newSize = size / Math.pow(1024, index)
	return newSize.toFixed(2) + ' ' + unit[index]
}

/**
 * 获取 svg 图标（id）列表
 */
export function getIconList(): string[] {
	const rs: string[] = []
	const list = document.querySelectorAll('svg symbol[id^="icon-"]')
	for (let i = 0; i < list.length; i++) {
		rs.push(list[i].id)
	}
	return rs
}

/**
 * 获取字典 Label
 * @param dictList 字典列表
 * @param dictType 字典类型
 * @param dictValue 字典值
 */
export function getDictLabel(dictList: SysDict[], dictType: string, dictValue: string): string {
	const type = dictList.find(element => element.dictType === dictType)
	if (type) {
		const val = type.dataList?.find(element => element.dictValue === dictValue + '')
		if (val) {
			return val.dictLabel || dictValue
		}
		return dictValue
	}
	return dictValue
}

/**
 * 获取字典 Label 样式
 * @param dictList 字典列表
 * @param dictType 字典类型
 * @param dictValue 字典值
 */
export function getDictLabelClass(dictList: SysDict[], dictType: string, dictValue: string): string {
	const type = dictList.find(element => element.dictType === dictType)
	if (type) {
		const val = type.dataList?.find(element => element.dictValue === dictValue + '')
		if (val) {
			return val.labelClass || ''
		}
		return ''
	}
	return ''
}

/**
 * 获取字典 Label 列表（支持逗号分隔的多值）
 * 返回 HTML 字符串，调用方需用 v-html 渲染
 * @param dictType 字典类型
 * @param dictValue 字典值，多个用逗号分隔
 */
export function getDictLabelList(dictType: string, dictValue: string | number | boolean): string {
	// 处理空值情况（包括 null、undefined、空字符串）
	if (dictValue == null || dictValue === '') {
		return ''
	}

	const strValue = String(dictValue)
	const appStore = useAppStore()

	let result = ''
	strValue.split(',').forEach(value => {
		if (!value) return
		const classStyle = getDictLabelClass(appStore.dictList, dictType, value)
		const label = getDictLabel(appStore.dictList, dictType, value)

		if (classStyle) {
			result += `<span class="el-tag el-tag--${classStyle} el-tag--${appStore.componentSize}">${label}</span>&nbsp;`
		} else {
			result += label + '&nbsp;'
		}
	})

	return result
}

/**
 * 获取字典数据列表
 * @param dictList 字典列表
 * @param dictType 字典类型
 */
export function getDictDataList(dictList: SysDict[], dictType: string): SysDictDataItem[] {
	const type = dictList.find(element => element.dictType === dictType)
	return type?.dataList ?? []
}

// ==================== AES 加解密 ====================

/** 加密密钥（32 位） */
const ENCRYPT_KEY = 'polymerlowcode16'

/**
 * AES 解密
 * @param ciphertext Base64 密文
 */
export function decrypt(ciphertext: string): string {
	const cipherParams = lib.CipherParams.create({
		ciphertext: enc.Base64.parse(ciphertext)
	})
	const decrypted = AES.decrypt(cipherParams, enc.Utf8.parse(ENCRYPT_KEY), {
		mode: mode.ECB,
		padding: pad.Pkcs7
	})
	return decrypted.toString(enc.Utf8)
}

/**
 * AES 加密
 * @param plaintext 明文
 */
export function encrypt(plaintext: string): string {
	const message = enc.Utf8.parse(plaintext)
	const encrypted = AES.encrypt(message, enc.Utf8.parse(ENCRYPT_KEY), {
		mode: mode.ECB,
		padding: pad.Pkcs7
	})
	return encrypted.toString()
}
