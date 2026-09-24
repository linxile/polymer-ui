import { ElLoading, ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import service from '@/utils/request'
import { blobValidate } from '@/utils/polymer'
import errorCode from '@/utils/errorCode'
import type { AxiosResponse } from 'axios'
import FileUrlUtils from "@/utils/fileUrlUtils";

/** loading 实例（全局单例） */
let downloadLoadingInstance: ReturnType<typeof ElLoading.service> | null = null

/**
 * 开启全局 loading
 */
function openLoading(text = '正在下载数据，请稍候'): void {
    downloadLoadingInstance = ElLoading.service({
        text,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

/**
 * 关闭全局 loading
 */
function closeLoading(): void {
    downloadLoadingInstance?.close()
    downloadLoadingInstance = null
}

/**
 * 触发浏览器下载
 */
function triggerDownload(data: Blob, fileName: string): void {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.download = fileName

    link.href = URL.createObjectURL(data)

    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
    }, 100)
}

/**
 * 检查响应是否为错误响应（JSON 格式）
 */
async function checkErrorResponse(res: AxiosResponse<Blob>): Promise<{ isError: boolean; blobCopy?: Blob }> {
    const contentType = (res.headers['content-type'] as string) || ''

    // 如果是 JSON，说明是错误响应
    if (contentType.includes('application/json')) {
        try {
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

    const blobCopy = res.data.slice(0, res.data.size, res.data.type)

    if (!blobCopy || blobCopy.size === 0) {
        ElMessage.error('文件为空，请检查查询条件')
        return { isError: true }
    }

    return { isError: false, blobCopy }
}

/**
 * 统一的下载错误处理
 */
async function handleDownloadError(err: any): Promise<void> {
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
 * 处理非 Blob 响应（错误响应）
 */
async function handleNonBlobResponse(res: AxiosResponse<Blob>): Promise<void> {
    const resText = await res.data.text()
    try {
        const rspObj = JSON.parse(resText)
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        ElMessage.error(errMsg)
    } catch {
        ElMessage.error('导出失败：' + resText.substring(0, 100))
    }
}

/**
 * 通用下载方法（GET）
 * @param url 下载地址
 * @param filename 文件名
 */
export async function download(url: string, filename: string): Promise<void> {
    try {
        const fullUrl = await FileUrlUtils.getFullUrl(url)
        const res = await service.get(fullUrl, {
            responseType: 'blob'
        }) as AxiosResponse<Blob>

        const { isError, blobCopy } = await checkErrorResponse(res)
        if (isError) {
            return
        }

        triggerDownload(blobCopy!, filename)

        ElMessage.success('下载成功')
    } catch (err: any) {
        await handleDownloadError(err)
    }
}

/**
 * 列表数据导出（POST JSON 传参，带 loading）
 * @param url 导出接口地址
 * @param params 查询参数
 * @param filename 导出文件名
 */
export async function exportFile(
    url: string,
    params: Record<string, any>,
    filename: string
): Promise<void> {
    if (!url) {
        ElMessage.error('导出接口地址未配置')
        return
    }

    openLoading()

    try {
        const res = await service.post(url, params, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'blob'
        }) as AxiosResponse<Blob>

        if (blobValidate(res.data)) {
            const blob = new Blob([res.data])
            saveAs(blob, filename)
            ElMessage.success('导出成功')
        } else {
            await handleNonBlobResponse(res)
        }
    } catch (err: any) {
        await handleDownloadError(err)
    } finally {
        closeLoading()
    }
}

/**
 * 模板下载（GET query 传参，无 loading）
 * @param url 模板下载地址
 * @param filename 文件名
 * @param params 查询参数（可传可不传）
 */
export async function exportTemplate(
    url: string,
    filename: string,
    params?: Record<string, any>
): Promise<void> {
    if (!url) {
        ElMessage.error('模板下载地址未配置')
        return
    }

    try {
        const res = await service.get(url, {
            params,
            responseType: 'blob'
        }) as AxiosResponse<Blob>

        const { isError, blobCopy } = await checkErrorResponse(res)
        if (isError) {
            return
        }

        triggerDownload(blobCopy!, filename)

        ElMessage.success('模板下载成功')
    } catch (err: any) {
        await handleDownloadError(err)
    }
}
