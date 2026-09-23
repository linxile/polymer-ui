import type { PageParam, BaseEntity } from "../common";

/** 登录日志分页查询参数 */
export interface SysLogLoginQuery extends PageParam {
    /** 用户名 */
    username?: string;
    /** 登录地点 */
    address?: string;
    /** 登录状态 0：失败 1：成功 */
    status?: 0 | 1;
}

/** 登录日志信息 */
export interface SysLogLogin extends BaseEntity {
    /** 用户名 */
    username?: string;
    /** 登录IP */
    ip?: string;
    /** 登录地点 */
    address?: string;
    /** User Agent */
    userAgent?: string;
    /** 登录状态 0：失败 1：成功 */
    status?: 0 | 1;
    /** 操作信息 0：登录成功 1：退出成功 2：验证码错误 3：账号密码错误 */
    operation?: 0 | 1 | 2 | 3;
}
