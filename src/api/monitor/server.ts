// @/api/monitor/server.ts
import service from '@/utils/request'
import type { Server, Cpu, Mem, Jvm, Sys, Disk } from '@/types/api/monitor/server'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/monitor/server';

/**
 * 服务器相关信息（聚合，含 cpu / mem / jvm / sys / disks）
 */
export const useServerInfoApi = (): Promise<Result<Server>> => {
	return service.get<Result<Server>>(`${BASE_URL}/info`)
}

/**
 * CPU 相关信息
 */
export const useCpuInfoApi = (): Promise<Result<Cpu>> => {
	return service.get<Result<Cpu>>(`${BASE_URL}/cpu`)
}

/**
 * 内存相关信息
 */
export const useMemInfoApi = (): Promise<Result<Mem>> => {
	return service.get<Result<Mem>>(`${BASE_URL}/mem`)
}

/**
 * JVM 相关信息
 */
export const useJvmInfoApi = (): Promise<Result<Jvm>> => {
	return service.get<Result<Jvm>>(`${BASE_URL}/jvm`)
}

/**
 * 系统相关信息
 */
export const useSysInfoApi = (): Promise<Result<Sys>> => {
	return service.get<Result<Sys>>(`${BASE_URL}/sys`)
}

/**
 * 系统文件（磁盘）相关信息
 */
export const useDiskInfoApi = (): Promise<Result<Disk[]>> => {
	return service.get<Result<Disk[]>>(`${BASE_URL}/disk`)
}
