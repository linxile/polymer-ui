// src/hooks/useCrud.ts
import { IHooksOptions } from '@/types/api/common'
import service from '@/utils/request'
import { onMounted, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'
import { useTableSelection } from './useTableSelection'
import { useFileDownload } from './useFileDownload'

export const useCrud = (options: IHooksOptions, tableRef?: any) => {
	// ==================== 默认配置 ====================
	const defaultOptions: IHooksOptions = {
		createdIsNeed: true,
		dataListUrl: '',
		isPage: true,
		deleteUrl: '',
		primaryKey: 'id',
		exportUrl: '',
		queryForm: {},
		dataList: [],
		order: '',
		asc: false,
		pageNo: 1,
		pageSize: 10,
		total: 0,
		pageSizes: [10, 20, 50, 100, 200],
		dataListLoading: false,
		dataListSelections: [],
		exportLoading: false
	}

	// ==================== 合并配置 ====================
	const mergeDefaultOptions = (options: any, props: any): IHooksOptions => {
		for (const key in options) {
			if (!Object.getOwnPropertyDescriptor(props, key)) {
				props[key] = options[key]
			}
		}
		return props
	}

	const state = reactive(mergeDefaultOptions(defaultOptions, options))

	// ==================== 子模块 ====================
	// 多选管理
	const selection = useTableSelection({
		dataList: toRefs(state).dataList,
		primaryKey: state.primaryKey,
		tableRef: tableRef
	})

	// 文件下载/导出
	const fileDownload = useFileDownload()

	// ==================== 核心查询方法 ====================
	const query = () => {
		if (!state.dataListUrl) {
			return
		}

		state.dataListLoading = true

		service
			.get(state.dataListUrl, {
				params: {
					order: state.order,
					asc: state.asc,
					pageNo: state.isPage ? state.pageNo : null,
					pageSize: state.isPage ? state.pageSize : null,
					...state.queryForm
				},
				paramsSerializer: params => {
					return qs.stringify(params)
				}
			})
			.then((res: any) => {
				const isPageMode = state.isPage
				const listData = isPageMode ? res.data.list : res.data

				// 如果当前页无数据且不是第一页，自动回退一页
				if (listData.length === 0 && (state.pageNo ?? 1) > 1) {
					state.pageNo = (state.pageNo ?? 1) - 1
					query()
					return
				}

				state.dataList = listData
				state.total = isPageMode ? res.data.total : 0

				// ✅ 恢复当前页的选中状态（使用独立的选择模块）
				import('vue').then(({ nextTick }) => {
					nextTick(() => {
						selection.restoreCurrentPageSelection()
					})
				})
			})
			.finally(() => {
				state.dataListLoading = false
			})
	}

	// ==================== 分页方法 ====================
	const getDataList = (pageNo?: number | Event) => {
		if (typeof pageNo === 'number') {
			state.pageNo = pageNo
		} else {
			state.pageNo = 1
		}
		selection.clearSelection() // 切换页码时清空选中（符合原有行为）
		query()
	}

	const sizeChangeHandle = (val: number) => {
		state.pageNo = 1
		state.pageSize = val
		query()
	}

	const currentChangeHandle = (val: number) => {
		state.pageNo = val
		query()
	}

	// ==================== 排序方法 ====================
	const sortChangeHandle = (data: any) => {
		const { prop, order } = data

		if (prop && order) {
			state.order = prop
			state.asc = order === 'ascending'
		} else {
			state.order = ''
		}
		query()
	}

	// ==================== 删除方法 ====================
	const deleteHandle = (key: number | string) => {
		if (!state.deleteUrl) {
			return
		}

		ElMessageBox.confirm('确定进行删除操作?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				service.delete(state.deleteUrl + '/' + key).then(() => {
					ElMessage.success('删除成功')
					selection.clearSelection()
					query()
				})
			})
			.catch(() => {})
	}

	const deleteBatchHandle = (key?: number | string) => {
		let data: any[] = []
		console.log('deleteBatchHandle', selection.getSelectedKeys())
		if (key) {
			data = [key]
		} else {
			const selectedKeys = selection.getSelectedKeys()
			if (selectedKeys.length === 0) {
				ElMessage.warning('请选择删除记录')
				return
			}
			data = selectedKeys
		}

		ElMessageBox.confirm(
			`确定要删除选中的 ${data.length} 条数据吗？\n\n此操作不可恢复！`,
			`批量删除确认（共 ${data.length} 条）`,
			{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				if (state.deleteUrl) {
					service.delete(state.deleteUrl, { data }).then(() => {
						ElMessage.success(`成功删除 ${data.length} 条数据`)
						selection.clearSelection()
						// ✅ 修复：直接 query，由 query 内部自动处理页码回退
						query()
					})
				}
			})
			.catch(() => {})
	}

	// ==================== 导出方法（委托给独立模块） ====================
	const exportHandle = async (filename?: string): Promise<void> => {
		if (!state.exportUrl) {
			ElMessage.error('导出接口地址未配置')
			return
		}

		// 使用独立的导出模块
		await fileDownload.exportFile(state.exportUrl, state.queryForm, filename)
	}

	// ==================== 通用下载方法（委托给独立模块） ====================
	const downloadHandle = async (url: string, filename?: string, method: string = 'GET'): Promise<any> => {
		return fileDownload.download(url, filename, method)
	}

	// ==================== 生命周期 ====================
	onMounted(() => {
		if (state.createdIsNeed) {
			query()
		}
	})

	// ==================== 返回值 ====================
	return {
		// 状态（直接暴露 reactive 对象，方便模板使用）
		state,
		// 核心方法
		getDataList,
		sizeChangeHandle,
		currentChangeHandle,
		sortChangeHandle,
		deleteHandle,
		deleteBatchHandle,
		// 文件操作（委托）
		downloadHandle,
		exportHandle,
		// 选择相关（直接暴露子模块的方法，保持 API 一致性）
		selectionChangeHandle: selection.selectionChangeHandle,
		selectHandle: selection.selectHandle,
		selectAllHandle: selection.selectAllHandle,
		// 额外暴露选择状态（方便调试）
		dataListSelections: selection.dataListSelections
	}
}
