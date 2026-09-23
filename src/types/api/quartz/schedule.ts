import type { PageParam, BaseEntity } from "../common";

/** 定时任务分页查询参数 */
export interface ScheduleJobQuery extends PageParam {
    /** 任务名称 */
    jobName?: string;
    /** 任务组名 */
    jobGroup?: string;
    /** 状态 */
    status?: number;
}

/** 定时任务信息 */
export interface ScheduleJob extends BaseEntity {
    /** 任务名称 */
    jobName?: string;
    /** 任务组名 */
    jobGroup?: string;
    /** bean名称 */
    beanName?: string;
    /** 执行方法 */
    method?: string;
    /** 参数 */
    params?: string;
    /** cron表达式 */
    cronExpression?: string;
    /** 状态 */
    status?: 0 | 1;
    /** 是否并发 */
    concurrent?: 0 | 1;
    /** 备注 */
    remark?: string;
}
