import type { PageParam, BaseEntity } from "../common";

/** 附件分页查询参数 */
export interface SysAttachmentQuery extends PageParam {
    /** 附件名称 */
    name?: string;
    /** 存储平台 */
    platform?: string;
}

/** 附件信息 */
export interface SysAttachment extends BaseEntity {
    /** 业务标识 */
    bizMark?: string;
    /** 业务类型 */
    bizType?: string;
    /** 附件名称 */
    name?: string;
    /** 附件地址 */
    url?: string;
    /** 附件大小 */
    size?: number;
    /** 附件类型 */
    type?: string;
    /** 存储平台 */
    platform?: string;
}
