import service from '@/utils/request'
import type { SysLogLogin, SysLogLoginQuery } from '@/types/api/sys/login'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/log/login';

/**
 * 分页查询登录日志
 * @param params 查询参数
 */
export const getLogLoginPage = (params: SysLogLoginQuery): Promise<Result<PageResult<SysLogLogin>>> => {
    return service.get<Result<PageResult<SysLogLogin>>>(`${BASE_URL}/page`, { params })
}

/**
 * 导出登录日志 Excel
 * @param params 查询参数
 */
export const exportLogLogin = (params: SysLogLoginQuery): Promise<Blob> => {
    return service.get(`${BASE_URL}/export`, { params, responseType: 'blob' })
}
