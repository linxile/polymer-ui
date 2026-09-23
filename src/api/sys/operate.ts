import service from '@/utils/request'
import type { SysLogOperate, SysLogOperateQuery } from '@/types/api/sys/operate'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/log/operate';

/**
 * 分页查询操作日志
 * @param params 查询参数
 */
export const getLogOperatePage = (params: SysLogOperateQuery): Promise<Result<PageResult<SysLogOperate>>> => {
    return service.get<Result<PageResult<SysLogOperate>>>(`${BASE_URL}/page`, { params })
}
