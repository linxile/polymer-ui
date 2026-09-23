import service from '@/utils/request'
import type { SysAttachment, SysAttachmentQuery } from '@/types/api/sys/attachment'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/attachment';

/**
 * 分页查询附件列表
 * @param params 查询参数
 */
export const getAttachmentPage = (params: SysAttachmentQuery): Promise<Result<PageResult<SysAttachment>>> => {
	return service.get<Result<PageResult<SysAttachment>>>(`${BASE_URL}/page`, { params })
}

/**
 * 新增附件
 */
export const submitAttachment = (data: SysAttachment): Promise<Result<SysAttachment>> => {
	return service.post<Result<SysAttachment>>(BASE_URL, data)
}

/**
 * 批量删除附件
 * @param ids 附件ID数组
 */
export const deleteAttachments = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}
