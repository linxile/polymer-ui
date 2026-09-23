import service from '@/utils/request'
import type { SysPost, SysPostQuery} from '@/types/api/sys/post'
import type {Result, PageResult} from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/post';

/**
 * 获取岗位详情
 * @param id 岗位ID
 */
export const getPostById = (id: number): Promise<Result<SysPost>> => {
	return service.get<Result<SysPost>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改岗位
 */
export const submitPost = (data: SysPost): Promise<Result<SysPost>> => {
	if (data.id) {
		return service.put<Result<SysPost>>(BASE_URL, data)
	}
	return service.post<Result<SysPost>>(BASE_URL, data)
}

/**
 * 分页查询岗位列表
 * @param params 查询参数
 */
export const getPostPage = (params: SysPostQuery): Promise<Result<PageResult<SysPost>>> => {
	return service.get<Result<PageResult<SysPost>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询全部岗位（下拉框用）
 */
export const usePostListApi = (): Promise<Result<SysPost[]>> => {
	return service.get<Result<SysPost[]>>(`${BASE_URL}/list`)
}

/**
 * 批量删除岗位
 * @param ids 岗位ID数组
 */
export const deletePosts = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
