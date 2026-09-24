import { ElMessage, ElLoading } from 'element-plus'
import service from "@/utils/request";
import { blobValidate } from "@/utils/polymer";
import { saveAs } from 'file-saver';
import errorCode from "@/utils/errorCode";

let downloadLoadingInstance: ReturnType<typeof ElLoading.service>

// 通用下载方法（JSON 传参）
export function exportFile2(url: string, params: any, filename: string, config?: any) {
  downloadLoadingInstance = ElLoading.service({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  })
  return service.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
    ...config
  }).then(async (res: any) => {
    const isBlob = blobValidate(res.data)
    if (isBlob) {
      const blob = new Blob([res.data])
      saveAs(blob, filename)
    } else {
      const resText = await res.data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg)
    }
    downloadLoadingInstance.close()
  }).catch((r: any) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}
