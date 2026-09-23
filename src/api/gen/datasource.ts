// @/api/gen/datasource.ts
import service from '@/utils/request'
import type { Datasource } from '@/types/api/gen/datasource'
import type { TableEntity } from '@/types/api/gen/table-entity'
import type { GenQuery } from '@/types/api/gen/base-class'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/gen/datasource';

/**
 * 获取数据源详情
 * @param id 数据源ID
 */
export const getDatasourceById = (id: number): Promise<Result<Datasource>> => {
	return service.get<Result<Datasource>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改数据源
 */
export const submitDatasource = (data: Datasource): Promise<Result<Datasource>> => {
	if (data.id) {
		return service.put<Result<Datasource>>(BASE_URL, data)
	}
	return service.post<Result<Datasource>>(BASE_URL, data)
}

/**
 * 分页查询数据源列表
 * @param params 查询参数
 */
export const getDatasourcePage = (params: GenQuery): Promise<Result<PageResult<Datasource>>> => {
	return service.get<Result<PageResult<Datasource>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询数据源列表（下拉框用）
 */
export const useDataSourceListApi = (): Promise<Result<Datasource[]>> => {
	return service.get<Result<Datasource[]>>(`${BASE_URL}/list`)
}

/**
 * 批量删除数据源
 * @param ids 数据源ID数组
 */
export const deleteDatasources = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 测试数据源连接
 * @param id 数据源ID
 */
export const useDataSourceTestApi = (id: number): Promise<Result<string>> => {
	return service.get<Result<string>>(`${BASE_URL}/test/${id}`)
}

/**
 * 根据数据源ID，获取全部数据表
 * @param id 数据源ID
 * @param tableName 表名（可选，过滤用）
 */
export const useDataSourceTableListApi = (id: number, tableName?: string): Promise<Result<TableEntity[]>> => {
	return service.get<Result<TableEntity[]>>(`${BASE_URL}/table/list/${id}`, { params: { tableName } })
}
