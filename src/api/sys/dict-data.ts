// @/api/sys/dict-data.ts
import service from '@/utils/request'
import type { SysDictData, SysDictDataQuery } from '@/types/api/sys/dict-data'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/dict/data';

/**
 * 获取字典数据详情
 * @param id 字典数据ID
 */
export const getDictDataById = (id: number): Promise<Result<SysDictData>> => {
    return service.get<Result<SysDictData>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改字典数据
 */
export const submitDictData = (data: SysDictData): Promise<Result<SysDictData>> => {
    if (data.id) {
        return service.put<Result<SysDictData>>(BASE_URL, data)
    }
    return service.post<Result<SysDictData>>(BASE_URL, data)
}

/**
 * 分页查询字典数据列表
 * @param params 查询参数
 */
export const getDictDataPage = (params: SysDictDataQuery): Promise<Result<PageResult<SysDictData>>> => {
    return service.get<Result<PageResult<SysDictData>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除字典数据
 * @param ids 字典数据ID数组
 */
export const deleteDictDatas = (ids: number[]): Promise<Result<string>> => {
    return service.delete<Result<string>>(BASE_URL, { data: ids })
}
