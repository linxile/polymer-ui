// @/types/api/message/sms-log.ts
import type { PageParam, BaseEntity } from "../common";

/** 短信日志分页查询参数 */
export interface MessageSmsLogQuery extends PageParam {
    /** 平台ID */
    platformId?: number;
    /** 平台类型 */
    platform?: number;
}

/** 短信日志信息 */
export interface MessageSmsLog extends BaseEntity {
    /** 平台ID */
    platformId?: number;
    /** 平台类型 */
    platform?: number;
    /** 手机号 */
    mobile?: string;
    /** 状态 0：失败 1：成功 */
    status?: 0 | 1;
    /** 参数 */
    params?: string;
    /** 异常信息 */
    error?: string;
}
