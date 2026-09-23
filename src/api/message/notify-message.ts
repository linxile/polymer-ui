// @/api/message/notify-message.ts
import service from '@/utils/request'
import type {
	MessageNotifyMessage,
	MessageNotifyMessageQuery
} from '@/types/api/message/notify-message'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/notifyMessage';

/**
 * 获取站内信消息详情
 * @param id 消息ID
 */
export const getNotifyMessageById = (id: number): Promise<Result<MessageNotifyMessage>> => {
	return service.get<Result<MessageNotifyMessage>>(`${BASE_URL}/${id}`);
};

/**
 * 分页查询站内信消息列表
 * @param params 查询参数
 */
export const getNotifyMessagePage = (params: MessageNotifyMessageQuery): Promise<Result<PageResult<MessageNotifyMessage>>> => {
	return service.get<Result<PageResult<MessageNotifyMessage>>>(`${BASE_URL}/page`, { params })
}

/**
 * 标记站内信为已读
 * @param ids 消息ID列表
 */
export const updateNotifyMessageRead = (ids: number[]): Promise<Result<boolean>> => {
	return service.put<Result<boolean>>(`${BASE_URL}/update-read`, null, { params: { ids } })
}

/**
 * 标记所有站内信为已读
 */
export const updateAllNotifyMessageRead = (): Promise<Result<boolean>> => {
	return service.put<Result<boolean>>(`${BASE_URL}/update-all-read`)
}

/**
 * 获取当前用户的最新站内信列表，默认 10 条
 * @param size 数量，默认 10
 */
export const getUnreadNotifyMessageList = (size?: number): Promise<Result<MessageNotifyMessage[]>> => {
	return service.get<Result<MessageNotifyMessage[]>>(`${BASE_URL}/get-unread-list`, { params: { size } })
}

/**
 * 获得当前用户的未读站内信数量
 */
export const getUnreadNotifyMessageCount = (): Promise<Result<number>> => {
	return service.get<Result<number>>(`${BASE_URL}/get-unread-count`)
}
