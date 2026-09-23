// @/types/api/message/sms-platform.ts
import type { PageParam, BaseEntity } from "../common";

/** 短信平台分页查询参数 */
export interface MessageSmsPlatformQuery extends PageParam {
    /** 平台类型 0：阿里云 1：腾讯云 */
    platform?: number;
    /** 短信签名 */
    signName?: string;
}

/** 短信平台信息 */
export interface MessageSmsPlatform extends BaseEntity {
    /** 平台类型 0：阿里云 1：腾讯云 */
    platform?: number;
    /** 短信签名 */
    signName?: string;
    /** 短信模板 */
    templateId?: string;
    /** 短信应用的ID，如：腾讯云等 */
    appId?: string;
    /** 腾讯云国际短信、华为云等需要 */
    senderId?: string;
    /** 接入地址，如：华为云 */
    url?: string;
    /** AccessKey */
    accessKey?: string;
    /** SecretKey */
    secretKey?: string;
    /** 状态 0：禁用 1：启用 */
    status?: 0 | 1;
}

/** 短信发送参数 */
export interface MessageSmsSend {
    /** id（短信平台ID） */
    id?: number;
    /** 手机号 */
    mobile?: string;
    /** 参数Key */
    paramKey?: string;
    /** 参数Value */
    paramValue?: string;
}
