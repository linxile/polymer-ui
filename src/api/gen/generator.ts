// @/api/gen/generator.ts
import service from '@/utils/request'
import type { Preview } from '@/types/api/gen/generator'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/gen/generator';

/**
 * 生成代码（自定义目录）
 * @param tableIds 表ID数组
 */
export const useGeneratorApi = (tableIds: number[]): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/code`, tableIds)
}

/**
 * 预览代码
 * @param tableId 表ID
 */
export const usePreviewApi = (tableId: number): Promise<Result<Preview[]>> => {
	return service.get<Result<Preview[]>>(`${BASE_URL}/preview`, { params: { tableId } })
}

/**
 * 生成代码（zip压缩包）下载地址
 * @param tableIds 表ID数组，会以逗号拼接
 */
export const getDownloadUrl = (tableIds: number[]): string => {
	return `${BASE_URL}/download?tableIds=${tableIds.join(',')}`
}
