// @/api/message/mail-account.ts
import service from '@/utils/request'
import type { MessageMailAccount, MessageMailAccountQuery } from '@/types/api/message/mail-account'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/message/mailAccount';

/**
 * 获取邮箱账号详情
 * @param id 账号ID
 */
export const getMailAccountById = (id: number): Promise<Result<MessageMailAccount>> => {
	return service.get<Result<MessageMailAccount>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改邮箱账号
 */
export const submitMailAccount = (data: MessageMailAccount): Promise<Result<MessageMailAccount>> => {
	if (data.id) {
		return service.put<Result<MessageMailAccount>>(BASE_URL, data)
	}
	return service.post<Result<MessageMailAccount>>(BASE_URL, data)
}

/**
 * 分页查询邮箱账号列表
 * @param params 查询参数
 */
export const getMailAccountPage = (params: MessageMailAccountQuery): Promise<Result<PageResult<MessageMailAccount>>> => {
	return service.get<Result<PageResult<MessageMailAccount>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询邮箱账号列表（下拉框用）
 */
export const useMailAccountListApi = (): Promise<Result<MessageMailAccount[]>> => {
	return service.get<Result<MessageMailAccount[]>>(`${BASE_URL}/list`)
}

/**
 * 批量删除邮箱账号
 * @param ids 账号ID数组
 */
export const deleteMailAccounts = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
