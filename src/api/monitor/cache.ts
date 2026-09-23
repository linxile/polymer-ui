// @/api/monitor/cache.ts
import service from '@/utils/request'
import type { Cache, RedisInfo } from '@/types/api/monitor/cache'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/monitor/cache';

/**
 * Redis 详情
 */
export const useCacheInfoApi = (): Promise<Result<RedisInfo>> => {
	return service.get<Result<RedisInfo>>(`${BASE_URL}/info`)
}

/**
 * 查询缓存名称列表
 */
export const listCacheName = (): Promise<Result<Cache[]>> => {
	return service.get<Result<Cache[]>>(`${BASE_URL}/getCacheName`)
}

/**
 * 查询缓存键名列表
 * @param cacheName 缓存名称
 */
export const listCacheKey = (cacheName: string): Promise<Result<string[]>> => {
	return service.get<Result<string[]>>(`${BASE_URL}/getCacheKeys/${cacheName}`)
}

/**
 * 查询缓存内容
 * @param cacheName 缓存名称
 * @param cacheKey 缓存键名
 */
export const getCacheValue = (cacheName: string, cacheKey: string): Promise<Result<Cache>> => {
	return service.get<Result<Cache>>(`${BASE_URL}/getCacheValue/${cacheName}/${cacheKey}`)
}

/**
 * 清理指定名称缓存
 * @param cacheName 缓存名称
 */
export const clearCacheName = (cacheName: string): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/clearCacheName/${cacheName}`)
}

/**
 * 清理指定键名缓存
 * @param cacheKey 缓存键名
 */
export const clearCacheKey = (cacheKey: string): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/clearCacheKey/${cacheKey}`)
}

/**
 * 清理全部缓存
 */
export const clearCacheAll = (): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}/clearCacheAll`)
}
