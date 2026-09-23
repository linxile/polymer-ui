// @/api/gen/table.ts
import service from '@/utils/request'
import type { TableEntity, TableField } from '@/types/api/gen/table-entity'
import type { GenQuery } from '@/types/api/gen/base-class'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/gen/table';

/**
 * 获取表信息（含字段列表）
 * @param id 表ID
 */
export const getTableById = (id: number): Promise<Result<TableEntity>> => {
	return service.get<Result<TableEntity>>(`${BASE_URL}/${id}`);
};

/**
 * 修改表信息
 */
export const submitTable = (data: TableEntity): Promise<Result<TableEntity>> => {
	return service.put<Result<TableEntity>>(BASE_URL, data)
}

/**
 * 分页查询表列表
 * @param params 查询参数
 */
export const getTablePage = (params: GenQuery): Promise<Result<PageResult<TableEntity>>> => {
	return service.get<Result<PageResult<TableEntity>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除表
 * @param ids 表ID数组
 */
export const deleteTables = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 同步表结构
 * @param id 表ID
 */
export const syncTable = (id: number): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/sync/${id}`)
}

/**
 * 导入数据源中的表
 * @param datasourceId 数据源ID
 * @param tableNameList 表名列表
 */
export const importTables = (datasourceId: number, tableNameList: string[]): Promise<Result<string>> => {
	return service.post<Result<string>>(`${BASE_URL}/import/${datasourceId}`, tableNameList)
}

/**
 * 修改表字段数据
 * @param tableId 表ID
 * @param tableFieldList 字段列表
 */
export const submitTableFields = (tableId: number, tableFieldList: TableField[]): Promise<Result<string>> => {
	return service.put<Result<string>>(`${BASE_URL}/field/${tableId}`, tableFieldList)
}
