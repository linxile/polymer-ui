import type { PageParam, BaseEntity } from "../common";

/** 操作日志分页查询参数 */
export interface SysLogOperateQuery extends PageParam {
    /** 用户 */
    realName?: string;
    /** 模块名 */
    module?: string;
    /** 请求URI */
    reqUri?: string;
    /** 操作状态 */
    status?: 0 | 1;
}

/** 操作日志信息 */
export interface SysLogOperate extends BaseEntity {
    /** 用户ID */
    userId?: number;
    /** 操作人 */
    realName?: string;
    /** 模块名 */
    module?: string;
    /** 操作名 */
    name?: string;
    /** 请求URI */
    reqUri?: string;
    /** 请求方法 */
    reqMethod?: string;
    /** 请求参数 */
    reqParams?: string;
    /** 操作IP */
    ip?: string;
    /** 登录地点 */
    address?: string;
    /** User Agent */
    userAgent?: string;
    /** 操作类型 */
    operateType?: number;
    /** 执行时长 */
    duration?: number;
    /** 操作状态 */
    status?: 0 | 1;
    /** 返回消息 */
    resultMsg?: string;
}
