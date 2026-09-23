import service from '@/utils/request'
import type { ScheduleJobLog, ScheduleJobLogQuery } from '@/types/api/quartz/schedule-log'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/schedule/log';

/**
 * 获取定时任务日志详情
 * @param id 日志ID
 */
export const getScheduleLogById = (id: number): Promise<Result<ScheduleJobLog>> => {
    return service.get<Result<ScheduleJobLog>>(`${BASE_URL}/${id}`);
};

/**
 * 分页查询定时任务日志列表
 * @param params 查询参数
 */
export const getScheduleLogPage = (params: ScheduleJobLogQuery): Promise<Result<PageResult<ScheduleJobLog>>> => {
    return service.get<Result<PageResult<ScheduleJobLog>>>(`${BASE_URL}/page`, { params })
}
