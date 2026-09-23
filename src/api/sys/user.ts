import service from '@/utils/request'
import {PageResult, Result} from "@/types/api/common";
import {SysUser, SysUserBase, SysUserPassword, SysUserQuery} from "@/types/api/sys/user";

/**
 * API 基础路径
 */
const BASE_URL = '/sys/user';

// 定义通用的 headers
const customHeaders = {
	isEncrypt: true,
	repeatSubmit: true
}

/**
 * 分页查询用户列表
 * @param params 查询参数
 */
export const getUserPage = (params: SysUserQuery): Promise<Result<PageResult<SysUser>>> => {
	return service.get<Result<PageResult<SysUser>>>(`${BASE_URL}/page`, { params })
}

/**
 * 获取当前登录用户信息
 */
export const useUserInfoApi = (): Promise<Result<SysUser>> => {
	return service.get<Result<SysUser>>(`${BASE_URL}/info`)
}

/**
 * 修改登录用户信息
 */
export const useUserInfoSubmitApi = (dataForm: SysUserBase): Promise<Result<string>> => {
	return service.put<Result<string>>(`${BASE_URL}/info`, dataForm)
}

/**
 * 修改登录用户密码
 */
export const updatePasswordApi = (data: SysUserPassword): Promise<Result<string>> => {
	return service.put<Result<string>>(`${BASE_URL}/password`, data, {
		headers: customHeaders
	})
	/*return service({
		url: '/sys/user/password',
		method: 'put',
		headers: {
			isEncrypt: true,
			repeatSubmit: true
		},
		data: data
	});*/
	//return service.put('/sys/user/password', data)
}

/**
 * 获取用户信息
 */
export const useUserApi = (id: number): Promise<Result<SysUser>> => {
	return service.get<Result<SysUser>>(`${BASE_URL}/${id}`)
}

/**
 * 新增和修改用户信息
 */
export const useUserSubmitApi = (dataForm: SysUser): Promise<Result<SysUser>> => {
	if (dataForm.id) {
		return service.put<Result<SysUser>>(BASE_URL, dataForm)
	} else {
		return service.post<Result<SysUser>>(BASE_URL, dataForm)
	}
}

/**
 * 根据部门id查询用户信息集合
 * @param deptId 部门id
 * 是否查询子集用户（1：查询；0不查询）
 */
export const useListByDeptIdApi = (deptId: number): Promise<Result<SysUser[]>> => {
	return service.get<Result<SysUser[]>>(`${BASE_URL}/getUserListByDeptId/${deptId}/1`)
}

/**
 * 批量删除用户
 * @param ids 用户ID数组
 */
export const deleteUsers = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
