import service from '@/utils/request'
import type { UserOnline, UserOnlineQuery } from '@/types/api/monitor/user-online'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/monitor/user';

/**
 * 分页查询在线用户列表
 * @param params 查询参数
 */
export const getUserOnlinePage = (params: UserOnlineQuery): Promise<Result<PageResult<UserOnline>>> => {
	return service.get<Result<PageResult<UserOnline>>>(`${BASE_URL}/page`, { params })
}

/**
 * 强制退出
 * @param accessToken 访问令牌
 */
export const forceLogout = (accessToken: string): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/${accessToken}`)
}
