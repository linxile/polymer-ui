// @/api/gen/field-type.ts
import service from '@/utils/request'
import type { FieldType } from '@/types/api/gen/field-type'
import type { GenQuery } from '@/types/api/gen/base-class'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/gen/fieldtype';

/**
 * 获取字段类型详情
 * @param id 字段类型ID
 */
export const getFieldTypeById = (id: number): Promise<Result<FieldType>> => {
	return service.get<Result<FieldType>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改字段类型
 */
export const submitFieldType = (data: FieldType): Promise<Result<FieldType>> => {
	if (data.id) {
		return service.put<Result<FieldType>>(BASE_URL, data)
	}
	return service.post<Result<FieldType>>(BASE_URL, data)
}

/**
 * 分页查询字段类型列表
 * @param params 查询参数
 */
export const getFieldTypePage = (params: GenQuery): Promise<Result<PageResult<FieldType>>> => {
	return service.get<Result<PageResult<FieldType>>>(`${BASE_URL}/page`, { params })
}

/**
 * 查询字段类型列表（属性类型集合，下拉框用）
 */
export const useFieldTypeListApi = (): Promise<Result<string[]>> => {
	return service.get<Result<string[]>>(`${BASE_URL}/list`)
}

/**
 * 批量删除字段类型
 * @param ids 字段类型ID数组
 */
export const deleteFieldTypes = (ids: number[]): Promise<Result<string>> => {
	return service.delete<Result<string>>(`${BASE_URL}`, { data: ids })
}
