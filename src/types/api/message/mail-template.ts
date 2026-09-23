// @/types/api/message/mail-template.ts
import type { PageParam, BaseEntity } from "../common";

/** 邮件模板分页查询参数 */
export interface MessageMailTemplateQuery extends PageParam {
    /** 模板名称 */
    name?: string;
    /** 模板编码 */
    code?: string;
}

/** 邮件模板信息 */
export interface MessageMailTemplate extends BaseEntity {
    /** 模板名称 */
    name?: string;
    /** 模板编码 */
    code?: string;
    /** 邮箱账号ID */
    accountId?: number;
    /** 发送人名称 */
    nickname?: string;
    /** 主题 */
    subject?: string;
    /** 模板标题 */
    title?: string;
    /** 模板内容 */
    content?: string;
    /** 参数数组 */
    params?: string[];
    /** 开启状态 0：禁用 1：启用 */
    status?: 0 | 1;
    /** 备注 */
    remark?: string;
    /** 部门ID */
    deptId?: number;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 邮箱账号 */
    mail?: string;
}

/** 发送邮件请求参数 */
export interface MessageMailTemplateSendReq {
    /** 接收邮箱 */
    mail: string;
    /** 模板编码 */
    templateCode: string;
    /** 模板参数 */
    templateParams?: Record<string, any>;
}
