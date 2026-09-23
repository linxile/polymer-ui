// @/api/sys/dict-type.ts
import service from '@/utils/request'
import type {SysDictType, SysDictTypeQuery, SysDictSimple, SysDict, SysDictDataItem} from '@/types/api/sys/dict-type'
import type { Result, PageResult } from '@/types/api/common'

/**
 * API 基础路径
 */
const BASE_URL = '/sys/dict/type';

/**
 * 获取字典类型详情
 * @param id 字典类型ID
 */
export const getDictTypeById = (id: number): Promise<Result<SysDictType>> => {
    return service.get<Result<SysDictType>>(`${BASE_URL}/${id}`);
};

/**
 * 新增/修改字典类型
 */
export const submitDictType = (data: SysDictType): Promise<Result<SysDictType>> => {
    if (data.id) {
        return service.put<Result<SysDictType>>(BASE_URL, data)
    }
    return service.post<Result<SysDictType>>(BASE_URL, data)
}

/**
 * 分页查询字典类型列表
 * @param params 查询参数
 */
export const getDictTypePage = (params: SysDictTypeQuery): Promise<Result<PageResult<SysDictType>>> => {
    return service.get<Result<PageResult<SysDictType>>>(`${BASE_URL}/page`, { params })
}

/**
 * 批量删除字典类型
 * @param ids 字典类型ID数组
 */
export const deleteDictTypes = (ids: number[]): Promise<Result<string>> => {
    return service.delete<Result<string>>(BASE_URL, { data: ids })
}

/**
 * 动态SQL数据
 * @param id 字典类型ID
 */
export const getDictSqlData = (id: number): Promise<Result<PageResult<SysDictDataItem>>> => {
    return service.get<Result<PageResult<SysDictDataItem>>>(`${BASE_URL}/list/sql`, { params: { id } })
}

/**
 * 全部字典数据（按类型分组，含 dataList）
 */
export const useDictAllApi = (): Promise<Result<SysDict[]>> => {
    return service.get<Result<SysDict[]>>(`${BASE_URL}/all`)
}

/**
 * 全部字典类型简版（下拉框用）
 */
export const useDictSimpleListApi = (): Promise<Result<SysDictSimple[]>> => {
    return service.get<Result<SysDictSimple[]>>(`${BASE_URL}/list-all-simple`)
}

/**
 * 刷新字典翻译缓存
 */
export const refreshTransCache = (): Promise<Result<string>> => {
    return service.get<Result<string>>(`${BASE_URL}/refreshTransCache`)
}
