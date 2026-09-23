import { getFilePresignedDownloadUrl } from '@/api/storage/file'

/**
 * 文件 URL 工具类
 * 用于把相对路径转换成完整的可访问 URL（下载/预览）
 */
class FileUrlUtils {
    /**
     * 获取文件的完整 URL（支持下载或预览）
     * @param relativeUrl 相对路径或完整 URL
     * @returns 完整的 URL 字符串
     */
    static async getFullUrl(relativeUrl: string): Promise<string> {
        if (!relativeUrl) {
            return ''
        }

        // 如果是绝对 URL（http/https）或者是 data URL、blob URL，直接返回
        if (
            relativeUrl.startsWith('http') ||
            relativeUrl.startsWith('https') ||
            relativeUrl.startsWith('data:') ||
            relativeUrl.startsWith('blob:')
        ) {
            return relativeUrl
        }

        // 如果是相对路径，获取预签名下载 URL
        try {
            const response = await getFilePresignedDownloadUrl(relativeUrl)
            // 后端返回的 data 是 URL 字符串
            return response.data ?? relativeUrl
        } catch (error) {
            console.error('获取文件预览地址失败:', error)
            return relativeUrl
        }
    }

    /**
     * 批量获取文件 URL（用于优化多个文件的获取）
     * @param urls URL 数组
     * @returns URL 数组的 Promise
     */
    static async getFullUrls(urls: string[]): Promise<string[]> {
        const promises = urls.map(url => this.getFullUrl(url))
        return Promise.all(promises)
    }
}

export default FileUrlUtils
