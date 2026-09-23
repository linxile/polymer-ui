// @/api/message/notify-template.ts
import service from '@/utils/request'
import type {
	MessageNotifyTemplate,
	MessageNotifyTemplateQuery,
	NotifyTemplateSendReq
} from '@/types/api/message/notify-template'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/notifyTemplate';

/**
 * 获取站内信模板详情
 * @param id 模板ID
 */
export const getNotifyTemplateById = (id: number): Promise<Result<MessageNotifyTemplate>> => {
	return service.get<Result<MessageNotifyTemplate>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改站内信模板
 */
export const submitNotifyTemplate = (data: MessageNotifyTemplate): Promise<Result<MessageNotifyTemplate>> => {
	if (data.id) {
		return service.put<Result<MessageNotifyTemplate>>(BASE_URL, data)
	}
	return service.post<Result<MessageNotifyTemplate>>(BASE_URL, data)
}

/**
 * 分页查询站内信模板列表
 * @param params 查询参数
 */
export const getNotifyTemplatePage = (params: MessageNotifyTemplateQuery): Promise<Result<PageResult<MessageNotifyTemplate>>> => {
	return service.get<Result<PageResult<MessageNotifyTemplate>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除站内信模板
 * @param ids 模板ID数组
 */
export const deleteNotifyTemplates = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 发送站内信
 */
export const sendNotify = (data: NotifyTemplateSendReq): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/send-notify`, data)
}
