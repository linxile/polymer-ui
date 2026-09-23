// @/types/api/storage/file.ts

/** 文件上传结果 */
export interface SysFileUpload {
    /** 文件名称 */
    name?: string;
    /** 文件地址 */
    url?: string;
    /** 文件大小 */
    size?: number;
    /** 存储平台 */
    platform?: string;
}

/** 预签名地址 */
export interface SysClientFilePresigned {
    /** 文件路径，包含文件名 */
    path?: string;
    /** 存储平台 */
    platform?: string;
    /** 预签名地址 */
    presignedUrl?: string;
}
