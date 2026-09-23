import type { PageParam, BaseEntity } from "../common";

/** 定时任务日志分页查询参数 */
export interface ScheduleJobLogQuery extends PageParam {
    /** 任务id */
    jobId?: number;
    /** 任务名称 */
    jobName?: string;
    /** 任务组名 */
    jobGroup?: string;
}

/** 定时任务日志信息 */
export interface ScheduleJobLog extends BaseEntity {
    /** 任务id */
    jobId?: number;
    /** 任务名称 */
    jobName?: string;
    /** 任务组名 */
    jobGroup?: string;
    /** spring bean名称 */
    beanName?: string;
    /** 执行方法 */
    method?: string;
    /** 参数 */
    params?: string;
    /** 任务状态 */
    status?: 0 | 1;
    /** 异常信息 */
    error?: string;
    /** 耗时(单位：毫秒) */
    times?: number;
}
