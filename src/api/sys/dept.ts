import service from '@/utils/request'
import type { SysDept } from '@/types/api/sys/dept'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/dept';

/**
 * 获取部门详情
 * @param id 部门ID
 */
export const getDeptById = (id: number): Promise<Result<SysDept>> => {
	return service.get<Result<SysDept>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改部门
 */
export const submitDept = (data: SysDept): Promise<Result<SysDept>> => {
	if (data.id) {
		return service.put<Result<SysDept>>(BASE_URL, data)
	}
	return service.post<Result<SysDept>>(BASE_URL, data)
}

/**
 * 查询部门列表（树）
 */
export const useDeptListApi = (): Promise<Result<SysDept[]>> => {
	return service.get<Result<SysDept[]>>(`${BASE_URL}/list`)
}

/**
 * 查询部门简版列表（下拉框用）
 */
export const useDeptSimpleListApi = (): Promise<Result<SysDept[]>> => {
	return service.get<Result<SysDept[]>>(`${BASE_URL}/simple-list`)
}

/**
 * 删除部门
 * @param id 部门ID
 */
export const deleteDept = (id: number): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/${id}`)
}
