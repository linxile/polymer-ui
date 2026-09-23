import service from '@/utils/request'
import type { SysMenu } from '@/types/api/sys/menu'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/menu';

/**
 * 菜单导航
 */
export const useMenuNavApi = (): Promise<Result<SysMenu[]>> => {
	return service.get<Result<SysMenu[]>>(`${BASE_URL}/nav`)
}

/**
 * 用户权限标识
 */
export const useAuthorityListApi = (): Promise<Result<string[]>> => {
	return service.get<Result<string[]>>(`${BASE_URL}/authority`)
}

/**
 * 菜单列表
 * @param type 菜单类型 0：菜单 1：按钮 2：接口 null：全部
 */
export const useMenuListApi = (type?: number): Promise<Result<SysMenu[]>> => {
	return service.get<Result<SysMenu[]>>(`${BASE_URL}/list`, { params: { type } })
}

/**
 * 获取菜单详情
 * @param id 菜单ID
 */
export const getMenuById = (id: number): Promise<Result<SysMenu>> => {
	return service.get<Result<SysMenu>>(`${BASE_URL}/${id}`)
}

/**
 * 新增/修改菜单
 */
export const submitMenu = (data: SysMenu): Promise<Result<SysMenu>> => {
	if (data.id) {
		return service.put<Result<SysMenu>>(BASE_URL, data)
	}
	return service.post<Result<SysMenu>>(BASE_URL, data)
}

/**
 * 删除菜单
 * @param id 菜单ID
 */
export const deleteMenu = (id: number): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/${id}`)
}
