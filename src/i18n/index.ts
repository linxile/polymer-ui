import { createI18n } from 'vue-i18n'
import cache from '@/utils/cache'

// element-plus 国际化文件
import element_zh_cn from 'element-plus/es/locale/lang/zh-cn'
import element_en from 'element-plus/es/locale/lang/en'

/** 语言包模块（import.meta.glob 的返回结构） */
interface LangModule {
	default: Record<string, any>
}

/** 语言包类型 */
type LangMessages = Record<string, any>

/** 支持的语言 */
export type LanguageKey = 'zh-CN' | 'en-US'

// 框架 国际化文件
const zh_cn = import.meta.glob('./lang/**/zh-CN.ts', { eager: true }) as Record<string, LangModule>
const en_us = import.meta.glob('./lang/**/en-US.ts', { eager: true }) as Record<string, LangModule>

/**
 * 加载 lang 文件夹下的国际化
 */
export function loadLang(modules: Record<string, LangModule>): LangMessages {
	const messages: LangMessages = {}

	Object.keys(modules).forEach(module => {
		Object.assign(messages, { ...modules[module].default })
	})

	return messages
}

/** 全部语言包 */
export const messages: Record<LanguageKey, LangMessages> = {
	'zh-CN': {
		langName: '简体中文',
		...loadLang(zh_cn),
		el: {
			...element_zh_cn
		}
	},
	'en-US': {
		langName: 'English',
		...loadLang(en_us),
		el: {
			...element_en
		}
	}
}

/** 获取当前语言（带默认值兜底） */
function getLanguage(): LanguageKey {
	const lang = cache.getLanguage() as LanguageKey | undefined
	// 兜底：缓存为空或非法时用 zh-CN
	return lang === 'zh-CN' || lang === 'en-US' ? lang : 'zh-CN'
}

export const i18n = createI18n({
	locale: getLanguage(),
	messages
})
