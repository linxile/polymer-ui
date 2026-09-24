// src/hooks/useFileUpload.ts
import * as FileApi from '@/api/storage/file'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import axios from 'axios'
import request from '@/utils/request'
import type { DataImportResult } from '@/types/api/common'
import type { SysFileUpload } from '@/types/api/storage/file'

/**
 * 上传类型
 */
enum UPLOAD_TYPE {
    /** 客户端直接上传（只支持 S3 服务） */
    CLIENT = 'client',
    /** 客户端发送到后端上传 */
    SERVER = 'server'
}

const isClientUpload = UPLOAD_TYPE.CLIENT === import.meta.env.VITE_UPLOAD_TYPE

/**
 * 服务端上传（附件）
 */
async function handleServerUpload(file: File): Promise<SysFileUpload> {
    try {
        const response = await FileApi.updateFile(file)

        // response 类型已是 Result<SysFileUpload>
        if (response.code === 0 && response.data) {
            return response.data
        }
        throw new Error(response.msg || '文件上传失败')
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : '文件上传失败')
    }
}

/**
 * 客户端直传（附件）
 */
async function handleClientUpload(file: File): Promise<SysFileUpload> {
    try {
        const presignedInfo = await FileApi.getFilePresignedUploadUrl(file.name)

        const data = presignedInfo.data
        if (!data) {
            throw new Error('获取预签名失败!')
        }

        if (data.platform === 'LOCAL') {
            // 回退到后端上传
            return await handleServerUpload(file)
        }

        if (!data.presignedUrl) {
            throw new Error('获取预签名地址失败!')
        }

        // 使用预签名 URL 直传
        await axios.put(data.presignedUrl, file, {
            headers: { 'Content-Type': file.type }
        })

        return {
            name: file.name,
            url: data.path || '',
            size: file.size,
            platform: data.platform || ''
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : '文件上传失败')
    }
}

/**
 * 上传附件
 * @param options el-upload 的请求选项
 */
export async function uploadAttachment(options: UploadRequestOptions): Promise<SysFileUpload> {
    return uploadAttachmentSimplify(options.file)
}

/**
 * 上传附件 - 直接接收 File 对象
 */
export async function uploadAttachmentSimplify(file: File): Promise<SysFileUpload> {
    if (isClientUpload) {
        return handleClientUpload(file)
    }
    return handleServerUpload(file)
}

/**
 * 导入数据文件
 * @param options el-upload 的请求选项
 * @param importUrl 导入接口地址
 * @param data 额外的业务参数（可选）
 */
export async function uploadDataImport(
    options: UploadRequestOptions,
    importUrl: string,
    data?: Record<string, any>
): Promise<DataImportResult> {
    if (!importUrl) {
        throw new Error('导入接口地址不能为空')
    }

    try {
        // 构建 FormData
        const formData = new FormData()
        formData.append('file', options.file)

        // 合并额外的业务参数
        if (data) {
            Object.keys(data).forEach(key => {
                const value = data[key]
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value))
                }
            })
        }

        // 使用统一的 request 实例发送请求
        const response = await request({
            url: importUrl,
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // 标准化返回结果
        const result: DataImportResult = {
            passed: response.data?.passed !== false,
            errorFileUrl: response.data?.errorFileUrl || '',
            message: response.data?.message || '导入完成'
        }

        return result
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : '数据文件导入失败')
    }
}
