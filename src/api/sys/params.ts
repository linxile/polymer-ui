import service from '@/utils/request'
import type { SysParams, SysParamsQuery } from '@/types/api/sys/params'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/params';

/**
 * 获取参数详情
 * @param id 参数ID
 */
export const getParamsById = (id: number): Promise<Result<SysParams>> => {
	return service.get<Result<SysParams>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改参数
 */
export const submitParams = (data: SysParams): Promise<Result<SysParams>> => {
	if (data.id) {
		return service.put<Result<SysParams>>(BASE_URL, data)
	}
	return service.post<Result<SysParams>>(BASE_URL, data)
}

/**
 * 分页查询参数列表
 * @param params 查询参数
 */
export const getParamsPage = (params: SysParamsQuery): Promise<Result<PageResult<SysParams>>> => {
	return service.get<Result<PageResult<SysParams>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除参数
 * @param ids 参数ID数组
 */
export const deleteParams = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
