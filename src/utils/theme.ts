import type { ITheme } from '@/store/theme/interface'

/** RGB 颜色数组 */
type RgbColor = [number, number, number]

/**
 * 处理主题样式，动态设置 CSS 变量
 * @param theme 主题配置
 */
export function handleThemeStyle(theme: ITheme): void {
	document.documentElement.style.setProperty('--el-color-primary', theme.primaryColor)
	for (let i = 1; i <= 9; i++) {
		document.documentElement.style.setProperty(
			`--el-color-primary-light-${i}`,
			getLightColor(theme.primaryColor, i / 10)
		)
	}
	for (let i = 1; i <= 9; i++) {
		document.documentElement.style.setProperty(
			`--el-color-primary-dark-${i}`,
			getDarkColor(theme.primaryColor, i / 10)
		)
	}
}

/**
 * hex 颜色转 rgb 数组
 * @param str hex 颜色，如 '#409eff'
 */
function hexToRgb(str: string): RgbColor {
	const hex = str.replace('#', '')
	const hexs = hex.match(/../g)
	if (!hexs || hexs.length < 3) {
		return [0, 0, 0]
	}
	return [
		parseInt(hexs[0], 16),
		parseInt(hexs[1], 16),
		parseInt(hexs[2], 16)
	]
}

/**
 * rgb 颜色转 hex 颜色
 * @param r 红色分量（0-255）
 * @param g 绿色分量（0-255）
 * @param b 蓝色分量（0-255）
 */
function rgbToHex(r: number, g: number, b: number): string {
	const hexs = [r.toString(16), g.toString(16), b.toString(16)]
	for (let i = 0; i < 3; i++) {
		if (hexs[i].length === 1) {
			hexs[i] = `0${hexs[i]}`
		}
	}
	return `#${hexs.join('')}`
}

/**
 * 变浅颜色值
 * @param color hex 颜色
 * @param level 变浅程度（0-1）
 */
function getLightColor(color: string, level: number): string {
	const rgb = hexToRgb(color)
	const result: RgbColor = [
		Math.floor((255 - rgb[0]) * level + rgb[0]),
		Math.floor((255 - rgb[1]) * level + rgb[1]),
		Math.floor((255 - rgb[2]) * level + rgb[2])
	]
	return rgbToHex(result[0], result[1], result[2])
}

/**
 * 变深颜色值
 * @param color hex 颜色
 * @param level 变深程度（0-1）
 */
function getDarkColor(color: string, level: number): string {
	const rgb = hexToRgb(color)
	const result: RgbColor = [
		Math.floor(rgb[0] * (1 - level)),
		Math.floor(rgb[1] * (1 - level)),
		Math.floor(rgb[2] * (1 - level))
	]
	return rgbToHex(result[0], result[1], result[2])
}
