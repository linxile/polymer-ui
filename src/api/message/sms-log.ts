// @/api/message/sms-log.ts
import service from '@/utils/request'
import type { MessageSmsLog, MessageSmsLogQuery } from '@/types/api/message/sms-log'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/smsLog';

/**
 * 获取短信日志详情
 * @param id 日志ID
 */
export const getSmsLogById = (id: number): Promise<Result<MessageSmsLog>> => {
    return service.get<Result<MessageSmsLog>>(`${BASE_URL}/${id}`);
};

/**
 * 分页查询短信日志列表
 * @param params 查询参数
 */
export const getSmsLogPage = (params: MessageSmsLogQuery): Promise<Result<PageResult<MessageSmsLog>>> => {
    return service.get<Result<PageResult<MessageSmsLog>>>(`${BASE_URL}/page`, { params })
}
