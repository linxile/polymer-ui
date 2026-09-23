// @/types/api/demo/multiple-files.ts
import type { PageParam, BaseEntity } from "../common";

/** 附件信息 */
export interface SysAttachment {
    /** id */
    id?: number;
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

/** 多文件上传样例分页查询参数 */
export interface DemoMultipleFilesQuery extends PageParam {
    // 后端 Query 无额外字段，保留占位便于后续扩展
}

/** 多文件上传样例信息 */
export interface DemoMultipleFiles extends BaseEntity {
    /** 名称 */
    name?: string;
    /** 描述 */
    description?: string;
    /** 部门ID */
    deptId?: number;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 图片 */
    images?: SysAttachment[];
    /** 附件 */
    attachments?: SysAttachment[];
}
