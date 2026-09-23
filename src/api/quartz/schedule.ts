import service from '@/utils/request'
import type { ScheduleJob, ScheduleJobQuery } from '@/types/api/quartz/schedule'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/schedule';

/**
 * 获取定时任务详情
 * @param id 任务ID
 */
export const getScheduleById = (id: number): Promise<Result<ScheduleJob>> => {
	return service.get<Result<ScheduleJob>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改定时任务
 */
export const submitSchedule = (data: ScheduleJob): Promise<Result<ScheduleJob>> => {
	if (data.id) {
		return service.put<Result<ScheduleJob>>(BASE_URL, data)
	}
	return service.post<Result<ScheduleJob>>(BASE_URL, data)
}

/**
 * 分页查询定时任务列表
 * @param params 查询参数
 */
export const getSchedulePage = (params: ScheduleJobQuery): Promise<Result<PageResult<ScheduleJob>>> => {
	return service.get<Result<PageResult<ScheduleJob>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除定时任务
 * @param ids 任务ID数组
 */
export const deleteSchedules = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 立即执行任务
 */
export const runSchedule = (data: ScheduleJob): Promise<Result<string>> => {
	return service.put<Result<string>>(`${BASE_URL}/run`, data)
}

/**
 * 修改任务状态
 */
export const changeScheduleStatus = (data: ScheduleJob): Promise<Result<string>> => {
	return service.put<Result<string>>(`${BASE_URL}/change-status`, data)
}
