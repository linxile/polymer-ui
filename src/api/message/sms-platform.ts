// @/api/message/sms-platform.ts
import service from '@/utils/request'
import type { MessageSmsPlatform, MessageSmsPlatformQuery, MessageSmsSend } from '@/types/api/message/sms-platform'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/smsPlatform';

/**
 * 获取短信平台详情
 * @param id 平台ID
 */
export const getSmsPlatformById = (id: number): Promise<Result<MessageSmsPlatform>> => {
	return service.get<Result<MessageSmsPlatform>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改短信平台
 */
export const submitSmsPlatform = (data: MessageSmsPlatform): Promise<Result<MessageSmsPlatform>> => {
	if (data.id) {
		return service.put<Result<MessageSmsPlatform>>(BASE_URL, data)
	}
	return service.post<Result<MessageSmsPlatform>>(BASE_URL, data)
}

/**
 * 分页查询短信平台列表
 * @param params 查询参数
 */
export const getSmsPlatformPage = (params: MessageSmsPlatformQuery): Promise<Result<PageResult<MessageSmsPlatform>>> => {
	return service.get<Result<PageResult<MessageSmsPlatform>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除短信平台
 * @param ids 平台ID数组
 */
export const deleteSmsPlatforms = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 发送短信
 */
export const sendSms = (data: MessageSmsSend): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/send`, data)
}
