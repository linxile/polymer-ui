// @/api/gen/base-class.ts
import service from '@/utils/request'
import type { BaseClass, GenQuery } from '@/types/api/gen/base-class'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/gen/baseclass';

/**
 * 获取基类详情
 * @param id 基类ID
 */
export const getBaseClassById = (id: number): Promise<Result<BaseClass>> => {
	return service.get<Result<BaseClass>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改基类
 */
export const submitBaseClass = (data: BaseClass): Promise<Result<BaseClass>> => {
	if (data.id) {
		return service.put<Result<BaseClass>>(BASE_URL, data)
	}
	return service.post<Result<BaseClass>>(BASE_URL, data)
}

/**
 * 分页查询基类列表
 * @param params 查询参数
 */
export const getBaseClassPage = (params: GenQuery): Promise<Result<PageResult<BaseClass>>> => {
	return service.get<Result<PageResult<BaseClass>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询基类列表（下拉框用）
 */
export const useBaseClassListApi = (): Promise<Result<BaseClass[]>> => {
	return service.get<Result<BaseClass[]>>(`${BASE_URL}/list`)
}

/**
 * 批量删除基类
 * @param ids 基类ID数组
 */
export const deleteBaseClasses = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
