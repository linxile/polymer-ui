import service from '@/utils/request'
import type { SysRole, SysRoleQuery } from '@/types/api/sys/role'
import type { Result, PageResult } from '@/types/api/common'
import {SysUser, SysUserQuery} from "@/types/api/sys/user";

/**
 * API 基础路径
 */
const BASE_URL = '/sys/role';

/**
 * 获取角色详情
 * @param id 角色ID
 */
export const getRoleById = (id: number): Promise<Result<SysRole>> => {
	return service.get<Result<SysRole>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改角色
 */
export const submitRole = (data: SysRole): Promise<Result<SysRole>> => {
	if (data.id) {
		return service.put<Result<SysRole>>(BASE_URL, data)
	}
	return service.post<Result<SysRole>>(BASE_URL, data)
}

/**
 * 分页查询角色列表
 * @param params 查询参数
 */
export const getRolePage = (params: SysRoleQuery): Promise<Result<PageResult<SysRole>>> => {
	return service.get<Result<PageResult<SysRole>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询全部角色（下拉框用）
 */
export const useRoleListApi = (): Promise<Result<SysRole[]>> => {
	return service.get<Result<SysRole[]>>(`${BASE_URL}/list`)
}

/**
 * 批量删除角色
 * @param ids 角色ID数组
 */
export const deleteRoles = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 获取角色菜单
 */
export const useRoleMenuApi = (): Promise<Result<number[]>> => {
	return service.get<Result<number[]>>(`${BASE_URL}/menu`)
}

/**
 * 提交角色数据范围
 */
export const useRoleDataScopeSubmitApi = (data: SysRole): Promise<Result<string>> => {
	return service.put<Result<string>>(`${BASE_URL}/data-scope`, data)
}

/**
 * 提交角色用户关联
 * @param roleId 角色ID
 * @param data 用户ID列表
 */
export const useRoleUserSubmitApi = (roleId: number, data: number[]): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/user/${roleId}`, data)
}

/**
 * 分页查询角色用户列表
 */
export const getRoleUserPage = (params: SysUserQuery & { roleId: number }): Promise<Result<PageResult<SysUser>>> => {
	return service.get<Result<PageResult<SysUser>>>(`${BASE_URL}/user/page`, { params })
}

/**
 * 批量删除角色用户
 * @param roleId 角色ID
 * @param ids 用户ID数组
 */
export const deleteRoleUsers = (roleId: number, ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/user/${roleId}`, { data: ids })
}
