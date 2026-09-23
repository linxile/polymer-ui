// @/types/api/message/mail-account.ts
import type { PageParam, BaseEntity } from "../common";

/** 邮箱账号分页查询参数 */
export interface MessageMailAccountQuery extends PageParam {
    /** 邮箱 */
    mail?: string;
    /** 用户名 */
    username?: string;
}

/** 邮箱账号信息 */
export interface MessageMailAccount extends BaseEntity {
    /** 邮箱 */
    mail?: string;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** SMTP 服务器域名 */
    host?: string;
    /** SMTP 服务器端口 */
    port?: number;
    /** 协议 */
    protocol?: string;
    /** 是否开启 SSL */
    sslEnable?: boolean;
    /** 部门ID */
    deptId?: number;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
}
