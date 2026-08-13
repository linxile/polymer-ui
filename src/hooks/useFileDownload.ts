// src/hooks/useFileDownload.ts
import service from '@/utils/request'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import FileUrlUtils from '@/utils/fileUrlUtils'
import { ref, Ref } from 'vue'

export interface IFileDownloadOptions {
    // 导出时的额外参数（会合并到 queryForm）
    extraParams?: Record<string, any>
    // 默认文件名（不含后缀）
    defaultFileName?: string
    // 默认文件扩展名
    defaultExt?: string
}

/**
 * 独立的文件下载与导出 Composable
 * 职责：处理所有文件下载、导出相关的逻辑
 */
export const useFileDownload = (options?: IFileDownloadOptions) => {
    const exportLoading: Ref<boolean> = ref(false)

    /**
     * 从响应头中提取文件名
     */
    const getFileNameFromResponse = (res: any, fallbackName?: string): string => {
        if (fallbackName) {
            return fallbackName
        }

        const contentDisposition = res.headers['content-disposition']
        if (contentDisposition) {
            // 优先匹配 filename* (支持 UTF-8 编码)
            const matchStar = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i)
            if (matchStar) {
                return decodeURIComponent(matchStar[1])
            }
            // 匹配普通 filename
            const match = contentDisposition.match(/filename=([^;]+)/i)
            if (match) {
                return decodeURIComponent(match[1])
            }
        }

        // 使用默认文件名
        const ext = options?.defaultExt || 'xlsx'
        return `${options?.defaultFileName || '文件'}_${new Date().getTime()}.${ext}`
    }

    /**
     * ✅ 修复：创建 Blob 副本，避免原始 Blob 被消费
     */
    const createBlobCopy = (blob: Blob): Blob => {
        // 读取原始 Blob 内容并创建新 Blob，保留原始 Blob 供后续使用
        return blob.slice(0, blob.size, blob.type)
    }

    /**
     * 触发浏览器下载
     */
    const triggerDownload = (data: Blob, fileName: string, fileType?: string) => {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.download = fileName

        const blob = new Blob([data], {
            type: data.type || fileType || 'application/octet-stream'
        })
        link.href = URL.createObjectURL(blob)

        document.body.appendChild(link)
        link.click()

        // 延迟清理资源
        setTimeout(() => {
            URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
        }, 100)
    }

    /**
     * 检查响应是否为错误响应（JSON 格式）
     * 使用 blob.slice() 创建副本，不破坏原始数据
     */
    const checkErrorResponse = async (res: any): Promise<{ isError: boolean; blobCopy?: Blob }> => {
        const contentType = res.headers['content-type'] || ''

        // 如果是 JSON，说明是错误响应
        if (contentType.includes('application/json')) {
            try {
                // 从原始 blob 读取文本
                const text = await res.data.text()
                try {
                    const errorData = JSON.parse(text)
                    ElMessage.error(errorData.msg || errorData.message || '操作失败')
                } catch {
                    ElMessage.error('操作失败：' + text.substring(0, 100))
                }
            } catch {
                ElMessage.error('操作失败：无法读取响应数据')
            }
            return { isError: true }
        }

        // 创建 Blob 副本，供后续下载使用
        // 原始 res.data 没有被消费，但为了安全，我们创建副本传递出去
        const blobCopy = createBlobCopy(res.data)

        // 检查文件是否为空
        if (!blobCopy || blobCopy.size === 0) {
            ElMessage.error('文件为空，请检查查询条件')
            return { isError: true }
        }

        return { isError: false, blobCopy }
    }

    /**
     * 统一的下载错误处理
     */
    const handleDownloadError = async (err: any): Promise<void> => {
        if (err.response) {
            const { status, data } = err.response

            if (data instanceof Blob) {
                try {
                    const text = await data.text()
                    try {
                        const errorData = JSON.parse(text)
                        ElMessage.error(errorData.msg || errorData.message || `请求失败 (HTTP ${status})`)
                    } catch {
                        ElMessage.error(`请求失败：${text.substring(0, 100)}`)
                    }
                } catch {
                    ElMessage.error(`请求失败 (HTTP ${status})`)
                }
            } else {
                ElMessage.error(err.response.data?.msg || err.response.data?.message || err.message || '请求失败')
            }
        } else if (err.request) {
            ElMessage.error('网络异常，请检查网络连接')
        } else {
            ElMessage.error(err.message || '请求失败')
        }
    }

    /**
     * 通用下载方法（支持任意 URL）
     */
    const download = async (url: string, filename?: string, method: string = 'GET'): Promise<any> => {
        try {
            const fullUrl = await FileUrlUtils.getFullUrl(url)

            const res = await service({
                responseType: 'blob',
                url: fullUrl,
                method: method
            })

            // 检查错误响应，同时获取 Blob 副本
            const { isError, blobCopy } = await checkErrorResponse(res)
            if (isError) {
                return
            }

            // 使用 Blob 副本进行下载
            const fileName = getFileNameFromResponse(res, filename)
            triggerDownload(blobCopy!, fileName)

            ElMessage.success('下载成功')
        } catch (err: any) {
            await handleDownloadError(err)
        }
    }

    /**
     * 导出方法（专用于列表数据导出，带查询参数）
     */
    const exportFile = async (
        exportUrl: string,
        queryForm: Record<string, any>,
        filename?: string
    ): Promise<void> => {
        if (exportLoading.value) {
            return
        }

        if (!exportUrl) {
            ElMessage.error('导出接口地址未配置')
            return
        }

        try {
            exportLoading.value = true

            // 合并额外参数
            const baseParams = { ...queryForm, ...(options?.extraParams || {}) }

            // 过滤空值
            const filteredParams = Object.keys(baseParams).reduce<Record<string, any>>((acc, key) => {
                const value = baseParams[key]
                if (value !== undefined && value !== null && value !== '') {
                    acc[key] = value
                }
                return acc
            }, {})

            // 构建完整 URL
            const queryString = Object.keys(filteredParams).length
                ? qs.stringify(filteredParams, { addQueryPrefix: true })
                : ''
            const fullUrl = exportUrl + queryString

            // 发起导出请求
            const res = await service({
                responseType: 'blob',
                url: fullUrl,
                method: 'GET'
            })

            // 检查错误响应，同时获取 Blob 副本
            const { isError, blobCopy } = await checkErrorResponse(res)
            if (isError) {
                return
            }

            // 使用 Blob 副本进行下载
            const fileName = getFileNameFromResponse(res, filename)
            triggerDownload(blobCopy!, fileName)

            ElMessage.success('导出成功')
        } catch (err: any) {
            await handleDownloadError(err)
        } finally {
            exportLoading.value = false
        }
    }

    return {
        exportLoading,
        download,
        exportFile
    }
}
