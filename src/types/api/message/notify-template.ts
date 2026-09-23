// @/types/api/message/notify-template.ts
import type { PageParam, BaseEntity } from "../common";

/** 站内信模板分页查询参数 */
export interface MessageNotifyTemplateQuery extends PageParam {
    /** 模板名称 */
    name?: string;
    /** 模板编码 */
    code?: string;
    /** 状态 */
    status?: 0 | 1;
    /** 创建时间范围 [开始, 结束] */
    createTime?: string[];
}

/** 站内信模板信息 */
export interface MessageNotifyTemplate extends BaseEntity {
    /** 模板名称 */
    name?: string;
    /** 模版编码 */
    code?: string;
    /** 发送人名称 */
    nickname?: string;
    /** 模版内容 */
    content?: string;
    /** 类型 */
    type?: number;
    /** 参数数组 */
    params?: string[];
    /** 状态 0：禁用 1：启用 */
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
}

/** 发送站内信请求参数 */
export interface NotifyTemplateSendReq {
    /** 用户id */
    userIds: number[];
    /** 模板编码 */
    templateCode: string;
    /** 模板参数 */
    templateParams?: Record<string, any>;
}
