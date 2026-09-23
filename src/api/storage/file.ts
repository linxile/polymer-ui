// @/api/storage/file.ts
import service from '@/utils/request'
import type { SysFileUpload, SysClientFilePresigned } from '@/types/api/storage/file'
import type { Result } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/storage/file';

/**
 * 上传文件（模式一：后端上传文件）
 * @param file 文件对象
 */
export const updateFile = (file: File): Promise<Result<SysFileUpload>> => {
    const formData = new FormData()
    formData.append('file', file)
    return service.post<Result<SysFileUpload>>(`${BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 获取文件预签名上传地址信息（模式二：前端直接上传）
 * @param fileName 文件名
 */
export const getFilePresignedUploadUrl = (fileName: string): Promise<Result<SysClientFilePresigned>> => {
    return service.get<Result<SysClientFilePresigned>>(`${BASE_URL}/presigned-url/upload`, {
        params: { fileName }
    })
}

/**
 * 获取文件预签名下载地址
 * @param path 文件路径
 */
export const getFilePresignedDownloadUrl = (path: string): Promise<Result<string>> => {
    return service.get<Result<string>>(`${BASE_URL}/presigned-url/download`, {
        params: { path }
    })
}
