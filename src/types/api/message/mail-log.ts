// @/types/api/message/mail-log.ts
import type { PageParam, BaseEntity } from "../common";

/** 邮件日志分页查询参数 */
export interface MessageMailLogQuery extends PageParam {
    /** 邮件标题 */
    templateTitle?: string;
}

/** 邮件日志信息 */
export interface MessageMailLog extends BaseEntity {
    /** 用户id */
    userId?: number;
    /** 用户类型 */
    userType?: number;
    /** 接收邮箱地址 */
    toMail?: string;
    /** 邮箱账号编号 */
    accountId?: number;
    /** 发送邮箱地址 */
    fromMail?: string;
    /** 模板编号 */
    templateId?: number;
    /** 模板编码 */
    templateCode?: string;
    /** 模版发送人名称 */
    templateNickname?: string;
    /** 邮件标题 */
    templateTitle?: string;
    /** 邮件内容 */
    templateContent?: string;
    /** 邮件参数 */
    templateParams?: Record<string, any>;
    /** 发送状态 */
    sendStatus?: number;
    /** 发送时间 */
    sendTime?: string;
    /** 发送返回的消息 ID */
    sendMessageId?: string;
    /** 发送异常 */
    sendException?: string;
    /** 部门ID */
    deptId?: number;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
}
