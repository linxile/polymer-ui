// @/api/gen/project.ts
import service from '@/utils/request'
import type { ProjectModify } from '@/types/api/gen/project'
import type { GenQuery } from '@/types/api/gen/base-class'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/gen/project';

/**
 * 获取项目变更详情
 * @param id 项目变更ID
 */
export const getProjectById = (id: number): Promise<Result<ProjectModify>> => {
	return service.get<Result<ProjectModify>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改项目变更
 */
export const submitProject = (data: ProjectModify): Promise<Result<ProjectModify>> => {
	if (data.id) {
		return service.put<Result<ProjectModify>>(BASE_URL, data)
	}
	return service.post<Result<ProjectModify>>(BASE_URL, data)
}

/**
 * 分页查询项目变更列表
 * @param params 查询参数
 */
export const getProjectPage = (params: GenQuery): Promise<Result<PageResult<ProjectModify>>> => {
	return service.get<Result<PageResult<ProjectModify>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除项目变更
 * @param ids 项目变更ID数组
 */
export const deleteProjects = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 源码下载地址
 * @param id 项目变更ID
 */
export const getProjectDownloadUrl = (id: number): string => {
	return `${BASE_URL}/download/${id}`
}
