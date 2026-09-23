// @/api/message/mail-template.ts
import service from '@/utils/request'
import type {
	MessageMailTemplate,
	MessageMailTemplateQuery,
	MessageMailTemplateSendReq
} from '@/types/api/message/mail-template'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/mailTemplate';

/**
 * 获取邮件模板详情
 * @param id 模板ID
 */
export const getMailTemplateById = (id: number): Promise<Result<MessageMailTemplate>> => {
	return service.get<Result<MessageMailTemplate>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改邮件模板
 */
export const submitMailTemplate = (data: MessageMailTemplate): Promise<Result<MessageMailTemplate>> => {
	if (data.id) {
		return service.put<Result<MessageMailTemplate>>(BASE_URL, data)
	}
	return service.post<Result<MessageMailTemplate>>(BASE_URL, data)
}

/**
 * 分页查询邮件模板列表
 * @param params 查询参数
 */
export const getMailTemplatePage = (params: MessageMailTemplateQuery): Promise<Result<PageResult<MessageMailTemplate>>> => {
	return service.get<Result<PageResult<MessageMailTemplate>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除邮件模板
 * @param ids 模板ID数组
 */
export const deleteMailTemplates = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 发送邮件
 */
export const sendMail = (data: MessageMailTemplateSendReq): Promise<Result<number>> => {
	return service.post<Result<number>>(`${BASE_URL}/send-mail`, data)
}
