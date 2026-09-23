import service from '@/utils/request'
import type { SysImportExportRecord, SysImportExportRecordQuery } from '@/types/api/sys/import-export-record'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/system/importExportRecord';

/**
 * 分页查询导入导出记录
 * @param params 查询参数
 */
export const getImportExportRecordPage = (params: SysImportExportRecordQuery): Promise<Result<PageResult<SysImportExportRecord>>> => {
	return service.get<Result<PageResult<SysImportExportRecord>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询导入记录列表
 * @param businessType 业务对象类型：user-用户, dept-部门, role-角色等
 */
export const useImportExportRecordListApi = (businessType: string): Promise<Result<SysImportExportRecord[]>> => {
	return service.get<Result<SysImportExportRecord[]>>(`${BASE_URL}/list/${businessType}`)
}
