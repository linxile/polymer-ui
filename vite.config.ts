import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// 参考：https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	base: './',
	resolve: {
		// 配置别名
		alias: {
			'@': resolve(__dirname, './src'),
			'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
		}
	},
	plugins: [
		vue(),
		vueSetupExtend(),
		createSvgIconsPlugin({
			iconDirs: [resolve(__dirname, 'src/icons/svg')],
			symbolId: 'icon-[dir]-[name]'
		})
	],
	// 生产环境去除 console 和 debugger
	esbuild: {
		drop: mode === 'production' ? ['console', 'debugger'] : []
	},
	server: {
		host: '0.0.0.0',
		port: 3000, // 端口号
		open: false, // 是否自动打开浏览器
	},
	build: {
		sourcemap: false,
		chunkSizeWarningLimit: 2000,
		rollupOptions: {
			output: {
				// 代码分包，优化缓存命中率
				manualChunks: {
					// Vue 核心
					'vender-vue': ['vue', 'vue-router', 'pinia'],
					// Element Plus
					'vender-element': ['element-plus', '@element-plus/icons-vue'],
					// 图表
					'vender-echarts': ['echarts'],
					// 富文本编辑器
					'vender-editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue', 'vue-codemirror', '@codemirror/lang-javascript'],
					// 工具库
					'vender-utils': ['axios', 'qs', 'crypto-js', 'jsencrypt', 'mitt', 'nprogress', 'sortablejs', 'xe-utils']
				}
			}
		}
	}
}))
