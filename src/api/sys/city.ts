import service from '@/utils/request'
import type { SysCity, SysCityQuery } from '@/types/api/sys/city'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/system/city';

/**
 * 获取城市详情
 * @param id 城市ID
 */
export const getCityById = (id: number): Promise<Result<SysCity>> => {
	return service.get<Result<SysCity>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改城市
 */
export const submitCity = (data: SysCity): Promise<Result<SysCity>> => {
	if (data.id) {
		return service.put<Result<SysCity>>(BASE_URL, data)
	}
	return service.post<Result<SysCity>>(BASE_URL, data)
}

/**
 * 查询城市列表
 * @param params 查询参数
 */
export const useCityListApi = (params?: SysCityQuery): Promise<Result<SysCity[]>> => {
	return service.get<Result<SysCity[]>>(`${BASE_URL}/list`, { params })
}

/**
 * 获得城市树
 */
export const useCityTreeApi = (): Promise<Result<SysCity[]>> => {
	return service.get<Result<SysCity[]>>(`${BASE_URL}/tree`)
}
