// @/api/message/mail-log.ts
import service from '@/utils/request'
import type { MessageMailLog, MessageMailLogQuery } from '@/types/api/message/mail-log'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/mailLog';

/**
 * 获取邮件日志详情
 * @param id 日志ID
 */
export const getMailLogById = (id: number): Promise<Result<MessageMailLog>> => {
	return service.get<Result<MessageMailLog>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改邮件日志
 */
export const submitMailLog = (data: MessageMailLog): Promise<Result<MessageMailLog>> => {
	if (data.id) {
		return service.put<Result<MessageMailLog>>(BASE_URL, data)
	}
	return service.post<Result<MessageMailLog>>(BASE_URL, data)
}

/**
 * 分页查询邮件日志列表
 * @param params 查询参数
 */
export const getMailLogPage = (params: MessageMailLogQuery): Promise<Result<PageResult<MessageMailLog>>> => {
	return service.get<Result<PageResult<MessageMailLog>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除邮件日志
 * @param ids 日志ID数组
 */
export const deleteMailLogs = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
