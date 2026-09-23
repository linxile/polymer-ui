// @/api/demo/multiple-files.ts
import service from '@/utils/request'
import type {
	DemoMultipleFiles,
	DemoMultipleFilesQuery,
} from '@/types/api/demo/multiple-files'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/demo/multipleFiles';

/**
 * 获取多文件上传样例详情
 * @param id 主键ID
 */
export const getMultipleFilesById = (id: number): Promise<Result<DemoMultipleFiles>> => {
	return service.get<Result<DemoMultipleFiles>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改多文件上传样例
 */
export const submitMultipleFiles = (data: DemoMultipleFiles): Promise<Result<DemoMultipleFiles>> => {
	if (data.id) {
		return service.put<Result<DemoMultipleFiles>>(BASE_URL, data)
	}
	return service.post<Result<DemoMultipleFiles>>(BASE_URL, data)
}

/**
 * 分页查询多文件上传样例列表
 * @param params 查询参数
 */
export const getMultipleFilesPage = (params: DemoMultipleFilesQuery): Promise<Result<PageResult<DemoMultipleFiles>>> => {
	return service.get<Result<PageResult<DemoMultipleFiles>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除多文件上传样例
 * @param ids 主键ID数组
 */
export const deleteMultipleFiles = (ids: number[]): Promise<Result<number>> => {
	return service.delete<Result<number>>(BASE_URL, { data: ids })
}
