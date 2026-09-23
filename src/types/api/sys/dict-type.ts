// @/types/api/sys/dict-type.ts
import type { PageParam, BaseEntity } from "../common";

/** 字典类型分页查询参数 */
export interface SysDictTypeQuery extends PageParam {
    /** 字典类型 */
    dictType?: string;
    /** 字典名称 */
    dictName?: string;
}

/** 字典类型信息 */
export interface SysDictType extends BaseEntity {
    /** 字典类型 */
    dictType: string;
    /** 字典名称 */
    dictName: string;
    /** 备注 */
    remark?: string;
    /** 排序 */
    sort?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 来源 0：字典数据 1：动态SQL */
    dictSource?: 0 | 1;
    /** 动态sql */
    dictSql?: string;
}

/** 字典类型简版（下拉框用） */
export interface SysDictSimple {
    /** 字典类型编号 */
    id?: number;
    /** 字典类型名称 */
    dictName?: string;
    /** 字典类型 */
    dictType?: string;
}

/** 全部字典中的单条字典数据 */
export interface SysDictDataItem {
    /** 字典标签 */
    dictLabel?: string;
    /** 字典值 */
    dictValue?: string;
    /** 标签样式 */
    labelClass?: string;
}

/** 全部字典（按 dictType 分组） */
export interface SysDict {
    /** 字典类型 */
    dictType?: string;
    /** 字典数据列表 */
    dataList?: SysDictDataItem[];
}
