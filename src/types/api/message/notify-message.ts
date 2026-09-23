// @/types/api/message/notify-message.ts
import type { PageParam, BaseEntity } from "../common";

/** 站内信消息分页查询参数 */
export interface MessageNotifyMessageQuery extends PageParam {
    /** 用户id */
    userId?: number;
    /** 模板编码 */
    templateCode?: string;
    /** 模版类型 */
    type?: number;
    /** 创建时间范围 [开始, 结束] */
    createTime?: string[];
}

/** 站内信消息信息 */
export interface MessageNotifyMessage extends BaseEntity {
    /** 用户id */
    userId?: number;
    /** 用户类型 */
    userType?: number;
    /** 标题 */
    title?: string;
    /** 模板编码 */
    templateCode?: string;
    /** 发送人 */
    sender?: string;
    /** 内容 */
    content?: string;
    /** 类型 */
    type?: number;
    /** 发送人头像 */
    senderAvatar?: string;
    /** 是否已读 */
    readStatus?: boolean;
    /** 阅读时间 */
    readTime?: string;
    /** 部门ID */
    deptId?: number;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
}
